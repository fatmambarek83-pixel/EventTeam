import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../Services/admin.service';
import { RhAccount } from '../../../Services/admin.service';

// Couleurs d'avatar
const AVATAR_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  users: RhAccount[] = [];
  loading = false;
  submitting = false;
  deletingId: number | null = null;
  showPassword = false;

  // Modal suppression
  userToDelete: RhAccount | null = null;

  form = { name: '', email: '', password: '' };
  successMessage = '';
  errorMessage = '';

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.adminService.listRH().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement RH:', err);
        this.errorMessage = this.getErrorMessage(err, 'chargement');
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

  getAvatarColor(index: number): string {
    return AVATAR_COLORS[index % AVATAR_COLORS.length];
  }

  viewProfile(user: RhAccount): void {
    this.router.navigate(['/admin/users', user.id]);
  }

  /* ========== SUPPRESSION ========== */

  confirmDelete(user: RhAccount): void {
    this.userToDelete = user;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelDelete(): void {
    this.userToDelete = null;
    this.deletingId = null;
  }

  deleteUser(): void {
    if (!this.userToDelete?.id) return;

    this.deletingId = this.userToDelete.id;

    this.adminService.deleteRH(this.userToDelete.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== this.userToDelete!.id);
        this.successMessage = `Le compte de ${this.userToDelete!.name} a été supprimé avec succès.`;
        this.userToDelete = null;
        this.deletingId = null;

        // Auto-hide success message
        setTimeout(() => this.successMessage = '', 4000);
      },
      error: (err) => {
        this.errorMessage = this.getErrorMessage(err, 'suppression');
        this.deletingId = null;
        this.userToDelete = null;
      }
    });
  }

  /* ========== CRÉATION ========== */

  onSubmit(rhForm?: NgForm): void {
    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.validateForm()) {
      this.submitting = false;
      return;
    }

    this.adminService.createRH(this.form).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res.password) {
          this.successMessage = `Compte RH créé pour ${res.email}, mais l'email n'a pas pu être envoyé. `
            + `Mot de passe à transmettre manuellement : ${res.password}`;
        } else {
          this.successMessage = `Compte RH créé pour ${res.email}. Les identifiants ont été envoyés par email.`;
        }
        this.form = { name: '', email: '', password: '' };
        this.showPassword = false;
        // resetForm() clears values AND the touched/dirty/submitted state,
        // so the fields go back to their initial empty look (no red borders left over).
        rhForm?.resetForm();
        this.loadUsers();
      },
      error: (err) => {
        this.submitting = false;
        console.error('Erreur création RH:', err);
        this.errorMessage = this.getErrorMessage(err, 'création');
      }
    });
  }

  private validateForm(): boolean {
    if (!this.form.name.trim()) {
      this.errorMessage = 'Le nom complet est obligatoire.';
      return false;
    }
    if (!this.form.email.trim()) {
      this.errorMessage = "L'email est obligatoire.";
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.form.email)) {
      this.errorMessage = "L'email n'est pas valide.";
      return false;
    }
    if (!this.form.password) {
      this.errorMessage = 'Le mot de passe est obligatoire.';
      return false;
    }
    if (this.form.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
      return false;
    }
    return true;
  }

  private getErrorMessage(err: any, context: string): string {
    if (!err) return `Erreur inconnue lors du ${context}.`;
    if (err.status === 0) {
      return "Impossible de contacter le serveur.\nVérifiez que le backend est démarré.";
    }
    if (err.status === 401) {
      return "Session expirée. Veuillez vous reconnecter.";
    }
    if (err.status === 403) {
      return "Vous n'avez pas les permissions pour cette action.";
    }
    if (err.status === 409) {
      return "Un compte avec cet email existe déjà.";
    }
    if (err.status === 422) {
      return err.error?.message || "Données invalides. Vérifiez les champs.";
    }
    if (err.status >= 500) {
      return "Erreur serveur. Réessayez plus tard.";
    }
    return err.error?.message || `Erreur ${err.status}: ${err.message || 'Inconnue'}`;
  }
}
