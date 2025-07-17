import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DoctorService } from '../../../Services/Doctor.service';
import { DoctorCreateDto } from '../../../models/doctor.model';
import { CountryGovernoratesDTO, GovernorateDTO } from '../../../models/location.model';
import { Specialty } from '../../../models/specialist.model';
import { LocationService } from '../../../Services/location.service';
import { SpecialistService } from '../../../Services/specilaist.service';
import { Location } from '@angular/common';

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
  doctorId: string | null = null; // To hold the doctor ID in edit mode
  isLoading:boolean=false;
  // These should be populated from your API
  hospitalSpecialties: Specialty[] = [];
  countriesData: { [key: number]: CountryGovernoratesDTO } = {};
  governorates: GovernorateDTO[] = [];
  countries: { id: number; name: string }[] = [];
  image:string = '';
  license:string = '';
  isfailed:boolean=false;
  isSuccess:boolean=false;
  messageError:string="";
  successMessage:string="";



  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private locationService: LocationService,
    private specialtyService: SpecialistService,
    private router: Router,
    private location: Location,
  ) {
    this.doctorForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', Validators.required],
      FirstName: ['', [Validators.required, Validators.minLength(2)]],
      LastName: ['', [Validators.required, Validators.minLength(2)]],
      Phone: ['', Validators.required],
      Gender: ['', Validators.required],
      Address: ['', Validators.required],
      City: ['', Validators.required],
      GovernorateId: [null, Validators.required],
      CountryId: [null, Validators.required],
      DateOfBirth: ['', Validators.required],
      MedicalLicenseNumber: [''],
      YearsOfExperience: [0],
      Bio: [''],
      Qualification: [''],
      HospitalSpecialtyId: [null, Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {

    if (!this.router.url.includes('add'))
      {
         this.isLoading = true;
         this.loadDoctor()
      }





    this.specialtyService.getAllSpecialists().subscribe({
      next: (specialties) => {
      this.hospitalSpecialties = specialties.items.filter((specialty: Specialty) => specialty.status === 1);
      console.log('Specialties loaded:', this.hospitalSpecialties);
      },
      error: (err) => {
      console.error('Error loading specialties', err);
      }
    });
    this.getCountries();
    }

    passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  loadDoctor()
  {


       this.isEditMode = true;
     this.doctorId = this.router.url.split('/').pop()!;
      console.log('Edit mode for doctor ID:', this.doctorId);

      this.doctorService.getDoctorById(this.doctorId!).subscribe({
        next: (doctor) => {
          this.doctorForm.patchValue({
            Email: doctor.email,
            FirstName: doctor.firstName,
            LastName: doctor.lastName,
            Phone: doctor.phone,
            Gender: doctor.gender,
            Address: doctor.address,
            GovernorateId: doctor.governorateId,
            CountryId: doctor.countryId,
            DateOfBirth: doctor.dateOfBirth.split('T')[0], // Convert to date string
            MedicalLicenseNumber: doctor.medicalLicenseNumber,
            YearsOfExperience: doctor.yearsOfExperience,
            Bio: doctor.bio,
            Qualification: doctor.qualification,
            HospitalSpecialtyId: doctor.specialtyId

          });
          this.image = doctor.imageURL || '';
          this.license = doctor.medicalLicenseNumber || '';
          console.log('Doctor data loaded:', doctor);
        },
        error: (err) => {
          console.error('Error loading doctor data', err);
        }
      });
      this.isLoading=false
  }

  getCountries() {
    console.log('Loading countries...');
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
  updateDoctor(): void {
    this.isLoading=true
    const formValues = { ...this.doctorForm.value };

    delete formValues.Password;
    delete formValues.ConfirmPassword;
    delete formValues.MedicalLicenseNumber;
    if (formValues.Phone) {
      formValues.PhoneNumber = formValues.Phone;
      delete formValues.Phone;
  }
    console.log("formValues",formValues)

    const formData = new FormData();

    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });

    if (this.LiscenseFile) {
      formData.append('licenseDocumentFile', this.LiscenseFile);
    }
    if (this.imageFile) {
      formData.append('profileImageFile', this.imageFile);
    }
    console.log("formData",formData);

          console.log(this.doctorForm)
          for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      this.isLoading=true
    this.doctorService.updateDoctor(this.doctorId!,formData).subscribe({
      next: (response) => {
        this.isLoading=false
        this.isSuccess=true;

        console.log(this.isSuccess)
        this.successMessage="doctor Created Succefully"
      },
      error: (error) => {
        this.isfailed=true;
        this.isLoading=false
        this.messageError="please enter a valid data"
        console.log(this.messageError)
        console.error('Error updating doctor', error);
      }
      });
      this.isLoading=false
    }

  onSubmit(): void {

   if( this.isEditMode) {
      this.updateDoctor();
      return;
    } else {
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
     this.isSuccess=false;
     this.isLoading=true;
    this.doctorService.createDoctor(formData).subscribe({
      next: (response) => {
        this.isLoading=false
        this.isSuccess=true;

        console.log(this.isSuccess)
        this.successMessage="doctor Created Succefully"

        // Handle success

        console.log('Doctor created successfully', response);
      },
      error: (error) => {
        // Handle error
        this.isLoading=false
        this.isfailed=true;

        this.messageError=error;
        console.error('Error creating doctor', error);
      }
    });

  }

  }
  closeError()
  {
    this.isfailed=false;
  }
  CloseSuccessCreaate()
  {
    this.isSuccess=false;
   this.router.navigate(['/hospitalProvider/doctors']);
  }
  goBack(): void {
  this.location.back();
}

}
