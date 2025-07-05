import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayAllHospitalsComponent } from './pages/Hospitals/display-all-hospitals/display-all-hospitals.component';
import { HospitalClinicsComponent } from './pages/Hospitals/hospital-clinics/hospital-clinics.component';
import { HospitalDoctorsComponent } from './pages/Hospitals/hospital-doctors/hospital-doctors.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: 'hospitals', component: DisplayAllHospitalsComponent },
  { path: 'Clinics', component: HospitalClinicsComponent },
  { path: 'Doctors', component: HospitalDoctorsComponent },
  {path: 'profile', component:ProfileComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule {}
