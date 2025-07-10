import { Component, OnInit } from '@angular/core';
import { LoadChildren, Router } from '@angular/router';
import { BookingService } from '../../services/Booking.service';
import { PaymentService } from '../../services/Payment.service';
import Swal from 'sweetalert2';
import { LoadingService } from '../../../../shared/services/loading.service';

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
    private isLoadingSrv:LoadingService
  ) {}

  ngOnInit(): void {
    this.bookingDetails = this.bookingService.getBookingData();
    console.log('Received booking details in stepper:', this.bookingDetails);

    if (!this.bookingDetails || Object.keys(this.bookingDetails).length === 0) {
      console.warn('Booking details not found in service. Redirecting...');
      this.router.navigate(['/']);
      return;
    }

    if (this.bookingDetails.roomAppointment) {
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
      this.proceedToPayment();
    }
  }

  proceedToPayment(): void {
    this.isLoadingSrv.show();
    this.currentStep = 'payment';
    this.isProcessingPayment = true;


    const payload: any = {};
    if (this.bookingDetails.specialtiyAppointment) {
      payload.specialtiyAppointment = this.bookingDetails.specialtiyAppointment;
    }
    if (this.bookingDetails.roomAppointment) {
      payload.roomAppointment = this.bookingDetails.roomAppointment;
    }
    // if (this.bookingDetails.carAppointment) {
    //   payload.carAppointment = this.bookingDetails.carAppointment;
    // }

    console.log('Final payload sent to API:', payload);


    this.paymentService.createCheckoutSession(payload).subscribe({
      next: (response) => {
        this.isLoadingSrv.hide();
        if (response && response.checkoutSessionUrl) {
          window.location.href = response.checkoutSessionUrl;
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
}
