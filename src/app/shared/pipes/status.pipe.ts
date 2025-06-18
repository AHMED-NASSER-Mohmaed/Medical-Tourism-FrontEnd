import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusClass',
  standalone: true
})
export class StatusClassPipe implements PipeTransform {
  transform(status: string): string {
    const normalizedStatus = status.toLowerCase();
    
    switch(normalizedStatus) {
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