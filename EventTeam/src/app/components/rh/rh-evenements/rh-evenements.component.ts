import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RhService } from '../../../Services/rh.service';
import { EventItem, EventStatus } from '../../../models/rh.model';
type FilterTab = 'Tous' | EventStatus;
@Component({
  selector: 'app-rh-evenements',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rh-evenements.component.html',
  styleUrls: ['./rh-evenements.component.css'],
})
export class RhEvenementsComponent implements OnInit {
  events: EventItem[] = [];
  activeTab: FilterTab = 'Tous';
  constructor(private rhService: RhService, private router: Router) {}
  ngOnInit(): void {
    this.load();
  }
  load(): void {
    this.rhService.getEvents().subscribe((events) => (this.events = events));
  }
  get filteredEvents(): EventItem[] {
    if (this.activeTab === 'Tous') return this.events;
    return this.events.filter((e) => e.status === this.activeTab);
  }
  setTab(tab: FilterTab): void {
    this.activeTab = tab;
  }
  onCreate(): void {
    this.router.navigate(['/rh/evenements/nouveau']);
  }
  onEdit(event: EventItem): void {
    this.router.navigate(['/rh/evenements', event.id, 'modifier']);
  }
  onDelete(event: EventItem): void {
    if (!confirm(`Supprimer l'événement "${event.name}" ?`)) return;
    this.rhService.deleteEvent(event.id).subscribe(() => this.load());
  }
  progressPercent(event: EventItem): number {
    return Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));
  }
  progressColor(percent: number): string {
    if (percent >= 90) return '#ef4444';
    if (percent >= 60) return '#f59e0b';
    return '#6c5ce7';
  }
}
