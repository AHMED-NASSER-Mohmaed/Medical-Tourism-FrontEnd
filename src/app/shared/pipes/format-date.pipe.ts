// shared/pipes/format-date.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}