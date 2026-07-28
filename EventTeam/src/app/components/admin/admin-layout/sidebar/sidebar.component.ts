import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styles: [`
    .sidebar {
  width: 260px;
  background-color: #1a1b2f;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 16px;
  height: 100vh; /* Add this */
  position: sticky; /* Optional: makes sidebar stay in place */
  top: 0;
}
    .logo-section {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }
    .logo-icon {
      background-color: #6366f1;
      padding: 8px;
      border-radius: 10px;
      display: flex;
    }
    .logo-text {
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.5px;
    }
    .user-badge {
      display: inline-block;
      background-color: rgba(99,102,241,0.2);
      color: #a5b4fc;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .nav-menu {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      color: #9ca3af;
      text-decoration: none;
      font-size: 14px;
      cursor: pointer;
    }
    .nav-item:hover {
      background-color: rgba(255,255,255,0.05);
      color: #fff;
    }
    .nav-item.active {
      background-color: rgba(255,255,255,0.08);
      color: #fff;
      font-weight: 600;
    }
    .bottom-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .sidebar-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.08);
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 10px;
      overflow: hidden;
    }
    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background-color: #6366f1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      flex-shrink: 0;
    }
    .details {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .name {
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .role {
      font-size: 12px;
      color: #9ca3af;
    }
    .logout-btn {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      display: flex;
      padding: 6px;
    }
    .logout-btn:hover {
      color: #fff;
    }
  `]
})
export class SidebarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }


}
