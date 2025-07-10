import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayAllHospitalsComponent } from './features/patient/pages/Hospitals/display-all-hospitals/display-all-hospitals.component';

import { DashBoardComponent } from './features/hospitalServiceProvider/Pages/dash-board/dash-board.component';
import { SpecialistsListComponent } from './features/hospitalServiceProvider/Pages/Specialists/specialists-list/specialists-list.component';
import { DoctorsListComponent } from './features/hospitalServiceProvider/Pages/doctors/doctors-list/doctors-list.component';
import { SidebarComponent } from './features/hospitalServiceProvider/components/sidebar/sidebar.component';
import { AppointmentsListComponent } from './features/hospitalServiceProvider/Pages/appointments/appointments-list/appointments-list.component';
import { DoctorsFormComponent } from './features/hospitalServiceProvider/Pages/doctors/doctors-form/doctors-form.component';
import { AppointmentFormComponent } from './features/hospitalServiceProvider/Pages/appointments/appointment-form/appointment-form.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';


import { DisbursementComponent } from './features/hospitalServiceProvider/Pages/Disbursement/disbursement.component';



const routes: Routes = [
  {
    path: 'hospitalProvider',component: SidebarComponent,
    children: [
      { path: 'dashboard', component: DashBoardComponent },
      { path: 'specialists', component: SpecialistsListComponent },
      { path: 'doctors', component: DoctorsListComponent },
      { path: 'appointments', component: AppointmentsListComponent },
      {path: 'doctor/add', component: DoctorsFormComponent},
      {path: 'doctor/edit/:id', component: DoctorsFormComponent},
      {path: 'schedule/add', component: AppointmentFormComponent},
      {path: 'schedule/edit/:id', component: AppointmentFormComponent},
      { path: 'disbursements' , component:DisbursementComponent},
    ]
  },
  { path: 'hospitals', component: DisplayAllHospitalsComponent },
  

  {
    path: 'super-admin',
    loadChildren: () => import('./features/super-admin/super-admin.module').then(m => m.SuperAdminModule)
  },



  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },


  {
    path: '',
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule),
    pathMatch: 'full'
  },


  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    pathMatch: 'full'
  },
    {
    path: 'hotel-provider',
    loadChildren: () =>
      import('./features/hotel-provider/hotel-provider.module').then(m => m.HotelProviderModule)
  },
  {
    path: 'car-rentals',
    loadChildren: () => import('./features/car-rental-website/car-rental-website.module').then(m => m.CarRentalWebsiteModule)
  },
  { path: '', redirectTo: 'hotel-provider', pathMatch: 'full' },

 {
    path: '',
    loadChildren: () => import('./features/patient/patient.module').then(m => m.PatientModule)
  },

  { path: 'hotels', loadChildren: () => import('./features/hotel-website/hotel-website.module').then(m => m.HotelWebsiteModule) },



{
  path: '**',
  component: NotFoundComponent,
  data: { hideNavFooter: true }
}



];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
