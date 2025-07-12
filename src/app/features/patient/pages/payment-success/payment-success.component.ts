import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../services/Booking.service'; // Adjust the import path as needed

@Component({
  selector: 'app-payment-success',
  standalone:false,
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  bookingDetails: any;

  appointmentWith: string = 'Your Doctor';
  appointmentDate: string = 'Your Appointment Date';
  transactionId: string = '#12345-67890';
  amountPaid: number = 0;

  constructor(
    private router: Router,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
   this.bookingService.updateBookingData({});
  }

  goToHomepage(): void {
    this.bookingService.updateBookingData({});
    this.router.navigate(['/']);
  }

}
