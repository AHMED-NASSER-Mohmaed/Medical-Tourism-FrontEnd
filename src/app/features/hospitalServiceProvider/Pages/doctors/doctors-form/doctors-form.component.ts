import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../Services/Doctor.service';
import { DoctorCreateDto } from '../../../models/doctor.model';
import { CountryGovernoratesDTO, GovernorateDTO } from '../../../models/location.model';
import { Specialty } from '../../../models/specialist.model';
import { LocationService } from '../../../Services/location.service';
import { SpecialistService } from '../../../Services/specilaist.service';

@Component({
  selector: 'app-doctors-form',
  standalone: false,
  templateUrl: './doctors-form.component.html',
  styleUrl: './doctors-form.component.css'
})
export class DoctorsFormComponent {
   doctorForm: FormGroup;
  isEditMode = false;
  LiscenseFile: File | null = null;
  imageFile: File | null = null;

  
  // These should be populated from your API
  hospitalSpecialties: Specialty[] = [];
  countriesData: { [key: number]: CountryGovernoratesDTO } = {};
  governorates: GovernorateDTO[] = [];
  countries: { id: number; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private locationService: LocationService,
    private specialtyService: SpecialistService,
  ) {
    this.doctorForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      governorateId: [null, Validators.required],
      countryId: [null, Validators.required],
      dateOfBirth: ['', Validators.required],
      medicalLicenseNumber: [''],
      yearsOfExperience: [0],
      bio: [''],
      qualification: [''],
      hospitalSpecialtyId: [null, Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    
   this.locationService.getCountriesWithGovernorates().subscribe({
    next: (response) => {
      // 1. Safely store the original data
      this.countriesData = response?.data || {};
      console.log('Countries data loaded:', this.countriesData);
      
      // 2. Create countries list with null check
      this.countries = Object.keys(this.countriesData)
        .filter(key => this.countriesData[+key] != null)
        .map(key => {
          const country = this.countriesData[+key];
          return {
            id: country.countryId,
            name: country.countryName
          };
        });

      // 3. Safely flatten all governorates
      
      console.log('Loaded countries:', this.countries);
      console.log('All governorates:', this.governorates);
    },
    error: (err) => {
      console.error('Failed to load data:', err);
      // Consider showing user feedback here
    }
  });



    this.specialtyService.getAllSpecialists().subscribe({
      next: (specialties) => {
      this.hospitalSpecialties = specialties.items.filter((specialty: Specialty) => specialty.status === 1);
      console.log('Specialties loaded:', this.hospitalSpecialties);
      },
      error: (err) => {
      console.error('Error loading specialties', err);
      }
    });
    }

    passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }
  getgovernorates() {
  const countryId = this.doctorForm.get('countryId')?.value;
  
  // Clear previous governorates selection
  this.governorates = [];
  this.doctorForm.get('governorateId')?.setValue(null);
  
  if (countryId && this.countriesData && this.countriesData[countryId]) {
    const country = this.countriesData[countryId];
    
    console.log('Selected country:', country);
    console.log('Governorates for selected country:', country.governates);
    this.governorates =  Object.values(country.governates);
   
  }
  console.log('Available governorates:', this.governorates);
}

  onLiscenceFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.LiscenseFile = event.target.files[0];
    }
  }
  onImageFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.doctorForm.invalid || !this.LiscenseFile || !this.imageFile) {
      return;
    }

    const formData = new FormData();
   
    Object.entries(this.doctorForm.value).forEach(([key, value]) => {
  formData.append(key, value as any);
});
    formData.append('licenseDocumentFile', this.LiscenseFile);
    formData.append('profileImageFile', this.imageFile);

    console.log(this.doctorForm)
    for (let [key, value] of formData.entries()) {
  console.log(key, value);
}
    this.doctorService.createDoctor(formData).subscribe({
      next: (response) => {
        // Handle success
        console.log('Doctor created successfully', response);
      },
      error: (error) => {
        // Handle error
        console.error('Error creating doctor', error);
      }
    });
  }
}
