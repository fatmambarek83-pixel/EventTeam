import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../Services/auth.service';
import { AdminService } from '../../../../Services/admin.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() currentUser: { name?: string; email?: string } | null = null;
  photo: string | null = null;
  private profileSub?: Subscription;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileSub = this.adminService.profile$.subscribe(profile => {
      this.photo = profile?.photo || null;
    });
    this.adminService.getProfile().subscribe({ error: () => {} });
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

  getEmailInitial(email: string | undefined): string {
    if (!email) return 'A';
    return email.charAt(0).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
