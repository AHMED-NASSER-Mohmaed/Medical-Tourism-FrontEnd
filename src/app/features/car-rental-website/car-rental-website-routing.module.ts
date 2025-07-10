import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarRentalsListComponent } from './pages/car-rentals-list/car-rentals-list.component';
import { CarRentalDetailsComponent } from './pages/car-rental-details/car-rental-details.component';
import { CarDetailsComponent } from './pages/car-details/car-details.component';

const routes: Routes = [
  { path: '', component: CarRentalsListComponent },
  { path: 'details/:id', component: CarRentalDetailsComponent },
  { path: 'car-details/:id', component: CarDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarRentalWebsiteRoutingModule { } 