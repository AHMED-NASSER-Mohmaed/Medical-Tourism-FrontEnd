// src/features/super-admin/pages/providers/add-car-rental-provider/add-car-rental-provider.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SuperAdminService } from '../../../services/super-admin.service';
import { CarRentalProvider, FuelType, TransmissionType } from '../../../models/super-admin.model';
import { Router } from '@angular/router';
import { faCar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-car-rental-provider',
  templateUrl: './add-car-rental-provider.component.html',
  styleUrls: ['./add-car-rental-provider.component.css'],
  standalone: false
})
export class AddCarRentalProviderComponent {
  faCar = faCar;
  FuelType = FuelType;
  TransmissionType = TransmissionType;
  
  carRentalForm: FormGroup;

  vehicleModels = ['Sedan', 'SUV', 'Truck', 'Van', 'Luxury'];
  availableFacilities = ['24/7 Support', 'Free Cancellation', 'Airport Pickup'];
  availablePolicies = ['Insurance Included', 'Unlimited Mileage', 'No Deposit'];
  supportedLanguages = [
    { id: 1, name: 'English' },
    { id: 2, name: 'Arabic' },
    { id: 3, name: 'French' }
  ];

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private router: Router
  ) {
    this.carRentalForm = this.fb.group({
      assetName: ['', Validators.required],
      assetDescription: ['', Validators.required],
      assetEmail: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      locationDescription: [''],
      latitude: [0],
      longitude: [0],
      facilities: this.fb.array<string>([]),
      fuelTypes: this.fb.array<FuelType>([]),
      models: this.fb.array<string>([]),
      transmission: [TransmissionType.MANUAL],
      rentalPolicies: this.fb.array<string>([]),
      languagesSupported: this.fb.array<number>([])
    });
  }

  getFormControl(controlName: string): FormControl {
    return this.carRentalForm.get(controlName) as FormControl;
  }

  onSubmit() {
    if (this.carRentalForm.valid) {
     const formValue = this.carRentalForm.value;
    const providerData = {
      assetName: formValue.assetName!,
      assetDescription: formValue.assetDescription!,
      assetEmail: formValue.assetEmail!,
      phone: formValue.phone!,
      locationDescription: formValue.locationDescription!,
      latitude: formValue.latitude!,
      longitude: formValue.longitude!,
      facilities: formValue.facilities || [],
      fuelTypes: formValue.fuelTypes || [],
      models: formValue.models || [],
      transmission: formValue.transmission!,
      rentalPolicies: formValue.rentalPolicies || [],
      languagesSupported: formValue.languagesSupported || [],
      // Add the missing required properties
      verificationNotes: '', // Initialize with empty string
      verificationStatus: 0, // Assuming 0 is PENDING status
      assetType: 2, // Assuming 2 is CAR_RENTAL type
      openingTime: { hour: 8, minute: 0, second: 0 }, // Default opening time
      closingTime: { hour: 18, minute: 0, second: 0 } // Default closing time
      };

      this.superAdminService.addCarRentalProvider(providerData).subscribe({
        next: (newProvider) => {
          this.router.navigate(['/super-admin/providers/car-rentals', newProvider.id]);
        },
        error: (err) => {
          console.error('Error adding car rental provider:', err);
          // Add user-friendly error handling here
        }
      });
    }
  }

  updateArrayControl(controlName: string, value: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    const control = this.carRentalForm.get(controlName) as FormControl;
    const currentArray = control.value as any[];

    if (isChecked) {
      control.setValue([...currentArray, value]);
    } else {
      control.setValue(currentArray.filter(item => item !== value));
    }
  }

  goBack() {
    this.router.navigate(['/super-admin/providers/car-rentals']);
  }
}