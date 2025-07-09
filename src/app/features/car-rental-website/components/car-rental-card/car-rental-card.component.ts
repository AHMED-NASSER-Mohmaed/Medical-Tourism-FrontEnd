import { Component, Input } from '@angular/core';
import { CarRental } from '../../models/car-rental.model';
import { FuelTypeMap, TransmissionTypeMap } from '../../utils/car-enums.utils';

@Component({
  selector: 'app-car-rental-card',
  templateUrl: './car-rental-card.component.html',
  styleUrls: ['./car-rental-card.component.css'],
  standalone: false
})
export class CarRentalCardComponent {
  @Input() carRental!: CarRental;

  getFuelTypes(fuelTypes?: number[]): string {
    if (!fuelTypes || !fuelTypes.length) return 'N/A';
    return fuelTypes.map(f => FuelTypeMap[f] || 'Unknown').join(', ');
  }

  getTransmission(transmission?: number): string {
    if (transmission === undefined || transmission === null) return 'N/A';
    return TransmissionTypeMap[transmission] || 'Unknown';
  }
} 