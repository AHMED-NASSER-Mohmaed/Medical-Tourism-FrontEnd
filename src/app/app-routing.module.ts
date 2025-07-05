import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayAllHospitalsComponent } from './features/patient/pages/Hospitals/display-all-hospitals/display-all-hospitals.component';
import { HospitalClinicsComponent } from './features/patient/pages/Hospitals/hospital-clinics/hospital-clinics.component';
import { HospitalDoctorsComponent } from './features/patient/pages/Hospitals/hospital-doctors/hospital-doctors.component';
import { DashBoardComponent } from './features/hospitalServiceProvider/Pages/dash-board/dash-board.component';
import { SpecialistsListComponent } from './features/hospitalServiceProvider/Pages/Specialists/specialists-list/specialists-list.component';
import { DoctorsListComponent } from './features/hospitalServiceProvider/Pages/doctors/doctors-list/doctors-list.component';
import { SidebarComponent } from './features/hospitalServiceProvider/components/sidebar/sidebar.component';
import { AppointmentsListComponent } from './features/hospitalServiceProvider/Pages/appointments/appointments-list/appointments-list.component';
import { DoctorsFormComponent } from './features/hospitalServiceProvider/Pages/doctors/doctors-form/doctors-form.component';
import { AppointmentFormComponent } from './features/hospitalServiceProvider/Pages/appointments/appointment-form/appointment-form.component';

const routes: Routes = [
  {
    path: 'hospital',component: SidebarComponent,
    children: [
      { path: 'dashboard', component: DashBoardComponent },
      { path: 'specialists', component: SpecialistsListComponent },
      { path: 'doctors', component: DoctorsListComponent },
      { path: 'appointments', component: AppointmentsListComponent },
      {path: 'doctor/add', component: DoctorsFormComponent},
      {path: 'doctor/edit/:id', component: DoctorsFormComponent},
      {path: 'schedule/add', component: AppointmentFormComponent},
      {path: 'schedule/edit/:id', component: AppointmentFormComponent},
    ]
  },
  { path: 'hospitals', component: DisplayAllHospitalsComponent },
  { path: 'Clinics', component: HospitalClinicsComponent },
  { path: 'Doctors', component: HospitalDoctorsComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
