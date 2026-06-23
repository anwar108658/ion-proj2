import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonModal, IonIcon, IonFabButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonList, IonCardContent, IonItem, IonThumbnail, IonLabel, IonFooter, IonCheckbox } from '@ionic/angular/standalone';
import { Task } from '../service/task/task';
import { DatePipe } from '@angular/common';
import { Preferences } from '@capacitor/preferences';
import { BackupService } from '../service/backup/backup';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [DatePipe,RouterModule,IonHeader, IonContent, IonButton, IonIcon, IonText, IonCard, IonList, IonCardContent, IonItem, IonLabel, IonFooter],
})
export class HomePage {
  constructor(public backupService:BackupService) {}
  public taskS = inject(Task)

 async toggleCompletedStatus(id:string){
    this.taskS.taskData.update(tasks =>
      tasks.map(task =>
        task.task === id
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );

    await Preferences.set({
      key: 'task',
      value: JSON.stringify(this.taskS.taskData()),
    });
  }


pendingTasks = computed(() =>
  this.taskS.taskData().filter(t => !t.isCompleted)
);

completedTasks = computed(() =>
  this.taskS.taskData().filter(t => t.isCompleted)
);

async export() {
  const file = await this.backupService.exportBackup();
  console.log('Backup created:', file);
}
async import() {
  const filePath = 'backup_123.json';
  const result = await this.backupService.importBackup(filePath);
  console.log('Backup created:', result);
}
}
