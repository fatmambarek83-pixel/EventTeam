import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
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
export class AdminLayoutComponent {
  showNotifications = false;
  unreadCount = 3;
  notifications: Notification[] = [
    { id: 1, title: 'Nouvel evenement cree par RH Manager', time: 'Il y a 5 min', type: 'event', read: false },
    { id: 2, title: 'Nouveau compte RH en attente', time: 'Il y a 1 heure', type: 'user', read: false },
    { id: 3, title: 'Rappel: Team Building demain', time: 'Il y a 2 heures', type: 'alert', read: false },
  ];
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }
  markAllRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.unreadCount = 0;
  }
}
