import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private bookingDataSource = new BehaviorSubject<any>({});
  currentBookingData = this.bookingDataSource.asObservable();

  constructor() { }

  updateBookingData(data: any) {
    this.bookingDataSource.next(data);
  }

  getBookingData() {
    return this.bookingDataSource.getValue();
  }
}
