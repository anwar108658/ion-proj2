import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonItem,IonLabel,IonModal, IonTitle,IonInput,IonTextarea,IonText, IonButton, IonCard, IonCardContent, IonDatetimeButton, IonDatetime, IonFooter } from "@ionic/angular/standalone";
import { Task } from '../service/task/task';

@Component({
  selector: 'app-add-Task',
  templateUrl: './add-Task.component.html',
  styleUrls: ['./add-Task.component.scss'],
  imports: [RouterModule,ReactiveFormsModule,IonContent, IonHeader, IonIcon, IonItem,IonLabel,IonTextarea,IonModal,IonText,IonInput, IonButton, IonCard, IonCardContent, IonDatetimeButton, IonDatetime, IonFooter],
})
export class AddTaskComponent  implements OnInit {

  private taskS = inject(Task)
  
  ngOnInit() {}

  taskForm = new  FormGroup({
    task: new FormControl('',[]),
    category: new FormControl({},[]),
    date: new FormControl(null,[]),
    time: new FormControl(null,[]),
    taskDetail: new FormControl('',[]),
    isCompleted:new FormControl(false,[])
  })
  
  categoryList = [
    {id:3,label:"x",iconName:"document-text-outline",color:"secondary"},
    {id:2,label:"y",iconName:"trophy-outline",color:"warning"},
    {id:1,label:"z",iconName:"calendar-outline",color:"tertiary"},
  ]

  getCategoryVal(val:object){
    this.taskForm.controls.category.setValue(val)
  }

  onSubmit(){
    console.log(this.taskForm.value)
    this.taskS.taskData.update(val => [...val,this.taskForm.value as any])
  }

}
