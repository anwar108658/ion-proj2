import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonModal, IonButtons, IonButton, IonList, IonItem, IonAvatar, IonLabel, IonInput, IonInputPasswordToggle, IonText, IonRouterLink, IonIcon, IonCard, IonCardContent } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [RouterModule, ReactiveFormsModule,IonContent, IonInput, IonItem, IonButton, IonText, IonIcon, IonCard, IonCardContent, ɵInternalFormsSharedModule],
})
export class LoginComponent  implements OnInit {

  constructor(private fb: FormBuilder,private router:Router) {}

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

 async ngOnInit() {
    const { value } = await Preferences.get({
      key: 'signup'
    });
    if (value) {
      this.signUpVal = JSON.parse(value)
    }
  }

  signUpVal:any

  async login(val:any){
    if (val.value.email === this.signUpVal?.email && val.value.password === this.signUpVal?.password) {
      const updateVal = {...this.signUpVal,isLogin:true}
      await Preferences.set({
        key: 'signup',
        value: JSON.stringify(updateVal)
      });
      this.router.navigate(['/home'])
    } else{
      alert("wrong credential")
    }
  }

}
