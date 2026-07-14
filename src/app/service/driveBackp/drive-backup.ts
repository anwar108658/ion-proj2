import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { GoogleSignIn } from '@capawesome/capacitor-google-sign-in';
import { Task } from '../task/task';

@Injectable({ providedIn: 'root' })
export class DriveBackupService {
  private readonly AUTH_KEY = 'signup';
  private readonly TODO_KEY = 'task';
  private readonly BACKUP_FILE_NAME = 'app_backup_data.json';
  private accessToken: string | null = null;
  private readonly TOKEN_KEY = 'google_drive_token';

  constructor(private taskService: Task) {
    this.initializeGoogleSignIn();
    this.loadSavedTokenOnStartup();
  }

  private async loadSavedTokenOnStartup(): Promise<void> {
    try {
      const result = await Preferences.get({ key: this.TOKEN_KEY });
      if (result.value) {
        this.accessToken = result.value;
        console.log('🔑 Previous session token loaded');
      }
    } catch (error) {
      console.log('No saved token found');
    }
  }

  private async saveTokenToStorage(token: string): Promise<void> {
    await Preferences.set({ key: this.TOKEN_KEY, value: token });
    console.log('💾 Token saved to storage');
  }

  private async clearTokenFromStorage(): Promise<void> {
    await Preferences.remove({ key: this.TOKEN_KEY });
    console.log('🗑️ Token removed from storage');
  }

  // 🔥 NEW: Simple helper to read token from storage
  private async loadTokenFromStorage(): Promise<string | null> {
    try {
      const result = await Preferences.get({ key: this.TOKEN_KEY });
      return result.value || null;
    } catch (error) {
      return null;
    }
  }

  private initializeGoogleSignIn() {
    GoogleSignIn.initialize({
      clientId: '42163742929-prljatpmgokpedijts35qdut0bnoslui.apps.googleusercontent.com',
      scopes: ['https://www.googleapis.com/auth/drive.appdata']
    });
  }

  // 🔥 FIXED: Get a valid access token SILENTLY when possible
  private async getAccessToken(): Promise<string> {
    // Step 1: Check memory cache
    if (this.accessToken) {
      console.log('✅ Using token from memory');
      return this.accessToken;
    }

    // Step 2: Check persistent storage (app restart survive!)
    const savedToken = await this.loadTokenFromStorage();
    if (savedToken) {
      console.log('✅ Using token from storage — NO POPUP!');
      this.accessToken = savedToken;
      return savedToken;
    }

    // Step 3: Only if no token anywhere, show login popup ONCE
    try {
      const result = await GoogleSignIn.signIn();
      
      if (result?.accessToken) {
        this.accessToken = result.accessToken;
        await this.saveTokenToStorage(result.accessToken);
        console.log('✅ Fresh token saved');
        return this.accessToken;
      }
      
      throw new Error('No access token available');
    } catch (error: any) {
      if (error.message === 'No access token available' || 
          error.message?.includes('canceled')) {
        throw new Error('Please sign in to backup your data.');
      }
      throw error;
    }
  }

  
  async exportBackupToDrive(): Promise<void> {
    try {
      const auth = await Preferences.get({ key: this.AUTH_KEY });
      const todos = await Preferences.get({ key: this.TODO_KEY });
      
      const backupData = {
        version: 1,
        createdAt: new Date().toISOString(),
        auth: auth.value ? JSON.parse(auth.value) : null,
        todos: todos.value ? JSON.parse(todos.value) : []
      };

      const accessToken = await this.getAccessToken();

      const fileId = await this.findAppDataFile(accessToken);

      const metadata = {
        name: this.BACKUP_FILE_NAME,
        mimeType: 'application/json',
        parents: ['appDataFolder']
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
        console.error('Upload failed:', response.status, errorText);
        
        if (response.status === 401) {
          this.accessToken = null;
          await this.clearTokenFromStorage();
          await GoogleSignIn.signOut();
          return this.exportBackupToDrive();
        }
        
        throw new Error(`Drive upload failed: ${response.status}`);
      }

      console.log('✅ Backup successfully stored');
    } catch (error) {
      console.error('Backup failed:', error);
      throw error;
    }
  }

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

  async importBackupFromDrive(): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();
      
      const listUrl = 'https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&fields=files(id,name,size)&orderBy=createdTime desc';
      
      const listResponse = await fetch(listUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!listResponse.ok) {
        throw new Error(`Failed to list files: ${listResponse.status}`);
      }

      const listData = await listResponse.json();
      console.log('📂 All files in appDataFolder:', listData);
      
      const fileId = listData.files?.[0]?.id;
      
      if (!fileId) {
        throw new Error('No backup file found.');
      }

      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
      
      const response = await fetch(downloadUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status}`);
      }

      const backup = await response.json();
      
      if (!backup || backup.version !== 1 || !Array.isArray(backup.todos)) {
        throw new Error('Invalid backup format.');
      }

      if (backup.auth) {
        await Preferences.set({ key: this.AUTH_KEY, value: JSON.stringify(backup.auth) });
      }
      
      if (backup.todos) {
        await Preferences.set({ key: this.TODO_KEY, value: JSON.stringify(backup.todos) });
      }
      this.taskService.checkName();
      console.log('✅ Data restored');
      alert(backup.todos.length > 0 ? `Restored ${backup.todos.length} tasks!` : 'No tasks found.');
      return backup;

    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }
}