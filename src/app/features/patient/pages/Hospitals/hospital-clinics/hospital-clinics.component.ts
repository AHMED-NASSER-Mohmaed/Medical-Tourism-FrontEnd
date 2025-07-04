import { Component } from '@angular/core';
import { HospitalService } from '../../../services/Hospital.service';
import { Clinic } from '../../../models/Hospital.model'; // Ensure Clinic model is imported

@Component({
  selector: 'app-hospital-clinics',
  standalone: false,
  templateUrl: './hospital-clinics.component.html',
  styleUrls: ['./hospital-clinics.component.css']
})
export class HospitalClinicsComponent {

  clinics: Clinic[] = [];
  searchTerm: string = '';
  selectedSpecialists: string[] = [];

  constructor(private hospitalService: HospitalService) {}

  ngOnInit() {
    // Fetch clinics for a specific hospital ID
    const hospitalId = '1';  // Use the actual hospitalId
    this.hospitalService.getClinicsByHospitalId(hospitalId).subscribe((clinics: Clinic[]) => {
      this.clinics = clinics;
      console.log('Clinics:', this.clinics);
    });
  }

  // Define the toggleSpecialist method
  toggleSpecialist(specialty: string) {
    const index = this.selectedSpecialists.indexOf(specialty);
    if (index === -1) {
      // If the specialty is not already selected, add it to the list
      this.selectedSpecialists.push(specialty);
    } else {
      // If the specialty is already selected, remove it
      this.selectedSpecialists.splice(index, 1);
    }
    console.log('Selected Specialists:', this.selectedSpecialists);
    // You can call filterClinics() to update the list based on the selected specialties
    this.filterClinics();
  }

  // Define the filterClinics method to apply selected specialties
  filterClinics() {
    const hospitalId = '1';  // Use the actual hospitalId
    this.hospitalService.filterClinics(hospitalId, this.searchTerm, this.selectedSpecialists).subscribe((filteredClinics: Clinic[]) => {
      this.clinics = filteredClinics;
      console.log('Filtered Clinics:', this.clinics);
    });
  }

  // Define the ViewClinicDetails method
  ViewClinicDetails(clinicId: string) {
    // Navigate or show details for the selected clinic
    console.log('Viewing details for clinic:', clinicId);
    // Add your navigation or modal logic here
  }
}
