import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarRentalWebsiteService } from '../../services/car-rental-website.service';
import { AvailableCar } from '../../models/available-car.model';
import { CarTypeMap, FuelTypeMap, TransmissionTypeMap } from '../../utils/car-enums.utils';
import { Location } from '@angular/common';

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
  @ViewChild('carDetailsRoot', { static: true }) carDetailsRoot!: ElementRef;

  // Geolocation state
  latitude: number = 0;
  longitude: number = 0;
  locationAvailable: boolean = false;
  retryingLocation: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private carService: CarRentalWebsiteService,
    private location: Location
  ) {}

  ngOnInit() {
    const carRentalId = this.route.snapshot.queryParamMap.get('rentalId');
    const carId = this.route.snapshot.paramMap.get('id');
    if (carRentalId && carId) {
      this.carService.getAvailableCarById(carRentalId, +carId).subscribe(car => {
        this.car = car;
        // No loading spinner for initial load
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
    if (!this.pickupDateTime || !this.dropoffDateTime || !this.pickupTime || !this.dropoffTime || !this.locationDescription || !this.car) {
      this.bookingError = 'Please fill in all required fields.';
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
      return;
    }
    if (dropoffDate <= pickupDate) {
      this.bookingError = 'Drop-off date/time must be after pick-up date/time.';
      return;
    }
    this.loading = true;
    // Prepare request body for car booking (all three keys)
    const requestBody = {
      specialtiyAppointment: {
        specialtyScheduleId: 0,
        isOffline: true,
        appointmentDate: {
          year: 0,
          month: 0,
          day: 0,
          dayOfWeek: 0
        }
      },
      roomAppointment: {
        checkInDate: {
          year: 0,
          month: 0,
          day: 0,
          dayOfWeek: 0
        },
        checkOutDate: {
          year: 0,
          month: 0,
          day: 0,
          dayOfWeek: 0
        },
        roomId: 0
      },
      carAppointment: {
        startingDateTime: pickupDate.toISOString(),
        endingDateTime: dropoffDate.toISOString(),
        latitude: this.latitude,
        longitude: this.longitude,
        locationDescription: this.locationDescription,
        fuelPolicy: this.fuelPolicy,
        carId: this.car.id
      }
    };
    // Call booking API
    this.carService.createBooking(requestBody).subscribe({
      next: (res) => {
        this.bookingSuccess = 'Car booked successfully!';
        this.loading = false;
      },
      error: (err) => {
        this.bookingError = 'Booking failed. Please try again.';
        this.loading = false;
      }
    });
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
} 