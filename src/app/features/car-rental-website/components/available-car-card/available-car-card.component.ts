import { Component, Input } from '@angular/core';
import { AvailableCar } from '../../models/available-car.model';
import { FuelTypeMap, TransmissionTypeMap } from '../../utils/car-enums.utils';

@Component({
  selector: 'app-available-car-card',
  templateUrl: './available-car-card.component.html',
  styleUrls: ['./available-car-card.component.css'],
  standalone: false
})
export class AvailableCarCardComponent {
  @Input() car!: AvailableCar;

  getFuelType(): string {
    return FuelTypeMap[this.car.fuelType] || 'Unknown';
  }

  getTransmission(): string {
    return TransmissionTypeMap[this.car.transmission] || 'Unknown';
  }
} 