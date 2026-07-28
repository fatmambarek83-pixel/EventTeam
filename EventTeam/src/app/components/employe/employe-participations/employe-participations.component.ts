import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipationService } from '../../../Services/participation.service';
import { AuthService } from '../../../Services/auth.service';
import { Participation } from '../../../models/participation.model';
import { isEmploye } from '../../../models/user.model';

@Component({
  selector: 'app-employe-participations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employe-participations.component.html',
  styleUrls: ['./employe-participations.component.css'],
})
export class EmployeParticipationsComponent implements OnInit {
  participations: Participation[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private participationService: ParticipationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    const employeId = isEmploye(user) ? user.id : null;
    if (!employeId) {
      this.loading = false;
      return;
    }
    this.participationService.getMine(employeId).subscribe({
      next: (participations) => {
        this.participations = participations ?? [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger vos participations.';
        this.loading = false;
      },
    });
  }
}
