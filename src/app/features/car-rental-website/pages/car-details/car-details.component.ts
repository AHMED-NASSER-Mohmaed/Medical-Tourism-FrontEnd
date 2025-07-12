import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarRentalWebsiteService } from '../../services/car-rental-website.service';
import { AvailableCar } from '../../models/available-car.model';
import { CarTypeMap, FuelTypeMap, TransmissionTypeMap } from '../../utils/car-enums.utils';
import { Location } from '@angular/common';
import { BookingService } from '../../../patient/services/Booking.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css'],
  standalone:false
})
export class CarDetailsComponent implements OnInit, AfterViewInit {
  car?: AvailableCar;
  selectedImage?: string;
  loading = false; // Only true during booking

  // Booking sidebar state
  pickupDateTime: Date | null = null;
  dropoffDateTime: Date | null = null;
  pickupTime: string = '';
  dropoffTime: string = '';
  locationDescription: string = '';
  fuelPolicy: number = 0;
  bookingError: string = '';
  bookingSuccess: string = '';
  navbarHeightPx: number = 0;
   bookingData: any = {};
  @ViewChild('carDetailsRoot', { static: true }) carDetailsRoot!: ElementRef;

  // Unavailable dates state
  unavailableDates: string[] = [];
  unavailableDatesSet: Set<string> = new Set();

  // Geolocation state
  latitude: number = 0;
  longitude: number = 0;
  locationAvailable: boolean = false;
  retryingLocation: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private carService: CarRentalWebsiteService,
    private location: Location,
     private bookingService: BookingService,
      private router: Router,
  ) {}

  ngOnInit() {
     this.bookingData = this.bookingService.getBookingData();
    console.log('Booking data received in CarRentalDetailsComponent:', this.bookingData);
    const carRentalId = this.route.snapshot.queryParamMap.get('rentalId');
    const carId = this.route.snapshot.paramMap.get('id');
    if (carRentalId && carId) {
      this.carService.getAvailableCarById(carRentalId, +carId).subscribe(car => {
        this.car = car;
        // No loading spinner for initial load
        if (car) {
          this.fetchUnavailableDates(car.id);
        }
      });
    }
    // Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.locationAvailable = true;
        },
        (error) => {
          this.latitude = 0;
          this.longitude = 0;
          this.locationAvailable = false;
        }
      );
    }
  }

  fetchUnavailableDates(carId: number) {
    this.carService.getCarUnavailableDates(carId).subscribe({
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

  ngAfterViewInit() {
    // Find the navbar element and get its height
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      this.navbarHeightPx = (navbar as HTMLElement).offsetHeight;
      // Set as a style variable on the root element for this component
      if (this.carDetailsRoot && this.carDetailsRoot.nativeElement) {
        this.carDetailsRoot.nativeElement.style.setProperty('--local-navbar-height', this.navbarHeightPx + 'px');
      }
    }
  }

  getCarType(): string {
    return this.car ? CarTypeMap[this.car.type] || 'Unknown' : '';
  }
  getFuelType(): string {
    return this.car ? FuelTypeMap[this.car.fuelType] || 'Unknown' : '';
  }
  getTransmission(): string {
    return this.car ? TransmissionTypeMap[this.car.transmission] || 'Unknown' : '';
  }
  selectImage(url: string) {
    this.selectedImage = url;
  }

  goBack() {
    this.location.back();
  }

   bookCar() {
    this.bookingError = '';
    this.bookingSuccess = '';
    const now = new Date();

    if (!this.pickupDateTime || !this.dropoffDateTime || !this.pickupTime || !this.dropoffTime) {
      this.bookingError = 'Please fill in all required date and time fields.';
      Swal.fire('Incomplete Information', this.bookingError, 'warning');
      return;
    }

    // Combine date and time for pickup
    const [pickupHour, pickupMinute] = this.pickupTime.split(':').map(Number);
    const pickupDate = new Date(this.pickupDateTime);
    pickupDate.setHours(pickupHour, pickupMinute, 0, 0);

    // Combine date and time for dropoff
    const [dropoffHour, dropoffMinute] = this.dropoffTime.split(':').map(Number);
    const dropoffDate = new Date(this.dropoffDateTime);
    dropoffDate.setHours(dropoffHour, dropoffMinute, 0, 0);

    if (pickupDate < now) {
      this.bookingError = 'Pick-up date/time cannot be in the past.';
      Swal.fire('Invalid Date', this.bookingError, 'error');
      return;
    }

    if (dropoffDate <= pickupDate) {
      this.bookingError = 'Drop-off date/time must be after pick-up date/time.';
      Swal.fire('Invalid Dates', this.bookingError, 'error');
      return;
    }

    const carAppointment = {

      startingDate: this.formatDate(this.pickupDateTime),
      endingDate: this.formatDate(this.dropoffDateTime),
      latitude: this.latitude,
      longitude: this.longitude,
      locationDescription: this.locationDescription,
      fuelPolicy: this.fuelPolicy,
      carId: this.car?.id
    };

    const currentBookingData = this.bookingService.getBookingData();
    const updatedBookingData = {
      ...currentBookingData,
      carAppointment: carAppointment
    };

    this.bookingService.updateBookingData(updatedBookingData);

    console.log('Final booking data with car:', updatedBookingData);

    this.router.navigate(['/patient/booking-stepper']);
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  retryGeolocation() {
    this.retryingLocation = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.locationAvailable = true;
          this.retryingLocation = false;
        },
        (error) => {
          this.latitude = 0;
          this.longitude = 0;
          this.locationAvailable = false;
          this.retryingLocation = false;
        }
      );
    } else {
      this.retryingLocation = false;
    }
  }



  dateFilter = (date: Date | null): boolean => {
    if (!date) return true;
    const formatted = this.formatDate(date);
    return !this.unavailableDatesSet.has(formatted);
  }
}
