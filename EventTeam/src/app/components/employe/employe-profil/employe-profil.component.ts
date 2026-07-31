import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { EmployeeService } from '../../../Services/employee.service';
import { Employe, isEmploye } from '../../../models/user.model';

@Component({
  selector: 'app-employe-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employe-profil.component.html',
  styleUrls: ['./employe-profil.component.css'],
})
export class EmployeProfilComponent implements OnInit {
  form: FormGroup;
  currentUser: Employe | null = null;
  saved = false;
  saveError = false;

  photo: string | null = null;
  photoUploading = false;
  photoError = '';
  private static readonly MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB

  passwordForm: FormGroup;
  passwordSaving = false;
  passwordSaved = false;
  passwordError = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      poste: [''],
      departement: [''],
    });
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser = isEmploye(user) ? user : null;
    if (this.currentUser) {
      this.form.patchValue(this.currentUser);
    }
    this.employeeService.getProfile().subscribe({
      next: (profile) => {
        this.photo = profile.photo || null;
      },
      error: () => {},
    });
  }

  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts[1]?.charAt(0) ?? '';
    return (first + second).toUpperCase() || 'U';
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.photoError = '';

    if (!file.type.startsWith('image/')) {
      this.photoError = "Le fichier doit être une image.";
      input.value = '';
      return;
    }
    if (file.size > EmployeProfilComponent.MAX_PHOTO_SIZE) {
      this.photoError = "L'image ne doit pas dépasser 2 Mo.";
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.photoUploading = true;
      this.employeeService.updatePhoto(base64).subscribe({
        next: (data) => {
          this.photo = data.photo || null;
          this.photoUploading = false;
        },
        error: (err) => {
          console.error('Erreur upload photo:', err);
          this.photoError = "Échec de l'envoi de la photo.";
          this.photoUploading = false;
        },
      });
    };
    reader.onerror = () => {
      this.photoError = 'Impossible de lire le fichier.';
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  onDeletePhoto(): void {
    this.photoUploading = true;
    this.photoError = '';
    this.employeeService.deletePhoto().subscribe({
      next: () => {
        this.photo = null;
        this.photoUploading = false;
      },
      error: (err) => {
        console.error('Erreur suppression photo:', err);
        this.photoError = 'Échec de la suppression de la photo.';
        this.photoUploading = false;
      },
    });
  }

  onSave(): void {
    if (this.form.invalid || !this.currentUser) {
      this.form.markAllAsTouched();
      return;
    }
    this.employeeService.update(this.currentUser.id, this.form.value).subscribe({
      next: (updated) => {
        this.currentUser = updated;
        this.saved = true;
        this.saveError = false;
        setTimeout(() => (this.saved = false), 2500);
      },
      error: () => {
        this.saveError = true;
      },
    });
  }

  onChangePassword(): void {
    this.passwordError = '';
    this.passwordSaved = false;

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.passwordError = 'Le nouveau mot de passe et la confirmation ne correspondent pas.';
      return;
    }

    this.passwordSaving = true;
    this.employeeService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.passwordSaving = false;
        this.passwordSaved = true;
        this.passwordForm.reset();
        setTimeout(() => (this.passwordSaved = false), 2500);
      },
      error: (err: any) => {
        this.passwordSaving = false;
        this.passwordError = err?.error?.message || 'Le mot de passe actuel est incorrect.';
      },
    });
  }
}
