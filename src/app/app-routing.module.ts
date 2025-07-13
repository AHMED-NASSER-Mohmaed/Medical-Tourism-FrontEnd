import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { LockComponent } from './shared/components/lock/lock.component';
import { UnauthComponent } from './shared/components/unauth/unauth.component';


const routes: Routes = [
{
  path: 'hospitalProvider',
  loadChildren: () => import('../app/features/hospitalServiceProvider/hospitalSrvProv.module').then(m => m.HospitalServiceProviderModule)
},
{
  path:'doctor',
  loadChildren :()=>import('../app/features/doctor-dashboard/doctorDashboard.module').then(m => m.doctorDashboardModule)
},


  {
    path: 'super-admin',
    loadChildren: () => import('./features/super-admin/super-admin.module').then(m => m.SuperAdminModule)
  },



  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },


  {
    path: '',
    loadChildren: () => import('./core/core.module').then(m => m.CoreModule),
    pathMatch: 'full'
  },


  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    pathMatch: 'full'
  },
    {
    path: 'hotel-provider',
    loadChildren: () =>
      import('./features/hotel-provider/hotel-provider.module').then(m => m.HotelProviderModule)
  },
  {
    path: 'car-rentals',
    loadChildren: () => import('./features/car-rental-website/car-rental-website.module').then(m => m.CarRentalWebsiteModule)
  },
  { path: '', redirectTo: 'hotel-provider', pathMatch: 'full' },

 {
    path: '',
    loadChildren: () => import('./features/patient/patient.module').then(m => m.PatientModule)
  },

  { path: 'hotels', loadChildren: () => import('./features/hotel-website/hotel-website.module').then(m => m.HotelWebsiteModule) },

 {path:'lock' ,component:LockComponent,data: { hideNavFooter: true }},
   {path:'unauth' ,component:UnauthComponent,data: { hideNavFooter: true }},



{
  path: '**',
  component: NotFoundComponent,
  data: { hideNavFooter: true }
}



];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    scrollOffset: [0, 70] // Optional: Adjusts for a fixed navbar height (e.g., 70px)
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
