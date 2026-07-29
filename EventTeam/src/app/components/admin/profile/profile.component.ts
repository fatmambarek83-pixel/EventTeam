import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AdminService} from "../../../Services/admin.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports:[CommonModule,FormsModule],
  templateUrl:'./profile.component.html',
  styleUrls:['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile={
    name:'',
    email:'',
    phone:'',
    position:'',
    photo: null as string | null
  };
  password={
    current:'',
    new:'',
    confirm:''
  };

  loading = false;
  saving = false;
  saveSuccess = false;
  errorMessage = '';
  lastEditDate: string = '—';
  twoFactorEnabled = false;

  photoUploading = false;
  photoError = '';
  private static readonly MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loading = true;
    this.adminService.getProfile().subscribe({
      next: (data) => {
        this.profile = {
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          position: data.position || '',
          photo: data.photo || null
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement profil:', err);
        this.errorMessage = "Impossible de charger le profil. Vérifiez que le backend est démarré.";
        this.loading = false;
      }
    });
  }

  getInitials(name?: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  getEmailInitial(email?: string): string {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.photoError = '';

    if (!file.type.startsWith('image/')) {
      this.photoError = "Le fichier doit être une image.";
      input.value = '';
      return;
    }
    if (file.size > ProfileComponent.MAX_PHOTO_SIZE) {
      this.photoError = "L'image ne doit pas dépasser 2 Mo.";
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.photoUploading = true;
      this.adminService.updatePhoto(base64).subscribe({
        next: (data) => {
          this.profile.photo = data.photo || null;
          this.photoUploading = false;
        },
        error: (err) => {
          console.error('Erreur upload photo:', err);
          this.photoError = "Échec de l'envoi de la photo.";
          this.photoUploading = false;
        }
      });
    };
    reader.onerror = () => {
      this.photoError = "Impossible de lire le fichier.";
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  onDeletePhoto(): void {
    this.photoUploading = true;
    this.photoError = '';
    this.adminService.deletePhoto().subscribe({
      next: () => {
        this.profile.photo = null;
        this.photoUploading = false;
      },
      error: (err) => {
        console.error('Erreur suppression photo:', err);
        this.photoError = "Échec de la suppression de la photo.";
        this.photoUploading = false;
      }
    });
  }

  onSave():void{
    this.saving = true;
    this.saveSuccess = false;
    this.errorMessage = '';
    this.adminService.updateProfile(this.profile).subscribe({
      next: () => {
        this.saving = false;
        this.saveSuccess = true;
        this.lastEditDate = new Date().toLocaleDateString('fr-FR');
        setTimeout(() => this.saveSuccess = false, 4000);
      },
      error: (err) => {
        console.error('Erreur enregistrement profil:', err);
        this.saving = false;
        this.errorMessage = "Échec de l'enregistrement. Vérifiez que le backend est démarré.";
      }
    });
  }
  onChangePassword():void{
    if(this.password.new !== this.password.confirm){
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    console.log('password changed');
    alert('Mot de passe modifie avec succes!');
    this.password={current:'',new:'',confirm:''};
  }
  toggleTwoFactor(): void {
    this.twoFactorEnabled = !this.twoFactorEnabled;
  }
}
