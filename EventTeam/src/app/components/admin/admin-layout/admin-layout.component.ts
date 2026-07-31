import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../Services/auth.service';
import { AdminService } from '../../../Services/admin.service';
import { AuthResponse } from '../../../models/auth-response.model';
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

  constructor(private authService: AuthService, private adminService: AdminService, private router: Router) {}

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

  goToProfile(): void {
    this.router.navigate(['/admin/profile']);
  }
}
