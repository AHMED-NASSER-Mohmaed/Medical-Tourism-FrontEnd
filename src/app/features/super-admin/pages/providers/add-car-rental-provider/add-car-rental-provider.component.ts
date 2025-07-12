// add-car-rental-provider.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { SuperAdminService } from '../../../services/super-admin.service';
import { 
  CarRentalProvider, 
  FuelType, 
  TransmissionType, 
  Gender,
  ProviderType,
  AssetStatus,
  TimeObject,
  UserBase,
  CountriesGovernatesResponse,
  CountryWithGovernates
} from '../../../models/super-admin.model';
import { Router } from '@angular/router';
import { faCar, faUser, faEnvelope, faLock, faPhone, faVenusMars, faMapMarkerAlt, faCalendar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-car-rental-provider',
  templateUrl: './add-car-rental-provider.component.html',
  styleUrls: ['./add-car-rental-provider.component.css'],
  standalone: false,
})
export class AddCarRentalProviderComponent implements OnInit {
  // Icons
  faCar = faCar;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faPhone = faPhone;
  faVenusMars = faVenusMars;
  faMapMarkerAlt = faMapMarkerAlt;
  faCalendar = faCalendar;
  
  // Enums
  FuelType = FuelType;
  TransmissionType = TransmissionType;
  Gender = Gender;
  AssetStatus = AssetStatus;
  
  carRentalForm: FormGroup;
  isLoading = false;
  apiError: string | null = null;

  vehicleModels = ['Sedan', 'SUV', 'Truck', 'Van', 'Luxury'];
  availableFacilities = ['24/7 Support', 'Free Cancellation', 'Airport Pickup'];
  availablePolicies = ['Insurance Included', 'Unlimited Mileage', 'No Deposit'];
  supportedLanguages = [
    { id: 1, name: 'English' },
    { id: 2, name: 'Arabic' },
    { id: 3, name: 'French' }
  ];
  countries: { id: number; name: string }[] = [];
  governorates: { id: number; name: string }[] = [];
  egyptGovernorates: { governateId: number; governateName: string }[] = [];
  private countriesMap: { [countryId: string]: CountryWithGovernates } = {};

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private router: Router
  ) {
    this.carRentalForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      phone: ['', [Validators.required]],
      gender: [Gender.UNSPECIFIED, Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      governorateId: [null, Validators.required],
      countryId: [null, Validators.required],
      dateOfBirth: ['', Validators.required],
      assetName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(250)]],
      assetDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      assetEmail: ['', [Validators.required, Validators.email]],
      locationDescription: ['', Validators.required],
      assetGovernorateId: [null, Validators.required],
      latitude: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      facilities: this.fb.array([], { validators: [Validators.required, Validators.minLength(1)] }),
      fuelTypes: this.fb.array([], { validators: [Validators.required, Validators.minLength(1)] }),
      models: this.fb.array([], { validators: [Validators.required, Validators.minLength(1)] }),
      transmission: [TransmissionType.MANUAL, Validators.required],
      rentalPolicies: this.fb.array([], { validators: [Validators.required, Validators.minLength(1)] }),
      languagesSupported: this.fb.array([], { validators: [Validators.required, Validators.minLength(1)] }),
      verificationNotes: [''],
      assetType: [ProviderType.CAR_RENTAL, Validators.required],
      openingTime: this.fb.group({
        hour: [8, [Validators.required, Validators.min(0), Validators.max(23)]],
        minute: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
        second: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      }),
      closingTime: this.fb.group({
        hour: [20, [Validators.required, Validators.min(0), Validators.max(23)]],
        minute: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
        second: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
      }),
      starRating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    }, {
      validators: [this.passwordMatchValidator, this.openingClosingTimeValidator]
    });

    // Initialize with default values to prevent empty arrays
    this.addDefaultArrayValues();
  }

  ngOnInit(): void {
    this.superAdminService.getCountriesAndGovernates().subscribe({
      next: (response: CountriesGovernatesResponse) => {
        this.countriesMap = response.data;
        this.countries = Object.values(this.countriesMap).map(c => ({ id: c.countryId, name: c.countryName }));
        // Egypt is countryId: 1
        const egypt = this.countriesMap[1];
        this.egyptGovernorates = egypt ? Object.values(egypt.governates) : [];
      },
      error: () => {
        this.apiError = 'Failed to load countries and governates.';
      }
    });

    this.carRentalForm.get('countryId')?.valueChanges.subscribe((countryId: number) => {
      this.updateGovernorates(countryId);
    });
  }

  private updateGovernorates(countryId: number) {
    if (!countryId || !this.countriesMap[countryId]) {
      this.governorates = [];
      this.carRentalForm.patchValue({ governorateId: null });
      return;
    }
    const govObj = this.countriesMap[countryId].governates;
    this.governorates = Object.values(govObj).map(g => ({ id: g.governateId, name: g.governateName }));
    this.carRentalForm.patchValue({ governorateId: null });
  }

  // Add default values to all array controls
  private addDefaultArrayValues() {
    this.updateArrayControl('models', 'Sedan', { target: { checked: true } } as any, true);
    this.updateArrayControl('fuelTypes', FuelType.GASOLINE, { target: { checked: true } } as any, true);
    this.updateArrayControl('facilities', '24/7 Support', { target: { checked: true } } as any, true);
    this.updateArrayControl('rentalPolicies', 'Insurance Included', { target: { checked: true } } as any, true);
    this.updateArrayControl('languagesSupported', 1, { target: { checked: true } } as any, true);
  }

  // Password match validator
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value 
      ? null 
      : { passwordMismatch: true };
  }

  private openingClosingTimeValidator(form: FormGroup) {
    const opening = form.get('openingTime')?.value;
    const closing = form.get('closingTime')?.value;
    if (!opening || !closing) return null;
    const openingMinutes = opening.hour * 60 + opening.minute;
    const closingMinutes = closing.hour * 60 + closing.minute;
    return closingMinutes > openingMinutes ? null : { closingBeforeOpening: true };
  }

  // Helper to convert time object to 'HH:mm:ss' string
  private toTimeString(time: { hour: number, minute: number, second: number }): string {
    return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}:${String(time.second).padStart(2, '0')}`;
  }

  // Getter methods for form arrays
  get facilitiesArray(): FormArray {
    return this.carRentalForm.get('facilities') as FormArray;
  }

  get fuelTypesArray(): FormArray {
    return this.carRentalForm.get('fuelTypes') as FormArray;
  }

  get modelsArray(): FormArray {
    return this.carRentalForm.get('models') as FormArray;
  }

  get rentalPoliciesArray(): FormArray {
    return this.carRentalForm.get('rentalPolicies') as FormArray;
  }

  get languagesSupportedArray(): FormArray {
    return this.carRentalForm.get('languagesSupported') as FormArray;
  }

  getFormControl(controlName: string): FormControl {
    return this.carRentalForm.get(controlName) as FormControl;
  }

  onSubmit() {
    this.apiError = null;
    if (this.carRentalForm.valid) {
      this.isLoading = true;
      const formValue = this.carRentalForm.value;
      const country = this.countriesMap[formValue.countryId];
      const governate = country?.governates[formValue.governorateId];
      // Prepare the complete payload with all required properties
      const providerData: Omit<CarRentalProvider, keyof UserBase | "assetId"> = {
        assetName: formValue.assetName,
        assetDescription: formValue.assetDescription,
        assetEmail: formValue.assetEmail,
        locationDescription: formValue.locationDescription,
        latitude: formValue.latitude,
        longitude: formValue.longitude,
        facilities: formValue.facilities || [],
        verificationNotes: formValue.verificationNotes,
        verificationStatus: AssetStatus.PENDING,
        languagesSupported: formValue.languagesSupported || [],
        assetType: ProviderType.CAR_RENTAL,
        openingTime: this.toTimeString(formValue.openingTime),
        closingTime: this.toTimeString(formValue.closingTime),
        fuelTypes: formValue.fuelTypes || [],
        models: formValue.models || [],
        transmission: Number(formValue.transmission),
        rentalPolicies: formValue.rentalPolicies || [],
        assetGovernorateId: Number(formValue.assetGovernorateId),
        assetGovernateName: governate?.governateName,
        countryId: Number(formValue.countryId),
        countryName: country?.countryName,
        assetImages: [],
        starRating: formValue.starRating
      };
      const fullPayload = {
        email: formValue.email,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phone: formValue.phone,
        gender: Number(formValue.gender),
        address: formValue.address,
        city: formValue.city,
        dateOfBirth: new Date(formValue.dateOfBirth).toISOString(),
        ...providerData
      };
      this.superAdminService.addCarRentalProvider(fullPayload).subscribe({
        next: (newProvider) => {
          this.isLoading = false;
          // SweetAlert2 toast is already shown by the service
          if (newProvider?.id) {
            this.router.navigate(['/super-admin/providers/car-rentals', newProvider.id]);
          } else {
            this.router.navigate(['/super-admin/providers/car-rentals']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          // SweetAlert2 toast is already shown by the service
          this.apiError = err.userMessage || 'Failed to create provider';
        }
      });
    } else {
      this.markAllAsTouched();
      this.apiError = 'Please complete all required fields correctly.';
    }
  }

  private markAllAsTouched() {
    Object.values(this.carRentalForm.controls).forEach(control => {
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

  // Updated array control handler
  updateArrayControl(controlName: string, value: any, event: Event, isInit: boolean = false) {
    // For initialization, we don't have an event
    if (isInit) {
      const array = this.carRentalForm.get(controlName) as FormArray;
      array.push(this.fb.control(value));
      return;
    }

    const isChecked = (event.target as HTMLInputElement).checked;
    const array = this.carRentalForm.get(controlName) as FormArray;
    
    if (isChecked) {
      // Add new control to the form array
      array.push(this.fb.control(value));
    } else {
      // Find and remove the control with the matching value
      const index = array.controls.findIndex(control => control.value === value);
      if (index !== -1) {
        array.removeAt(index);
      }
    }
  }

  goBack() {
    this.router.navigate(['/super-admin/providers/car-rentals']);
  }
}