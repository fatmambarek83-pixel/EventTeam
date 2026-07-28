import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RhService } from '../../../Services/rh.service';
import { FeedbackEvent } from '../../../models/rh.model';
@Component({
  selector: 'app-rh-feedback-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rh-feedback-detail.component.html',
  styleUrls: ['./rh-feedback-detail.component.css'],
})
export class RhFeedbackDetailComponent implements OnInit {
  feedback: FeedbackEvent | null = null;

  constructor(private route: ActivatedRoute, private rhService: RhService) {
  }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('eventId');
    if (eventId) {
      this.rhService.getFeedbackByEventId(eventId).subscribe((f) => (this.feedback = f ?? null));
    }
  }

  stars(rating: number): number[] {
    return Array.from({length: 5}, (_, i) => i + 1);
  }
}
