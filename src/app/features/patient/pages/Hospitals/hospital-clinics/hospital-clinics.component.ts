import { Component } from '@angular/core';
import { HospitalService } from '../../../services/Hospital.service';
import { Clinic } from '../../../models/Hospital.model';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-hospital-clinics',
  standalone: false,
  templateUrl: './hospital-clinics.component.html',
  styleUrl: './hospital-clinics.component.css'
})
export class HospitalClinicsComponent {


  clinics: Clinic[] = [];
  hospitalId : number = 1;
  constructor(private hospitalService: HospitalService , private router :Router) {}

  ngOnInit() {
    // Replace with actual hospital id as needed
    this.hospitalService.getClinicsByHospitalId(this.hospitalId).subscribe(clinics => {
      this.clinics = clinics;
    });
  }


  filteredClinics: Clinic[] = [];
  searchTerm: string = '';
  selectedSpecialists: string[] = [];

  filterClinics() {
    console.log('Filter criteria:');
    console.log('Applying filters:', this.searchTerm, this.selectedSpecialists);
    const hospitalId = 1; // Replace with actual hospital id as needed
    this.hospitalService.filterClinics(hospitalId, this.searchTerm, this.selectedSpecialists)
      .subscribe(clinics => {
        this.clinics = clinics;
      });
  }
    ViewClinicDetails(clinicId: number) 
  {
    this.router.navigate(['/Doctors'], { queryParams: { hospitalId: this.hospitalId , ClinicId : clinicId} });
  }
}
