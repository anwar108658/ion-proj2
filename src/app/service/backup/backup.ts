import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core'; 

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  private readonly AUTH_KEY = 'signup';
  private readonly TODO_KEY = 'task';
  private readonly BACKUP_FILE = 'backup.json';

  // -------------------------
  // EXPORT BACKUP
  // -------------------------
  async exportBackup(): Promise<string> {
    try {
      const auth = await Preferences.get({ key: this.AUTH_KEY });
      const todos = await Preferences.get({ key: this.TODO_KEY });

      const backup = {
        version: 1,
        createdAt: new Date().toISOString(),
        auth: auth.value ? JSON.parse(auth.value) : null,
        todos: todos.value ? JSON.parse(todos.value) : []
      };

      const jsonData = JSON.stringify(backup, null, 2);

      // 1. WEB FALLBACK: Direct download if running in a browser
      if (!Capacitor.isNativePlatform()) {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.BACKUP_FILE;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return this.BACKUP_FILE;
      }

      // 2. NATIVE MOBILE execution
      const fileResult = await Filesystem.writeFile({
        path: this.BACKUP_FILE,
        data: jsonData,
        directory: Directory.Documents, 
        encoding: Encoding.UTF8
      });

      // 3. Open share menu so user can save or send the file out of the hidden sandbox
      // await Share.share({
      //   title: 'App Backup Data',
      //   text: 'Exporting your application data',
      //   url: fileResult.uri,
      //   dialogTitle: 'Save or Send Backup File'
      // });

      // console.log(this.BACKUP_FILE)
      return this.BACKUP_FILE;

    } catch (error) {
      console.error('Backup failed:', error);
      throw new Error('Failed to create backup.');
    }
  }

  // -------------------------
  // IMPORT BACKUP
  // -------------------------

  async importBackup(): Promise<any> {
    try {
      // 1. Trigger the native file picker UI
      const result = await FilePicker.pickFiles({
        types: ['application/json'],
        limit: 1,
        readData: true // Instructs OS to read data into memory safely
      });

      // 2. Validate selection
      if (!result.files || result.files.length === 0) {
        throw new Error('No file selected.');
      }

      const pickedFile = result.files[0];
      if (!pickedFile.data) {
        throw new Error('Selected file is empty.');
      }

      // 3. FIX: Safely parse Web vs Mobile Base64 payloads
      let base64String = pickedFile.data;
      
      // If running on Web, remove the "data:application/json;base64," prefix if present
      if (base64String.includes(';base64,')) {
        base64String = base64String.split(';base64,')[1];
      }
      
      // Decode the clean base64 string
      const decodedData = atob(base64String);
      const backup = JSON.parse(decodedData);

      // 4. File validation rules
      if (!backup || backup.version !== 1 || !Array.isArray(backup.todos)) {
        throw new Error('Invalid backup file structure.');
      }

      // 5. Restore back to Preferences storage
      await Preferences.set({
        key: this.AUTH_KEY,
        value: JSON.stringify(backup.auth)
      });

      await Preferences.set({
        key: this.TODO_KEY,
        value: JSON.stringify(backup.todos)
      });

      return backup;

    } catch (error) {
      console.error('Restore failed:', error);
      throw new Error('Failed to restore backup.');
    }
  }

}
