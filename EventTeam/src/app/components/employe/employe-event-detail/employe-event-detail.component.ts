import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, catchError, of } from 'rxjs';
import { EventService } from '../../../Services/event.service';
import { ActivityService } from '../../../Services/activity.service';
import { ImageService } from '../../../Services/image.service';
import { Event } from '../../../models/event.model';
import { Activity } from '../../../models/activity.model';

@Component({
  selector: 'app-employe-event-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employe-event-detail.component.html',
  styleUrls: ['./employe-event-detail.component.css'],
})
export class EmployeEventDetailComponent implements OnInit {
  event: Event | null = null;
  activities: Activity[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private activityService: ActivityService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const eventId = idParam ? Number(idParam) : null;
    if (!eventId) {
      this.errorMessage = "Événement introuvable.";
      this.loading = false;
      return;
    }
    this.load(eventId);
  }

  load(eventId: number): void {
    this.loading = true;
    this.errorMessage = '';
    forkJoin([
      this.eventService.getById(eventId),
      this.activityService.getByEvent(eventId),
      this.imageService.getAllActivityImagePaths().pipe(catchError(() => of({} as Record<string, string>))),
    ]).subscribe({
      next: ([event, activities, activityImages]) => {
        this.event = event;
        this.activities = (activities ?? []).map((a) => ({
          ...a,
          imageUrl: a.id != null ? activityImages[String(a.id)] : undefined,
        }));
        this.loading = false;
      },
      error: () => {
        this.errorMessage = "Impossible de charger les activités de cet événement.";
        this.loading = false;
      },
    });
  }

  statusClass(status?: string): string {
    switch (status) {
      case 'Actif': return 'badge-active';
      case 'Planifié': return 'badge-planned';
      case 'Terminé': return 'badge-done';
      default: return '';
    }
  }
}
