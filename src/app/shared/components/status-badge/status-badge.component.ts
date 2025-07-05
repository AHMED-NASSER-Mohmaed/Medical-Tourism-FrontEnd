import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { AssetStatus, UserStatus } from '../../../features/super-admin/models/super-admin.model';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css'],
  standalone: false,
})
export class StatusBadgeComponent {
  @Input() statusIcon?: IconDefinition;
  @Input() status: string = '';
  @Input() statusValue?: AssetStatus | UserStatus; // Can accept either enum type

  get statusClass(): string {
    // If statusValue is provided (enum), use that first
    if (this.statusValue !== undefined) {
      return this.getClassFromEnum(this.statusValue);
    }

    // Fall back to string status
    const lowercaseStatus = this.status.toLowerCase();
    switch(lowercaseStatus) {
      case 'active':
      case 'approved':
      case AssetStatus[AssetStatus.APPROVED].toLowerCase():
      case UserStatus[UserStatus.ACTIVE].toLowerCase():
        return 'success';
      case 'pending':
      case AssetStatus[AssetStatus.PENDING].toLowerCase():
      case UserStatus[UserStatus.PENDING].toLowerCase():
        return 'warning';
      case 'suspended':
      case 'rejected':
      case AssetStatus[AssetStatus.REJECTED].toLowerCase():
      case UserStatus[UserStatus.SUSPENDED].toLowerCase():
        return 'danger';
      case 'inactive':
      case UserStatus[UserStatus.INACTIVE].toLowerCase():
        return 'secondary';
      case 'under review':
      case AssetStatus[AssetStatus.UNDER_REVIEW].toLowerCase():
        return 'info';
      default:
        return 'secondary';
    }
  }

  private getClassFromEnum(value: AssetStatus | UserStatus): string {
    switch(value) {
      case AssetStatus.APPROVED:
      case UserStatus.ACTIVE:
        return 'success';
      case AssetStatus.PENDING:
      case UserStatus.PENDING:
        return 'warning';
      case AssetStatus.REJECTED:
      case UserStatus.SUSPENDED:
        return 'danger';
      case UserStatus.INACTIVE:
        return 'secondary';
      case AssetStatus.UNDER_REVIEW:
        return 'info';
      default:
        return 'secondary';
    }
  }

  get displayText(): string {
    if (this.statusValue !== undefined) {
      return AssetStatus[this.statusValue] || UserStatus[this.statusValue] || this.status;
    }
    return this.status;
  }
}