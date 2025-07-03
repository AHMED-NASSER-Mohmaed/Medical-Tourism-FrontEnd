import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardShellComponent } from './dashboard-shell/dashboard-shell.component';
import { ManageProvidersComponent } from './pages/manage-providers/manage-providers.component';
import { AddHospitalProviderComponent } from './pages/providers/add-hospital-provider/add-hospital-provider.component';
import { AddCarRentalProviderComponent } from './pages/providers/add-car-rental-provider/add-car-rental-provider.component';
import { AddHotelProviderComponent } from './pages/providers/add-hotel-provider/add-hotel-provider.component';
import { ChangeEmailComponent } from './pages/user-actions/change-email/change-email.component';
import { ResetPasswordComponent } from './pages/user-actions/reset-password/reset-password.component';
import { SuperAdminProfileComponent } from './pages/profile/profile.component';
import { AccountDetailsComponent } from './pages/account-details/account-details.component';
import { PatientsAccountsComponent } from './pages/manage-accounts/patients-accounts/patients-accounts.component';
import { HospitalsAccountsComponent } from './pages/manage-accounts/hospitals-accounts/hospitals-accounts.component';
import { HotelsAccountsComponent } from './pages/manage-accounts/hotels-accounts/hotels-accounts.component';
import { CarRentalsAccountsComponent } from './pages/manage-accounts/car-rentals-accounts/car-rentals-accounts.component';
import { AddPatientProviderComponent } from './pages/providers/add-patient-provider/add-patient-provider.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardShellComponent,
    children: [
      {
        path: 'manage-accounts',
        children: [
          { path: 'patients', component: PatientsAccountsComponent },
          { path: 'hospitals', component: HospitalsAccountsComponent },
          { path: 'hotels', component: HotelsAccountsComponent },
          { path: 'car-rentals', component: CarRentalsAccountsComponent },
          { path: '', redirectTo: 'patients', pathMatch: 'full' }
        ]
      },


      {
        path: 'manage-providers',
        component: ManageProvidersComponent,
        data: { title: 'Manage Providers' },
        children: [
          { path: 'hospitals', component: ManageProvidersComponent, data: { providerType: 'hospitals' } },
          { path: 'hotels', component: ManageProvidersComponent, data: { providerType: 'hotels' } },
          { path: 'car-rentals', component: ManageProvidersComponent, data: { providerType: 'car-rentals' } },
          { path: '', redirectTo: 'hospitals', pathMatch: 'full' }
        ]
      },

      // Provider Add Pages
      { path: 'providers/hospitals/add', component: AddHospitalProviderComponent, data: { title: 'Add Hospital' } },
      { path: 'providers/hotels/add', component: AddHotelProviderComponent, data: { title: 'Add Hotel' } },
      { path: 'providers/car-rentals/add', component: AddCarRentalProviderComponent, data: { title: 'Add Car Rental' } },
      { path: 'providers/patients/add', component: AddPatientProviderComponent, data: { title: 'Add Patient' } },

     

      { path: 'profile', component: SuperAdminProfileComponent, data: { title: 'My Profile' } },

      { path: '', redirectTo: 'manage-accounts', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }