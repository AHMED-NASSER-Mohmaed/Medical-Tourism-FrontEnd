import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/Hospital.service';
import { Router } from '@angular/router';
import { CountryService } from '../../../../../auth/services/country.service';

@Component({
  selector: 'app-display-all-hospitals',
  standalone:false,
  templateUrl: './display-all-hospitals.component.html',
  styleUrls: ['./display-all-hospitals.component.css']
})
export class DisplayAllHospitalsComponent implements OnInit {
  specialties: any[] = [];
  filterCriteria = {
    name: '',
    specialty: '',
    location: 0  // Represents governorateId
  };
  pageNumber: number = 1;
  pageSize: number = 10;
   totalPages: number = 1;
  hospitals: any[] = [];
  governorates: any[] = [];

  constructor(private hospitalService: HospitalService, private router: Router, private countryService: CountryService) {}

  ngOnInit() {
    this.loadSpecialties();
    this.loadHospitals();
    this.loadGovernorates();
  }

  // Fetch specialties from the API
  loadSpecialties() {
    this.hospitalService.getSpecialties().subscribe(
      (specialties) => {
        console.log('Specialties loaded:', specialties);
        this.specialties = specialties; // Now we have an array of specialties
      },
      (error) => {
        console.error('Error fetching specialties:', error);
      }
    );
  }

  // Fetch hospitals with filter criteria
loadHospitals() {
  console.log('Loading hospitals with filters:', this.filterCriteria);

  // Convert specialty to a number, or pass undefined if it's empty or invalid
  const specialtyId = this.filterCriteria.specialty ? Number(this.filterCriteria.specialty) : undefined;

  // Pass the individual filter parameters
  this.hospitalService.getHospitals(
    this.pageNumber,
    this.pageSize,
    this.filterCriteria.name,
    specialtyId,  // Pass specialtyId (undefined if no specialty is selected)
    this.filterCriteria.location || 0  // Pass governorateId
  ).subscribe(
    (data: any) => {
      console.log('Hospitals loaded:', data);
      this.hospitals = data?.items || [];
      // Update the pagination if needed
      this.totalPages = data.totalPages;  // Update total pages
    },
    (error) => {
      console.error('Error fetching hospitals:', error);
    }
  );
}

onPageChange(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.pageNumber = page;
  this.loadHospitals();
}


  // View details for a hospital
  ViewHospitalDetails(hospitalId: string) {
    // Navigate to hospital details page
    this.router.navigate(['/hospital-details', hospitalId]);
  }

  // Apply the filter to the list of hospitals
  applyFilters() {
    console.log('Applying filters:', this.filterCriteria);
    this.loadHospitals(); // Re-fetch hospitals with the updated filters
  }

  // Fetch governorates for Egypt (countryId = 1)
  loadGovernorates() {
    this.countryService.getCountries().subscribe(
      (data) => {
        // Get governorates for Egypt (countryId = 1)
        const egyptGovernorates = data.countryMap.get(1)?.governorates || [];
        this.governorates = egyptGovernorates;
        console.log('Egypt Governorates:', this.governorates);
      },
      (error) => {
        console.error('Error fetching governorates:', error);
      }
    );
  }
}
