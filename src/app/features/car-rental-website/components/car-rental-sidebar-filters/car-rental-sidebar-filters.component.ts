import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CarRentalWebsiteService } from '../../services/car-rental-website.service';
import { Governate } from '../../models/governate.model';

@Component({
  selector: 'app-car-rental-sidebar-filters',
  templateUrl: './car-rental-sidebar-filters.component.html',
  styleUrls: ['./car-rental-sidebar-filters.component.css'],
  standalone: false
})
export class CarRentalSidebarFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<any>();

  filters = {
    searchTerm: '',
    userStatus: '',
    governorateId: ''
    // Add more filters as needed
  };

  governates: Governate[] = [];
  governatesLoading = false;

  constructor(private carRentalService: CarRentalWebsiteService) {}

  ngOnInit() {
    this.fetchGovernates();
  }

  fetchGovernates() {
    this.governatesLoading = true;
    this.carRentalService.getEgyptGovernates().subscribe({
      next: (govs) => {
        this.governates = govs;
        this.governatesLoading = false;
      },
      error: () => {
        this.governates = [];
        this.governatesLoading = false;
      }
    });
  }

  applyFilters() {
    this.filtersChanged.emit(this.filters);
  }
} 