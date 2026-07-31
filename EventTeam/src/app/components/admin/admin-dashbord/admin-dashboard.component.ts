import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService } from '../../../Services/event.service';
import { AuthService } from '../../../Services/auth.service';
import { Event } from '../../../models/event.model';

const MONTHS_FR = ['JANV.', 'FÉVR.', 'MARS', 'AVR.', 'MAI', 'JUIN', 'JUIL.', 'AOÛT', 'SEPT.', 'OCT.', 'NOV.', 'DÉC.'];

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  firstName = 'Admin';
  loading = true;

  stats = {
    totalEvents: 0,
    activeActivities: 0,
    totalParticipants: 0,
    averageRating: 0
  };

  upcomingEvents: any[] = [];

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.firstName = user?.name?.split(/\s+/)[0] ?? 'Admin';
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getAll().subscribe({
      next: (events) => {
        this.stats.totalEvents = events.length;
        this.stats.activeActivities = events.filter(e => e.status === 'À venir').length;
        this.stats.totalParticipants = events.reduce((sum, e) => sum + (e.participantsCount || 0), 0);
        this.stats.averageRating = 0;
        this.upcomingEvents = events
          .slice()
          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .slice(0, 4)
          .map((ev) => this.mapEventToCard(ev));
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des événements', err);
        this.loading = false;
      }
    });
  }

  progressColor(percent: number): string {
    if (percent >= 90) return '#ef4444';
    if (percent >= 60) return '#f59e0b';
    return '#22c55e';
  }

  private mapEventToCard(ev: Event) {
    const date = ev.startDate ? new Date(ev.startDate) : null;
    const current = ev.participantsCount || 0;
    const progress = ev.capacity ? Math.round((current / ev.capacity) * 100) : 0;
    return {
      id: ev.id,
      day: date ? String(date.getDate()).padStart(2, '0') : '--',
      month: date ? MONTHS_FR[date.getMonth()] : '',
      title: ev.name || ev.title,
      status: ev.status || 'À venir',
      location: ev.location || '',
      progress,
      currentParticipants: current,
      maxParticipants: ev.capacity,
      imageUrl: ev.imageUrl,
    };
  }
}
