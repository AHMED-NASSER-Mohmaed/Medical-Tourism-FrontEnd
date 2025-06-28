import { Component } from '@angular/core';
import { SuperAdminService } from '../../../services/super-admin.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';
import { faHospital } from '@fortawesome/free-solid-svg-icons';
import { AssetStatus } from '../../../models/super-admin.model';

@Component({
  selector: 'app-add-hospital-provider',
  templateUrl: './add-hospital-provider.component.html',
  styleUrls: ['./add-hospital-provider.component.css'],
  standalone: false
})
export class AddHospitalProviderComponent {
  faHospital = faHospital;

  hospitalForm: FormGroup;

  availableFacilities = ['ICU', 'Radiology', 'Pharmacy', 'Laboratory', 'Surgery'];
  availableLanguages = [
    { id: 1, name: 'English' },
    { id: 2, name: 'Arabic' },
    { id: 3, name: 'French' }
  ];
  countries = [
    { id: 1, name: 'Egypt' },
    { id: 2, name: 'Saudi Arabia' }
  ];
  governorates = [
    { id: 1, name: 'Cairo' },
    { id: 2, name: 'Giza' }
  ];

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private router: Router
  ) {
    this.hospitalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      gender: [0, Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      countryId: [1, Validators.required],
      governorateId: [1, Validators.required],

      assetName: ['', Validators.required],
      assetDescription: ['', Validators.required],
      assetEmail: ['', [Validators.required, Validators.email]],
      locationDescription: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      numberOfDepartments: [1, [Validators.required, Validators.min(1)]],
      emergencyServices: [false, Validators.required],
      facilities: this.fb.array([this.fb.control('', Validators.required)]),
      verificationNotes: ['', Validators.required],
      languagesSupported: this.fb.array([], Validators.required),

      hasEmergencyRoom: [false],
      isTeachingHospital: [false],

      openingTime: this.fb.group({
        hour: [8, [Validators.required, Validators.min(0), Validators.max(23)]],
        minute: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
        second: [0],
        millisecond: [0]
      }),
      closingTime: this.fb.group({
        hour: [20, [Validators.required, Validators.min(0), Validators.max(23)]],
        minute: [0, [Validators.required, Validators.min(0), Validators.max(59)]],
        second: [0],
        millisecond: [0]
      })
    });
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

  onSubmit(): void {
    if (this.hospitalForm.valid) {
      const formValue = this.hospitalForm.value;

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
        governorateId: formValue.governorateId,
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
        openingTime: formValue.openingTime,
  closingTime: formValue.closingTime,
  verificationStatus:  AssetStatus.APPROVED
      };

      this.superAdminService.addHospitalProvider(payload).subscribe({
        next: (newHospital) => {
          this.router.navigate(['/super-admin/providers/hospitals', newHospital.id]);
        },
        error: (err) => console.error('Error adding hospital:', err)
      });
    }
  }
}
