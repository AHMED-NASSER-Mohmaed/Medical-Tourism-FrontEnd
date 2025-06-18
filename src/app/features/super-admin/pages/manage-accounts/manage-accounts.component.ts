import { Component, OnInit } from '@angular/core';
import { SuperAdminService } from '../../services/super-admin.service';
import { 
  UserStatus, 
  PaginatedResponse,
  Patient,
  HospitalProvider,
  HotelProvider,
  CarRentalProvider
} from '../../models/super-admin.model';
import { 
  faEye, faCheck, faTimes, faSearch, 
  faUser, faUserCheck, faUserClock 
} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

type AccountType = Patient | HospitalProvider | HotelProvider | CarRentalProvider;
type AccountViewType = 'patients' | 'hospitals' | 'hotels' | 'car-rentals';

@Component({
  selector: 'app-manage-accounts',
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.css'],
  standalone: false
})
export class ManageAccountsComponent implements OnInit {
  accounts: AccountType[] = [];
  pagination = { page: 1, limit: 10, totalItems: 0, totalPages: 0 };
  isLoading = false;
  searchTerm = '';
  currentView: AccountViewType = 'patients';
  UserStatus = UserStatus;

  icons = {
    view: faEye,
    activate: faCheck,
    deactivate: faTimes,
    search: faSearch,
    users: faUser,
    userCheck: faUserCheck,
    userClock: faUserClock
  };

  constructor(private superAdminService: SuperAdminService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading = true;
    let request$ = this.getRequestObservable();

    request$.subscribe({
      next: (response: PaginatedResponse<AccountType>) => {
        this.accounts = response.items;
        this.pagination = {
          page: response.page,
          limit: response.limit,
          totalItems: response.totalItems,
          totalPages: response.totalPages
        };
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  get Math() {
    return Math;
  }
  private getRequestObservable(): Observable<PaginatedResponse<AccountType>> {
    const { page, limit } = this.pagination;

    switch(this.currentView) {
      case 'hospitals':
        return this.superAdminService.getHospitalProviders(page, limit, this.searchTerm);
      case 'hotels':
        return this.superAdminService.getHotelProviders(page, limit, this.searchTerm);
      case 'car-rentals':
        return this.superAdminService.getCarRentalProviders(page, limit, this.searchTerm);
      default:
        return this.superAdminService.getPatients(page, limit, this.searchTerm);
    }
  }

  getStatusBadgeClass(status: number): string {
    switch(status) {
      case UserStatus.ACTIVE: return 'bg-soft-success text-success';
      case UserStatus.PENDING: return 'bg-soft-warning text-warning';
      case UserStatus.INACTIVE: return 'bg-soft-secondary text-secondary';
      case UserStatus.SUSPENDED: return 'bg-soft-danger text-danger';
      default: return 'bg-soft-secondary text-secondary';
    }
  }

  getUserStatusText(status: number): string {
    switch(status) {
      case UserStatus.INACTIVE: return 'Inactive';
      case UserStatus.ACTIVE: return 'Active';
      case UserStatus.PENDING: return 'Pending';
      case UserStatus.SUSPENDED: return 'Suspended';
      default: return 'Unknown';
    }
  }

  activateUser(userId: string): void {
    this.superAdminService.activateUser(userId).subscribe({
      next: () => this.updateLocalUserStatus(userId, UserStatus.ACTIVE),
      error: () => {}
    });
  }

  deactivateUser(userId: string): void {
    this.superAdminService.deactivateUser(userId).subscribe({
      next: () => this.updateLocalUserStatus(userId, UserStatus.INACTIVE),
      error: () => {}
    });
  }

  private updateLocalUserStatus(userId: string, status: number): void {
    const user = this.accounts.find(u => u.id === userId);
    if (user) user.status = status;
  }

  getUserType(user: AccountType): string {
    if ('bloodGroup' in user) return 'Patient';
    if ('starRating' in user) return 'Hotel';
    if ('numberOfDepartments' in user) return 'Hospital';
    if ('vehicleType' in user) return 'Car Rental';
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
    this.loadAccounts();
  }

  getPageNumbers(): number[] {
    const totalPages = this.pagination.totalPages;
    const currentPage = this.pagination.page;
    const pageNumbers = [];

    pageNumbers.push(1);

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    if (startPage > 2) pageNumbers.push(-1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) pageNumbers.push(-1);

    if (totalPages > 1) pageNumbers.push(totalPages);

    return pageNumbers;
  }

  trackByUserId(index: number, account: AccountType): string {
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

  calculateTrend(count: number): number {
    if (!this.pagination.totalItems) return 0;
    return Math.round((count / this.pagination.totalItems) * 100);
  }
}