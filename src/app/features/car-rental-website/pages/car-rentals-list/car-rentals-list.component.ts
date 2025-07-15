import { Component, OnInit } from '@angular/core';
import { CarRentalWebsiteService } from '../../services/car-rental-website.service';
import { CarRental } from '../../models/car-rental.model';
import { CarRentalStateService } from '../../services/car-rental-state.service';
import { Location } from '@angular/common';
import { LoadingService } from '../../../../shared/services/loading.service';
@Component({
  selector: 'app-car-rentals-list',
  templateUrl: './car-rentals-list.component.html',
  styleUrls: ['./car-rentals-list.component.css'],
  standalone: false,
})
export class CarRentalsListComponent implements OnInit {
  carRentals: CarRental[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  filters: any = {};

  constructor(
    private carRentalService: CarRentalWebsiteService,
    private carRentalState: CarRentalStateService,
    private location: Location,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.fetchCarRentals();
  }

  onFiltersChanged(filters: any) {
    this.filters = filters;
    this.currentPage = 1;
    this.fetchCarRentals();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchCarRentals();
  }

  fetchCarRentals() {
    this.loading = true;
    this.loadingService.show();
    const params: any = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize,
      searchTerm: this.filters.searchTerm || undefined,
      userStatus: this.filters.userStatus !== '' ? this.filters.userStatus : undefined,
      governerateId: this.filters.governorateId !== '' ? this.filters.governorateId : undefined,
      // Add more filters as needed
    };
    this.carRentalService.getCarRentals(params).subscribe({
      next: (data: any) => {
        this.carRentals = data.items || [];
        this.carRentalState.setCarRentals(this.carRentals);
        this.totalPages = data.totalPages || 1;
        this.loading = false;
        this.loadingService.hide();
      },
      error: () => {
        this.carRentals = [];
        this.carRentalState.setCarRentals([]);
        this.loading = false;
        this.loadingService.hide();
      }
    });
  }
   goBack(): void {
    this.location.back();
  }

}
