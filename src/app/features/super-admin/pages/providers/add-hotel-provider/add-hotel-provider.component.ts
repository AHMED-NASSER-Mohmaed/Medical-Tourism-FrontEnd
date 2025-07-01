// add-hotel-provider.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { SuperAdminService } from '../../../services/super-admin.service';
import { 
  Gender,
  ProviderType,
  AssetStatus,
  TimeObject
} from '../../../models/super-admin.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-hotel-provider',
  templateUrl: './add-hotel-provider.component.html',
  styleUrls: ['./add-hotel-provider.component.css'],
  standalone: false, // This component is not standalone, it uses Angular's FormsModule and ReactiveFormsModule
})
export class AddHotelProviderComponent {
  hotelForm: FormGroup;
  isLoading = false;
  apiError: string | null = null;
  
  // Enums
  Gender = Gender;
  
  // For the form
  supportedLanguages = [
    { id: 1, name: 'English' },
    { id: 2, name: 'Arabic' },
    { id: 3, name: 'French' }
  ];
  countries = [
    { id: 1, name: 'Egypt' },
    { id: 2, name: 'Saudi Arabia' },
    { id: 3, name: 'United Arab Emirates' }
  ];
  governorates = [
    { id: 1, name: 'Cairo' },
    { id: 2, name: 'Alexandria' },
    { id: 3, name: 'Giza' }
  ];
  facilitiesList = ['WiFi', 'Parking', 'Spa', 'Gym', 'Bar', 'Room Service'];

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private router: Router
  ) {
    this.hotelForm = this.fb.group({
      // User Account Information
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      gender: [Gender.UNSPECIFIED, Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      governorateId: [null, Validators.required],
      countryId: [null, Validators.required],
      dateOfBirth: ['', Validators.required],

      // Asset Information
      assetName: ['', Validators.required],
      assetDescription: ['', Validators.required],
      assetEmail: ['', [Validators.required, Validators.email]],
      locationDescription: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      facilities: this.fb.array([], { validators: Validators.required }),
      verificationNotes: ['Added via admin portal'],
      verificationStatus: [AssetStatus.PENDING],
      languagesSupported: this.fb.array([], { validators: Validators.required }),
      assetType: [ProviderType.HOTEL],
      openingTime: this.fb.group({
        hour: [8, [Validators.required, Validators.min(0), Validators.max(23)]],
        minute: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
        second: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      }),
      closingTime: this.fb.group({
        hour: [18, [Validators.required, Validators.min(0), Validators.max(23)]],
        minute: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
        second: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      }),
      nationalDocsURL: [''],
      credentialDocURL: [''],
      starRating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      hasPool: [false],
      hasRestaurant: [false]
    }, {
      validators: [this.passwordMatchValidator]
    });

    // Initialize with default values for arrays
    this.addDefaultArrayValues();
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value 
      ? null 
      : { passwordMismatch: true };
  }

  private addDefaultArrayValues() {
    // For facilities, default to WiFi
    this.updateArrayControl('facilities', 'WiFi', { target: { checked: true } } as any, true);
    // For languages, default to English
    this.updateArrayControl('languagesSupported', 1, { target: { checked: true } } as any, true);
  }

  get languagesSupportedArray(): FormArray {
    return this.hotelForm.get('languagesSupported') as FormArray;
  }

  get facilitiesArray(): FormArray {
    return this.hotelForm.get('facilities') as FormArray;
  }

  updateArrayControl(controlName: string, value: any, event: Event, isInit: boolean = false) {
    if (isInit) {
      const array = this.hotelForm.get(controlName) as FormArray;
      array.push(this.fb.control(value));
      return;
    }

    const isChecked = (event.target as HTMLInputElement).checked;
    const array = this.hotelForm.get(controlName) as FormArray;
    
    if (isChecked) {
      array.push(this.fb.control(value));
    } else {
      const index = array.controls.findIndex(ctrl => ctrl.value === value);
      if (index !== -1) {
        array.removeAt(index);
      }
    }
  }

  onSubmit() {
    this.apiError = null;
    if (this.hotelForm.valid) {
      this.isLoading = true;
      const formValue = this.hotelForm.value;

      // Prepare payload for the service
      const payload = {
        // User account fields
        email: formValue.email,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phone: formValue.phone,
        gender: Number(formValue.gender),
        address: formValue.address,
        city: formValue.city,
        governorateId: Number(formValue.governorateId),
        countryId: Number(formValue.countryId),
        dateOfBirth: new Date(formValue.dateOfBirth).toISOString(),

        // Asset fields
        assetName: formValue.assetName,
        assetDescription: formValue.assetDescription,
        assetEmail: formValue.assetEmail,
        locationDescription: formValue.locationDescription,
        latitude: formValue.latitude,
        longitude: formValue.longitude,
        facilities: formValue.facilities || [],
        verificationNotes: formValue.verificationNotes,
        verificationStatus: formValue.verificationStatus,
        languagesSupported: formValue.languagesSupported || [],
        assetType: formValue.assetType,
        openingTime: formValue.openingTime,
        closingTime: formValue.closingTime,
        nationalDocsURL: formValue.nationalDocsURL,
        credentialDocURL: formValue.credentialDocURL,
        starRating: formValue.starRating,
        hasPool: formValue.hasPool,
        hasRestaurant: formValue.hasRestaurant
      };

      this.superAdminService.addHotelProvider(payload).subscribe({
        next: (newHotel) => {
          this.isLoading = false;
          if (newHotel?.id) {
            this.router.navigate(['/super-admin/providers/hotels', newHotel.id]);
          } else {
            this.router.navigate(['/super-admin/providers/hotels']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error adding hotel:', err);
          if (err.status === 400) {
            this.apiError = 'Validation failed: ' + (err.error?.technicalMessage || 'Please check all required fields');
          } else {
            this.apiError = err.userMessage || 'Failed to create hotel provider';
          }
        }
      });
    } else {
      this.markAllAsTouched();
      this.apiError = 'Please complete all required fields correctly.';
    }
  }

  private markAllAsTouched() {
    Object.values(this.hotelForm.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach(subControl => {
          subControl.markAsTouched();
        });
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          arrayControl.markAsTouched();
        });
      }
    });
  }
}