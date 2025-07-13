import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { DisbursementComponent } from './Pages/Disbursement/disbursement.component';
import { SpecialistsListComponent } from './Pages/Specialists/specialists-list/specialists-list.component';
import { SpecialistsFormComponent } from './Pages/Specialists/specialists-form/specialists-form.component';
import { DoctorsListComponent } from './Pages/doctors/doctors-list/doctors-list.component';
import { DoctorsFormComponent } from './Pages/doctors/doctors-form/doctors-form.component';
import { AppointmentsListComponent } from './Pages/appointments/appointments-list/appointments-list.component';
import { AppointmentFormComponent } from './Pages/appointments/appointment-form/appointment-form.component';
import { TruncatePipe } from '../../truncate.pipe';

import { HospitalServiceProviderRoutingModule } from '../hospitalServiceProvider/hospitalSrvProv-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../app.module';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { DisbursementDetailsComponent } from './Pages/Disbursement/disbursement-details/disbursement-details.component';
import { ScheduleFormComponent } from './Pages/appointments/schedule-form/schedule-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [

    DisbursementComponent,
    DisbursementDetailsComponent,
    SpecialistsListComponent,
    SpecialistsFormComponent,
    DoctorsListComponent,
    DoctorsFormComponent,
    AppointmentsListComponent,
    AppointmentFormComponent,
    TruncatePipe,
    ScheduleFormComponent
  ],
  imports: [

     MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HospitalServiceProviderRoutingModule,
        TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    NgxPaginationModule

  ]
})
export class HospitalServiceProviderModule { }
