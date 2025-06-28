import { Component } from '@angular/core';
import { SuperAdminService } from '../../../services/super-admin.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AssetStatus, ProviderType } from '../../../models/super-admin.model';

@Component({
  selector: 'app-add-hotel-provider',
  templateUrl: './add-hotel-provider.component.html',
  styleUrls: ['./add-hotel-provider.component.css'],
  standalone: false
})
export class AddHotelProviderComponent {
  hotelForm: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService
  ) {
    this.hotelForm = this.fb.group({
      assetName: ['', Validators.required],
      assetDescription: ['', Validators.required],
      assetEmail: ['', [Validators.required, Validators.email]],
      locationDescription: ['', Validators.required],
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      facilities: [[]], // Array of strings
      verificationNotes: [''],
      verificationStatus: [AssetStatus.PENDING],
      languagesSupported: [[]], // Array of numbers (language IDs)
      assetType: [ProviderType.HOTEL],
      openingTime: this.fb.group({
        hour: [14, [Validators.required, Validators.min(0), Validators.max(23)]],
        minute: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
        second: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      }),
      closingTime: this.fb.group({
        hour: [12, [Validators.required, Validators.min(0), Validators.max(23)]],
        minute: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
        second: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      }),
      nationalDocsURL: [''],
      credentialDocURL: [''],
      starRating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      hasPool: [false],
      hasRestaurant: [false]
    });
  }

  onSubmit() {
    if (this.hotelForm.valid) {
      // Remove empty strings/arrays if not needed by backend
      const payload = { ...this.hotelForm.value };
      this.superAdminService.addHotelProvider(payload).subscribe({
        next: (newHotel) => {
          // Handle success (e.g., show toast, navigate)
          console.log('Hotel added:', newHotel);
        },
        error: (err) => {
          // Handle error (toast is already shown by service)
          console.error('Error adding hotel:', err);
        }
      });
    } else {
      this.hotelForm.markAllAsTouched();
    }
  }
}