import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RhService } from '../../../Services/rh.service';
import { ActivityService } from '../../../Services/activity.service';
import { ImageService } from '../../../Services/image.service';
import { ActivityStatus, EventItem } from '../../../models/rh.model';
import { ImagePickerComponent } from '../../../shared/image-picker/image-picker.component';

@Component({
  selector: 'app-rh-create-activity',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ImagePickerComponent],
  templateUrl: './rh-create-activity.component.html',
  styleUrls: ['./rh-create-activity.component.css'],
})
export class RhCreateActivityComponent implements OnInit {
  @ViewChild(ImagePickerComponent) imagePicker?: ImagePickerComponent;
  form: FormGroup;
  isEditMode = false;
  saving = false;
  events: EventItem[] = [];
  private activityId: number | null = null;
  readonly statusOptions: ActivityStatus[] = ['Planifié', 'Actif', 'Terminé'];

  constructor(
    private fb: FormBuilder,
    private rhService: RhService,
    private activityService: ActivityService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      animateur: ['', Validators.required],
      status: ['Planifié', Validators.required],
      eventId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.rhService.getEvents().subscribe((events) => (this.events = events));
    const idParam = this.route.snapshot.paramMap.get('id');
    this.activityId = idParam ? Number(idParam) : null;
    this.isEditMode = !!this.activityId;
    if (this.activityId) {
      this.activityService.getById(this.activityId).subscribe((activity) => {
        if (activity) {
          this.form.patchValue({ ...activity, eventId: activity.event?.id });
          this.form.get('eventId')?.clearValidators();
          this.form.get('eventId')?.updateValueAndValidity();
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    const { eventId, ...activity } = this.form.value;
    if (this.isEditMode && this.activityId) {
      this.activityService.update(this.activityId, activity).subscribe(() => {
        this.attachImage(this.activityId!);
      });
    } else {
      this.activityService.create(eventId, activity).subscribe((created) => {
        this.attachImage(created.id!);
      });
    }
  }

  /** Attaches the RH's chosen image, or a random one from the gallery if none was picked. */
  private attachImage(activityId: number): void {
    const image = this.imagePicker?.getSelectionOrRandom();
    if (!image || !image.path) {
      this.saving = false;
      this.router.navigate(['/rh/activites']);
      return;
    }
    this.imageService.addToActivity(activityId, { path: image.path, extension: image.extension }).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/rh/activites']);
      },
      error: (err) => {
        console.error("Erreur lors de l'enregistrement de l'image", err);
        this.saving = false;
        this.router.navigate(['/rh/activites']);
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/rh/activites']);
  }
}
