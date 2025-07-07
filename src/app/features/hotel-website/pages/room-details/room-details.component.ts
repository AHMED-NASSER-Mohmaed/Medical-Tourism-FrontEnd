import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelWebsiteService } from '../../services/hotel-website.service';
import { Room } from '../../models/room.model';
import { BreadcrumbService } from '../../../../shared/services/BreadcrumbService';
import Swal from 'sweetalert2';

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

  // Booking sidebar state
  unavailableDates: string[] = [];
  unavailableDatesSet: Set<string> = new Set();
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  minDate: string = '';
  showDateError: boolean = false;
  bookingError: string = '';
  bookingSuccess: string = '';

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelWebsiteService,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.hotelId = params.get('hotelId')!;
      this.roomId = params.get('roomId')!;
      this.fetchRoomDetails();
      this.fetchUnavailableDates();
      this.setMinDate();
      this.setBreadcrumbs();
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
        console.log('Fetched rooms:', data.items.map(r => r.id));
        console.log('Looking for roomId:', this.roomId, typeof this.roomId);
        this.room = data.items.find(r => String(r.id) === String(this.roomId));
        if (!this.room) {
          this.error = 'Room not found.';
        }
        // Reset selectedImage when room changes
        this.selectedImage = undefined;
        this.loading = false;
        this.setBreadcrumbs();
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

  // Booking logic
  bookRoom() {
    if (!this.checkInDate || !this.checkOutDate || !this.room) {
      return;
    }

    const bookingPayload = {
      specialtiyAppointment: {
        specialtyScheduleId: 0,
        isOffline: true,
        appointmentDate: { year: 0, month: 0, day: 0, dayOfWeek: 0 }
      },
      roomAppointment: {
        checkInDate: {
          year: this.checkInDate.getFullYear(),
          month: this.checkInDate.getMonth() + 1,
          day: this.checkInDate.getDate(),
          dayOfWeek: this.checkInDate.getDay()
        },
        checkOutDate: {
          year: this.checkOutDate.getFullYear(),
          month: this.checkOutDate.getMonth() + 1,
          day: this.checkOutDate.getDate(),
          dayOfWeek: this.checkOutDate.getDay()
        },
        roomId: this.room.id
      },
      carAppointment: null
    };

    console.log('Booking payload:', bookingPayload);

    this.loading = true;
    this.hotelService.createRoomBooking(bookingPayload).subscribe({
      next: () => {
        this.bookingSuccess = 'Booking successful!';
        this.checkInDate = null;
        this.checkOutDate = null;
        this.fetchUnavailableDates();
        this.loading = false;
        this.promptForCarRental();
      },
      error: (err) => {
        this.bookingError = 'Booking failed. Please try again.';
        this.loading = false;
      }
    });
  }

  promptForCarRental(): void {
    Swal.fire({
      title: 'Need a Car Rental?',
      text: "We can help you find the best car rentals for your stay.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#aaa',
      confirmButtonText: '🚗 Yes, find a car!',
      cancelButtonText: 'Skip'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/car-rental-website']);
      } else {
        this.router.navigate(['/payment']);
      }
    });
  }

  isDateUnavailable(dateStr: string): boolean {
    return this.unavailableDatesSet.has(dateStr);
  }

  parseDate(dateStr: string) {
    const d = new Date(dateStr);
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    };
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    // Use UTC to avoid timezone issues
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  setBreadcrumbs() {
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Doctor-List', url: '/doctor-list' },
      { label: 'Doctor', url: '/doctor-profile' },
      { label: 'Hotels-List', url: '/hotel-website' },
      { label: `Room ${this.room?.roomNumber} - ${this.roomTypeLabel(this.room?.roomType)}`, url: this.router.url }
    ]);
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return true;
    const formatted = this.formatDate(date);
    console.log('Checking date:', formatted, 'Unavailable:', this.unavailableDatesSet.has(formatted));
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
