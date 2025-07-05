import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelRoomService } from '../../../../services/hotel-room.service';

@Component({
  selector: 'app-room-details',
  standalone: false,
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.css'
})
export class RoomDetailsComponent implements OnInit {
  room: any;
  loading = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private hotelRoomService: HotelRoomService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const roomId = +params['roomId'];
      if (roomId) {
        this.fetchRoom(roomId);
      }
    });
  }

  fetchRoom(roomId: number) {
    this.loading = true;
    this.error = null;
    this.hotelRoomService.getRoomById(roomId).subscribe({
      next: (data) => {
        this.room = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.userMessage || 'Failed to load room details.';
        this.loading = false;
      }
    });
  }
}
