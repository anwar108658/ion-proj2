import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonImg, IonModal, IonButtons, IonButton, IonList, IonItem, IonAvatar, IonLabel, IonInput, IonInputPasswordToggle, IonText, IonRouterLink, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ RouterModule, IonContent, IonTitle, IonImg,IonInput, IonItem, IonList, IonInputPasswordToggle, IonButton, IonText, IonRouterLink, IonIcon],
})
export class LoginComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
