import { Component, Input, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { Subscription } from 'rxjs';
import { Employe } from '../../../models/user.model';
import { AuthService } from '../../../Services/auth.service';
import { EmployeeService } from '../../../Services/employee.service';

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
export class EmployeSidebarComponent implements OnInit, OnDestroy {
  @Input() currentUser: Employe | null = null;
  photo: string | null = null;
  private profileSub?: Subscription;

  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileSub = this.employeeService.profile$.subscribe(profile => {
      this.photo = profile?.photo || null;
    });
    this.employeeService.getProfile().subscribe({ error: () => {} });
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
