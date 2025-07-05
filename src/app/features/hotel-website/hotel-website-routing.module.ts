import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelsListComponent } from './pages/hotels-list/hotels-list.component';
import { HotelDetailsComponent } from './pages/hotel-details/hotel-details.component';
import { RoomDetailsComponent } from './pages/room-details/room-details.component';

const routes: Routes = [
  { path: '', component: HotelsListComponent },
  { path: 'details/:id', component: HotelDetailsComponent },
  { path: 'details/:hotelId/room/:roomId', component: RoomDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelWebsiteRoutingModule { }
