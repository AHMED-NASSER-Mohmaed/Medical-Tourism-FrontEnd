import { Component, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-car-available-sidebar-filters',
  templateUrl: './car-available-sidebar-filters.component.html',
  styleUrls: ['./car-available-sidebar-filters.component.css'],
  standalone: false
})
export class CarAvailableSidebarFiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<any>();

  filters = {
    searchTerm: '',
    carType: '',
    minPrice: '',
    maxPrice: ''
  };

  carTypes = [
    { value: '', label: 'All Types' },
    { value: 0, label: 'Sedan' },
    { value: 1, label: 'SUV' },
    { value: 2, label: 'Hatchback' },
    { value: 3, label: 'Coupe' },
    { value: 4, label: 'Convertible' },
    { value: 5, label: 'Van' },
    { value: 6, label: 'Pickup' }
  ];

  constructor() {}

  ngOnInit() {}

  applyFilters() {
    this.filtersChanged.emit(this.filters);
  }
} 