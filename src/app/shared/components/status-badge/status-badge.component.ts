// shared/components/status-badge/status-badge.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css'],
    standalone: false

})
export class StatusBadgeComponent {
  @Input() statusIcon: any;
  @Input() status: string = '';
  @Input() statusMap: { [key: string]: string } = {
    'active': 'success',
    'approved': 'success',
    'pending': 'warning',
    'suspended': 'danger',
    'rejected': 'danger'
  };
  
 get statusClass(): string {
  const lowercaseStatus = this.status.toLowerCase();
  switch(lowercaseStatus) {
    case 'active':
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'suspended':
    case 'rejected':
      return 'danger';
    case 'inactive':
      return 'secondary';
    case 'under review':
      return 'info';
    default:
      return 'secondary';
  }
  }
}