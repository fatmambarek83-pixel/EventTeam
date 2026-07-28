import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ResponsableRH } from '../../../models/user.model';
interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-rh-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rh-sidebar.component.html',
  styleUrls: ['./rh-sidebar.component.css']
})
export class RhSidebarComponent {
  @Input() currentUser: ResponsableRH | null = null;
  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'grid', route: '/rh/dashboard' },
    { label: 'Activités', icon: 'activity', route: '/rh/activites' },
    { label: 'Événements', icon: 'calendar', route: '/rh/evenements' },
    { label: 'Participations', icon: 'users', route: '/rh/participations' },
    { label: 'Feedbacks', icon: 'message', route: '/rh/feedbacks' },
    { label: 'Activation comptes', icon: 'user-plus', route: '/rh/activation' },
  ];

  readonly bottomNavItems: NavItem[] = [
    { label: 'Mon Profil', icon: 'user', route: '/rh/profil' },
    { label: 'Paramètres', icon: 'settings', route: '/rh/parametres' },
  ];
}
