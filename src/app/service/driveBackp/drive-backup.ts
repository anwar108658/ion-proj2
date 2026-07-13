import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';

@Injectable({ providedIn: 'root' })
export class DriveBackupService {
  private readonly AUTH_KEY = 'signup';
  private readonly TODO_KEY = 'task';
  private readonly BACKUP_FILE_NAME = 'app_backup_data.json';
  private accessToken: string | null = null;

  constructor() {
    // Initialize Google Sign-In
    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn() {
    GoogleSignIn.initialize({
      clientId: '42163742929-prljatpmgokpedijts35qdut0bnoslui.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/drive.appdata']
    });
  }

  // 1. Get a valid access token SILENTLY when possible
  private async getAccessToken(): Promise<string> {
    // If we already have a token, return it
    if (this.accessToken) {
      return this.accessToken;
    }

    try {
      // Try to sign in silently first
      const result = await GoogleSignIn.signIn();
      
      if (result?.accessToken) {
        this.accessToken = result.accessToken;
        return this.accessToken;
      }
      
      throw new Error('No access token available');
    } catch (error: any) {
      // If silent sign-in fails, we need to show the sign-in UI
      if (error.message === 'No access token available' || 
          error.message?.includes('canceled')) {
        throw new Error('Please sign in to backup your data. The sign-in was cancelled or failed.');
      }
      throw error;
    }
  }

  // 3. EXPORT BACKUP TO HIDDEN APP DATA FOLDER
  async exportBackupToDrive(): Promise<void> {
    try {
      // Build the backup JSON
      const auth = await Preferences.get({ key: this.AUTH_KEY });
      const todos = await Preferences.get({ key: this.TODO_KEY });
      
      const backupData = {
        version: 1,
        createdAt: new Date().toISOString(),
        auth: auth.value ? JSON.parse(auth.value) : null,
        todos: todos.value ? JSON.parse(todos.value) : []
      };

      const accessToken = await this.getAccessToken();

      // Search for an existing backup file in the app data folder
      const fileId = await this.findAppDataFile(accessToken);

      // Prepare multipart metadata – "parents" puts it in the hidden app folder
      const metadata = {
        name: this.BACKUP_FILE_NAME,
        mimeType: 'application/json',
        parents: ['appDataFolder']  // Hidden folder, invisible to user
      };

      const boundary = 'foo_bar_baz_boundary';
      const multipartBody =
        `--${boundary}\r\n` +
        `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
        `${JSON.stringify(metadata)}\r\n` +
        `--${boundary}\r\n` +
        `Content-Type: application/json\r\n\r\n` +
        `${JSON.stringify(backupData)}\r\n` +
        `--${boundary}--`;

      // If file exists, update it; otherwise create new
      const url = fileId
        ? `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`
        : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
      
      const method = fileId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed with status:', response.status, errorText);
        
        // If token expired, clear it and retry once
        if (response.status === 401) {
          this.accessToken = null;
          await GoogleSignIn.signOut();
          return this.exportBackupToDrive(); // Retry once with fresh sign-in
        }
        
        throw new Error(`Drive upload failed: ${response.status}`);
      }

      console.log('✅ Backup successfully stored in Google Drive app folder');
    } catch (error) {
      console.error('Backup failed:', error);
      throw error; // Let the UI handle the error display
    }
  }

  // Helper: Find existing backup file inside the app data folder
  private async findAppDataFile(token: string): Promise<string | null> {
    try {
      const query = encodeURIComponent(
        `name='${this.BACKUP_FILE_NAME}' and 'appDataFolder' in parents and trashed=false`
      );
      const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id)`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.files?.length ? data.files[0].id : null;
    } catch (error) {
      console.error('Error finding backup file:', error);
      return null;
    }
  }

  // 4. IMPORT BACKUP FROM GOOGLE DRIVE
  async importBackupFromDrive(): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      
      // 🔥 FIX: Directly list ALL files in appDataFolder
      const listUrl = 'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,size)&orderBy=createdTime desc';
      
      const listResponse = await fetch(listUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!listResponse.ok) {
        throw new Error(`Failed to list files: ${listResponse.status}`);
      }

      const listData = await listResponse.json();
      console.log('📂 All files in appDataFolder:', listData);
      
      // Get the first file (most recent backup)
      const fileId = listData.files?.[0]?.id;
      
      console.log(fileId, "ye backup he ");
      
      if (!fileId) {
        throw new Error('No backup file found in Google Drive. Please create a backup first.');
      }

      // Download the file
      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      
      const response = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error(`Failed to download backup: ${response.status}`);
      }

      const backup = await response.json();
      
      // Validate backup structure
      if (!backup || backup.version !== 1 || !Array.isArray(backup.todos)) {
        throw new Error('Invalid backup file format.');
      }

      // Restore the data
      if (backup.auth) {
        await Preferences.set({ key: this.AUTH_KEY, value: JSON.stringify(backup.auth) });
      }
      
      if (backup.todos) {
        await Preferences.set({ key: this.TODO_KEY, value: JSON.stringify(backup.todos) });
      }

      console.log('✅ Data successfully restored from Google Drive');
      alert(backup.todos.length > 0 ? `Data restored successfully! (${backup.todos.length} tasks)` : 'No tasks found in backup.');
      return backup;

    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }
}