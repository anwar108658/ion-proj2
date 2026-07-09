import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonHeader, IonContent, IonFooter, IonButton, IonToolbar,IonIcon, IonText, IonAccordionGroup, IonAccordion,IonItem,IonLabel } from "@ionic/angular/standalone";
import { BackupService } from '../service/backup/backup';
import { DriveBackupService } from '../service/driveBackp/drive-backup';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  imports: [RouterModule, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonText, IonAccordionGroup, IonAccordion,IonItem,IonLabel],
})
export class SettingComponent  implements OnInit {

  constructor(public backupService:BackupService,private driveBackupService: DriveBackupService) {}
  ngOnInit() {}

  async export() {
    const file = await this.backupService.exportBackup();
    console.log('Backup created:', file);
  }
  async import() {
    const result = await this.backupService.importBackup();
    console.log('Backup created:', result);
  }

async onBackup() {
  await this.driveBackupService.exportBackupToDrive();
}

async onRestore() {
  await this.driveBackupService.importBackupFromDrive();
}

}
