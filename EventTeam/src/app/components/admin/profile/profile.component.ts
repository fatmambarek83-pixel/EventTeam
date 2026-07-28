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
    position:''
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

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loading = true;
    this.adminService.getProfile().subscribe({
      next: (data) => {
        this.profile = {
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          position: data.position || ''
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
