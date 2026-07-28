import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { ResponsableRhService } from '../../../Services/responsable-rh.service';
import { ResponsableRH, isResponsableRH } from '../../../models/user.model';
@Component({
  selector: 'app-rh-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rh-profil.component.html',
  styleUrls: ['./rh-profil.component.css'],
})
export class RhProfilComponent implements OnInit {
  form: FormGroup;
  currentUser: ResponsableRH | null = null;
  saved = false;
  saveError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private responsableRhService: ResponsableRhService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departement: [''],
    });
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser = isResponsableRH(user) ? user : null;
    if (this.currentUser) {
      this.form.patchValue(this.currentUser);
    }
  }

  onSave(): void {
    if (this.form.invalid || !this.currentUser) {
      this.form.markAllAsTouched();
      return;
    }
    this.responsableRhService.update(this.currentUser.id, this.form.value).subscribe({
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
