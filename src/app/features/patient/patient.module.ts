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




@NgModule({
  declarations: [
    DisplayAllHospitalsComponent,
    ProfileComponent,
    SpecialistsListComponent,
    DoctorsListComponent,

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
