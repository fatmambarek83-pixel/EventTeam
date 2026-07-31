import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryImage, IMAGE_GALLERY, getRandomGalleryImage } from '../../constants/image-gallery.constants';

export interface PickedImage {
  path: string;
  extension: string;
  chosen: boolean;
}

@Component({
  selector: 'app-image-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.css'],
})
export class ImagePickerComponent {
  @Output() imageChange = new EventEmitter<PickedImage>();

  readonly gallery: GalleryImage[] = IMAGE_GALLERY;
  readonly categories: string[] = Array.from(new Set(IMAGE_GALLERY.map((g) => g.category)));

  activeCategory = this.categories[0];
  selectedUrl: string | null = null;
  uploadedPreview: string | null = null;
  uploadError = '';

  get visibleImages(): GalleryImage[] {
    return this.gallery.filter((g) => g.category === this.activeCategory);
  }

  setCategory(category: string): void {
    this.activeCategory = category;
  }

  selectPreset(image: GalleryImage): void {
    this.selectedUrl = image.url;
    this.uploadedPreview = null;
    this.uploadError = '';
    this.imageChange.emit({ path: image.url, extension: 'jpg', chosen: true });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.uploadError = 'Merci de choisir un fichier image.';
      return;
    }
    this.uploadError = '';
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.uploadedPreview = dataUrl;
      this.selectedUrl = null;
      const extension = file.name.split('.').pop() || 'png';
      this.imageChange.emit({ path: dataUrl, extension, chosen: true });
    };
    reader.readAsDataURL(file);
  }

  clearSelection(): void {
    this.selectedUrl = null;
    this.uploadedPreview = null;
    this.uploadError = '';
    this.imageChange.emit({ path: '', extension: '', chosen: false });
  }
  getSelectionOrRandom(): PickedImage {
    if (this.uploadedPreview) {
      return { path: this.uploadedPreview, extension: 'png', chosen: true };
    }
    if (this.selectedUrl) {
      return { path: this.selectedUrl, extension: 'jpg', chosen: true };
    }
    const random = getRandomGalleryImage();
    return { path: random.url, extension: 'jpg', chosen: false };
  }
}
