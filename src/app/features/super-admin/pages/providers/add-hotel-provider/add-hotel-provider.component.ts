import { Component } from '@angular/core';
import { SuperAdminService } from '../../../services/super-admin.service';
import { HotelProvider } from '../../../models/super-admin.model';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-hotel-provider',
  templateUrl: './add-hotel-provider.component.html',
  styleUrls: ['./add-hotel-provider.component.css'],
    standalone: false

})
export class AddHotelProviderComponent {
  hotelForm;

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService
  ) {
    this.hotelForm = this.fb.group({
      assetName: ['', Validators.required],
      description: ['', Validators.required],
      starRating: [0, [Validators.min(1), Validators.max(5)]],
      hasPool: [false],
      hasRestaurant: [false],
      // Add other hotel-specific fields
    });
  }

  onSubmit() {
    if (this.hotelForm.valid) {
      this.superAdminService.addHotelProvider(this.hotelForm.value).subscribe({
        next: (newHotel: HotelProvider) => {
          console.log('Hotel added:', newHotel);
        },
        error: (err) => console.error('Error adding hotel:', err)
      });
    }
  }
}