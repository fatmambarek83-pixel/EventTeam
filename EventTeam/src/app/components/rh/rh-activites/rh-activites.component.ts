import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RhService } from '../../../Services/rh.service';
import { Activity } from '../../../models/rh.model';

@Component({
  selector: 'app-rh-activites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rh-activites.component.html',
  styleUrls: ['./rh-activites.component.css'],
})
export class RhActivitesComponent implements OnInit {
  activities: Activity[] = [];
  constructor(private rhService: RhService, private router: Router) {}
  ngOnInit(): void {
    this.load();
  }
  load(): void {
    this.rhService.getActivities().subscribe((activities) => (this.activities = activities));
  }
  onCreate(): void {
    this.router.navigate(['/rh/activites/nouvelle']);
  }
  onEdit(activity: Activity): void {
    this.router.navigate(['/rh/activites', activity.id, 'modifier']);
  }
  onDelete(activity: Activity): void {
    if (!activity.id) return;
    if (!confirm(`Supprimer l'activité "${activity.name}" ?`)) return;
    this.rhService.deleteActivity(activity.id).subscribe(() => this.load());
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
