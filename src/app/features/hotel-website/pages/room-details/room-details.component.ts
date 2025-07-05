import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelWebsiteService } from '../../services/hotel-website.service';
import { Room } from '../../models/room.model';

@Component({
  selector: 'app-room-details',
  standalone: false,
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.css'
})
export class RoomDetailsComponent implements OnInit {
  hotelId!: string;
  roomId!: string;
  room?: Room;
  loading = false;
  error: string | null = null;
  selectedImage?: string; // For interactive gallery

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelWebsiteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.hotelId = params.get('hotelId')!;
      this.roomId = params.get('roomId')!;
      this.fetchRoomDetails();
    });
  }

  fetchRoomDetails() {
    this.loading = true;
    this.error = null;
    this.hotelService.getHotelRooms(this.hotelId, { PageNumber: 1, PageSize: 100 }).subscribe({
      next: (data) => {
        console.log('Fetched rooms:', data.items.map(r => r.id));
        console.log('Looking for roomId:', this.roomId, typeof this.roomId);
        this.room = data.items.find(r => String(r.id) === String(this.roomId));
        if (!this.room) {
          this.error = 'Room not found.';
        }
        // Reset selectedImage when room changes
        this.selectedImage = undefined;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load room details.';
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/hotels/details', this.hotelId]);
  }

  roomTypeLabel(type: number): string {
    switch (type) {
      case 0: return 'Single';
      case 1: return 'Double';
      case 2: return 'Suite';
      case 3: return 'Family';
      default: return 'Unknown';
    }
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  get firstImage(): string {
    return this.room?.images?.[0] || '';
  }
}
