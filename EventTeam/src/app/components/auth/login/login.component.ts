import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../../models/auth-response.model';
import { AuthService } from '../../../Services/auth.service';
import { Role, ROLE_HOME_ROUTE, ROLE_LABLES } from '../../../constants/role.constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Role = Role;
  ROLE_LABLES = ROLE_LABLES;

  selectedRole: Role = Role.EMPLOYE;
  credentials = { email: '', password: '' };
  errorMessage = '';
  loading = false;
  showPendingBanner = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.showPendingBanner = this.route.snapshot.queryParamMap.get('pending') === '1';
  }

  selectRole(role: Role) {
    this.selectedRole = role;
    this.credentials = { email: '', password: '' };
  }

  onSubmit() {
    this.loading = true;
    this.errorMessage = '';

    const loginData: LoginRequest = {
      ...this.credentials,
      role: this.selectedRole
    };

    this.authService.login(loginData).subscribe({
      next: () => {
        this.loading = false;
        const userRole = this.authService.getRole();

        if (userRole !== this.selectedRole) {
          this.authService.logout();
          this.errorMessage = "Cet email ne correspond pas au type de compte sélectionné.";
          return;
        }

        this.router.navigate([ROLE_HOME_ROUTE[this.selectedRole]]);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Email ou mot de passe incorrect.';
        console.error(err);
      }
    });
  }
}
