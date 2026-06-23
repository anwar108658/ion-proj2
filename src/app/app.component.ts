import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, pencil, arrowBack, trophyOutline, documentTextOutline, calendarOutline, chevronBackOutline, timeOutline, calendarClearOutline, closeOutline, mailOutline, lockClosedOutline, checkboxOutline, checkbox, squareOutline, personOutline, shieldCheckmarkOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({
      arrowBack,
      trophyOutline,
      documentTextOutline,
      calendarOutline,
      chevronBackOutline,
      timeOutline,
      calendarClearOutline,
      closeOutline,
      mailOutline,
      lockClosedOutline,
      checkboxOutline,
      checkbox,
      squareOutline,
      personOutline,
      shieldCheckmarkOutline,
    })
  }
}
