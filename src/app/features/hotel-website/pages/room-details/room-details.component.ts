import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelWebsiteService } from '../../services/hotel-website.service';
import { Room } from '../../models/room.model';
import Swal from 'sweetalert2';
import { BookingService } from '../../../patient/services/Booking.service';

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
  selectedImage?: string;

  // Booking sidebar state
  unavailableDates: string[] = [];
  unavailableDatesSet: Set<string> = new Set();
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  minDate: string = '';
  showDateError: boolean = false;
  bookingError: string = '';
  bookingSuccess: string = '';

  bookingData: any = {};

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelWebsiteService,
    private router: Router,
    private bookingService: BookingService
  ) {}

  ngOnInit() {
    this.bookingData = this.bookingService.getBookingData();
    console.log('Booking data received in RoomDetailsComponent:', this.bookingData);

    this.route.paramMap.subscribe(params => {
      this.hotelId = params.get('hotelId')!;
      this.roomId = params.get('roomId')!;
      this.fetchRoomDetails();
      this.fetchUnavailableDates();
      this.setMinDate();
    });



  }

  setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  fetchUnavailableDates() {
    this.hotelService.getRoomUnavailableDates(this.roomId).subscribe({
      next: (data) => {
        this.unavailableDates = data.unavailableDates || [];
        this.unavailableDatesSet = new Set(this.unavailableDates);
      },
      error: () => {
        this.unavailableDates = [];
        this.unavailableDatesSet = new Set();
      }
    });
  }

  fetchRoomDetails() {
    this.loading = true;
    this.error = null;
    this.hotelService.getHotelRooms(this.hotelId, { PageNumber: 1, PageSize: 100 }).subscribe({
      next: (data) => {
        this.room = data.items.find(r => String(r.id) === String(this.roomId));
        if (!this.room) {
          this.error = 'Room not found.';
        }
        this.selectedImage = this.room?.roomImages?.[0]?.imageURL;
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

  roomTypeLabel(type?: number): string {
    switch (type) {
      case 0: return 'Standard';
      case 1: return 'Deluxe';
      case 2: return 'Suite';
      case 3: return 'Family';
      default: return 'Unknown';
    }
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  get firstImage(): string {
    return this.room?.roomImages?.[0]?.imageURL || '';
  }


  bookRoom() {
    if (!this.checkInDate || !this.checkOutDate) {
      this.showDateError = true;
      return;
    }
     if (this.checkOutDate <= this.checkInDate) {
        Swal.fire('Invalid Dates', 'Check-out date must be after the check-in date.', 'error');
        return;
    }
    this.showDateError = false;

    const roomAppointment = {
      checkInDate: this.formatDate(this.checkInDate),
      checkOutDate: this.formatDate(this.checkOutDate),
      roomId: this.room?.id
    };


    const currentBookingData = this.bookingService.getBookingData();
    const updatedBookingData = {
      ...currentBookingData,
      roomAppointment: roomAppointment
    };

    this.bookingService.updateBookingData(updatedBookingData);

    this.router.navigate(['/patient/booking-stepper']);
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  dateFilter = (date: Date | null): boolean => {
    if (!date) return true;
    const formatted = this.formatDate(date);
    return !this.unavailableDatesSet.has(formatted);
  }

  viewTypeLabel(type?: number): string {
    switch (type) {
      case 0: return 'City View';
      case 1: return 'Sea View';
      case 2: return 'Pool View';
      case 3: return 'Garden View';
      case 4: return 'Mountain View';
      default: return 'Standard';
    }
  }

  roomStatusLabel(status?: number): string {
    switch (status) {
      case 0: return 'Clean & Available';
      case 1: return 'Occupied';
      case 2: return 'Under Maintenance';
      case 3: return 'Reserved';
      default: return 'Unknown';
    }
  }
}
