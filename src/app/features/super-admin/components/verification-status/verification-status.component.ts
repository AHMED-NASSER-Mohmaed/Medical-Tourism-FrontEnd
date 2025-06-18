import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SuperAdminService } from '../../services/super-admin.service';
import { AssetStatus } from '../../models/super-admin.model';

@Component({
  selector: 'app-verification-status',
  templateUrl: './verification-status.component.html',
  styleUrls: ['./verification-status.component.css'],
  standalone: false
})
export class VerificationStatusComponent {
  @Input() assetId!: string;
  @Input() currentStatus!: number;
  @Output() statusUpdated = new EventEmitter<void>();
  
  statusOptions = [
    { value: AssetStatus.PENDING, label: 'Pending' },
    { value: AssetStatus.UNDER_REVIEW, label: 'Under Review' },
    { value: AssetStatus.APPROVED, label: 'Approved' }
  ];
  
  notes = '';
  selectedStatus = this.currentStatus;

  constructor(private superAdminService: SuperAdminService) {}

  updateStatus() {
    this.superAdminService.setAssetVerificationStatus(
      this.assetId,
      this.selectedStatus,
      this.notes
    ).subscribe({
      next: () => {
        this.statusUpdated.emit();
      },
      error: (err) => console.error('Error updating status:', err)
    });
  }
}