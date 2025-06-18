// src/features/super-admin/pages/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { SuperAdminService } from '../../services/super-admin.service';
import { UserBase, UserStatus } from '../../models/super-admin.model';

@Component({
  selector: 'app-super-admin-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: false
})
export class SuperAdminProfileComponent implements OnInit {
  profile!: UserBase;
  lastLogin = new Date(); // Example last login date

  constructor(private superAdminService: SuperAdminService) {}

  ngOnInit() {
    this.superAdminService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  // Add this method to fix the error
  getUserStatusText(status: number | undefined): string {
    if (status === undefined) return 'Unknown';
    
    switch(status) {
      case UserStatus.ACTIVE: return 'Active';
      case UserStatus.PENDING: return 'Pending';
      case UserStatus.INACTIVE: return 'Inactive';
      case UserStatus.SUSPENDED: return 'Suspended';
      default: return 'Unknown';
    }
  }
}