import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RhService } from '../../../Services/rh.service';
import { EventStatus } from '../../../models/rh.model';
@Component({
  selector: 'app-rh-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './rh-create-event.component.html',
  styleUrls: ['./rh-create-event.component.css'],
})
export class RhCreateEventComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  private eventId: string | null = null;
  readonly statusOptions: EventStatus[] = ['À venir', 'Terminé'];
  constructor(
    private fb: FormBuilder,
    private rhService: RhService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      date: ['', Validators.required],
      maxCapacity: [30, [Validators.required, Validators.min(1)]],
      location: ['', Validators.required],
      status: ['À venir', Validators.required],
    });
  }
  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.eventId;
    if (this.eventId) {
      this.rhService.getEventById(this.eventId).subscribe((event) => {
        if (event) {
          this.form.patchValue(event);
        }
      });
    }
  }
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload = this.form.value;
    if (this.isEditMode && this.eventId) {
      this.rhService.updateEvent(this.eventId, payload).subscribe(() => {
        this.router.navigate(['/rh/evenements']);
      });
    } else {
      this.rhService.createEvent(payload).subscribe(() => {
        this.router.navigate(['/rh/evenements']);
      });
    }
  }
  onCancel(): void {
    this.router.navigate(['/rh/evenements']);
  }
}
