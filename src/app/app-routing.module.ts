// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: 'super-admin',
    loadChildren: () => import('./features/super-admin/super-admin.module')
      .then(m => m.SuperAdminModule),
    // canLoad: [AuthGuard]
  },
  { path: '', redirectTo: 'super-admin', pathMatch: 'full' },
  { path: '**', redirectTo: 'super-admin' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }