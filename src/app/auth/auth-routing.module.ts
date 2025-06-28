import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login/login.component';
import { RegisterPatientComponent } from './pages/register/patient/register-patient/register-patient.component';
import { RegisterHotelComponent } from './pages/register/service-provider/register-hotel/register-hotel.component';
import { RegisterHospitalComponent } from './pages/register/service-provider/register-hospital/register-hospital.component';
import { RegisterCarRentalComponent } from './pages/register/service-provider//register-car-rental/register-car-rental.component';
import { ConfirmEmailComponent } from './pages/confirm-email/confirm-email.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register/patient', component: RegisterPatientComponent },
  { path: 'register/hotel', component: RegisterHotelComponent },
  { path: 'register/hospital', component: RegisterHospitalComponent },
  { path: 'register/car', component: RegisterCarRentalComponent },
   { path: 'confirm-email',
  component: ConfirmEmailComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
