import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { Employe } from '../../../models/user.model';
import { AuthService } from '../../../Services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-employe-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employe-sidebar.component.html',
  styleUrls: ['./employe-sidebar.component.css']
})
export class EmployeSidebarComponent {
  @Input() currentUser: Employe | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'grid', route: '/employee/dashboard' },
    { label: 'Événements', icon: 'calendar', route: '/employee/evenements' },
    { label: 'Mes participations', icon: 'users', route: '/employee/participations' },
    { label: 'Feedback', icon: 'message', route: '/employee/feedback' },
  ];

  readonly bottomNavItems: NavItem[] = [
    { label: 'Mon Profil', icon: 'user', route: '/employee/profil' },
    { label: 'Paramètres', icon: 'settings', route: '/employee/parametres' },
  ];

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
