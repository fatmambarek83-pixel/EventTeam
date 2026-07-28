import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  emailNotifications = true;
  appNotifications = true;
  selectedLanguage:string = 'fr';

  languages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' }
  ];

  toggleEmail(): void {
    this.emailNotifications = !this.emailNotifications;
  }

  toggleApp(): void {
    this.appNotifications = !this.appNotifications;
  }
}
