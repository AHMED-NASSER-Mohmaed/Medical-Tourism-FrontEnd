import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelRoomService } from '../../../../services/hotel-room.service';

@Component({
  selector: 'app-add-edit-room',
  standalone: false,
  templateUrl: './add-edit-room.component.html',
  styleUrl: './add-edit-room.component.css'
})
export class AddEditRoomComponent implements OnInit {
  room: any = {};
  loading = false;
  error: string | null = null;
  isEditMode = false;
  roomId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelRoomService: HotelRoomService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.roomId = params['roomId'] ? +params['roomId'] : null;
      this.isEditMode = !!this.roomId;
      if (this.isEditMode && this.roomId) {
        this.fetchRoom(this.roomId);
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
        this.error = err.userMessage || 'Failed to load room.';
        this.loading = false;
      }
    });
  }

  saveRoom(formData: FormData) {
    this.loading = true;
    this.error = null;
    if (this.isEditMode && this.roomId) {
      this.hotelRoomService.updateRoom(this.roomId, formData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/hotel-provider/rooms']);
        },
        error: (err) => {
          this.error = err.userMessage || 'Failed to update room.';
          this.loading = false;
        }
      });
    } else {
      this.hotelRoomService.addRoom(formData).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/hotel-provider/rooms']);
        },
        error: (err) => {
          this.error = err.userMessage || 'Failed to add room.';
          this.loading = false;
        }
      });
    }
  }
}
