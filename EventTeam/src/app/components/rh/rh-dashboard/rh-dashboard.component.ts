import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';  // ← AJOUTÉ
import { EmployeeService } from '../../../Services/employee.service';
import { ExternalService } from '../../../Services/external.service';
import { RhService } from '../../../Services/rh.service';
import { AuthService } from '../../../Services/auth.service';
import { DashboardStats, EventItem } from '../../../models/rh.model';

interface PendingEmploye {
  id: number;
  name: string;
  email: string;
  status?: string;
}

interface PendingCompany {
  id: number;
  name: string;
  email: string;
  status?: string;
}

@Component({
  selector: 'app-rh-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],  // ← AJOUTÉ RouterModule
  templateUrl: './rh-dashboard.component.html',
  styleUrls: ['./rh-dashboard.component.css']
})
export class RhDashboardComponent implements OnInit {

  firstName = '';

  // ✅ Valeurs par défaut (pas de null !)
  stats: DashboardStats = {
    totalEvents: 0,
    totalEventsDelta: '+0 ce mois',
    activeActivities: 0,
    activeActivitiesTotal: 0,
    totalParticipants: 0,
    averageRating: 0
  };

  upcomingEvents: EventItem[] = [];

  pendingEmployes: PendingEmploye[] = [];
  pendingCompanies: PendingCompany[] = [];
  loading = false;
  actionMessage = '';
  actionError = '';

  constructor(
    private employeeService: EmployeeService,
    private externalService: ExternalService,
    private rhService: RhService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.firstName = user?.name?.split(/\s+/)[0] ?? 'Utilisateur';

    // Charger les stats
    this.rhService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats ?? this.stats;  // ← garde les valeurs par défaut si null
      },
      error: (err) => {
        console.error('Erreur stats:', err);
        // this.stats reste avec les valeurs par défaut
      },
    });

    // Charger les événements
    this.rhService.getUpcomingEvents().subscribe({
      next: (events) => {
        this.upcomingEvents = events ?? [];
      },
      error: (err) => {
        console.error('Erreur events:', err);
        this.upcomingEvents = [];
      },
    });

    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.actionError = '';

    this.employeeService.getPending().subscribe({
      next: (data: any) => {
        this.pendingEmployes = data ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.actionError = "Erreur lors du chargement des employés.";
        console.error(err);
        this.pendingEmployes = [];
        this.loading = false;
      }
    });

    this.externalService.getPending().subscribe({
      next: (data: any) => {
        this.pendingCompanies = data ?? [];
      },
      error: (err) => {
        this.actionError = "Erreur lors du chargement des entreprises.";
        console.error(err);
        this.pendingCompanies = [];
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) ?? '';
    const second = parts[1]?.charAt(0) ?? '';
    return (first + second).toUpperCase();
  }

  progressPercent(event: EventItem): number {
    if (!event.maxCapacity || event.maxCapacity === 0) return 0;
    return Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));
  }

  progressColor(percent: number): string {
    if (percent >= 90) return '#ef4444';
    if (percent >= 60) return '#f59e0b';
    return '#22c55e';
  }

  approveEmploye(employe: PendingEmploye): void {
    this.employeeService.validate(employe.id).subscribe({
      next: () => {
        this.actionMessage = `${employe.name} a été validé.`;
        this.pendingEmployes = this.pendingEmployes.filter(e => e.id !== employe.id);
      },
      error: (err) => {
        this.actionError = "Erreur lors de la validation.";
        console.error(err);
      }
    });
  }

  rejectEmploye(employe: PendingEmploye): void {
    this.employeeService.reject(employe.id).subscribe({
      next: () => {
        this.actionMessage = `${employe.name} a été refusé.`;
        this.pendingEmployes = this.pendingEmployes.filter(e => e.id !== employe.id);
      },
      error: (err) => {
        this.actionError = "Erreur lors du refus.";
        console.error(err);
      }
    });
  }

  approveCompany(company: PendingCompany): void {
    this.externalService.validate(company.id).subscribe({
      next: () => {
        this.actionMessage = `${company.name} a été validée.`;
        this.pendingCompanies = this.pendingCompanies.filter(c => c.id !== company.id);
      },
      error: (err) => {
        this.actionError = "Erreur lors de la validation.";
        console.error(err);
      }
    });
  }

  rejectCompany(company: PendingCompany): void {
    this.externalService.reject(company.id).subscribe({
      next: () => {
        this.actionMessage = `${company.name} a été refusée.`;
        this.pendingCompanies = this.pendingCompanies.filter(c => c.id !== company.id);
      },
      error: (err) => {
        this.actionError = "Erreur lors du refus.";
        console.error(err);
      }
    });
  }
}
