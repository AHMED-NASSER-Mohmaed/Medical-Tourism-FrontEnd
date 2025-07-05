// src/app/features/super-admin/super-admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';
import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { DashboardModule } from '../../dashboard/dashboard.module';
import { SharedModule } from '../../shared/shared.module';
import { ManageProvidersComponent } from './pages/manage-providers/manage-providers.component';
import { AddHospitalProviderComponent } from './pages/providers/add-hospital-provider/add-hospital-provider.component';
import { ChangeEmailComponent } from './pages/user-actions/change-email/change-email.component';
import { ResetPasswordComponent } from './pages/user-actions/reset-password/reset-password.component';
import { AddCarRentalProviderComponent } from './pages/providers/add-car-rental-provider/add-car-rental-provider.component';
import { VerificationStatusComponent } from './components/verification-status/verification-status.component';
import { AddHotelProviderComponent } from './pages/providers/add-hotel-provider/add-hotel-provider.component';
import { SuperAdminProfileComponent } from '../../features/super-admin/pages/profile/profile.component';
import { RouterModule } from '@angular/router';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { DashboardShellComponent } from './dashboard-shell/dashboard-shell.component';
import { AccountDetailsComponent } from './pages/account-details/account-details.component';
import { StatusLabelPipe } from '../../shared/pipes/status.pipe';
import { PatientsAccountsComponent } from './pages/manage-accounts/patients-accounts/patients-accounts.component';
import { HospitalsAccountsComponent } from './pages/manage-accounts/hospitals-accounts/hospitals-accounts.component';
import { HotelsAccountsComponent } from './pages/manage-accounts/hotels-accounts/hotels-accounts.component';
import { CarRentalsAccountsComponent } from './pages/manage-accounts/car-rentals-accounts/car-rentals-accounts.component';
import { AddPatientProviderComponent } from './pages/providers/add-patient-provider/add-patient-provider.component';

@NgModule({
  declarations: [
    ManageProvidersComponent,
    AddHospitalProviderComponent,
    ChangeEmailComponent,
    ResetPasswordComponent,
    AddCarRentalProviderComponent,
    VerificationStatusComponent,
    AddHotelProviderComponent,
    SuperAdminProfileComponent,
    DashboardShellComponent,
    AccountDetailsComponent,
    PatientsAccountsComponent,
    HospitalsAccountsComponent,
    HotelsAccountsComponent,
    CarRentalsAccountsComponent,
    AddPatientProviderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    SuperAdminRoutingModule,
    DashboardModule,
    RouterModule,
    SharedModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    })
  ]
})
export class SuperAdminModule { }