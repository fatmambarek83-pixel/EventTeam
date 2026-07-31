import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../Services/event.service';
import { ParticipationService } from '../../../Services/participation.service';
import { AuthService } from '../../../Services/auth.service';
import { Event } from '../../../models/event.model';
import { Participation } from '../../../models/participation.model';
import { isEmploye } from '../../../models/user.model';

type FilterTab = 'Tous' | 'À venir' | 'Terminé';

interface EventRow {
  event: Event;
  participation: Participation | null;
}

@Component({
  selector: 'app-employe-evenements',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employe-evenements.component.html',
  styleUrls: ['./employe-evenements.component.css'],
})
export class EmployeEvenementsComponent implements OnInit {
  rows: EventRow[] = [];
  activeTab: FilterTab = 'Tous';
  employeId: number | null = null;
  loading = true;
  errorMessage = '';
  pendingActionEventId: number | null = null;

  constructor(
    private eventService: EventService,
    private participationService: ParticipationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.employeId = isEmploye(user) ? user.id : null;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.errorMessage = '';
    this.eventService.getAll().subscribe({
      next: (events) => {
        const list = events ?? [];
        if (this.employeId) {
          this.participationService.getMine(this.employeId).subscribe({
            next: (participations) => {
              this.rows = list.map((event) => ({
                event,
                participation: (participations ?? []).find((p) => p.eventId === event.id) ?? null,
              }));
              this.loading = false;
            },
            error: () => {
              this.rows = list.map((event) => ({ event, participation: null }));
              this.loading = false;
            },
          });
        } else {
          this.rows = list.map((event) => ({ event, participation: null }));
          this.loading = false;
        }
      },
      error: () => {
        this.errorMessage = "Impossible de charger les événements.";
        this.loading = false;
      },
    });
  }

  get filteredRows(): EventRow[] {
    if (this.activeTab === 'Tous') return this.rows;
    return this.rows.filter((r) => (r.event.status ?? 'À venir') === this.activeTab);
  }

  setTab(tab: FilterTab): void {
    this.activeTab = tab;
  }

  isActive(participation: Participation | null): boolean {
    return !!participation && participation.status !== 'Annulé' && participation.status !== 'Refusé';
  }

  onParticiper(row: EventRow): void {
    if (!this.employeId || !row.event.id) {
      console.warn('[EmployeEvenements] onParticiper bloqué — employeId:', this.employeId, 'eventId:', row.event.id);
      this.errorMessage = !this.employeId
        ? "Votre session n'a pas pu être identifiée. Reconnectez-vous et réessayez."
        : "Cet événement n'est pas valide.";
      return;
    }
    this.pendingActionEventId = row.event.id;
    this.participationService.participer(row.event.id, this.employeId).subscribe({
      next: () => {
        this.pendingActionEventId = null;
        this.load();
      },
      error: () => {
        this.pendingActionEventId = null;
        this.errorMessage = "Impossible de rejoindre cet événement.";
      },
    });
  }

  onAnnuler(row: EventRow): void {
    if (!this.employeId || !row.event.id) {
      console.warn('[EmployeEvenements] onAnnuler bloqué — employeId:', this.employeId, 'eventId:', row.event.id);
      this.errorMessage = !this.employeId
        ? "Votre session n'a pas pu être identifiée. Reconnectez-vous et réessayez."
        : "Cet événement n'est pas valide.";
      return;
    }
    if (!confirm(`Annuler votre participation à "${row.event.name}" ?`)) return;
    this.pendingActionEventId = row.event.id;
    this.participationService.annuler(row.event.id, this.employeId).subscribe({
      next: () => {
        this.pendingActionEventId = null;
        this.load();
      },
      error: () => {
        this.pendingActionEventId = null;
        this.errorMessage = "Impossible d'annuler votre participation.";
      },
    });
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
