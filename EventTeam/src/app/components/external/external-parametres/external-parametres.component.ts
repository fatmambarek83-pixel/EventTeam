import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-external-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './external-parametres.component.html',
  styleUrls: ['./external-parametres.component.css'],
})
export class ExternalParametresComponent {
  emailNotifications = true;
  eventReminders = true;
  weeklyDigest = false;
  language: 'fr' | 'en' = 'fr';
}
