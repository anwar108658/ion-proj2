import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonItem,IonLabel,IonToolbar,IonModal, IonTitle,IonInput,IonTextarea,IonText, IonButton, IonCard, IonCardContent, IonDatetimeButton, IonDatetime, IonFooter } from "@ionic/angular/standalone";
import { Task } from '../service/task/task';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-add-Task',
  templateUrl: './add-Task.component.html',
  styleUrls: ['./add-Task.component.scss'],
  imports: [RouterModule, ReactiveFormsModule, IonContent, IonToolbar, IonHeader, IonIcon, IonItem, IonLabel, IonTextarea, IonModal, IonText, IonInput, IonButton, IonCard, IonCardContent, IonDatetimeButton, IonDatetime, IonFooter],
})
export class AddTaskComponent  implements OnInit {

  private taskS = inject(Task)
  private router = inject(Router)
  
  ngOnInit() {
    
  }

  taskForm = new  FormGroup({
    task: new FormControl('',[Validators.required]),
    category: new FormControl({id:3,label:"x",iconName:"document-text-outline",color:"secondary"},[Validators.required]),
    date: new FormControl(new Date().toISOString(),[Validators.required]),
    time: new FormControl(new Date().toISOString(),[Validators.required]),
    taskDetail: new FormControl('',[Validators.required]),
    isCompleted:new FormControl(false,[])
  })

  inputFormOpen:any = {date:false,time:false}
  
  categoryList = [
    {id:3,label:"x",iconName:"document-text-outline",color:"secondary"},
    {id:2,label:"y",iconName:"trophy-outline",color:"warning"},
    {id:1,label:"z",iconName:"calendar-outline",color:"tertiary"},
  ]

  getCategoryVal(val:any){
    this.taskForm.controls.category.setValue(val)
  }

  async onSubmit(){
    console.log(this.taskForm.value)
    this.taskForm.markAllAsTouched();
    const task = this.taskS.taskData().some(p => p.task === this.taskForm.value.task)
    if (!task && !this.taskForm.invalid) {
      this.taskS.taskData.update(val => [...val,this.taskForm.value as any])
      await Preferences.set({
        key: 'task',
        value: JSON.stringify(this.taskS.taskData()),
      });
      this.router.navigate(["/home"])
    }
  }

  isFormOpen(formName:string){
    this.inputFormOpen[formName] = !this.inputFormOpen[formName];
  }
}
