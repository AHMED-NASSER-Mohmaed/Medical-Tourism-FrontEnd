import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [

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
    path: '',
    loadChildren: () => import('./features/patient/patient.module').then(m => m.PatientModule)
  },


  {
    path: '**',
    redirectTo: 'auth/login'
  },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
