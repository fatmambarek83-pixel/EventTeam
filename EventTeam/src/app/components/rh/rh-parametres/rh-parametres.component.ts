import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-rh-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rh-parametres.component.html',
  styleUrls: ['./rh-parametres.component.css'],
})
export class RhParametresComponent {
  emailNotifications = true;
  newRegistrationAlerts = true;
  weeklyDigest = false;
  language: 'fr' | 'en' = 'fr';
}
