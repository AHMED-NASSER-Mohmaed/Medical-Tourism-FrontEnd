import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardShellComponent } from './dashboard-shell/dashboard-shell.component';
import { ManageAccountsComponent } from './pages/manage-accounts/manage-accounts.component';
import { ManageProvidersComponent } from './pages/manage-providers/manage-providers.component';
import { AddHospitalProviderComponent } from './pages/providers/add-hospital-provider/add-hospital-provider.component';
import { AddCarRentalProviderComponent } from './pages/providers/add-car-rental-provider/add-car-rental-provider.component';
import { AddHotelProviderComponent } from './pages/providers/add-hotel-provider/add-hotel-provider.component';
import { SuperAdminProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardShellComponent,
    children: [
      // Account Management
      {
        path: 'manage-accounts',
        component: ManageAccountsComponent,
        data: { title: 'Manage Accounts' },
        children: [
          { path: 'patients', component: ManageAccountsComponent, data: { accountType: 'patients' } },
          { path: 'hospitals', component: ManageAccountsComponent, data: { accountType: 'hospitals' } },
          { path: 'hotels', component: ManageAccountsComponent, data: { accountType: 'hotels' } },
          { path: 'car-rentals', component: ManageAccountsComponent, data: { accountType: 'car-rentals' } },
          { path: '', redirectTo: 'patients', pathMatch: 'full' }
        ]
      },

      // Provider Management
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

      // Add provider pages
      { path: 'providers/hospitals/add', component: AddHospitalProviderComponent, data: { title: 'Add Hospital' } },
      { path: 'providers/hotels/add', component: AddHotelProviderComponent, data: { title: 'Add Hotel' } },
      { path: 'providers/car-rentals/add', component: AddCarRentalProviderComponent, data: { title: 'Add Car Rental' } },

      // Profile page
      { path: 'profile', component: SuperAdminProfileComponent, data: { title: 'My Profile' } },

      // Default redirect to manage-accounts
      { path: '', redirectTo: 'manage-accounts', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }
