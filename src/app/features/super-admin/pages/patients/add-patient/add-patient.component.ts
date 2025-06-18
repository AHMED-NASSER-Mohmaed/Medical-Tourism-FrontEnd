import { Component } from '@angular/core';
import { SuperAdminService } from '../../../services/super-admin.service';
import { Patient } from '../../../models/super-admin.model';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css'],
  standalone: false
})
export class AddPatientComponent {
  patientForm;

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private router: Router
  ) {
    this.patientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      height: ['', Validators.required],
      weight: ['', Validators.required],
      // Add other patient fields as needed
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.superAdminService.addPatient(this.patientForm.value).subscribe({
        next: (newPatient: Patient) => {
          this.router.navigate(['/super-admin/patients', newPatient.id]);
        },
        error: (err) => console.error('Error adding patient:', err)
      });
    }
  }
}