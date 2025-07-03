// src/app/core/services/navigation.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  constructor(private router: Router) {}

  // Provider Navigation
  navigateToAddProvider(type: 'hospital' | 'hotel' | 'car-rental') {
    this.router.navigate([`/super-admin/providers/${type}s/add`]);
  }

  navigateToProviderList(type: 'hospitals' | 'hotels' | 'car-rentals') {
    this.router.navigate([`/super-admin/providers/${type}`]);
  }

  navigateToProviderDetails(type: 'hospitals' | 'hotels' | 'car-rentals', id: string) {
    this.router.navigate([`/super-admin/providers/${type}`, id]);
  }

  // User Management
  navigateToUserList() {
    this.router.navigate(['/super-admin/manage-accounts']);
  }

  navigateToChangeEmail(userId: string) {
    this.router.navigate(['/super-admin/user-actions/change-email', userId]);
  }

  navigateToResetPassword(userId: string) {
    this.router.navigate(['/super-admin/user-actions/reset-password', userId]);
  }

  // Profile
  navigateToProfile() {
    this.router.navigate(['/super-admin/profile']);
  }

  // Dashboard
  navigateToDashboard() {
    this.router.navigate(['/super-admin/dashboard']);
  }

  // Generic
  goBack() {
    this.router.navigate(['../'], { relativeTo: this.router.routerState.root });
  }
}