import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonItem,IonLabel,IonModal, IonTitle,IonInput,IonTextarea,IonText, IonButton, IonCard, IonCardContent, IonDatetimeButton, IonDatetime, IonFooter } from "@ionic/angular/standalone";

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  imports: [RouterModule,ReactiveFormsModule,IonContent, IonHeader, IonIcon, IonItem,IonLabel,IonTextarea,IonModal,IonText,IonInput, IonButton, IonCard, IonCardContent, IonDatetimeButton, IonDatetime, IonFooter],
})
export class AddTaskComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

  taskForm = new  FormGroup({
    task: new FormControl('',[]),
    category: new FormControl('',[]),
    date: new FormControl(null,[]),
    time: new FormControl(null,[]),
    taskDetail: new FormControl('',[]),
    isActive:new FormControl(true,[])
  })
  
  categoryList = [
    {id:3,label:"x",iconName:"document-text-outline",color:"secondary",class:"cat-btn selected-blue"},
    {id:2,label:"y",iconName:"trophy-outline",color:"warning",class:"cat-btn selected-purple"},
    {id:1,label:"z",iconName:"calendar-outline",color:"tertiary",class:"cat-btn selected-yellow"},
  ]

  getCategoryVal(val:string){
    this.taskForm.controls.category.setValue(val)
  }

  onSubmit(){
    console.log(this.taskForm.value)
  }

}
