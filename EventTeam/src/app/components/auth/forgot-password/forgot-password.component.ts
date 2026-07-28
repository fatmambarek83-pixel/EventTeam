import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (res) => {
        this.loading = false;
        this.submitted = true;
        this.successMessage = res.message;
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || "Une erreur est survenue. Veuillez réessayer.";
        console.error(err);
      }
    });
  }
}
