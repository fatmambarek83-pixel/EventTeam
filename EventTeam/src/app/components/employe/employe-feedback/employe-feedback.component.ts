import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParticipationService } from '../../../Services/participation.service';
import { FeedbackService } from '../../../Services/feedback.service';
import { AuthService } from '../../../Services/auth.service';
import { Participation } from '../../../models/participation.model';
import { Feedback } from '../../../models/feedback.model';
import { isEmploye } from '../../../models/user.model';

interface FeedbackRow {
  participation: Participation;
  feedback: Feedback | null;
  editing: boolean;
  draftStars: number;
  draftComment: string;
  saving: boolean;
}

@Component({
  selector: 'app-employe-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employe-feedback.component.html',
  styleUrls: ['./employe-feedback.component.css'],
})
export class EmployeFeedbackComponent implements OnInit {
  rows: FeedbackRow[] = [];
  loading = true;
  errorMessage = '';
  employeId: number | null = null;

  constructor(
    private participationService: ParticipationService,
    private feedbackService: FeedbackService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.employeId = isEmploye(user) ? user.id : null;
    if (!this.employeId) {
      this.loading = false;
      return;
    }

    this.participationService.getMine(this.employeId).subscribe({
      next: (participations) => {
        // On ne propose un feedback que pour les événements où j'ai réellement participé (accepté).
        const attended = (participations ?? []).filter((p) => p.status === 'Accepté');
        if (attended.length === 0) {
          this.loading = false;
          return;
        }
        let remaining = attended.length;
        this.rows = attended.map((participation) => ({
          participation,
          feedback: null,
          editing: false,
          draftStars: 5,
          draftComment: '',
          saving: false,
        }));
        attended.forEach((participation, index) => {
          this.feedbackService.getByEvent(participation.eventId).subscribe({
            next: (feedbacks) => {
              const mine = (feedbacks ?? []).find((f) => f.auteurId === this.employeId) ?? null;
              this.rows[index].feedback = mine;
              if (mine) {
                this.rows[index].draftStars = mine.stars;
                this.rows[index].draftComment = mine.commentaire ?? '';
              }
              remaining--;
              if (remaining === 0) this.loading = false;
            },
            error: () => {
              remaining--;
              if (remaining === 0) this.loading = false;
            },
          });
        });
      },
      error: () => {
        this.errorMessage = 'Impossible de charger vos événements.';
        this.loading = false;
      },
    });
  }

  startEdit(row: FeedbackRow): void {
    row.editing = true;
  }

  cancelEdit(row: FeedbackRow): void {
    row.editing = false;
    row.draftStars = row.feedback?.stars ?? 5;
    row.draftComment = row.feedback?.commentaire ?? '';
  }

  setStars(row: FeedbackRow, stars: number): void {
    row.draftStars = stars;
  }

  submit(row: FeedbackRow): void {
    if (!this.employeId) return;
    row.saving = true;
    this.feedbackService
      .create(row.participation.eventId, this.employeId, {
        stars: row.draftStars,
        commentaire: row.draftComment,
      })
      .subscribe({
        next: (feedback) => {
          row.feedback = feedback;
          row.editing = false;
          row.saving = false;
        },
        error: () => {
          row.saving = false;
          this.errorMessage = "Impossible d'enregistrer votre avis.";
        },
      });
  }
}
