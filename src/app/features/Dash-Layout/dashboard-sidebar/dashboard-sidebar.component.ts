// src/app/dashboard/components/dashboard-sidebar/dashboard-sidebar.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DashboardMenuItem } from '../dashboard.types';
import {
  faShieldAlt, faChevronDown, faChevronUp,
  faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css'],
  standalone: false
})
export class DashboardSidebarComponent {
  @Input() items: DashboardMenuItem[] = [];
  @Input() collapsed = false;
  @Input() userRole = '';
  @Input() mobileOpen = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  icons = {
    shield: faShieldAlt,
    chevronDown: faChevronDown,
    chevronUp: faChevronUp,
    chevronLeft: faChevronLeft,
    chevronRight: faChevronRight
  };

  toggleItemExpand(item: DashboardMenuItem): void {
    if (item.children) {
      item.isExpanded = !item.isExpanded;
    }
  }

  handleToggleSidebar(): void {
    this.toggleCollapse.emit();
  }
}
