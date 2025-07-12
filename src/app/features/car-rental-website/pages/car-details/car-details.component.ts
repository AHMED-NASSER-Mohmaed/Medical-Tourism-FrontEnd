import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarRentalWebsiteService } from '../../services/car-rental-website.service';
import { AvailableCar } from '../../models/available-car.model';
import { CarTypeMap, FuelTypeMap, TransmissionTypeMap } from '../../utils/car-enums.utils';
import { Location } from '@angular/common';
import { BookingService } from '../../../patient/services/Booking.service';
import Swal from 'sweetalert2';
interface UnavailableDateRange {
  startingDate: string;
  endingDate: string;
}

interface UnavailableDatesResponse {
  carId: number;
  carModel: string;
  carRentalId: string;
  carRentalName: string;
  unavailableDates: UnavailableDateRange[];
}
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
 minDate: Date;
  constructor(
    private route: ActivatedRoute,
    private carService: CarRentalWebsiteService,
    private location: Location,
     private bookingService: BookingService,
      private router: Router,
  ) {
 this.minDate = new Date();

  }

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
 // EDITED: This method now uses the corrected interface
  fetchUnavailableDates(carId: number) {
    // We cast the response to 'any' to bypass the incorrect service typing,
    // then handle it as the correct interface inside the 'next' block.
    this.carService.getCarUnavailableDates(carId).subscribe({
      next: (data: any) => {
        const response = data as UnavailableDatesResponse;
        const newUnavailableDatesSet = new Set<string>();
        if (response && response.unavailableDates) {
          response.unavailableDates.forEach(range => {
            let currentDate = new Date(range.startingDate);
            const endDate = new Date(range.endingDate);

            while (currentDate <= endDate) {
              newUnavailableDatesSet.add(this.formatDate(new Date(currentDate)));
              currentDate.setDate(currentDate.getDate() + 1);
            }
          });
        }
        this.unavailableDatesSet = newUnavailableDatesSet;
        this.checkAndSetPreselectedDates();
      },
      error: () => {
        this.unavailableDatesSet = new Set();
      }
    });
  }

  checkAndSetPreselectedDates(): void {
    const preselectedCarApp = this.bookingData?.carAppointment;
    if (preselectedCarApp && preselectedCarApp.startingDate && preselectedCarApp.endingDate) {
      const pickup = new Date(preselectedCarApp.startingDate);
      const dropoff = new Date(preselectedCarApp.endingDate);

      if (this.dateFilter(pickup) && this.dateFilter(dropoff)) {
        this.pickupDateTime = pickup;
        this.dropoffDateTime = dropoff;
      } else {
        Swal.fire('Dates No Longer Available', 'The dates you previously selected for this car are no longer available. Please choose new dates.', 'warning');
        const currentData = this.bookingService.getBookingData();
        delete currentData.carAppointment;
        this.bookingService.updateBookingData(currentData);
        this.pickupDateTime = null;
        this.dropoffDateTime = null;
      }
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

   // EDITED: Updated booking logic with new validation
  bookCar() {
    this.bookingError = '';
    const now = new Date();

    if (!this.pickupDateTime || !this.dropoffDateTime ) {
      this.bookingError = 'Please fill in all required date and time fields.';
      return;
    }

    const pickupDate = new Date(this.pickupDateTime);
    const dropoffDate = new Date(this.dropoffDateTime);
    if (dropoffDate <= pickupDate) {
      this.bookingError = 'Drop-off date/time must be after pick-up date/time.';
      return;
    }

    // EDITED: New validation check for the date range
    if (!this.isDateRangeAvailable(this.pickupDateTime, this.dropoffDateTime)) {
        this.bookingError = 'The selected date range includes unavailable dates. Please choose a different range.';
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
      carAppointment: carAppointment,
      navigationIds: {
        ...currentBookingData.navigationIds,
        carId: this.car?.id,
        carRentalId: this.car?.carRentalAssetId
      }
    };

    this.bookingService.updateBookingData(updatedBookingData);
    console.log('Final booking data with car:', updatedBookingData);
    this.router.navigate(['/patient/booking-stepper']);
  }

  // EDITED: New helper function to check if a date range is available
  isDateRangeAvailable(start: Date, end: Date): boolean {
    let currentDate = new Date(start);
    while (currentDate <= end) {
      if (this.unavailableDatesSet.has(this.formatDate(currentDate))) {
        return false; // Found an unavailable date in the range
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return true; // No unavailable dates found in the range
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
