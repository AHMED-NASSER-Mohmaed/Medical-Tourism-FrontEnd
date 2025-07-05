
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faShieldAlt, faUsersCog, faUserInjured, faHospital,
  faHotel, faCar, faListAlt, faEdit, faHeadset,
  faChevronLeft, faChevronRight, faEye, faCheck,
  faTimes, faSearch, faUser, faUserCheck, faUserClock,
  faArrowUp, faArrowDown,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


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


import { FormsModule } from '@angular/forms';


import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { SuperAdminModule } from './features/super-admin/super-admin.module';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


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

  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
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


    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),

    HttpClientModule,
    AppRoutingModule,
    DashboardModule,
    SharedModule,
    SuperAdminModule,
    FontAwesomeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })

  ],

  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faShieldAlt, faUsersCog, faUserInjured, faHospital,
      faHotel, faCar, faListAlt, faEdit, faHeadset,
      faChevronLeft, faChevronRight, faEye, faCheck,
      faTimes, faSearch, faUser, faUserCheck, faUserClock,
      faArrowUp, faArrowDown,faUserCircle
    );
  }
}
