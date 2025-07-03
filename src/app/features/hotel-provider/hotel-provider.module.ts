import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HotelProviderRoutingModule } from './hotel-provider-routing.module';

import { ProfileComponent } from './pages/profile/profile/profile.component';
import { RoomsListComponent } from './pages/rooms/rooms-list/rooms-list/rooms-list.component';
import { RoomDetailsComponent } from './pages/rooms/room-details/room-details/room-details.component';
import { AddEditRoomComponent } from './pages/rooms/add-edit-room/add-edit-room/add-edit-room.component';

@NgModule({
  declarations: [
    ProfileComponent,
    RoomsListComponent,
    RoomDetailsComponent,
    AddEditRoomComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HotelProviderRoutingModule
  ]
})
export class HotelProviderModule {}
