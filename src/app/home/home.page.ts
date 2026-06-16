import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonModal, IonIcon, IonFabButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonList, IonCardContent, IonItem, IonThumbnail, IonLabel, IonFooter, IonCheckbox } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [RouterModule,IonHeader, IonContent, IonButton, IonIcon, IonText, IonCard, IonList, IonCardContent, IonItem, IonLabel, IonFooter, IonCheckbox],
})
export class HomePage {
  constructor() {}
  items: any[] = [
    {id:3,label:"Study lesson",iconName:"document-text-outline",color:"secondary"},
    {id:2,label:"Run 5k",iconName:"trophy-outline",color:"warning"},
    {id:1,label:"Go to party",iconName:"calendar-outline",color:"tertiary"},
  ]
}
