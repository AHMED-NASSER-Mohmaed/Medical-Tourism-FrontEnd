import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatSelectModule } from '@angular/material/select';
// Routing
import { AuthRoutingModule } from './auth-routing.module';


// Components
import { LoginComponent } from './pages/login/login.component';
import { RegisterPatientComponent } from './pages/register/patient/register-patient/register-patient.component';
import { RegisterHotelComponent } from './pages/register/service-provider/register-hotel/register-hotel.component';
import { RegisterHospitalComponent } from './pages/register/service-provider/register-hospital/register-hospital.component';
import { RegisterCarRentalComponent } from './pages/register/service-provider/register-car-rental/register-car-rental.component';

// Services


// Store
import { authReducer } from './store/auth.reducer';
import { AuthEffects } from './store/auth.effects';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
import { PasswordRecoveryComponent } from './pages/password-recovery/password-recovery.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterPatientComponent,
    RegisterHotelComponent,
    RegisterHospitalComponent,
    RegisterCarRentalComponent,
    ConfirmEmailComponent,
    PasswordRecoveryComponent,
    ResetPasswordComponent,



  ],
imports: [
  CommonModule,
  HttpClientModule,
  FormsModule,
  ReactiveFormsModule,
  AuthRoutingModule,
  NgSelectModule,
  MatSelectModule,

  /* reducer effects */
  StoreModule.forFeature('auth', authReducer),
  EffectsModule.forFeature([AuthEffects])
],

  providers: [

  ]
})
export class AuthModule { }
