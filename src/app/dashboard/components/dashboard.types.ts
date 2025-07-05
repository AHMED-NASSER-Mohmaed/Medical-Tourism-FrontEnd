// src/app/dashboard/shared/dashboard.types.ts
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

/**
 * Dashboard menu item structure
 */
export interface DashboardMenuItem {
  label: string;
  icon: IconDefinition;
  link: string;
  roles?: string[];
  children?: DashboardMenuItem[];
  isExpanded?: boolean;
  badge?: {
    count: number;
    variant: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  };
}

/**
 * Breadcrumb item structure
 */
export interface BreadcrumbItem {
  label: string;
  link?: string;
  icon?: IconDefinition;
}

/**
 * User profile information
 */
export interface DashboardUser {
  name: string;
  role: string;
  avatar: string;
  lastLogin?: Date;
  email?: string;
}

/**
 * Dashboard layout configuration
 */
export interface DashboardConfig {
  showSidebar: boolean;
  showHeader: boolean;
  showBreadcrumbs: boolean;
  fixedHeader: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
}

/**
 * Notification item structure
 */
export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon: IconDefinition;
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  route?: string;
}

/**
 * Quick action item structure
 */
export interface DashboardQuickAction {
  label: string;
  icon: IconDefinition;
  action: () => void;
  variant: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

/**
 * Sidebar state
 */
export interface SidebarState {
  collapsed: boolean;
  collapsedWidth: number;
  expandedWidth: number;
  currentWidth: number;
}

/**
 * Header state
 */
export interface HeaderState {
  height: number;
  fixed: boolean;
  showUserDropdown: boolean;
  showNotifications: boolean;
}

// Type guards for runtime type checking
export function isDashboardMenuItem(item: any): item is DashboardMenuItem {
  return item && typeof item.label === 'string' && item.link;
}

export function isBreadcrumbItem(item: any): item is BreadcrumbItem {
  return item && typeof item.label === 'string';
}