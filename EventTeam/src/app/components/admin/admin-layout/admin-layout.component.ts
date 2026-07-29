import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../Services/auth.service';
import { AdminService } from '../../../Services/admin.service';
import { AuthResponse } from '../../../models/auth-response.model';
interface Notification {
  id: number;
  title: string;
  time: string;
  type: 'event' | 'user' | 'alert';
  read: boolean;
}
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  currentUser: AuthResponse | null = null;
  photo: string | null = null;
  private profileSub?: Subscription;
  showNotifications = false;
  unreadCount = 3;
  notifications: Notification[] = [
    { id: 1, title: 'Nouvel evenement cree par RH Manager', time: 'Il y a 5 min', type: 'event', read: false },
    { id: 2, title: 'Nouveau compte RH en attente', time: 'Il y a 1 heure', type: 'user', read: false },
    { id: 3, title: 'Rappel: Team Building demain', time: 'Il y a 2 heures', type: 'alert', read: false },
  ];

  constructor(private authService: AuthService, private adminService: AdminService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.profileSub = this.adminService.profile$.subscribe(profile => {
      this.photo = profile?.photo || null;
    });
  }

  ngOnDestroy(): void {
    this.profileSub?.unsubscribe();
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'AD';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts[1]?.charAt(0) ?? '';
    return (first + second).toUpperCase() || 'AD';
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  markAllRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.unreadCount = 0;
  }
}
