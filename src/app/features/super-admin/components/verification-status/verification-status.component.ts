import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SuperAdminService } from '../../services/super-admin.service';
import { AssetStatus } from '../../models/super-admin.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-verification-status',
  templateUrl: './verification-status.component.html',
  styleUrls: ['./verification-status.component.css'],
  standalone: false,
})
export class VerificationStatusComponent {
  @Input({ required: true }) assetId!: string;
  @Input({ required: true }) currentStatus!: AssetStatus;
  @Output() statusUpdated = new EventEmitter<void>();
  
  readonly statusOptions = [
    { value: AssetStatus.PENDING, label: 'Pending' },
    { value: AssetStatus.UNDER_REVIEW, label: 'Under Review' },
    { value: AssetStatus.APPROVED, label: 'Approved' },
    { value: AssetStatus.REJECTED, label: 'Rejected' }
  ];
  
  notes = '';
  selectedStatus = this.currentStatus;
  isLoading = false;
  errorMessage = '';

  constructor(private superAdminService: SuperAdminService) {}

  updateStatus() {
    if (!this.assetId || this.selectedStatus === undefined) return;
    
    this.isLoading = true;
    this.errorMessage = '';

    this.superAdminService.changeUserState(
      this.assetId,
      this.selectedStatus === AssetStatus.APPROVED ? 'approve' : 'reject',
      this.notes
    ).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: () => {
        this.statusUpdated.emit();
      },
      error: (err) => {
        this.errorMessage = err.userMessage || 'Failed to update status';
        console.error('Status update error:', err.technicalMessage || err);
      }
    });
  }
}