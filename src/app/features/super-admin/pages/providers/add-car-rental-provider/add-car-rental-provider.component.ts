// src/features/super-admin/pages/providers/add-car-rental-provider/add-car-rental-provider.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SuperAdminService } from '../../../services/super-admin.service';
import { CarRentalProvider } from '../../../models/super-admin.model';
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
  
  carRentalForm;

  vehicleTypes = ['Sedan', 'SUV', 'Truck', 'Van', 'Luxury'];
  transmissions = ['Automatic', 'Manual'];
  fuelTypes = ['Gasoline', 'Diesel', 'Electric', 'Hybrid'];
  features = ['GPS', 'Child Seat', 'WiFi', 'Bluetooth'];

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private router: Router
  ) {
    this.carRentalForm = this.fb.group({
      assetName: ['', Validators.required],
      description: ['', Validators.required],
      vehicleType: new FormControl<string[]>([]), // Properly typed FormControl
      transmission: new FormControl<string[]>([]),
      fuelType: new FormControl<string[]>([]),
      rentalPolicies: new FormControl<string[]>([]),
      additionalServices: new FormControl<string[]>([]),
      carFeatures: new FormControl<string[]>([]),
      assetEmail: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      operationalAreas: [''],
      latitude: [''],
      longitude: [''],
      locationDescription: ['']
    });
  }

  // Helper method to safely get form controls
  getFormControl(controlName: string): FormControl {
    return this.carRentalForm.get(controlName) as FormControl;
  }

  onSubmit() {
    if (this.carRentalForm.valid) {
      this.superAdminService.addCarRentalProvider(this.carRentalForm.value).subscribe({
        next: (newCarRental: CarRentalProvider) => {
          this.router.navigate(['/super-admin/providers/car-rentals', newCarRental.id]);
        },
        error: (err) => console.error('Error adding car rental:', err)
      });
    }
  }
// Add this method to handle checkbox arrays
updateCheckboxArray(controlName: string, value: string, event: Event) {
  const isChecked = (event.target as HTMLInputElement).checked;
  const currentArray = this.carRentalForm.get(controlName)?.value as string[];
  
  if (isChecked) {
    this.carRentalForm.get(controlName)?.setValue([...currentArray, value]);
  } else {
    this.carRentalForm.get(controlName)?.setValue(currentArray.filter(item => item !== value));
  }
}
  goBack() {
    this.router.navigate(['/super-admin/providers/car-rentals']);
  }
}