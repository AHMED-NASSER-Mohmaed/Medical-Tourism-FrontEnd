import { Component, OnInit } from '@angular/core';
import { HotelRoomService } from '../../../../services/hotel-room.service';

@Component({
  selector: 'app-rooms-list',
  standalone: false,
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.css'
})
export class RoomsListComponent implements OnInit {
  rooms: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private hotelRoomService: HotelRoomService) {}

  ngOnInit(): void {
    this.fetchRooms();
  }

  fetchRooms() {
    this.loading = true;
    this.error = null;
    this.hotelRoomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data?.items || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.userMessage || 'Failed to load rooms.';
        this.loading = false;
      }
    });
  }
}
