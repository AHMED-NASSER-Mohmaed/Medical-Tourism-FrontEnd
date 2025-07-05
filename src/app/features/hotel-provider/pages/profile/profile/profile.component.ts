import { Component, OnInit } from '@angular/core';
import { HotelProviderService } from '../../../services/hotel-provider.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profile: any;
  loading = false;
  error: string | null = null;

  constructor(private hotelProviderService: HotelProviderService) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile() {
    this.loading = true;
    this.error = null;
    this.hotelProviderService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.userMessage || 'Failed to load profile.';
        this.loading = false;
      }
    });
  }
}
