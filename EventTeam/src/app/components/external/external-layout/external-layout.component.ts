import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExternalSidebarComponent } from '../external-sidebar/external-sidebar.component';
import { AuthService } from '../../../Services/auth.service';
import { ExternalCompany, isExternalCompany } from '../../../models/user.model';

@Component({
  selector: 'app-external-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ExternalSidebarComponent],
  templateUrl: './external-layout.component.html',
  styleUrls: ['./external-layout.component.css'],
})
export class ExternalLayoutComponent implements OnInit {
  currentUser: ExternalCompany | null = null;
  todayLabel = '';

  private readonly DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  private readonly MONTHS = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser = isExternalCompany(user) ? user : null;

    const now = new Date();
    const day = this.DAYS[now.getDay()];
    const month = this.MONTHS[now.getMonth()];
    this.todayLabel = `${day.charAt(0).toUpperCase()}${day.slice(1)} ${now.getDate()} ${month} ${now.getFullYear()}`;
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts[1]?.charAt(0) ?? '';
    return (first + second).toUpperCase() || 'U';
  }
}
