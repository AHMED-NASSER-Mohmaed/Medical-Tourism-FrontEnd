import { Component, OnInit } from '@angular/core';
import { SuperAdminService } from '../../../services/super-admin.service';
import { Patient, UserStatus, PaginatedResponse } from '../../../models/super-admin.model';
import { finalize } from 'rxjs/operators';
import { faUser, faUserCheck, faUserClock, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patients-accounts',
  standalone: false,
  templateUrl: './patients-accounts.component.html',
  styleUrl: './patients-accounts.component.css'
})
export class PatientsAccountsComponent implements OnInit {
  accounts: Patient[] = [];
  pagination = { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 };
  isLoading = false;
  searchTerm = '';
  errorMessage = '';
  showAccountModal = false;
  selectedAccount: Patient | null = null;
  statusFilter: 'all' | 'active' | 'inactive' | 'pending' | 'suspended' = 'all';
  UserStatus = UserStatus;
  stats: any[] = [];

  constructor(private superAdminService: SuperAdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const filters: any = { searchTerm: this.searchTerm };
    if (this.statusFilter !== 'all') {
      filters.UserStatus = UserStatus[this.statusFilter.toUpperCase() as keyof typeof UserStatus];
    }
    this.superAdminService.getPatients(this.pagination.page, this.pagination.pageSize, filters)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response: PaginatedResponse<Patient>) => {
          this.accounts = response.items;
          this.pagination = {
            page: response.pageNumber,
            pageSize: response.pageSize,
            totalCount: response.totalCount,
            totalPages: response.totalPages
          };
          this.updateStats();
        },
        error: (err) => {
          this.errorMessage = err.userMessage || 'Failed to load patients';
        }
      });
  }

  updateStats() {
    this.stats = [
      {
        title: 'Total Accounts',
        value: this.pagination.totalCount,
        icon: faUser,
        color: 'primary',
        trend: 0,
        trendUp: true
      },
      {
        title: 'Active',
        value: this.activeAccountCount,
        icon: faUserCheck,
        color: 'success',
        trend: this.calculateTrend(this.activeAccountCount),
        trendUp: this.calculateTrend(this.activeAccountCount) >= 0
      },
      {
        title: 'Pending',
        value: this.pendingAccountCount,
        icon: faUserClock,
        color: 'warning',
        trend: this.calculateTrend(this.pendingAccountCount),
        trendUp: this.calculateTrend(this.pendingAccountCount) >= 0
      },
      {
        title: 'Inactive',
        value: this.inactiveAccountCount,
        icon: faTimes,
        color: 'danger',
        trend: this.calculateTrend(this.inactiveAccountCount),
        trendUp: this.calculateTrend(this.inactiveAccountCount) >= 0
      }
    ];
  }

  // Dashboard stats
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

  // Pagination
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.page = page;
      this.loadAccounts();
    }
  }
  getPageNumbers(): number[] {
    const { page, totalPages } = this.pagination;
    const pageNumbers = [];
    const range = 2;
    pageNumbers.push(1);
    let start = Math.max(2, page - range);
    let end = Math.min(totalPages - 1, page + range);
    if (start > 2) pageNumbers.push(-1);
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    if (end < totalPages - 1) pageNumbers.push(-1);
    if (totalPages > 1) pageNumbers.push(totalPages);
    return pageNumbers;
  }
  getToEntry(): number {
    return Math.min(this.pagination.page * this.pagination.pageSize, this.pagination.totalCount);
  }

  // Status filter
  changeStatusFilter(status: 'all' | 'active' | 'inactive' | 'pending' | 'suspended'): void {
    this.statusFilter = status;
    this.pagination.page = 1;
    this.loadAccounts();
  }

  // Actions
  changeUserStatus(userId: string, activate: boolean): void {
    this.isLoading = true;
    const action = activate ? 'activate' : 'deactivate';
    this.superAdminService.changeUserState(userId, action).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.loadAccounts();
      },
      error: (err) => {
        this.errorMessage = err.userMessage || `Failed to ${action} user`;
      }
    });
  }
  async viewAccount(account: Patient): Promise<void> {
    this.selectedAccount = await this.superAdminService.enrichCountryAndGovernorate(account);
    this.showAccountModal = true;
  }
  closeAccountModal(): void {
    this.showAccountModal = false;
    this.selectedAccount = null;
  }

  // Utility
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

  onAddClick() {
    this.router.navigate(['/super-admin/providers/patients/add']);
  }
}
