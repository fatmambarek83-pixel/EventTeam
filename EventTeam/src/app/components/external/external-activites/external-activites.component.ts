import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from '../../../Services/activity.service';
import { Activity } from '../../../models/activity.model';

@Component({
  selector: 'app-external-activites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './external-activites.component.html',
  styleUrls: ['./external-activites.component.css'],
})
export class ExternalActivitesComponent implements OnInit {
  activities: Activity[] = [];
  loading = true;
  errorMessage = '';

  constructor(private activityService: ActivityService) {}

  ngOnInit(): void {
    this.activityService.getAll().subscribe({
      next: (activities) => {
        this.activities = activities ?? [];
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les activités.';
        this.loading = false;
      },
    });
  }
}
