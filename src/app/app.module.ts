
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { HttpClient } from '@angular/common/http';
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
import { ReactiveFormsModule } from '@angular/forms';


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
import { CommonModule, DatePipe } from '@angular/common';
import { TruncatePipe } from './truncate.pipe';
//
// import { TruncatePipe } from './pipes/truncate.pip';


import { FormsModule } from '@angular/forms';




export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}



//
// import { TruncatePipe } from './pipes/truncate.pip';





import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardModule } from './dashboard/dashboard.module';
import { SharedModule } from './shared/shared.module';
import { SuperAdminModule } from './features/super-admin/super-admin.module';
import { DisbursementComponent } from './features/hospitalServiceProvider/Pages/Disbursement/disbursement.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    AppComponent,
  
  
   // DashBoardComponent,
    SpecialistsListComponent,
    SpecialistsFormComponent,
    DoctorsListComponent,
    DoctorsFormComponent,
    AppointmentsListComponent,
    AppointmentFormComponent,
    TruncatePipe,
    DisbursementComponent
    ],



 

  imports: [
    CommonModule,
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
    ReactiveFormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    NgxPaginationModule,
    HttpClientModule,
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
    }),
    RouterModule

],
  providers: [DatePipe],

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
