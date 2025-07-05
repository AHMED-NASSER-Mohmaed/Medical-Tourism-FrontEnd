import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { PaginatedResponse } from '../../../features/super-admin/models/super-admin.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  standalone: false
})
export class DataTableComponent<T> {
  @Input() items: T[] = [];
  @Input() columns: { key: string, label: string }[] = [];
  @Input() pagination!: Omit<PaginatedResponse<T>, 'items'>;
  @Input() isLoading = false;
  @Input() rowTemplate?: TemplateRef<any>;

  @Input() searchTerm: string = '';
  @Output() search = new EventEmitter<string>();
  @Output() clearSearch = new EventEmitter<void>();
  @Output() pageChange = new EventEmitter<number>();

  getPages(): number[] {
    if (!this.pagination || !this.pagination.totalPages) return [];
    const totalPages = this.pagination.totalPages;
    const currentPage = this.pagination.pageNumber;
    const pageNumbers = [];

    pageNumbers.push(1);

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) {
      pageNumbers.push(-1); // Ellipsis indicator
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push(-1); // Ellipsis indicator
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.pagination.totalPages && page !== this.pagination.pageNumber) {
      this.pageChange.emit(page);
    }
  }

  getDisplayValue(item: any, key: string): string {
    return key.split('.').reduce((o, i) => o?.[i], item) ?? '';
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search.emit(input.value);
  }

  onClearSearch(): void {
    this.searchTerm = '';
    this.clearSearch.emit();
  }
}