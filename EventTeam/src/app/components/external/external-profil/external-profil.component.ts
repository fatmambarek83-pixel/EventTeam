import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { ExternalService } from '../../../Services/external.service';
import { ExternalCompany, isExternalCompany } from '../../../models/user.model';

@Component({
  selector: 'app-external-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './external-profil.component.html',
  styleUrls: ['./external-profil.component.css'],
})
export class ExternalProfilComponent implements OnInit {
  form: FormGroup;
  currentUser: ExternalCompany | null = null;
  saved = false;
  saveError = false;

  photo: string | null = null;
  photoUploading = false;
  photoError = '';
  private static readonly MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private externalService: ExternalService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactName: [''],
      phone: [''],
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser = isExternalCompany(user) ? user : null;
    if (this.currentUser) {
      this.form.patchValue(this.currentUser);
    }
    this.externalService.getProfile().subscribe({
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
    if (file.size > ExternalProfilComponent.MAX_PHOTO_SIZE) {
      this.photoError = "L'image ne doit pas dépasser 2 Mo.";
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.photoUploading = true;
      this.externalService.updatePhoto(base64).subscribe({
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
    this.externalService.deletePhoto().subscribe({
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
    this.externalService.update(this.currentUser.id, this.form.value).subscribe({
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
}
