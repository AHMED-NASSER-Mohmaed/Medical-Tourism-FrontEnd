import { Component, OnInit } from '@angular/core';
import { SuperAdminService } from '../../services/super-admin.service';
import {
  AssetStatus,
  ProviderType,
  ProviderStatusChangeResponse,
  HospitalProvider,
  HotelProvider,
  CarRentalProvider,
  PaginatedResponse,
  Provider,
  UserStatus
} from '../../models/super-admin.model';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { faList, faCheck, faTimes, faSearch, faPlus, faEye, faHospital, faHotel, faCar } from '@fortawesome/free-solid-svg-icons';

export type CardColor = 'primary' | 'success' | 'warning' | 'danger';

type AnyProvider = HotelProvider | HospitalProvider | CarRentalProvider;

type UIProvider = Provider & { isStatusChanging?: boolean };

@Component({
  selector: 'app-manage-providers',
  templateUrl: './manage-providers.component.html',
  styleUrls: ['./manage-providers.component.css'],
  standalone: false,
})
export class ManageProvidersComponent implements OnInit {
  providers: UIProvider[] = [];
  pagination = { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 };
  isLoading = false;
  searchTerm = '';
  currentView: 'hospital' | 'hotel' | 'car-rental' = 'hospital';
  errorMessage = '';
  AssetStatus = AssetStatus;
  ProviderType = ProviderType;
  icons = {
    list: faList,
    approve: faCheck,
    reject: faTimes,
    search: faSearch,
    add: faPlus,
    view: faEye
  };
  viewConfigs = [
    {
      type: 'hospital' as const,
      label: 'Hospitals',
      icon: faHospital,
      providerType: ProviderType.HOSPITAL,
      color: 'primary' as CardColor
    },
    {
      type: 'hotel' as const,
      label: 'Hotels',
      icon: faHotel,
      providerType: ProviderType.HOTEL,
      color: 'success' as CardColor
    },
    {
      type: 'car-rental' as const,
      label: 'Car Rentals',
      icon: faCar,
      providerType: ProviderType.CAR_RENTAL,
      color: 'warning' as CardColor
    }
  ];
  selectedProvider: UIProvider | null = null;
  showProviderModal = false;

  constructor(private superAdminService: SuperAdminService) {}

  ngOnInit(): void {
    this.loadProviders();
  }

  loadProviders(): void {
    this.isLoading = true;
    this.errorMessage = '';
    let request$: Observable<PaginatedResponse<AnyProvider>>;
    if (this.currentView === 'hospital') {
      request$ = this.superAdminService.getHospitalProviders(this.pagination.page, this.pagination.pageSize) as Observable<PaginatedResponse<AnyProvider>>;
    } else if (this.currentView === 'hotel') {
      request$ = this.superAdminService.getHotelProviders(this.pagination.page, this.pagination.pageSize) as Observable<PaginatedResponse<AnyProvider>>;
    } else {
      request$ = this.superAdminService.getCarRentalProviders(this.pagination.page, this.pagination.pageSize) as Observable<PaginatedResponse<AnyProvider>>;
    }
    request$.pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (response) => this.handleSuccessResponse(response),
      error: (error) => this.handleErrorResponse(error)
    });
  }

  private handleSuccessResponse(response: PaginatedResponse<AnyProvider>): void {
    this.providers = response.items.map(item => ({
      ...item,
      verificationStatus: item.verificationStatus ?? item.verificationStatus,
      type: this.currentView,
      isStatusChanging: false
    })) as UIProvider[];
    this.pagination = {
      page: response.pageNumber,
      pageSize: response.pageSize,
      totalCount: response.totalCount,
      totalPages: response.totalPages
    };
  }

  private handleErrorResponse(error: { message?: string }): void {
    this.errorMessage = error.message || 'Failed to load providers';
    console.error('Error loading providers:', error);
  }

  approveProvider(provider: UIProvider): void {
    provider.isStatusChanging = true;
    this.superAdminService.approveProvider(
      provider.id,
      provider.assetType
    ).pipe(
      finalize(() => {
        provider.isStatusChanging = false;
      })
    ).subscribe({
      next: (response) => this.handleStatusChangeSuccess(response, provider),
      error: (error) => this.handleStatusChangeError(error, provider)
    });
  }

  openRejectDialog(provider: UIProvider): void {
    Swal.fire({
      title: 'Reject Provider',
      input: 'textarea',
      inputLabel: 'Reason for rejection',
      inputPlaceholder: 'Enter the reason for rejecting this provider...',
      showCancelButton: true,
      confirmButtonText: 'Confirm Rejection',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      preConfirm: (notes) => {
        if (!notes || notes.trim().length < 10) {
          Swal.showValidationMessage('Please provide a detailed reason (at least 10 characters)');
        }
        return notes;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.rejectProvider(provider, result.value);
      }
    });
  }

  private rejectProvider(provider: UIProvider, notes: string): void {
    provider.isStatusChanging = true;
    this.superAdminService.rejectProvider(provider.id, provider.assetType, notes).pipe(
      finalize(() => {
        provider.isStatusChanging = false;
      })
    ).subscribe({
      next: (response) => this.handleStatusChangeSuccess(response, provider),
      error: (error) => this.handleStatusChangeError(error, provider)
    });
  }

  private handleStatusChangeSuccess(response: ProviderStatusChangeResponse, provider: UIProvider): void {
    provider.status = response.newStatus as unknown as UserStatus;
    Swal.fire({
      position: 'top-end',
      toast: true,
      title: 'Success',
      text: response.message || 'Operation completed successfully',
      icon: 'success',
      timer: 3000,
      showConfirmButton: false
    });
  }

  private handleStatusChangeError(error: any, provider: UIProvider): void {
    console.error('Full error:', error);
    Swal.fire({
      position: 'top-end',
      toast: true,
      title: 'Error',
      text: error.message || 'Operation failed',
      icon: 'error',
      timer: 3000,
      showConfirmButton: false
    });
  }

  changeView(viewType: 'hospital' | 'hotel' | 'car-rental'): void {
    this.currentView = viewType;
    this.pagination.page = 1;
    this.loadProviders();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.page = page;
      this.loadProviders();
    }
  }

  get currentViewConfig() {
    return this.viewConfigs.find(c => c.type === this.currentView) || this.viewConfigs[0];
  }

  getStatusClass(status: AssetStatus): string {
    switch(status) {
      case AssetStatus.APPROVED: return 'badge-approved';
      case AssetStatus.PENDING: return 'badge-pending';
      case AssetStatus.UNDER_REVIEW: return 'badge-under-review';
      case AssetStatus.REJECTED: return 'badge-rejected';
      default: return 'badge-secondary';
    }
  }

  trackByProviderId(index: number, provider: UIProvider): string {
    return provider.id;
  }

  trackByIndex(index: number, item: any): number {
    return index;
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

  get approvedCount(): number {
    return this.providers.filter(p => this.getAssetStatus(p.status) === AssetStatus.APPROVED).length;
  }

  get rejectedCount(): number {
    return this.providers.filter(p => this.getAssetStatus(p.status) === AssetStatus.REJECTED).length;
  }

  get pendingCount(): number {
    return this.providers.filter(p => this.getAssetStatus(p.status) === AssetStatus.PENDING).length;
  }

  addNewProvider(): void {
    // Implement navigation or modal opening logic here
    console.log('Add New Provider clicked');
  }

  getProviderType(provider: UIProvider): string {
    switch (provider.assetType) {
      case ProviderType.HOSPITAL: return 'Hospital';
      case ProviderType.HOTEL: return 'Hotel';
      case ProviderType.CAR_RENTAL: return 'Car Rental';
      default: return '';
    }
  }

  viewProviderDetails(providerId: string): void {
    const provider = this.providers.find(p => p.id === providerId);
    if (provider) {
      this.selectedProvider = provider;
      this.showProviderModal = true;
    }
  }

  closeProviderModal(): void {
    this.showProviderModal = false;
    this.selectedProvider = null;
  }

  get showingRange(): string {
    const { page, pageSize, totalCount } = this.pagination;
    if (totalCount === 0) return 'No results';
    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalCount);
    return `Showing ${start}–${end} of ${totalCount}`;
  }

  getAssetStatus(userStatus: number): AssetStatus {
    // Map UserStatus to AssetStatus as appropriate for your business logic
    switch (userStatus) {
      case 1: return AssetStatus.APPROVED;      // ACTIVE
      case 2: return AssetStatus.PENDING;       // PENDING
      case 3: return AssetStatus.REJECTED;      // SUSPENDED
      case 0: return AssetStatus.UNDER_REVIEW;  // INACTIVE
      default: return AssetStatus.PENDING;
    }
  }
}