import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Optionally import your NotFoundComponent or HomeComponent if you have them
// import { NotFoundComponent } from './shared/pages/not-found/not-found.component';
// import { HomeComponent } from './home/home.component';

const routes: Routes = [
  // Lazy load the super-admin module
  {
    path: 'super-admin',
    loadChildren: () =>
      import('./features/super-admin/super-admin.module').then(m => m.SuperAdminModule)
  },

  // Example: Home route (optional)
  // { path: '', component: HomeComponent },

  // Fallback: redirect to super-admin or show 404
  { path: '', redirectTo: 'super-admin', pathMatch: 'full' },
  // { path: '**', component: NotFoundComponent } // Uncomment if you have a 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }