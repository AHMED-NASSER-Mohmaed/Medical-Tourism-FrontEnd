// src/app/dashboard/components/dashboard-header/dashboard-header.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BreadcrumbItem } from '../dashboard.types';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css'],
  standalone: false
})
export class DashboardHeaderComponent {
  @Input() title = '';
  @Input() userRole = '';
  @Input() avatar = 'assets/images/www-avatat.png';
  @Input() breadcrumbs: BreadcrumbItem[] = [];
  @Output() menuToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onLogout() {
    this.logout.emit();
  }
}