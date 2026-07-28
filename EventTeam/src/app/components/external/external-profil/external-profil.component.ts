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
