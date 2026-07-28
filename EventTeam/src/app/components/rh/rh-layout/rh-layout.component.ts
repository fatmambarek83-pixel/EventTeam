import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RhSidebarComponent } from '../rh-sidebar/rh-sidebar.component';
import { AuthService } from '../../../Services/auth.service';
import { ResponsableRH, isResponsableRH } from '../../../models/user.model';

@Component({
  selector: 'app-rh-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RhSidebarComponent],
  templateUrl: './rh-layout.component.html',
  styleUrls: ['./rh-layout.component.css'],
})
export class RhLayoutComponent implements OnInit {
  currentUser: ResponsableRH | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser = isResponsableRH(user) ? user : null;
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts[1]?.charAt(0) ?? '';
    return (first + second).toUpperCase() || 'U';
  }
}
