import { Component, OnInit } from '@angular/core';
import { SuperAdminService } from '../../services/super-admin.service';
import { UserBase, UserStatus, Gender } from '../../models/super-admin.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-super-admin-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: false,
  providers: [DatePipe]
})
export class SuperAdminProfileComponent implements OnInit {
  profile!: UserBase;
  lastLogin = new Date();
  UserStatus = UserStatus; // Expose enum to template
  Gender = Gender; // Expose enum to template

  constructor(
    private superAdminService: SuperAdminService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.superAdminService.getProfile().subscribe({
      next: (profile: any) => {
        // Map API fields to model fields if needed
        this.profile = {
          ...profile,
          governorate: profile.governorateName ?? profile.governorate ?? '',
          country: profile.countryName ?? profile.country ?? '',
          imageURL: profile.imageURL || null
        };
      },
      error: (err) => console.error('Error loading profile:', err)
    });
  }

  getUserStatusText(status: UserStatus): string {
    switch(status) {
      case UserStatus.ACTIVE: return 'Active';
      case UserStatus.PENDING: return 'Pending';
      case UserStatus.INACTIVE: return 'Inactive';
      case UserStatus.SUSPENDED: return 'Suspended';
      default: return 'Unknown';
    }
  }

  getFormattedDate(date: Date | string | undefined): string {
    if (!date) return 'Never logged in';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return this.datePipe.transform(dateObj, 'medium') || 'Invalid date';
  }

  getGenderText(gender: Gender): string {
    switch(gender) {
      case Gender.MALE: return 'Male';
      case Gender.FEMALE: return 'Female';
      case Gender.UNSPECIFIED: return 'Unspecified';
      default: return 'Unknown';
    }
  }
}