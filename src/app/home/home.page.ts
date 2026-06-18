import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonModal, IonIcon, IonFabButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonList, IonCardContent, IonItem, IonThumbnail, IonLabel, IonFooter, IonCheckbox } from '@ionic/angular/standalone';
import { Task } from '../service/task/task';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [DatePipe,RouterModule,IonHeader, IonContent, IonButton, IonIcon, IonText, IonCard, IonList, IonCardContent, IonItem, IonLabel, IonFooter, IonCheckbox],
})
export class HomePage {
  constructor() {}
  public taskS = inject(Task)

  toggleCompletedStatus(id:string){
    this.taskS.taskData.update(tasks =>
      tasks.map(task =>
        task.task === id
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  }
  pendingTasks = computed(() =>
  this.taskS.taskData().filter(t => !t.isCompleted)
);

completedTasks = computed(() =>
  this.taskS.taskData().filter(t => t.isCompleted)
);
}
