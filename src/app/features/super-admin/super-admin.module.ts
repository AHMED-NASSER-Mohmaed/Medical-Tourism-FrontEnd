// src/app/features/super-admin/super-admin.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrModule } from 'ngx-toastr';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { DashboardModule } from '../../dashboard/dashboard.module';
import { SharedModule } from '../../shared/shared.module';

import { ManageAccountsComponent } from './pages/manage-accounts/manage-accounts.component';
import { ManageProvidersComponent } from './pages/manage-providers/manage-providers.component';
import { AccountDetailsComponent } from './components/account-details/account-details.component';
import { ProviderFormComponent } from './components/provider-form/provider-form.component';
import { ListPatientsComponent } from './pages/patients/list-patients/list-patients.component';
import { AddPatientComponent } from './pages/patients/add-patient/add-patient.component';
import { EditPatientComponent } from './pages/patients/edit-patient/edit-patient.component';
import { ViewPatientComponent } from './pages/patients/view-patient/view-patient.component';
import { ListHospitalProvidersComponent } from './pages/providers/list-hospital-providers/list-hospital-providers.component';
import { AddHospitalProviderComponent } from './pages/providers/add-hospital-provider/add-hospital-provider.component';
import { EditHotelProviderComponent } from './pages/providers/edit-hotel-provider/edit-hotel-provider.component';
import { ViewHotelProviderComponent } from './pages/providers/view-hotel-provider/view-hotel-provider.component';
import { ChangeEmailComponent } from './pages/user-actions/change-email/change-email.component';
import { ResetPasswordComponent } from './pages/user-actions/reset-password/reset-password.component';
import { ActivateUserComponent } from './pages/user-actions/activate-user/activate-user.component';
import { DeactivateUserComponent } from './pages/user-actions/deactivate-user/deactivate-user.component';
import { ListCarRentalProvidersComponent } from './pages/providers/list-car-rental-providers/list-car-rental-providers.component';
import { AddCarRentalProviderComponent } from './pages/providers/add-car-rental-provider/add-car-rental-provider.component';
import { EditCarRentalProviderComponent } from './pages/providers/edit-car-rental-provider/edit-car-rental-provider.component';
import { ViewCarRentalProviderComponent } from './pages/providers/view-car-rental-provider/view-car-rental-provider.component';
import { PatientFormComponent } from './components/patient-form/patient-form.component';
import { VerificationStatusComponent } from './components/verification-status/verification-status.component';
import { AddHotelProviderComponent } from './pages/providers/add-hotel-provider/add-hotel-provider.component';
import { SuperAdminProfileComponent } from '../../features/super-admin/pages/profile/profile.component';

@NgModule({
  declarations: [
    ManageAccountsComponent,
    ManageProvidersComponent,
    AccountDetailsComponent,
    ProviderFormComponent,
    ListPatientsComponent,
    AddPatientComponent,
    EditPatientComponent,
    ViewPatientComponent,
    ListHospitalProvidersComponent,
    AddHospitalProviderComponent,
    EditHotelProviderComponent,
    ViewHotelProviderComponent,
    ChangeEmailComponent,
    ResetPasswordComponent,
    ActivateUserComponent,
    DeactivateUserComponent,
    ListCarRentalProvidersComponent,
    AddCarRentalProviderComponent,
    EditCarRentalProviderComponent,
    ViewCarRentalProviderComponent,
    PatientFormComponent,

    VerificationStatusComponent,
    AddHotelProviderComponent,
    SuperAdminProfileComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    SuperAdminRoutingModule,
    DashboardModule,
    SharedModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    })
  ]
})
export class SuperAdminModule { }