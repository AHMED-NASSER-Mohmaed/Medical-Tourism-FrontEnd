import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarRentalWebsiteRoutingModule } from './car-rental-website-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CarRentalsListComponent } from './pages/car-rentals-list/car-rentals-list.component';
import { CarRentalCardComponent } from './components/car-rental-card/car-rental-card.component';
import { CarRentalSidebarFiltersComponent } from './components/car-rental-sidebar-filters/car-rental-sidebar-filters.component';
import { CarRentalDetailsComponent } from './pages/car-rental-details/car-rental-details.component';
import { NavbarComponent } from '../../core/layout/navbar/navbar.component';
import { CoreModule } from '../../core/core.module';
import { FormsModule } from '@angular/forms';
import { AvailableCarCardComponent } from './components/available-car-card/available-car-card.component';
import { CarRentalDetailsSidebarFiltersComponent } from './components/car-rental-details-sidebar-filters/car-rental-details-sidebar-filters.component';
// Components will be added here as created

@NgModule({
  declarations: [
    CarRentalsListComponent,
    CarRentalCardComponent,
    CarRentalSidebarFiltersComponent,
    CarRentalDetailsComponent,
    AvailableCarCardComponent,
    CarRentalDetailsSidebarFiltersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CarRentalWebsiteRoutingModule,
    FormsModule
  ]
})
export class CarRentalWebsiteModule { } 