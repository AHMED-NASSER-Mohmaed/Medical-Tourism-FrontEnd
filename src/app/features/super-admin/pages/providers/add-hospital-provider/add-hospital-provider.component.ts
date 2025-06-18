import { Component } from '@angular/core';
import { SuperAdminService } from '../../../services/super-admin.service';
import { HospitalProvider } from '../../../models/super-admin.model';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { faHospital } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-hospital-provider',
  templateUrl: './add-hospital-provider.component.html',
  styleUrls: ['./add-hospital-provider.component.css'],
    standalone: false

})
export class AddHospitalProviderComponent {
  faHospital = faHospital;
  
  hospitalForm: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private router: Router
  ) {
    this.hospitalForm = this.fb.group({
      assetName: ['', Validators.required],
      description: ['', Validators.required],
      numberOfDepartments: [1, [Validators.required, Validators.min(1)]],
      hasEmergencyRoom: [false],
      isTeachingHospital: [false],
      emergencyServices: [false],
      assetEmail: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      locationDescription: ['']
    });
  }
 goBack() {
    this.router.navigate(['/super-admin/manage-accounts']);
    // Or navigate to previous page: this.location.back();
  }
  onSubmit() {
    if (this.hospitalForm.valid) {
      this.superAdminService.addHospitalProvider(this.hospitalForm.value).subscribe({
        next: (newHospital: HospitalProvider) => {
          this.router.navigate(['/super-admin/providers/hospitals', newHospital.id]);
        },
        error: (err) => console.error('Error adding hospital:', err)
      });
    }
  }
}