import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { HotelWebsiteService } from '../../services/hotel-website.service';
import { Governate } from '../../models/governate.model';

@Component({
  selector: 'app-hotel-sidebar-filters',
  standalone: false,
  templateUrl: './hotel-sidebar-filters.component.html',
  styleUrl: './hotel-sidebar-filters.component.css',
})
export class HotelSidebarFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<any>();

  filters = {
    searchTerm: '',
    userStatus: '',
    governorateId: '',
    hasPool: false,
    hasRestaurant: false,
    starRating: ''
  };

  governates: Governate[] = [];
  governatesLoading = false;

  constructor(private hotelService: HotelWebsiteService) {}

  ngOnInit() {
    this.fetchGovernates();
  }

  fetchGovernates() {
    this.governatesLoading = true;
    this.hotelService.getEgyptGovernates().subscribe({
      next: (govs) => {
        console.log('Fetched governates:', govs);
        this.governates = govs;
        this.governatesLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch governates:', err);
        this.governates = [];
        this.governatesLoading = false;
      }
    });
  }

  applyFilters() {
    this.filtersChanged.emit(this.filters);
  }
}
