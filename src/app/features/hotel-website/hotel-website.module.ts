import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { HotelWebsiteRoutingModule } from './hotel-website-routing.module';
import { HotelsListComponent } from './pages/hotels-list/hotels-list.component';
import { HotelCardComponent } from './components/hotel-card/hotel-card.component';
import { HotelSidebarFiltersComponent } from './components/hotel-sidebar-filters/hotel-sidebar-filters.component';
import { HotelDetailsComponent } from './pages/hotel-details/hotel-details.component';
import { FormsModule } from '@angular/forms';
import { RoomSidebarFiltersComponent } from './components/room-sidebar-filters/room-sidebar-filters.component';
import { RoomCardComponent } from './components/room-card/room-card.component';
import { CoreModule } from '../../core/core.module';
import { RoomDetailsComponent } from './pages/room-details/room-details.component';
import { PatientModule } from '../patient/patient.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    HotelCardComponent,
    HotelSidebarFiltersComponent,
    HotelsListComponent,
    HotelDetailsComponent,
    RoomSidebarFiltersComponent,
    RoomCardComponent,
    RoomDetailsComponent
  ],
  imports: [
    CommonModule,
    HotelWebsiteRoutingModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
    PatientModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    SharedModule,
    NgSelectModule
  ]
})
export class HotelWebsiteModule { }
