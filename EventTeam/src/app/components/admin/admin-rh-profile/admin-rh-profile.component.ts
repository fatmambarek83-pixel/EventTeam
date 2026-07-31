import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService, RhAccount } from '../../../Services/admin.service';

const AVATAR_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

@Component({
  selector: 'app-admin-rh-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-rh-profile.component.html',
  styleUrls: ['./admin-rh-profile.component.css']
})
export class AdminRhProfileComponent implements OnInit {

  user: RhAccount | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage = 'Compte introuvable.';
      return;
    }
    this.loading = true;
    this.adminService.getRHById(id).subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement profil RH:', err);
        this.errorMessage = "Impossible de charger ce profil. Vérifiez que le backend est démarré.";
        this.loading = false;
      }
    });
  }

  getInitials(name?: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getAvatarColor(): string {
    if (!this.user) return AVATAR_COLORS[0];
    return AVATAR_COLORS[this.user.id % AVATAR_COLORS.length];
  }

  goBack(): void {
    this.router.navigate(['/admin/users']);
  }
}
