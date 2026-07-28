import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { EmployeeService } from '../../../Services/employee.service';
import { Employe, isEmploye } from '../../../models/user.model';

@Component({
  selector: 'app-employe-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employe-profil.component.html',
  styleUrls: ['./employe-profil.component.css'],
})
export class EmployeProfilComponent implements OnInit {
  form: FormGroup;
  currentUser: Employe | null = null;
  saved = false;
  saveError = false;

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
  }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.currentUser = isEmploye(user) ? user : null;
    if (this.currentUser) {
      this.form.patchValue(this.currentUser);
    }
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
}
