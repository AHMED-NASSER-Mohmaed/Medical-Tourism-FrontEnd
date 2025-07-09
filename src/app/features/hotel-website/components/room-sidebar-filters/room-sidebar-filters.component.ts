import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { HotelWebsiteService } from '../../services/hotel-website.service';
import { Governate } from '../../models/governate.model';

@Component({
  selector: 'app-room-sidebar-filters',
  standalone: false,
  templateUrl: './room-sidebar-filters.component.html',
  styleUrl: './room-sidebar-filters.component.css'
})
export class RoomSidebarFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<any>();

  filters = {
    searchTerm: '',
    roomType: '',
    minPrice: 0,
    maxPrice: 10000,
    minOccupancy: 1,
    maxOccupancy: 10,
    filterGovernorateId: ''
  };

  minPriceLimit = 0;
  maxPriceLimit = 10000;
  minOccupancyLimit = 1;
  maxOccupancyLimit = 10;

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

  onMinPriceChange(value: number) {
    this.filters.minPrice = Math.min(value, this.filters.maxPrice - 50);
  }
  onMaxPriceChange(value: number) {
    this.filters.maxPrice = Math.max(value, this.filters.minPrice + 50);
  }
  onMinOccupancyChange(value: number) {
    this.filters.minOccupancy = Math.min(value, this.filters.maxOccupancy - 1);
  }
  onMaxOccupancyChange(value: number) {
    this.filters.maxOccupancy = Math.max(value, this.filters.minOccupancy + 1);
  }
} 