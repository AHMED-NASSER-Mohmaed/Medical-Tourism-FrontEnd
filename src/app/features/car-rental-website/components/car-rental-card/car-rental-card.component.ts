import { Component, Input } from '@angular/core';
import { CarRental } from '../../models/car-rental.model';

@Component({
  selector: 'app-car-rental-card',
  templateUrl: './car-rental-card.component.html',
  styleUrls: ['./car-rental-card.component.css'],
  standalone: false
})
export class CarRentalCardComponent {
  @Input() carRental!: CarRental;
} 