import { Component } from '@angular/core';
import { SuperAdminService } from '../../../services/super-admin.service';
import { AddPatientRequest, Gender } from '../../../models/super-admin.model';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],
  standalone: false
})
export class AddPatientComponent {
  patientForm: ReturnType<FormBuilder['group']>;
  Gender = Gender;

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      governorateId: ['', Validators.required],
      countryId: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      height: ['', [Validators.required, Validators.min(50)]],
      weight: ['', [Validators.required, Validators.min(20)]]
    });
  }

  onSubmit() {
    if (this.patientForm.valid && this.passwordsMatch()) {
      const formValue = this.patientForm.value;
      const patientData: AddPatientRequest = {
        email: formValue.email!,
        password: formValue.password!,
        confirmPassword: formValue.confirmPassword!,
        firstName: formValue.firstName!,
        lastName: formValue.lastName!,
        phone: formValue.phone!,
        gender: parseInt(formValue.gender!) as Gender,
        address: formValue.address!,
        city: formValue.city!,
        governorateId: parseInt(formValue.governorateId!),
        countryId: parseInt(formValue.countryId!),
        dateOfBirth: formValue.dateOfBirth!,
        bloodGroup: formValue.bloodGroup!,
        height: parseInt(formValue.height!),
        weight: parseInt(formValue.weight!)
      };

      this.superAdminService.addPatient(patientData).subscribe({
        next: (newPatient) => {
          this.router.navigate(['/super-admin/patients', newPatient.id]);
        },
        error: (err) => console.error('Error adding patient:', err)
      });
    }
  }

  passwordsMatch(): boolean {
    return this.patientForm.value.password === this.patientForm.value.confirmPassword;
  }
}