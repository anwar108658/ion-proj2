import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root'
})
export class BackupService {

  private AUTH_KEY = 'signup';
  private TODO_KEY = 'task';

  // -------------------------
  // EXPORT BACKUP
  // -------------------------
  async exportBackup() {
    const auth = await Preferences.get({ key: this.AUTH_KEY });
    const todos = await Preferences.get({ key: this.TODO_KEY });

    const backup = {
      version: 1,
      createdAt: new Date().toISOString(),
      auth: auth.value ? JSON.parse(auth.value) : null,
      todos: todos.value ? JSON.parse(todos.value) : []
    };

    const fileName = `backup_123.json`;

     await Filesystem.writeFile({
      path: fileName,
      data: JSON.stringify(backup, null, 2),
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });

    return fileName;
  }

  // -------------------------
  // IMPORT BACKUP
  // -------------------------
  async importBackup(filePath: string) {
    const file = await Filesystem.readFile({
      path: filePath,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    });

    const backup = JSON.parse(file.data as string);

    if (!backup?.version) {
      throw new Error('Invalid backup file');
    }

    if (backup.auth) {
      await Preferences.set({
        key: this.AUTH_KEY,
        value: JSON.stringify(backup.auth)
      });
    }

    if (backup.todos) {
      await Preferences.set({
        key: this.TODO_KEY,
        value: JSON.stringify(backup.todos)
      });
    }

    return true;
  }
}