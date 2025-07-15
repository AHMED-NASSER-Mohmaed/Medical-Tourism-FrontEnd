import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuperAdminService } from '../../../services/super-admin.service';
import { Router } from '@angular/router';
import { Gender, CountriesGovernatesResponse, CountryWithGovernates, Governate } from '../../../models/super-admin.model';

@Component({
  selector: 'app-add-patient-provider',
  templateUrl: './add-patient-provider.component.html',
  styleUrls: ['./add-patient-provider.component.css'],
  standalone: false,
})
export class AddPatientProviderComponent implements OnInit {
  patientForm: FormGroup;
  isLoading = false;
  apiError: string | null = null;

  Gender = Gender;
  countries: { id: number; name: string }[] = [];
  governorates: { id: number; name: string }[] = [];
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  private countriesMap: { [countryId: string]: CountryWithGovernates } = {};

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
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
      bloodGroup: [''],
      height: [null, [Validators.min(30), Validators.max(250)]],
      weight: [null, [Validators.min(2), Validators.max(300)]],
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  ngOnInit(): void {
    this.superAdminService.getCountriesAndGovernates().subscribe({
      next: (response: CountriesGovernatesResponse) => {
        this.countriesMap = response.data;
        this.countries = Object.values(this.countriesMap).map(c => ({ id: c.countryId, name: c.countryName }));
      },
      error: () => {
        this.apiError = 'Failed to load countries and governates.';
      }
    });

    this.patientForm.get('countryId')?.valueChanges.subscribe((countryId: number) => {
      this.updateGovernorates(countryId);
    });
  }

  private updateGovernorates(countryId: number) {
    if (!countryId || !this.countriesMap[countryId]) {
      this.governorates = [];
      this.patientForm.patchValue({ governorateId: null });
      return;
    }
    const govObj = this.countriesMap[countryId].governates;
    this.governorates = Object.values(govObj).map(g => ({ id: g.governateId, name: g.governateName }));
    this.patientForm.patchValue({ governorateId: null });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (!password || !confirmPassword) return null;
    return password.value === confirmPassword.value 
      ? null 
      : { passwordMismatch: true };
  }

  onSubmit() {
    this.apiError = null;
    if (this.patientForm.valid) {
      this.isLoading = true;
      const formValue = this.patientForm.value;
      const country = this.countriesMap[formValue.countryId];
      const governate = country?.governates[formValue.governorateId];
      const payload = {
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
        bloodGroup: formValue.bloodGroup,
        height: Number(formValue.height),
        weight: Number(formValue.weight)
      };
      this.superAdminService.addPatient(payload).subscribe({
        next: (newPatient) => {
          this.isLoading = false;
          this.router.navigate(['/super-admin/manage-accounts/patients']);
        },
        error: (err) => {
          this.isLoading = false;
          this.apiError = err.userMessage || 'Failed to create patient';
        }
      });
    } else {
      this.markAllAsTouched();
      this.apiError = 'Please complete all required fields correctly.';
    }
  }

  private markAllAsTouched() {
    Object.values(this.patientForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
} 