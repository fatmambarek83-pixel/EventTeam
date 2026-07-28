import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RhService } from '../../../Services/rh.service';
import { Participation } from '../../../models/rh.model';
@Component({
  selector: 'app-rh-participations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rh-participations.component.html',
  styleUrls: ['./rh-participations.component.css'],
})
export class RhParticipationsComponent implements OnInit {
  participations: Participation[] = [];
  constructor(private rhService: RhService) {}
  ngOnInit(): void {
    this.load();
  }
  load(): void {
    this.rhService.getParticipations().subscribe((list) => (this.participations = list));
  }
  onAccept(p: Participation): void {
    this.rhService.updateParticipationStatus(p.id, 'Accepté').subscribe(() => this.load());
  }
  onRefuse(p: Participation): void {
    this.rhService.updateParticipationStatus(p.id, 'Refusé').subscribe(() => this.load());
  }
  statusClass(status: Participation['status']): string {
    switch (status) {
      case 'Accepté':
        return 'badge-accepted';
      case 'En attente':
        return 'badge-pending';
      case 'Refusé':
        return 'badge-refused';
    }
  }
}
