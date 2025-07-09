import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayAllHospitalsComponent } from './pages/Hospitals/display-all-hospitals/display-all-hospitals.component';

import { ProfileComponent } from './pages/profile/profile.component';
import { SpecialistsListComponent } from './pages/specialists-list/specialists-list.component';
import { DoctorsListComponent } from './pages/Hospitals/doctors-list/doctors-list.component';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { BookingStepperComponent } from './pages/booking-stepper/booking-stepper.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';

const routes: Routes = [
    { path: 'hospitals/:specialistId', component: DisplayAllHospitalsComponent },
  { path: 'hospitals', component: DisplayAllHospitalsComponent },
  {path: 'profile', component:ProfileComponent},
 { path: 'hospital/:id/specialists', component: SpecialistsListComponent },
   { path: 'specialists', component: SpecialistsListComponent },
   { path: 'doctors/:specialtyId/:hospitalId', component: DoctorsListComponent },
   { path: 'doctor-profile/:doctorId', component: DoctorProfileComponent },
   {path:'patient/booking-stepper', component:BookingStepperComponent},
   {path:'payment-success' , component:PaymentSuccessComponent}



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule {}
