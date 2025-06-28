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
  faUser, 
  faUserCheck, 
  faUserClock,
  faHospital,
  faHotel,
  faCar
} from '@fortawesome/free-solid-svg-icons';
import { SuperAdminService } from '../../services/super-admin.service';
import { 
  UserStatus, 
  PaginatedResponse,
  Patient,
  HospitalProvider,
  HotelProvider,
  CarRentalProvider,
  UserBase
} from '../../models/super-admin.model';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

type AccountType = Patient | HospitalProvider | HotelProvider | CarRentalProvider;
type AccountViewType = 'patients' | 'hospitals' | 'hotels' | 'car-rentals';

interface AccountViewConfig {
  type: AccountViewType;
  label: string;
  icon: any;
  color: any;
}

@Component({
  selector: 'app-manage-accounts',
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.css'],
  standalone: false,
})
export class ManageAccountsComponent implements OnInit {
  accounts: AccountType[] = [];
  pagination = { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 };
  isLoading = false;
  searchTerm = '';
  currentView: AccountViewType = 'patients';
  errorMessage = '';
  UserStatus = UserStatus;

  viewConfigs: AccountViewConfig[] = [
    { type: 'patients', label: 'Patients', icon: faUser, color: 'primary' },
    { type: 'hospitals', label: 'Hospitals', icon: faHospital, color: 'danger' },
    { type: 'hotels', label: 'Hotels', icon: faHotel, color: 'warning' },
    { type: 'car-rentals', label: 'Car Rentals', icon: faCar, color: 'info' }
  ];

  icons = {
    view: faEye,
    activate: faCheck,
    deactivate: faTimes,
    search: faSearch,
    userCheck: faUserCheck,
    userClock: faUserClock
  };

  constructor(private superAdminService: SuperAdminService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.getRequestObservable().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response) => this.handleSuccessResponse(response),
      error: (err) => this.handleErrorResponse(err)
    });
  }

  private handleSuccessResponse(response: PaginatedResponse<AccountType>): void {
    this.accounts = response.items;
    this.pagination = {
      page: response.pageNumber,
      pageSize: response.pageSize,
      totalCount: response.totalCount,
      totalPages: response.totalPages
    };
  }

  private handleErrorResponse(error: any): void {
    this.errorMessage = error.userMessage || 'Failed to load accounts';
    console.error('Account loading error:', error.technicalMessage || error);
  }

  private getRequestObservable(): Observable<PaginatedResponse<AccountType>> {
    const { page, pageSize } = this.pagination;
    const filters = { searchTerm: this.searchTerm };

    switch(this.currentView) {
      case 'hospitals':
        return this.superAdminService.getHospitalProviders(page, pageSize, filters);
      case 'hotels':
        return this.superAdminService.getHotelProviders(page, pageSize, filters);
      case 'car-rentals':
        return this.superAdminService.getCarRentalProviders(page, pageSize, filters);
      default:
        return this.superAdminService.getPatients(page, pageSize, filters);
    }
  }

  getStatusBadgeClass(status: UserStatus): string {
    switch(status) {
      case UserStatus.ACTIVE: return 'bg-soft-success text-success';
      case UserStatus.PENDING: return 'bg-soft-warning text-warning';
      case UserStatus.INACTIVE: return 'bg-soft-secondary text-secondary';
      case UserStatus.SUSPENDED: return 'bg-soft-danger text-danger';
      default: return 'bg-soft-secondary text-secondary';
    }
  }

  getUserStatusText(status: UserStatus): string {
    return UserStatus[status] || 'Unknown';
  }

  changeUserStatus(userId: string, activate: boolean): void {
    this.isLoading = true;
    const action = activate ? 'activate' : 'deactivate';
    
    this.superAdminService.changeUserState(userId, action).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.updateLocalUserStatus(userId, activate ? UserStatus.ACTIVE : UserStatus.INACTIVE);
      },
      error: (err) => {
        this.errorMessage = err.userMessage || `Failed to ${action} user`;
      }
    });
  }

  private updateLocalUserStatus(userId: string, status: UserStatus): void {
    const user = this.accounts.find(u => u.id === userId);
    if (user) user.status = status;
  }

  getUserType(user: AccountType): string {
    if ('bloodGroup' in user) return 'Patient';
    if ('starRating' in user) return 'Hotel';
    if ('numberOfDepartments' in user) return 'Hospital';
    if ('transmission' in user) return 'Car Rental';
    return 'User';
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.page = page;
      this.loadAccounts();
    }
  }

  changeView(viewType: AccountViewType): void {
    this.currentView = viewType;
    this.pagination.page = 1;
    this.searchTerm = '';
    this.loadAccounts();
  }

  getPageNumbers(): number[] {
    const { page, totalPages } = this.pagination;
    const pageNumbers = [];
    const range = 2; // Number of pages to show around current page

    // Always include first page
    pageNumbers.push(1);

    // Calculate start and end of middle range
    let start = Math.max(2, page - range);
    let end = Math.min(totalPages - 1, page + range);

    // Add ellipsis if needed before middle range
    if (start > 2) pageNumbers.push(-1);

    // Add middle range
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis if needed after middle range
    if (end < totalPages - 1) pageNumbers.push(-1);

    // Always include last page if different from first
    if (totalPages > 1) pageNumbers.push(totalPages);

    return pageNumbers;
  }

  trackByUserId(_: number, account: UserBase): string {
    return account.id;
  }

  get activeAccountCount(): number {
    return this.accounts.filter(a => a.status === UserStatus.ACTIVE).length;
  }

  get pendingAccountCount(): number {
    return this.accounts.filter(a => a.status === UserStatus.PENDING).length;
  }

  get inactiveAccountCount(): number {
    return this.accounts.filter(a => a.status === UserStatus.INACTIVE).length;
  }

  get suspendedAccountCount(): number {
    return this.accounts.filter(a => a.status === UserStatus.SUSPENDED).length;
  }

  calculateTrend(count: number): number {
    if (!this.pagination.totalCount) return 0;
    return Math.round((count / this.pagination.totalCount) * 100);
  }

  get currentViewConfig(): AccountViewConfig {
    return this.viewConfigs.find(c => c.type === this.currentView) || this.viewConfigs[0];
  }
  getToEntry(): number {
  return Math.min(this.pagination.page * this.pagination.pageSize, this.pagination.totalCount);
}
}