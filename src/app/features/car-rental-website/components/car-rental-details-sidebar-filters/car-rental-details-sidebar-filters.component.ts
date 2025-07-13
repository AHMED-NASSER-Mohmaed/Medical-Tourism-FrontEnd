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


  carPage = 1;
  carPageSize = 8;
  carTotalPages = 1;
  carsLoading = false;

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
    this.carPage = 1;
    this.fetchCars();
  }

  fetchCars() {
    this.carsLoading = true;
    const params = {
      pageNumber: this.carPage,
      pageSize: this.carPageSize,
      searchTerm: this.filters.searchTerm || undefined,
      carType: this.filters.carType !== '' ? +this.filters.carType : undefined,
     minPrice: this.filters.minPrice >= 0 ? this.filters.minPrice : undefined,
    maxPrice: this.filters.maxPrice > 0 ? this.filters.maxPrice : undefined
    };

    this.carRentalService.getAvailableCars(this.carRentalId, params).subscribe({
      next: (response: any) => {
        this.availableCars = response.items || [];
        this.carTotalPages = response.totalPages || 1;
        this.loading = false;
        this.carsLoading = false;
      },
      error: () => {
        this.availableCars = [];
        this.loading = false;
        this.carsLoading = false;
      }
    });
  }

  goToCarPage(page: number) {
    if (page < 1 || page > this.carTotalPages) return;
    this.carPage = page;
    this.fetchCars();
  }

  onMinPriceChange(value: number) {
    this.filters.minPrice = Math.min(value, this.filters.maxPrice - 50);
    this.applyFilters();
  }

  onMaxPriceChange(value: number) {
    this.filters.maxPrice = Math.max(value, this.filters.minPrice + 50);
    this.applyFilters();
  }
}
