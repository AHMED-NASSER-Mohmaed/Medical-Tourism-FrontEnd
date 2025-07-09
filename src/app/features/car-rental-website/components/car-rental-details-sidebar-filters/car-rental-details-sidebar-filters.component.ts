import { Component, OnInit, Input } from '@angular/core';
import { CarRentalWebsiteService } from '../../services/car-rental-website.service';
import { AvailableCar } from '../../models/available-car.model';
import { FuelTypeMap, TransmissionTypeMap, CarTypeMap } from '../../utils/car-enums.utils';

@Component({
  selector: 'app-car-rental-details-sidebar-filters',
  templateUrl: './car-rental-details-sidebar-filters.component.html',
  styleUrls: ['./car-rental-details-sidebar-filters.component.css'],
    standalone: false
})
export class CarRentalDetailsSidebarFiltersComponent implements OnInit {
  @Input() carRentalId!: string;

  filters = {
    searchTerm: '',
    carType: '',
    minPrice: 0,
    maxPrice: 10000,
    transmission: '',
    fuelType: '',
    capacity: ''
  };
  minPriceLimit = 0;
  maxPriceLimit = 10000;
  availableCars: AvailableCar[] = [];
  loading = false;

  carTypes = Object.entries(CarTypeMap);
  fuelTypes = Object.entries(FuelTypeMap);
  transmissions = Object.entries(TransmissionTypeMap);

  constructor(private carRentalService: CarRentalWebsiteService) {}

  ngOnInit() {
    if (this.carRentalId) {
      this.applyFilters();
    }
  }

  ngOnChanges() {
    if (this.carRentalId) {
      this.applyFilters();
    }
  }

  applyFilters() {
    if (!this.carRentalId) return;
    this.loading = true;
    this.carRentalService.getAvailableCars(this.carRentalId, {
      searchTerm: this.filters.searchTerm,
      carType: this.filters.carType !== '' ? +this.filters.carType : undefined,
      minPrice: this.filters.minPrice,
      maxPrice: this.filters.maxPrice,
      // Add more filters as needed
    }).subscribe({
      next: (res) => {
        this.availableCars = res.items;
        this.loading = false;
      },
      error: () => {
        this.availableCars = [];
        this.loading = false;
      }
    });
  }

  onMinPriceChange(value: number) {
    this.filters.minPrice = Math.min(value, this.filters.maxPrice - 50);
  }
  onMaxPriceChange(value: number) {
    this.filters.maxPrice = Math.max(value, this.filters.minPrice + 50);
  }
} 