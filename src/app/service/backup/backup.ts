import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

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

      await Filesystem.writeFile({
        path: this.BACKUP_FILE,
        data: JSON.stringify(backup, null, 2),
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });

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

      const file = await Filesystem.readFile({
        path: this.BACKUP_FILE,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });

      const backup = JSON.parse(file.data as string);

      // Validation
      if (
        !backup ||
        backup.version !== 1 ||
        !Array.isArray(backup.todos)
      ) {
        throw new Error('Invalid backup file');
      }

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