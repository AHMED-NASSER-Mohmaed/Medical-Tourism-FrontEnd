import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisplayAllHospitalsComponent } from './features/patient/pages/Hospitals/display-all-hospitals/display-all-hospitals.component';
import { HospitalClinicsComponent } from './features/patient/pages/Hospitals/hospital-clinics/hospital-clinics.component';
import { HospitalDoctorsComponent } from './features/patient/pages/Hospitals/hospital-doctors/hospital-doctors.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { DashBoardComponent } from './features/hospitalServiceProvider/Pages/dash-board/dash-board.component';



import { SpecialistsListComponent } from './features/hospitalServiceProvider/Pages/Specialists/specialists-list/specialists-list.component';
import { SpecialistsFormComponent } from './features/hospitalServiceProvider/Pages/Specialists/specialists-form/specialists-form.component';
import { DoctorsListComponent } from './features/hospitalServiceProvider/Pages/doctors/doctors-list/doctors-list.component';
import { DoctorsFormComponent } from './features/hospitalServiceProvider/Pages/doctors/doctors-form/doctors-form.component';
import { AppointmentsListComponent } from './features/hospitalServiceProvider/Pages/appointments/appointments-list/appointments-list.component';
import { AppointmentFormComponent } from './features/hospitalServiceProvider/Pages/appointments/appointment-form/appointment-form.component';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { TruncatePipe } from './truncate.pipe';
//
// import { TruncatePipe } from './pipes/truncate.pip';



@NgModule({
  declarations: [
    AppComponent,
    DisplayAllHospitalsComponent,
    HospitalClinicsComponent,
    HospitalDoctorsComponent,
   // DashBoardComponent,
    SpecialistsListComponent,
    SpecialistsFormComponent,
    DoctorsListComponent,
    DoctorsFormComponent,
    AppointmentsListComponent,
    AppointmentFormComponent,
    TruncatePipe
    ],
  imports: [
     BrowserModule,
    AppRoutingModule,
    CoreModule,
     HttpClientModule ,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule


  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
