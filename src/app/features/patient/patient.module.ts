import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientRoutingModule } from './patient-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { DisplayAllHospitalsComponent } from './pages/Hospitals/display-all-hospitals/display-all-hospitals.component';
import { HospitalClinicsComponent } from './pages/Hospitals/hospital-clinics/hospital-clinics.component';
import { HospitalDoctorsComponent } from './pages/Hospitals/hospital-doctors/hospital-doctors.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NgSelectModule } from '@ng-select/ng-select';




@NgModule({
  declarations: [
    DisplayAllHospitalsComponent,
    HospitalClinicsComponent,
    HospitalDoctorsComponent,
    ProfileComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    PatientRoutingModule
    ,ReactiveFormsModule
    ,NgSelectModule
  ]
})
export class PatientModule {}
