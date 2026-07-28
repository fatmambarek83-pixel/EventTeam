import { Routes } from '@angular/router';
import { rhGuard } from './guards/rh.guard';
import { employeGuard } from './guards/employe.guard';
import { externalGuard } from './guards/external.guard';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { RhLayoutComponent } from './components/rh/rh-layout/rh-layout.component';
import { RhDashboardComponent } from './components/rh/rh-dashboard/rh-dashboard.component';
import { RhActivitesComponent } from './components/rh/rh-activites/rh-activites.component';
import { RhCreateActivityComponent } from './components/rh/rh-create-activity/rh-create-activity.component';
import { RhEvenementsComponent } from './components/rh/rh-evenements/rh-evenements.component';
import { RhCreateEventComponent } from './components/rh/rh-create-event/rh-create-event.component';
import { RhParticipationsComponent } from './components/rh/rh-participations/rh-participations.component';
import { RhFeedbacksComponent } from './components/rh/rh-feedbacks/rh-feedbacks.component';
import { RhFeedbackDetailComponent } from './components/rh/rh-feedback-detail/rh-feedback-detail.component';
import { RhActivationComponent } from './components/rh/rh-activation/rh-activation.component';
import { RhProfilComponent } from './components/rh/rh-profil/rh-profil.component';
import { RhParametresComponent } from './components/rh/rh-parametres/rh-parametres.component';
import { adminGuard } from './guards/admin.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './components/admin/admin-dashbord/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { EmployeLayoutComponent } from './components/employe/employe-layout/employe-layout.component';
import { EmployeDashboardComponent } from './components/employe/employe-dashboard/employe-dashboard.component';
import { EmployeEvenementsComponent } from './components/employe/employe-evenements/employe-evenements.component';
import { EmployeParticipationsComponent } from './components/employe/employe-participations/employe-participations.component';
import { EmployeFeedbackComponent } from './components/employe/employe-feedback/employe-feedback.component';
import { EmployeProfilComponent } from './components/employe/employe-profil/employe-profil.component';
import { EmployeParametresComponent } from './components/employe/employe-parametres/employe-parametres.component';
import { ExternalLayoutComponent } from './components/external/external-layout/external-layout.component';
import { ExternalDashboardComponent } from './components/external/external-dashboard/external-dashboard.component';
import { ExternalEvenementsComponent } from './components/external/external-evenements/external-evenements.component';
import { ExternalActivitesComponent } from './components/external/external-activites/external-activites.component';
import { ExternalProfilComponent } from './components/external/external-profil/external-profil.component';
import { ExternalParametresComponent } from './components/external/external-parametres/external-parametres.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'profile', loadComponent: () => import('./components/admin/profile/profile.component').then(m => m.ProfileComponent) },
      { path: 'settings', loadComponent: () => import('./components/admin/settings/settings.component').then(m =>
          m.SettingsComponent) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'rh',
    component: RhLayoutComponent,
    canActivate: [rhGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: RhDashboardComponent },
      { path: 'activites', component: RhActivitesComponent },
      { path: 'activites/nouvelle', component: RhCreateActivityComponent },
      { path: 'activites/:id/modifier', component: RhCreateActivityComponent },
      { path: 'evenements', component: RhEvenementsComponent },
      { path: 'evenements/nouveau', component: RhCreateEventComponent },
      { path: 'evenements/:id/modifier', component: RhCreateEventComponent },
      { path: 'participations', component: RhParticipationsComponent },
      { path: 'feedbacks', component: RhFeedbacksComponent },
      { path: 'feedbacks/:eventId', component: RhFeedbackDetailComponent },
      { path: 'activation', component: RhActivationComponent },
      { path: 'profil', component: RhProfilComponent },
      { path: 'parametres', component: RhParametresComponent },
    ],
  },
  {
    path: 'employee',
    component: EmployeLayoutComponent,
    canActivate: [employeGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: EmployeDashboardComponent },
      { path: 'evenements', component: EmployeEvenementsComponent },
      { path: 'participations', component: EmployeParticipationsComponent },
      { path: 'feedback', component: EmployeFeedbackComponent },
      { path: 'profil', component: EmployeProfilComponent },
      { path: 'parametres', component: EmployeParametresComponent },
    ],
  },
  {
    path: 'external',
    component: ExternalLayoutComponent,
    canActivate: [externalGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ExternalDashboardComponent },
      { path: 'evenements', component: ExternalEvenementsComponent },
      { path: 'activites', component: ExternalActivitesComponent },
      { path: 'profil', component: ExternalProfilComponent },
      { path: 'parametres', component: ExternalParametresComponent },
    ],
  },
];
