import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RhService } from '../../../Services/rh.service';
import { ImageService } from '../../../Services/image.service';
import { EventStatus } from '../../../models/rh.model';
import { ImagePickerComponent } from '../../../shared/image-picker/image-picker.component';
@Component({
  selector: 'app-rh-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ImagePickerComponent],
  templateUrl: './rh-create-event.component.html',
  styleUrls: ['./rh-create-event.component.css'],
})
export class RhCreateEventComponent implements OnInit {
  @ViewChild(ImagePickerComponent) imagePicker?: ImagePickerComponent;
  form: FormGroup;
  isEditMode = false;
  saving = false;
  private eventId: string | null = null;
  readonly statusOptions: EventStatus[] = ['À venir', 'Terminé'];
  constructor(
    private fb: FormBuilder,
    private rhService: RhService,
    private imageService: ImageService,
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
    this.saving = true;
    const payload = this.form.value;
    if (this.isEditMode && this.eventId) {
      this.rhService.updateEvent(this.eventId, payload).subscribe(() => {
        this.attachImage(this.eventId!);
      });
    } else {
      this.rhService.createEvent(payload).subscribe((created) => {
        this.attachImage(created.id);
      });
    }
  }

  /** Attaches the RH's chosen image, or a random one from the gallery if none was picked. */
  private attachImage(eventId: string): void {
    const image = this.imagePicker?.getSelectionOrRandom();
    if (!image || !image.path) {
      this.saving = false;
      this.router.navigate(['/rh/evenements']);
      return;
    }
    this.imageService.addToEvent(eventId, { path: image.path, extension: image.extension }).subscribe({
      next: () => {
        this.saving = false;
        this.router.navigate(['/rh/evenements']);
      },
      error: (err) => {
        console.error("Erreur lors de l'enregistrement de l'image", err);
        this.saving = false;
        this.router.navigate(['/rh/evenements']);
      },
    });
  }
  onCancel(): void {
    this.router.navigate(['/rh/evenements']);
  }
}
