// app.module.ts
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { FormsModule } from '@angular/forms';
import { DisplayAllHospitalsComponent } from './features/patient/pages/Hospitals/display-all-hospitals/display-all-hospitals.component';
import { HospitalClinicsComponent } from './features/patient/pages/Hospitals/hospital-clinics/hospital-clinics.component';
import { HospitalDoctorsComponent } from './features/patient/pages/Hospitals/hospital-doctors/hospital-doctors.component';


import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';




@NgModule({
  declarations: [
    AppComponent,
     DisplayAllHospitalsComponent,
    HospitalClinicsComponent,
    HospitalDoctorsComponent
  ],

  imports: [
     BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,

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



    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
