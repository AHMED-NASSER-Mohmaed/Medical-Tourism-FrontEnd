import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayAllHospitalsComponent } from './features/patient/pages/Hospitals/display-all-hospitals/display-all-hospitals.component';
import { HospitalClinicsComponent } from './features/patient/pages/Hospitals/hospital-clinics/hospital-clinics.component';
import { HospitalDoctorsComponent } from './features/patient/pages/Hospitals/hospital-doctors/hospital-doctors.component';

const routes: Routes = [
  { path: 'hospitals', component: DisplayAllHospitalsComponent }
 ,{ path : 'Clinics', component : HospitalClinicsComponent }
 ,{ path : 'Doctors', component : HospitalDoctorsComponent}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
