import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
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

@Pipe({
  name: 'to12Hour'
})
export class To12HourPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    // Expecting value in HH:mm:ss or HH:mm format
    const [hourStr, minuteStr] = value.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12; // Handle midnight
    return `${hour}:${minute} ${ampm}`;
  }
}
