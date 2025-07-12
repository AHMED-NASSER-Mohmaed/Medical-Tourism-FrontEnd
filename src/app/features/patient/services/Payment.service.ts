import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = `${environment.apiUrl}/Checkout`;

  constructor(private http: HttpClient) { }

  createCheckoutSession(bookingData: any): Observable<{ checkoutSessionUrl: string }> {
    return this.http.post<{ checkoutSessionUrl: string }>(`${this.baseUrl}/CreateBooking`, bookingData);
  }
}
