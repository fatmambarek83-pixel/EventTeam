import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { RhService } from '../../../Services/rh.service';
import { FeedbackEvent } from '../../../models/rh.model';
@Component({
  selector: 'app-rh-feedbacks',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rh-feedbacks.component.html',
  styleUrls: ['./rh-feedbacks.component.css'],
})
export class RhFeedbacksComponent implements OnInit {
  feedbackEvents: FeedbackEvent[] = [];
  constructor(private rhService: RhService, private router: Router) {}
  ngOnInit(): void {
    this.rhService.getFeedbackEvents().subscribe((list) => (this.feedbackEvents = list));
  }
  averageRating(f: FeedbackEvent): number {
    if (!f.reviews.length) return 0;
    return Math.round((f.reviews.reduce((sum, r) => sum + r.rating, 0) / f.reviews.length) * 10) / 10;
  }
  openDetail(f: FeedbackEvent): void {
    this.router.navigate(['/rh/feedbacks', f.eventId]);
  }
}
