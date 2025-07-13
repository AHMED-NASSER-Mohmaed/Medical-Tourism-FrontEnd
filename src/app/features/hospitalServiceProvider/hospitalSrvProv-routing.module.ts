import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import the shell/layout component for this section
import { SidebarComponent } from './components/sidebar/sidebar.component'; // Assuming this is your shell component

// Import all the page components for the routes
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { SpecialistsListComponent } from './Pages/Specialists/specialists-list/specialists-list.component';
import { DoctorsListComponent } from './Pages/doctors/doctors-list/doctors-list.component';
import { AppointmentsListComponent } from './Pages/appointments/appointments-list/appointments-list.component';
import { DoctorsFormComponent } from './Pages/doctors/doctors-form/doctors-form.component';
import { AppointmentFormComponent } from './Pages/appointments/appointment-form/appointment-form.component';
import { DisbursementComponent } from './Pages/Disbursement/disbursement.component';

// Import your guards
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RoleGuard } from '../../shared/guards/role.guard';
import { DisbursementDetailsComponent } from './Pages/Disbursement/disbursement-details/disbursement-details.component';
import { ScheduleFormComponent } from './Pages/appointments/schedule-form/schedule-form.component';

const routes: Routes = [
  {
    path: '',
    component: SidebarComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      expectedRole: 'HospitalServiceProvider'
    },
    children: [
      { path: 'dashboard', component: DashBoardComponent },
      { path: 'specialists', component: SpecialistsListComponent },
      { path: 'doctors', component: DoctorsListComponent },
      { path: 'appointments', component: AppointmentsListComponent },
      { path: 'doctor/add', component: DoctorsFormComponent },
      { path: 'doctors/:id', component: DoctorsFormComponent },
      { path: 'schedule/add', component: ScheduleFormComponent },
      { path: 'schedule/:id/:day', component: AppointmentFormComponent },
      { path: 'disbursements' , component:DisbursementComponent},
      {path: 'disbursement/:id', component: DisbursementDetailsComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalServiceProviderRoutingModule { }
