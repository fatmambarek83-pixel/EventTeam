import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { Subscription } from 'rxjs';
import { ResponsableRH } from '../../../models/user.model';
import { AuthService } from '../../../Services/auth.service';
import { ResponsableRhService } from '../../../Services/responsable-rh.service';
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
export class RhSidebarComponent implements OnInit, OnDestroy {
  @Input() currentUser: ResponsableRH | null = null;
  photo: string | null = null;
  private profileSub?: Subscription;

  constructor(
    private authService: AuthService,
    private responsableRhService: ResponsableRhService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileSub = this.responsableRhService.profile$.subscribe(profile => {
      this.photo = profile?.photo || null;
    });
    this.responsableRhService.getProfile().subscribe({ error: () => {} });
  }

  ngOnDestroy(): void {
    this.profileSub?.unsubscribe();
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'RH';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts[1]?.charAt(0) ?? '';
    return (first + second).toUpperCase() || 'RH';
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

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
