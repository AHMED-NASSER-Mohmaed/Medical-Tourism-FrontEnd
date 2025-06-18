// shared/components/search-filter/search-filter.component.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css'],
    standalone: false

})
export class SearchFilterComponent {
  @Output() search = new EventEmitter<string>();
  searchTerm = '';
  
  onSearch() {
    this.search.emit(this.searchTerm);
  }
}