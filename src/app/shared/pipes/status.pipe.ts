import { Pipe, PipeTransform } from '@angular/core';
import { AssetStatus } from '../../features/super-admin/models/super-admin.model';

@Pipe({ name: 'statusLabel' })
export class StatusLabelPipe implements PipeTransform {
  transform(status: AssetStatus): string {
    switch (status) {
      case AssetStatus.APPROVED: return 'Approved';
      case AssetStatus.REJECTED: return 'Rejected';
      case AssetStatus.PENDING: return 'Pending';
      case AssetStatus.UNDER_REVIEW: return 'Under Review';
      default: return '';
    }
  }
}