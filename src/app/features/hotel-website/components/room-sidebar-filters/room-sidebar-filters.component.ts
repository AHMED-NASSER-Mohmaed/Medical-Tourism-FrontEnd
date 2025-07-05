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
    minPrice: '',
    maxPrice: '',
    minOccupancy: '',
    maxOccupancy: '',
    filterGovernorateId: ''
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