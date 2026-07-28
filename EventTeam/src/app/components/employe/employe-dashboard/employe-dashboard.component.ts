import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../Services/event.service';
import { ParticipationService } from '../../../Services/participation.service';
import { AuthService } from '../../../Services/auth.service';
import { Event } from '../../../models/event.model';
import { Participation } from '../../../models/participation.model';
import { isEmploye } from '../../../models/user.model';

@Component({
  selector: 'app-employe-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employe-dashboard.component.html',
  styleUrls: ['./employe-dashboard.component.css'],
})
export class EmployeDashboardComponent implements OnInit {
  firstName = '';
  employeId: number | null = null;

  participations: Participation[] = [];
  upcomingEvents: Event[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private eventService: EventService,
    private participationService: ParticipationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.firstName = user?.name?.split(/\s+/)[0] ?? 'Utilisateur';
    this.employeId = isEmploye(user) ? user.id : null;

    this.eventService.getAll().subscribe({
      next: (events) => {
        this.upcomingEvents = (events ?? [])
          .filter((e) => e.status !== 'Terminé')
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .slice(0, 3);
        this.loading = false;
      },
      error: () => {
        this.errorMessage = "Impossible de charger les événements.";
        this.loading = false;
      },
    });

    if (this.employeId) {
      this.participationService.getMine(this.employeId).subscribe({
        next: (participations) => (this.participations = participations ?? []),
        error: () => (this.participations = []),
      });
    }
  }

  get totalParticipations(): number {
    return this.participations.length;
  }

  get acceptedCount(): number {
    return this.participations.filter((p) => p.status === 'Accepté').length;
  }

  get pendingCount(): number {
    return this.participations.filter((p) => p.status === 'En attente').length;
  }

  progressPercent(event: Event): number {
    if (!event.capacity) return 0;
    return Math.min(100, Math.round(((event.participantsCount ?? 0) / event.capacity) * 100));
  }

  progressColor(percent: number): string {
    if (percent >= 90) return '#ef4444';
    if (percent >= 60) return '#f59e0b';
    return '#6c5ce7';
  }
}
