import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarRentalWebsiteService } from '../../services/car-rental-website.service';
import { CarRental } from '../../models/car-rental.model';
import { CarRentalStateService } from '../../services/car-rental-state.service';
import { take } from 'rxjs/operators';
import { FuelTypeMap, TransmissionTypeMap, CarTypeMap } from '../../utils/car-enums.utils';
import { LoadingService } from '../../../../shared/services/loading.service';

@Component({
  selector: 'app-car-rental-details',
  templateUrl: './car-rental-details.component.html',
  styleUrls: ['./car-rental-details.component.css'],
  standalone: false
})
export class CarRentalDetailsComponent implements OnInit {
  carRentalId!: string;
  carRental?: CarRental;
  loading = false;
  FuelTypeMap = FuelTypeMap;
  TransmissionTypeMap = TransmissionTypeMap;
  CarTypeMap = CarTypeMap;

  // Cars for this rental
  cars: any[] = [];
  carsLoading = false;
  carFilters: any = {};
  carPage = 1;
  carPageSize = 8;
  carTotalPages = 1;

  constructor(
    private route: ActivatedRoute,
    private carRentalService: CarRentalWebsiteService,
    private carRentalState: CarRentalStateService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.carRentalId = params.get('id')!;
      this.getCarRentalFromStateOrApi();
      this.fetchCars();
    });
  }

  getCarRentalFromStateOrApi() {
    this.loadingService.show();
    this.loading = true;
    this.carRentalState.getCarRentalById(this.carRentalId).pipe(take(1)).subscribe(carRental => {
      if (carRental) {
        this.carRental = carRental;
        this.loading = false;
        this.loadingService.hide();
      } else {
        // Fallback: fetch from API (first page, or increase pageSize if needed)
        this.carRentalService.getCarRentals({ pageSize: 100 }).subscribe({
          next: (data: any) => {
            this.carRental = data.items?.find((c: CarRental) => c.id === this.carRentalId);
            this.loading = false;
            this.loadingService.hide();
          },
          error: () => {
            this.carRental = undefined;
            this.loading = false;
            this.loadingService.hide();
          }
        });
      }
    });
  }

  onCarFiltersChanged(filters: any) {
    this.carFilters = filters;
    this.carPage = 1;
    this.fetchCars();
  }

  goToCarPage(page: number) {
    if (page < 1 || page > this.carTotalPages) return;
    this.carPage = page;
    this.fetchCars();
  }

  fetchCars() {
    this.carsLoading = true;
    const params: any = {
      pageNumber: this.carPage,
      pageSize: this.carPageSize,
      searchTerm: this.carFilters.searchTerm || undefined,
      carType: this.carFilters.carType !== '' ? this.carFilters.carType : undefined,
      minPrice: this.carFilters.minPrice !== '' ? this.carFilters.minPrice : undefined,
      maxPrice: this.carFilters.maxPrice !== '' ? this.carFilters.maxPrice : undefined
    };
    this.carRentalService.getAvailableCars(this.carRentalId, params).subscribe({
      next: (data: any) => {
        this.cars = data.items || [];
        this.carTotalPages = data.totalPages || 1;
        this.carsLoading = false;
      },
      error: () => {
        this.cars = [];
        this.carsLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/car-rentals']);
  }

}
