import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarRentalWebsiteService } from '../../services/car-rental-website.service';
import { AvailableCar } from '../../models/available-car.model';
import { CarTypeMap, FuelTypeMap, TransmissionTypeMap } from '../../utils/car-enums.utils';

@Component({
  selector: 'app-car-details',
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.css']
})
export class CarDetailsComponent implements OnInit {
  car?: AvailableCar;
  selectedImage?: string;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private carService: CarRentalWebsiteService
  ) {}

  ngOnInit() {
    const carRentalId = this.route.snapshot.queryParamMap.get('rentalId');
    const carId = this.route.snapshot.paramMap.get('id');
    if (carRentalId && carId) {
      this.carService.getAvailableCarById(carRentalId, +carId).subscribe(car => {
        this.car = car;
        this.loading = false;
      });
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
} 