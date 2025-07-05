import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { RoomsListComponent } from './pages/rooms/rooms-list/rooms-list/rooms-list.component';
import { RoomDetailsComponent } from './pages/rooms/room-details/room-details/room-details.component';
import { AddEditRoomComponent } from './pages/rooms/add-edit-room/add-edit-room/add-edit-room.component';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent },
  {
    path: 'rooms',
    children: [
      { path: '', component: RoomsListComponent },
      { path: 'add', component: AddEditRoomComponent },
      { path: ':roomId', component: RoomDetailsComponent },
      { path: ':roomId/edit', component: AddEditRoomComponent }
    ]
  },
  { path: '', redirectTo: 'profile', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HotelProviderRoutingModule {}
