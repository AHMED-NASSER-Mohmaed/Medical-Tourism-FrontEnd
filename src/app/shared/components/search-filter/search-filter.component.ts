import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css'],
  standalone: false
})
export class SearchFilterComponent {
  @Input() searchTerm: string = '';
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  onSearch() {
    this.search.emit(this.searchTerm.trim());
  }

  clearSearch() {
    this.searchTerm = '';
    this.clear.emit();
    this.search.emit('');
  }
}