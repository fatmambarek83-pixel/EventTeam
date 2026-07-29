import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { Subscription } from 'rxjs';
import { ExternalCompany } from '../../../models/user.model';
import { AuthService } from '../../../Services/auth.service';
import { ExternalService } from '../../../Services/external.service';

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
export class ExternalSidebarComponent implements OnInit, OnDestroy {
  @Input() currentUser: ExternalCompany | null = null;
  photo: string | null = null;
  private profileSub?: Subscription;

  constructor(
    private authService: AuthService,
    private externalService: ExternalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileSub = this.externalService.profile$.subscribe(profile => {
      this.photo = profile?.photo || null;
    });
    this.externalService.getProfile().subscribe({ error: () => {} });
  }

  ngOnDestroy(): void {
    this.profileSub?.unsubscribe();
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts[1]?.charAt(0) ?? '';
    return (first + second).toUpperCase() || 'U';
  }

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
