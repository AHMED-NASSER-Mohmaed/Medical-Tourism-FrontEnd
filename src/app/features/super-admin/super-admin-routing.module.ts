import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageAccountsComponent } from './pages/manage-accounts/manage-accounts.component';
import { ManageProvidersComponent } from './pages/manage-providers/manage-providers.component';
import { AddHospitalProviderComponent } from './pages/providers/add-hospital-provider/add-hospital-provider.component';
import { AddCarRentalProviderComponent } from './pages/providers/add-car-rental-provider/add-car-rental-provider.component';
// import { ViewHospitalProviderComponent } from './pages/providers/view-hospital-provider.component';
import { ViewCarRentalProviderComponent } from './pages/providers/view-car-rental-provider/view-car-rental-provider.component';
import { ChangeEmailComponent } from './pages/user-actions/change-email/change-email.component';
import { ResetPasswordComponent } from './pages/user-actions/reset-password/reset-password.component';
import { SuperAdminProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { 
    path: '', 
    children: [
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
      { 
        path: 'providers/hospitals/add',
        component: AddHospitalProviderComponent,
        data: { title: 'Add Hospital' }
      },
      // { 
      //   path: 'providers/hospitals/:id',
      //   component: ViewHospitalProviderComponent,
      //   data: { title: 'Hospital Details' }
      // },
      { 
        path: 'providers/car-rentals/add',
        component: AddCarRentalProviderComponent,
        data: { title: 'Add Car Rental' }
      },
      { 
        path: 'providers/car-rentals/:id',
        component: ViewCarRentalProviderComponent,
        data: { title: 'Car Rental Details' }
      },
      { 
        path: 'user/:id/change-email',
        component: ChangeEmailComponent,
        data: { title: 'Change Email' }
      },
      { 
        path: 'user/:id/reset-password',
        component: ResetPasswordComponent,
        data: { title: 'Reset Password' }
      },
      { 
        path: 'profile',
        component: SuperAdminProfileComponent,
        data: { title: 'My Profile' }
      },
      { path: '', redirectTo: 'manage-accounts', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuperAdminRoutingModule { }