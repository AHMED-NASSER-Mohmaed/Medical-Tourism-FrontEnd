// src/app/dashboard/components/dashboard-layout/dashboard-layout.component.ts
import { Component, Input } from '@angular/core';
import { DashboardMenuItem, BreadcrumbItem } from '../dashboard.types';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css'],
  standalone: false
})
export class DashboardLayoutComponent {
  @Input() sidebarItems: DashboardMenuItem[] = [];
  @Input() headerTitle = '';
  @Input() userRole = '';
  @Input() breadcrumbs: BreadcrumbItem[] = [];
  @Input() avatar = 'assets/default-avatar.png';
  
  isSidebarCollapsed = false;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}