import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CarRental } from '../models/car-rental.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CarRentalStateService {
  private carRentalsSubject = new BehaviorSubject<CarRental[]>([]);
  carRentals$ = this.carRentalsSubject.asObservable();

  setCarRentals(carRentals: CarRental[]): void {
    this.carRentalsSubject.next(carRentals);
  }

  getCarRentalById(id: string): Observable<CarRental | undefined> {
    return this.carRentals$.pipe(
      map(carRentals => carRentals.find(c => c.id === id))
    );
  }
} 