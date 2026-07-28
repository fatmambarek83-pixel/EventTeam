import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employe-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employe-parametres.component.html',
  styleUrls: ['./employe-parametres.component.css'],
})
export class EmployeParametresComponent {
  emailNotifications = true;
  eventReminders = true;
  weeklyDigest = false;
  language: 'fr' | 'en' = 'fr';
}
