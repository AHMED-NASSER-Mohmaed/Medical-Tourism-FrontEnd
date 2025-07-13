// src/app/dashboard/components/dashboard-layout/dashboard-layout.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() logout = new EventEmitter<void>();
  
  isSidebarCollapsed = false;
  isSidebarMobileOpen = false;

  toggleSidebar(): void {
    if (window.innerWidth < 992) {
      this.isSidebarMobileOpen = !this.isSidebarMobileOpen;
    } else {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }

  closeSidebarMobile(): void {
    this.isSidebarMobileOpen = false;
  }

  onLogout() {
    this.logout.emit();
  }
}