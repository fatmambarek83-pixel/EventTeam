import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../Services/event.service';
import { Event } from '../../../models/event.model';

const MONTHS_FR = ['JANV.', 'FÉVR.', 'MARS', 'AVR.', 'MAI', 'JUIN', 'JUIL.', 'AOÛT', 'SEPT.', 'OCT.', 'NOV.', 'DÉC.'];
const THEME_CLASSES = ['blue', 'purple', 'green', 'yellow'];

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  loading = true;

  stats = {
    totalEvents: 0,
    activeActivities: 0,
    totalParticipants: 0,
    averageRating: 0
  };

  upcomingEvents: any[] = [];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getAll().subscribe({
      next: (events) => {
        this.stats.totalEvents = events.length;
        this.stats.activeActivities = events.length;
        this.stats.totalParticipants = events.reduce((sum, e) => sum + (e.participantsCount || 0), 0);
        this.stats.averageRating = 0;
        this.upcomingEvents = events.map((ev, i) => this.mapEventToCard(ev, i));
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des événements', err);
        this.loading = false;
      }
    });
  }

  private mapEventToCard(ev: Event, index: number) {
    const date = ev.startDate ? new Date(ev.startDate) : null;
    const current = ev.participantsCount || 0;
    return {
      day: date ? String(date.getDate()).padStart(2, '0') : '--',
      month: date ? MONTHS_FR[date.getMonth()] : '',
      title: ev.title,
      status: ev.status || 'À venir',
      location: ev.location || '',
      progress: ev.capacity ? Math.round((current / ev.capacity) * 100) : 0,
      currentParticipants: current,
      maxParticipants: ev.capacity,
      themeClass: THEME_CLASSES[index % THEME_CLASSES.length]
    };
  }
}
