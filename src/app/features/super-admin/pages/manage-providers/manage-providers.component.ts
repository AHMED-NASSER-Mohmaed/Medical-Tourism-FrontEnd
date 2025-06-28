import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faEye, 
  faCheck, 
  faTimes, 
  faSearch, 
  faHospital, 
  faHotel, 
  faCar, 
  faListAlt,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { SuperAdminService } from '../../services/super-admin.service';
import { 
  AssetStatus, 
  PaginatedResponse,
  HospitalProvider,
  HotelProvider,
  CarRentalProvider
} from '../../models/super-admin.model';
import { finalize } from 'rxjs/operators';
import { NavigationService } from '../../../../core/services/navigation.service';
import { Observable } from 'rxjs';
import { CardColor } from '../../../../dashboard/components/dashboard-card/dashboard-card.component';

type ProviderType = HospitalProvider | HotelProvider | CarRentalProvider;

interface ProviderViewConfig {
  type: 'hospitals' | 'hotels' | 'car-rentals';
  label: string;
  icon: any;
  color: CardColor;
}

@Component({
  selector: 'app-manage-providers',
  templateUrl: './manage-providers.component.html',
  styleUrls: ['./manage-providers.component.css'],
  standalone: false,
})
export class ManageProvidersComponent implements OnInit {
  providers: ProviderType[] = [];
  pagination = { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 };
  isLoading = false;
  searchTerm = '';
  currentView: 'hospitals' | 'hotels' | 'car-rentals' = 'hospitals';
  errorMessage = '';
  AssetStatus = AssetStatus;

  viewConfigs: ProviderViewConfig[] = [
    { type: 'hospitals', label: 'Hospitals', icon: faHospital, color: 'danger' },
    { type: 'hotels', label: 'Hotels', icon: faHotel, color: 'warning' },
    { type: 'car-rentals', label: 'Car Rentals', icon: faCar, color: 'primary' }
  ];

  icons = {
    view: faEye,
    approve: faCheck,
    reject: faTimes,
    search: faSearch,
    list: faListAlt,
    add: faPlus
  };

  constructor(
    private superAdminService: SuperAdminService,
    private navigation: NavigationService
  ) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  // Computed properties
  get approvedCount(): number {
    return this.providers.filter(p => p.verificationStatus === AssetStatus.APPROVED).length;
  }
  get pendingCount(): number {
    return this.providers.filter(p => p.verificationStatus === AssetStatus.PENDING).length;
  }
  get underReviewCount(): number {
    return this.providers.filter(p => p.verificationStatus === AssetStatus.UNDER_REVIEW).length;
  }
  get showingRange(): string {
    const start = (this.pagination.page - 1) * this.pagination.pageSize + 1;
    const end = Math.min(this.pagination.page * this.pagination.pageSize, this.pagination.totalCount);
    return `Showing ${start} to ${end} of ${this.pagination.totalCount}`;
  }

  loadProviders(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.getRequestObservable().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => this.handleSuccessResponse(response),
      error: (err) => this.handleErrorResponse(err)
    });
  }

  private handleSuccessResponse(response: PaginatedResponse<ProviderType>): void {
    this.providers = response.items;
    this.pagination = {
      page: response.pageNumber,
      pageSize: response.pageSize,
      totalCount: response.totalCount,
      totalPages: response.totalPages
    };
  }

  private handleErrorResponse(error: any): void {
    this.errorMessage = error.userMessage || 'Failed to load providers';
    console.error('Provider loading error:', error.technicalMessage || error);
  }

  private getRequestObservable(): Observable<PaginatedResponse<ProviderType>> {
    const { page, pageSize } = this.pagination;
    const filters = { searchTerm: this.searchTerm };

    switch(this.currentView) {
      case 'hotels':
        return this.superAdminService.getHotelProviders(page, pageSize, filters);
      case 'car-rentals':
        // --- FIX: Use the correct endpoint as per your API ---
        return this.superAdminService.getCarRentalProviders(page, pageSize, filters);
      default:
        return this.superAdminService.getHospitalProviders(page, pageSize, filters);
    }
  }

  getStatusIcon(status: AssetStatus): any {
    switch(status) {
      case AssetStatus.APPROVED: return this.icons.approve;
      case AssetStatus.PENDING: return this.icons.search;
      case AssetStatus.UNDER_REVIEW: return this.icons.search;
      default: return null;
    }
  }

  changeProviderStatus(providerId: string, approve: boolean): void {
    this.isLoading = true;
    const action = approve ? 'approve' : 'reject';
    const notes = approve ? '' : 'Rejected by admin';

    this.superAdminService.changeUserState(
      providerId,
      action,
      notes
    ).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.updateLocalProviderStatus(
          providerId,
          approve ? AssetStatus.APPROVED : AssetStatus.PENDING
        );
      },
      error: (err) => {
        this.errorMessage = err.userMessage || `Failed to ${action} provider`;
      }
    });
  }

  private updateLocalProviderStatus(providerId: string, status: AssetStatus): void {
    const provider = this.providers.find(p => p.id === providerId);
    if (provider) provider.verificationStatus = status;
  }

  getProviderType(provider: ProviderType): string {
    if ('numberOfDepartments' in provider) return 'Hospital';
    if ('starRating' in provider) return 'Hotel';
    if ('assetName' in provider && 'assetEmail' in provider) return 'Car Rental';
    return 'Provider';
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.page = page;
      this.loadProviders();
    }
  }

  changeView(viewType: 'hospitals' | 'hotels' | 'car-rentals'): void {
    this.currentView = viewType;
    this.pagination.page = 1;
    this.searchTerm = '';
    this.loadProviders();
  }

  getPageNumbers(): number[] {
    const { page, totalPages } = this.pagination;
    const pageNumbers = [1];
    const range = 2;

    let start = Math.max(2, page - range);
    let end = Math.min(totalPages - 1, page + range);

    if (start > 2) pageNumbers.push(-1);
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    if (end < totalPages - 1) pageNumbers.push(-1);
    if (totalPages > 1) pageNumbers.push(totalPages);

    return pageNumbers;
  }

  trackByProviderId(_: number, provider: ProviderType): string {
    return provider.id;
  }

  get currentViewConfig(): ProviderViewConfig {
    return this.viewConfigs.find(c => c.type === this.currentView) || this.viewConfigs[0];
  }

  viewProviderDetails(providerId: string): void {
    this.navigation.navigateToProviderDetails(this.currentView, providerId);
  }

  addNewProvider(): void {
    this.navigation.navigateToAddProvider(this.currentView.slice(0, -1) as any);
  }

  getSafeColor(color: string): CardColor {
    const allowedColors: CardColor[] = ['primary', 'success', 'warning', 'danger'];
    return allowedColors.includes(color as CardColor) ? color as CardColor : 'primary';
  }
}