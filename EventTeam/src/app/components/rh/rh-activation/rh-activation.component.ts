import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RhService } from '../../../Services/rh.service';
import { PendingAccount, ExternalCompany } from '../../../models/rh.model';
@Component({
  selector: 'app-rh-activation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rh-activation.component.html',
  styleUrls: ['./rh-activation.component.css'],
})
export class RhActivationComponent implements OnInit {
  pendingAccounts: PendingAccount[] = [];
  externalCompanies: ExternalCompany[] = [];
  activeEmployees: PendingAccount[] = [];
  showActiveAccounts = false;
  activeAccountsLoaded = false;
  constructor(private rhService: RhService) {}
  ngOnInit(): void {
    this.load();
  }
  load(): void {
    this.rhService.getPendingAccounts().subscribe((list) => (this.pendingAccounts = list));
    this.rhService.getExternalCompanies().subscribe((list) => (this.externalCompanies = list));
    if (this.activeAccountsLoaded) {
      this.loadActiveEmployees();
    }
  }
  loadActiveEmployees(): void {
    this.rhService.getActiveEmployees().subscribe((list) => {
      this.activeEmployees = list;
      this.activeAccountsLoaded = true;
    });
  }
  toggleActiveAccounts(): void {
    this.showActiveAccounts = !this.showActiveAccounts;
    if (this.showActiveAccounts && !this.activeAccountsLoaded) {
      this.loadActiveEmployees();
    }
  }
  onActivate(account: PendingAccount): void {
    this.rhService.activateAccount(account).subscribe(() => this.load());
  }
  onReject(account: PendingAccount): void {
    this.rhService.rejectAccount(account).subscribe(() => this.load());
  }
  subtitle(account: PendingAccount): string {
    return `${account.category} · ${account.type}`;
  }
}
