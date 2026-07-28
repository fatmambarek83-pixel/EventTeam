import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../../../models/auth-response.model';
import { AuthService } from '../../../Services/auth.service';
import { Role, ROLE_LABLES } from '../../../constants/role.constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  Role = Role;
  ROLE_LABLES = ROLE_LABLES;

  selectedRole: Role = Role.EMPLOYE;
  errorMessage = '';
  loading = false;

  form = {
    nom: '',
    prenom: '',
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    departement: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  selectRole(role: Role) {
    this.selectedRole = role;
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    if (this.form.password !== this.form.confirmPassword) {
      this.loading = false;
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    let payload: RegisterRequest;
    if (this.selectedRole === Role.EXTERNAL_COMPANY) {
      payload = {
        name: this.form.companyName,
        email: this.form.email,
        password: this.form.password,
        role: this.selectedRole
      };
    } else {
      payload = {
        name: `${this.form.prenom} ${this.form.nom}`.trim(),
        email: this.form.email,
        password: this.form.password,
        role: this.selectedRole
      };
    }

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login'], { queryParams: { pending: 1 } });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || "Une erreur est survenue lors de l'inscription.";
        console.error(err);
      }
    });
  }
}
