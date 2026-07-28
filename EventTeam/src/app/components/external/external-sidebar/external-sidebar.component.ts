import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { ExternalCompany } from '../../../models/user.model';
import { AuthService } from '../../../Services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-external-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './external-sidebar.component.html',
  styleUrls: ['./external-sidebar.component.css']
})
export class ExternalSidebarComponent {
  @Input() currentUser: ExternalCompany | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'grid', route: '/external/dashboard' },
    { label: 'Événements', icon: 'calendar', route: '/external/evenements' },
    { label: 'Activités', icon: 'activity', route: '/external/activites' },
  ];

  readonly bottomNavItems: NavItem[] = [
    { label: 'Mon Profil', icon: 'user', route: '/external/profil' },
    { label: 'Paramètres', icon: 'settings', route: '/external/parametres' },
  ];

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
