import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { IonContent, IonCard, IonCardContent, IonButton,IonIcon,IonInput,IonItem,IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [RouterModule,ReactiveFormsModule,IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonInput, IonItem, IonText, ɵInternalFormsSharedModule],
})
export class SignupComponent  implements OnInit {

  constructor(private fb:FormBuilder,private router:Router) { }

  signupForm = this.fb.group({
    name:['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async ngOnInit() {
    const { value } = await Preferences.get({
      key: 'name'
    });
    if (value) {
      this.router.navigate(['/home'])
    }
  }

  async createAccount(val:any){
    console.log(val)
    await Preferences.set({
      key:'signup',
      value: JSON.stringify(val.value),
    })
    this.router.navigate(['/login'])
  }

}
