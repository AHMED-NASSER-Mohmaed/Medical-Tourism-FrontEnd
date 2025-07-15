import { Component, OnInit } from '@angular/core';
import { LoadChildren, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { LoadingService } from '../../../../shared/services/loading.service';
import { HospitalService } from '../../services/Hospital.service';
import { BookingService } from '../../services/Booking.service';
import { PaymentService } from '../../services/Payment.service';

@Component({
  selector: 'app-booking-stepper',
  standalone: false,
  templateUrl: './booking-stepper.component.html',
  styleUrls: ['./booking-stepper.component.css']
})
export class BookingStepperComponent implements OnInit {

  currentStep: 'hotel' | 'car' | 'payment' = 'hotel';
  bookingDetails: any = {};
  isProcessingPayment = false; // To show a loading state


  constructor(
    private router: Router,
    private bookingService: BookingService,
    private paymentService: PaymentService,
    private isLoadingSrv:LoadingService,
    private hospitalService: HospitalService,
  ) {}

  ngOnInit(): void {
    this.bookingDetails = this.bookingService.getBookingData();
    console.log('Received booking details in stepper:', this.bookingDetails);

    if (!this.bookingDetails || Object.keys(this.bookingDetails).length === 0) {
      console.warn('Booking details not found in service. Redirecting...');
      this.router.navigate(['/']);
      return;
    }

  if (this.bookingDetails.carAppointment) {

      this.currentStep = 'payment';

    } else if (this.bookingDetails.roomAppointment) {

      this.currentStep = 'car';
    } else {

      this.currentStep = 'hotel';
    }
  }

  handleHotelChoice(wantsHotel: boolean): void {
    if (wantsHotel) {
      this.router.navigate(['/hotels']);
    } else {
      this.currentStep = 'car';
    }
  }

  handleCarChoice(wantsCar: boolean): void {
    if (wantsCar) {

      this.router.navigate(['/car-rentals']);
    } else {
       this.currentStep = 'payment';
    }
  }

 navigateToStep(step: 'appointment' | 'hotel' | 'car'): void {
  const { hotelId, roomId } = this.bookingDetails.navigationIds;
  console.log("hotelid",hotelId);
  console.log("roomid",roomId);
    if (step === 'appointment' && this.bookingDetails.navigationIds?.doctorId) {
      const { doctorId } = this.bookingDetails.navigationIds;
      this.router.navigate(['/doctor-profile', doctorId]);
    } else if (step === 'hotel') {
        if (this.bookingDetails.navigationIds?.hotelId && this.bookingDetails.navigationIds?.roomId) {
            const { hotelId, roomId } = this.bookingDetails.navigationIds;
            this.router.navigate(['/hotels/details', hotelId, 'room', roomId]);
        } else {
            this.router.navigate(['/hotels']);
        }
    } else if (step === 'car') {
      if (this.bookingDetails.navigationIds?.carId && this.bookingDetails.navigationIds?.carRentalId) {
        const { carId, carRentalId } = this.bookingDetails.navigationIds;
        this.router.navigate(['/car-rentals/car-details', carId], { queryParams: { rentalId: carRentalId } });
      } else {
        this.router.navigate(['/car-rentals']);
      }
    }
  }
 proceedToPayment(): void {


    // Build a summary of the booking for the confirmation dialog
    let bookingSummaryHtml = '<div style="text-align: left; padding-left: 1rem;">You are about to finalize a booking for:<ul>';
    if (this.bookingDetails.specialtiyAppointment) {
      bookingSummaryHtml += '<li>A doctor\'s appointment</li>';
    }
    if (this.bookingDetails.roomAppointment) {
      bookingSummaryHtml += '<li>A hotel stay</li>';
    }
    if (this.bookingDetails.carAppointment) {
      bookingSummaryHtml += '<li>A car rental</li>';
    }
    bookingSummaryHtml += '</ul></div>';

    Swal.fire({
      title: 'Confirm Your Booking',
      html: bookingSummaryHtml,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed to payment!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // If the user confirms, then call the payment API
        this.isProcessingPayment = true;
        this.isLoadingSrv.show();

        const payload: any = {};
        if (this.bookingDetails.specialtiyAppointment) {
          payload.specialtiyAppointment = this.bookingDetails.specialtiyAppointment;
        }
        if (this.bookingDetails.roomAppointment) {
          payload.roomAppointment = this.bookingDetails.roomAppointment;
        }
        if (this.bookingDetails.carAppointment) {
          payload.carAppointment = this.bookingDetails.carAppointment;
        }

        this.paymentService.createCheckoutSession(payload).subscribe({
          next: (response) => {
            this.isLoadingSrv.hide();
            if (response && response.checkoutSessionUrl) {
              window.location.href = response.checkoutSessionUrl;
              this.bookingService.updateBookingData({});
            } else {
              Swal.fire('Error', 'Could not retrieve payment URL. Please try again.', 'error');
              this.isProcessingPayment = false;
            }
          },
          error: (err) => {
            this.isLoadingSrv.hide();
            console.error('Error creating checkout session:', err);
            Swal.fire('Payment Error', 'There was an issue initiating the payment process. Please contact support.', 'error');
            this.isProcessingPayment = false;
          }
        });
      }
    });
  }
}
