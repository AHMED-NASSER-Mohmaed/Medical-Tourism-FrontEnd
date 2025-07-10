import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayAllHospitalsComponent } from './pages/Hospitals/display-all-hospitals/display-all-hospitals.component';

import { ProfileComponent } from './pages/profile/profile.component';
import { SpecialistsListComponent } from './pages/specialists-list/specialists-list.component';
import { DoctorsListComponent } from './pages/Hospitals/doctors-list/doctors-list.component';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { BookingStepperComponent } from './pages/booking-stepper/booking-stepper.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';

// EDITED: Import the guards
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RoleGuard } from '../../shared/guards/role.guard';

const routes: Routes = [
  // These routes are public and do not need guards
  { path: 'hospitals/:specialistId', component: DisplayAllHospitalsComponent },
  { path: 'hospitals', component: DisplayAllHospitalsComponent },
  { path: 'specialists', component: SpecialistsListComponent },
  { path: 'hospital/:id/specialists', component: SpecialistsListComponent },
  { path: 'doctors/:specialtyId/:hospitalId', component: DoctorsListComponent },
  { path: 'doctor-profile/:doctorId', component: DoctorProfileComponent },

  // EDITED: These routes are now protected and require the 'Patient' role
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Patient' }
  },
  {
    path: 'patient/booking-stepper',
    component: BookingStepperComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Patient' }
  },
  {
    path: 'payment-success',
    component: PaymentSuccessComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Patient' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule {}
