import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: 'super-admin',
    loadChildren: () =>
      import('./features/super-admin/super-admin.module').then(m => m.SuperAdminModule)
  },
  {
    path: 'hotel-provider',
    loadChildren: () =>
      import('./features/hotel-provider/hotel-provider.module').then(m => m.HotelProviderModule)
  },
  { path: '', redirectTo: 'hotel-provider', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }