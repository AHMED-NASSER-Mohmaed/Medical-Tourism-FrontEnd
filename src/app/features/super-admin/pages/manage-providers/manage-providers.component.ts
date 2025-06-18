import { Component, OnInit } from '@angular/core';
import { SuperAdminService } from '../../services/super-admin.service';
import { 
  AssetStatus, 
  PaginatedResponse,
  HospitalProvider,
  HotelProvider,
  CarRentalProvider
} from '../../models/super-admin.model';
import { 
  faEye, faCheck, faTimes, faSearch, 
  faHospital, faHotel, faCar, faListAlt, 
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { NavigationService } from '../../../../core/services/navigation.service';

type ProviderType = HospitalProvider | HotelProvider | CarRentalProvider;

@Component({
  selector: 'app-manage-providers',
  templateUrl: './manage-providers.component.html',
  styleUrls: ['./manage-providers.component.css'],
  standalone: false
})
export class ManageProvidersComponent implements OnInit {
  providers: ProviderType[] = [];
  pagination = { page: 1, limit: 10, totalItems: 0, totalPages: 0 };
  isLoading = false;
  searchTerm = '';
  currentView: 'hospitals' | 'hotels' | 'car-rentals' = 'hospitals';
  AssetStatus = AssetStatus;
  
  icons = {
    view: faEye,
    approve: faCheck,
    reject: faTimes,
    search: faSearch,
    hospital: faHospital,
    hotel: faHotel,
    car: faCar,
    list: faListAlt,
  add: faPlus

  };

  constructor(private superAdminService: SuperAdminService,private navigation: NavigationService) {}

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

  get providerType(): string {
    switch(this.currentView) {
      case 'hospitals': return 'Hospital';
      case 'hotels': return 'Hotel';
      case 'car-rentals': return 'Car Rental';
      default: return '';
    }
  }

  get showingRange(): string {
    const start = (this.pagination.page - 1) * this.pagination.limit + 1;
    const end = Math.min(this.pagination.page * this.pagination.limit, this.pagination.totalItems);
    return `Showing ${start} to ${end} of ${this.pagination.totalItems} entries`;
  }

  loadProviders(): void {
    this.isLoading = true;
    
    this.getRequestObservable().subscribe({
      next: (response: PaginatedResponse<ProviderType>) => {
        this.providers = response.items;
        this.pagination = {
          page: response.page,
          limit: response.limit,
          totalItems: response.totalItems,
          totalPages: response.totalPages
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading providers:', error);
        this.isLoading = false;
      }
    });
  }

  private getRequestObservable(): Observable<PaginatedResponse<ProviderType>> {
    const { page, limit } = this.pagination;
    switch(this.currentView) {
      case 'hotels': 
        return this.superAdminService.getHotelProviders(page, limit, this.searchTerm);
      case 'car-rentals': 
        return this.superAdminService.getCarRentalProviders(page, limit, this.searchTerm);
      default:
        return this.superAdminService.getHospitalProviders(page, limit, this.searchTerm);
    }
  }

  getStatusText(status: number): string {
    switch(status) {
      case AssetStatus.APPROVED: return 'Approved';
      case AssetStatus.PENDING: return 'Pending';
      case AssetStatus.UNDER_REVIEW: return 'Under Review';
      default: return 'Unknown';
    }
  }

  getStatusIcon(status: number): any {
    switch(status) {
      case AssetStatus.APPROVED: return this.icons.approve;
      case AssetStatus.PENDING: return this.icons.search;
      case AssetStatus.UNDER_REVIEW: return this.icons.search;
      default: return null;
    }
  }

  approveProvider(providerId: string): void {
    this.superAdminService.approveProvider(providerId).subscribe({
      next: () => this.updateLocalProviderStatus(providerId, AssetStatus.APPROVED),
      error: (error) => console.error('Error approving provider:', error)
    });
  }

  rejectProvider(providerId: string): void {
    const notes = 'Rejected by admin';
    this.superAdminService.rejectProvider(providerId, notes).subscribe({
      next: () => this.updateLocalProviderStatus(providerId, AssetStatus.PENDING),
      error: (error) => console.error('Error rejecting provider:', error)
    });
  }

  private updateLocalProviderStatus(providerId: string, status: AssetStatus): void {
    const provider = this.providers.find(p => p.id === providerId);
    if (provider) {
      provider.verificationStatus = status;
    }
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
    this.loadProviders();
  }

  getPageNumbers(): number[] {
    const totalPages = this.pagination.totalPages;
    const currentPage = this.pagination.page;
    const pageNumbers = [1];

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    if (startPage > 2) pageNumbers.push(-1);
    for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    if (endPage < totalPages - 1) pageNumbers.push(-1);
    if (totalPages > 1) pageNumbers.push(totalPages);
    
    return pageNumbers;
  }

  trackByProviderId(index: number, provider: ProviderType): string {
    return provider.id;
  }
  // In manage-providers.component.ts
getProviderType(provider: ProviderType): string {
  if ('numberOfDepartments' in provider) return 'Hospital';
  if ('starRating' in provider) return 'Hotel';
  if ('vehicleType' in provider) return 'Car Rental';
  return 'Provider';
}
getAddProviderRoute(): string {
  switch(this.currentView) {
    case 'hospitals': return '/super-admin/providers/hospitals/add';
    case 'hotels': return '/super-admin/providers/hotels/add';
    case 'car-rentals': return '/super-admin/providers/car-rentals/add';
    default: return '';
  }
}
viewProviderDetails(providerId: string) {
    this.navigation.navigateToProviderDetails(this.currentView, providerId);
  }

  addNewProvider() {
    this.navigation.navigateToAddProvider(this.currentView.slice(0, -1) as any);
  }

  changeEmail(userId: string) {
    this.navigation.navigateToChangeEmail(userId);
  }
}