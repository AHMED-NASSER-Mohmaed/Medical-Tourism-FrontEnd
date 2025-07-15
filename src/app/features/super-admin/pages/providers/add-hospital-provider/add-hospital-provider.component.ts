import { Component, OnInit } from '@angular/core';
import { SuperAdminService } from '../../../services/super-admin.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { faHospital } from '@fortawesome/free-solid-svg-icons';
import { AssetStatus, CountriesGovernatesResponse, CountryWithGovernates } from '../../../models/super-admin.model';

@Component({
  selector: 'app-add-hospital-provider',
  templateUrl: './add-hospital-provider.component.html',
  styleUrls: ['./add-hospital-provider.component.css'],
  standalone: false
})
export class AddHospitalProviderComponent implements OnInit {
  faHospital = faHospital;

  hospitalForm: FormGroup;

  availableFacilities = ['ICU', 'Radiology', 'Pharmacy', 'Laboratory', 'Surgery'];
  availableLanguages = [
    { id: 1, name: 'English' },
    { id: 2, name: 'Arabic' },
    { id: 3, name: 'French' }
  ];
  countries: { id: number; name: string }[] = [];
  governorates: { id: number; name: string }[] = [];
  isLoading = false;
  apiError: string | null = null;

  private countriesMap: { [countryId: string]: CountryWithGovernates } = {};
  egyptGovernorates: { governateId: number; governateName: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private router: Router
  ) {
    this.hospitalForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      phone: ['', [Validators.required]],
      gender: [0, Validators.required],
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
      numberOfDepartments: [1, [Validators.required, Validators.min(1)]],
      emergencyServices: [false, Validators.required],
      facilities: this.fb.array([], { validators: [Validators.required, Validators.minLength(1)] }),
      verificationNotes: [''],
      languagesSupported: this.fb.array([], { validators: [Validators.required, Validators.minLength(1)] }),
      assetType: [1, Validators.required],
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
    }, {
      validators: [this.passwordMatchValidator, this.openingClosingTimeValidator]
    });
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
    this.hospitalForm.get('countryId')?.valueChanges.subscribe((countryId: number) => {
      this.updateGovernorates(countryId);
    });
  }

  private updateGovernorates(countryId: number) {
    if (!countryId || !this.countriesMap[countryId]) {
      this.governorates = [];
      this.hospitalForm.patchValue({ governorateId: null });
      return;
    }
    const govObj = this.countriesMap[countryId].governates;
    this.governorates = Object.values(govObj).map(g => ({ id: g.governateId, name: g.governateName }));
    this.hospitalForm.patchValue({ governorateId: null });
  }

  get facilities(): FormArray {
    return this.hospitalForm.get('facilities') as FormArray;
  }

  get languagesSupported(): FormArray {
    return this.hospitalForm.get('languagesSupported') as FormArray;
  }

  addFacility(): void {
    this.facilities.push(this.fb.control('', Validators.required));
  }

  removeFacility(index: number): void {
    if (this.facilities.length > 1) {
      this.facilities.removeAt(index);
    }
  }

  onLanguageChange(event: any, langId: number): void {
    if (event.target.checked) {
      this.languagesSupported.push(this.fb.control(langId));
    } else {
      const idx = this.languagesSupported.controls.findIndex(c => c.value === langId);
      if (idx !== -1) this.languagesSupported.removeAt(idx);
    }
  }

  goBack(): void {
    this.router.navigate(['/super-admin/manage-accounts']);
  }

  // Helper to convert time object to 'HH:mm:ss' string
  private toTimeString(time: { hour: number, minute: number, second: number }): string {
    return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}:${String(time.second).padStart(2, '0')}`;
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private openingClosingTimeValidator(form: FormGroup) {
    const opening = form.get('openingTime')?.value;
    const closing = form.get('closingTime')?.value;
    if (!opening || !closing) return null;
    const openingMinutes = opening.hour * 60 + opening.minute;
    const closingMinutes = closing.hour * 60 + closing.minute;
    return closingMinutes > openingMinutes ? null : { closingBeforeOpening: true };
  }

  onSubmit(): void {
    if (this.hospitalForm.valid) {
      // Final check: ensure selected governorateId is valid
      const selectedGovId = this.hospitalForm.get('governorateId')?.value;
      if (!this.governorates.some(g => g.id === selectedGovId)) {
        this.apiError = 'Selected governorate is not valid. Please choose a valid governorate.';
        return;
      }
      const formValue = this.hospitalForm.value;
      const country = this.countriesMap[formValue.countryId];
      const governate = country?.governates[formValue.governorateId];
      const payload = {
        email: formValue.email,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phone: formValue.phone,
        gender: formValue.gender,
        address: formValue.address,
        city: formValue.city,
        countryId: formValue.countryId,
        countryName: country?.countryName,
        dateOfBirth: formValue.dateOfBirth,
        assetName: formValue.assetName,
        assetDescription: formValue.assetDescription,
        assetEmail: formValue.assetEmail,
        locationDescription: formValue.locationDescription,
        latitude: Number(formValue.latitude),
        longitude: Number(formValue.longitude),
        numberOfDepartments: Number(formValue.numberOfDepartments),
        emergencyServices: formValue.emergencyServices,
        facilities: formValue.facilities,
        verificationNotes: formValue.verificationNotes,
        languagesSupported: formValue.languagesSupported,
        assetType: 0,
        openingTime: this.toTimeString(formValue.openingTime),
        closingTime: this.toTimeString(formValue.closingTime),
        verificationStatus:  AssetStatus.APPROVED,
        assetGovernorateId: Number(formValue.assetGovernorateId),
        assetGovernateName: governate?.governateName,
        assetImages: []
      };
      this.superAdminService.addHospitalProvider(payload).subscribe({
        next: (newHospital) => {
          if (newHospital?.id) {
            this.router.navigate(['/super-admin/providers/hospitals', newHospital.id]);
          } else {
            this.router.navigate(['/super-admin/providers/hospitals']);
          }
        },
        error: (err) => {
          this.apiError = err.userMessage || 'Failed to create hospital provider';
        }
      });
    }
  }
}
