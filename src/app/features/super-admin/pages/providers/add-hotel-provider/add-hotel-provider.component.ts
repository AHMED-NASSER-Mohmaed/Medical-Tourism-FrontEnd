// add-hotel-provider.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { SuperAdminService } from '../../../services/super-admin.service';
import { 
  Gender,
  ProviderType,
  AssetStatus,
  TimeObject,
  CountriesGovernatesResponse,
  CountryWithGovernates
} from '../../../models/super-admin.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-hotel-provider',
  templateUrl: './add-hotel-provider.component.html',
  styleUrls: ['./add-hotel-provider.component.css'],
  standalone: false, // This component is not standalone, it uses Angular's FormsModule and ReactiveFormsModule
})
export class AddHotelProviderComponent implements OnInit {
  hotelForm: FormGroup;
  isLoading = false;
  apiError: string | null = null;
  egyptGovernorates: { governateId: number; governateName: string }[] = [];
  
  // Enums
  Gender = Gender;
  
  // For the form
  supportedLanguages = [
    { id: 1, name: 'English' },
    { id: 2, name: 'Arabic' },
    { id: 3, name: 'French' }
  ];
  countries: { id: number; name: string }[] = [];
  governorates: { id: number; name: string }[] = [];
  facilitiesList = ['WiFi', 'Parking', 'Spa', 'Gym', 'Bar', 'Room Service'];

  private countriesMap: { [countryId: string]: CountryWithGovernates } = {};

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private router: Router
  ) {
    this.hotelForm = this.fb.group({
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
      verificationNotes: [''],
      languagesSupported: this.fb.array([], { validators: [Validators.required, Validators.minLength(1)] }),
      assetType: [ProviderType.HOTEL, Validators.required],
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
      starRating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      hasPool: [false],
      hasRestaurant: [false],
      nationalDocsURL: [''],
      credentialDocURL: [''],
    }, {
      validators: [this.passwordMatchValidator, this.openingClosingTimeValidator]
    });

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
        this.updateCountryControlState();
      },
      error: () => {
        this.apiError = 'Failed to load countries and governates.';
        this.updateCountryControlState();
      }
    });

    this.hotelForm.get('countryId')?.valueChanges.subscribe((countryId: number) => {
      this.updateGovernorates(countryId);
      this.updateGovernorateControlState();
    });
    this.updateCountryControlState();
    this.updateGovernorateControlState();
  }

  private updateGovernorates(countryId: number) {
    if (!countryId || !this.countriesMap[countryId]) {
      this.governorates = [];
      this.hotelForm.patchValue({ governorateId: null });
      return;
    }
    const govObj = this.countriesMap[countryId].governates;
    this.governorates = Object.values(govObj).map(g => ({ id: g.governateId, name: g.governateName }));
    this.hotelForm.patchValue({ governorateId: null });
  }

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

  // Helper to convert time object to 'HH:mm:ss' string
  private toTimeString(time: { hour: number, minute: number, second: number }): string {
    return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}:${String(time.second).padStart(2, '0')}`;
  }

  onSubmit() {
    this.apiError = null;
    if (this.hotelForm.valid) {
      this.isLoading = true;
      const formValue = this.hotelForm.value;
      const country = this.countriesMap[formValue.countryId];
      const governate = country?.governates[formValue.governorateId];
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
        governorateName: governate?.governateName,
        countryId: Number(formValue.countryId),
        countryName: country?.countryName,
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
        openingTime: this.toTimeString(formValue.openingTime),
        closingTime: this.toTimeString(formValue.closingTime),
        nationalDocsURL: formValue.nationalDocsURL,
        credentialDocURL: formValue.credentialDocURL,
        starRating: formValue.starRating,
        hasPool: formValue.hasPool,
        hasRestaurant: formValue.hasRestaurant,
        assetGovernorateId: Number(formValue.assetGovernorateId),
        assetGovernateName: governate?.governateName,
        assetImages: []
      };
      this.superAdminService.addHotelProvider(payload).subscribe({
        next: (newHotel) => {
          this.isLoading = false;
          // SweetAlert2 toast is already shown by the service
          if (newHotel?.id) {
            this.router.navigate(['/super-admin/providers/hotels', newHotel.id]);
          } else {
            this.router.navigate(['/super-admin/providers/hotels']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          // SweetAlert2 toast is already shown by the service
          this.apiError = err.userMessage || 'Failed to create hotel provider';
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

  private updateCountryControlState() {
    const control = this.hotelForm.get('countryId');
    if (!this.countries || this.countries.length === 0 || this.isLoading) {
      control?.disable({ emitEvent: false });
    } else {
      control?.enable({ emitEvent: false });
    }
  }

  private updateGovernorateControlState() {
    const control = this.hotelForm.get('governorateId');
    if (!this.governorates || this.governorates.length === 0 || !this.hotelForm.get('countryId')?.value || this.isLoading) {
      control?.disable({ emitEvent: false });
    } else {
      control?.enable({ emitEvent: false });
    }
  }
}