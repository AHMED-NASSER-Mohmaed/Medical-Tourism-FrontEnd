import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientRoutingModule } from './patient-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { DisplayAllHospitalsComponent } from './pages/Hospitals/display-all-hospitals/display-all-hospitals.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SpecialistsListComponent } from './pages/specialists-list/specialists-list.component';
import { DoctorsListComponent } from './pages/Hospitals/doctors-list/doctors-list.component';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { BookingStepperComponent } from './pages/booking-stepper/booking-stepper.component';

import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';

import { To12HourPipe } from "../../shared/pipes/format-date.pipe";



@NgModule({
  declarations: [
    DisplayAllHospitalsComponent,
    ProfileComponent,
    SpecialistsListComponent,
    DoctorsListComponent,
    DoctorProfileComponent,
     BookingStepperComponent,
     PaymentSuccessComponent



  ],
  imports: [
    CommonModule,
    FormsModule,
    PatientRoutingModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,

    To12HourPipe
],
    exports: [


  ]
})
export class PatientModule {}
