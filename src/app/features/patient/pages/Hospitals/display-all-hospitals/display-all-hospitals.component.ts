import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../../services/Hospital.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryService } from '../../../../../auth/services/country.service';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-display-all-hospitals',
  standalone: false,
  templateUrl: './display-all-hospitals.component.html',
  styleUrls: ['./display-all-hospitals.component.css']
})
export class DisplayAllHospitalsComponent implements OnInit {
  specialties: any[] = [];
  filterCriteria = {
    name: '',
    specialty: '',
    location: 0
  };
  pageNumber: number = 1;
  pageSize: number = 9;
  totalPages: number = 1;
  hospitals: any[] = [];
  governorates: any[] = [];
  specialistId: string | null = null;

  constructor(
    private hospitalService: HospitalService,
    private router: Router,
    private countryService: CountryService,
    private loadingService: LoadingService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
       this.activatedRoute.paramMap.subscribe(params => {
      this.specialistId = params.get('specialistId');
      console.log('Specialist ID:', this.specialistId);

      if (this.specialistId) {
        this.filterCriteria.specialty = this.specialistId;
      }
    });
    this.loadSpecialties();
    this.loadHospitals();
    this.loadGovernorates();
  }


  loadSpecialties() {
    this.hospitalService.getSpecialties().subscribe(
      (specialties) => {
        console.log('Specialties loaded:', specialties);
        this.specialties = specialties;
      },
      (error) => {
        console.error('Error fetching specialties:', error);
      }
    );
  }


loadHospitals() {
    console.log('Loading hospitals with filters:', this.filterCriteria);

    this.loadingService.show();

    const specialtyId = this.specialistId ? +this.specialistId : (this.filterCriteria.specialty ? Number(this.filterCriteria.specialty) : undefined);


    this.hospitalService.getHospitals(
      this.pageNumber,
      this.pageSize,
      this.filterCriteria.name,
      specialtyId,
      this.filterCriteria.location || 0
    ).subscribe(
      (data: any) => {
        console.log('Hospitals loaded:', data);
        this.hospitals = data?.items || [];

        this.totalPages = data.totalPages;

        this.loadingService.hide();
      },
      (error) => {
        console.error('Error fetching hospitals:', error);

        this.loadingService.hide();
      }
    );
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.loadHospitals();
  }




  applyFilters() {
    console.log('Applying filters:', this.filterCriteria);
    this.loadHospitals();
  }


  loadGovernorates() {
    this.countryService.getCountries().subscribe(
      (data) => {
        const egyptGovernorates = data.countryMap.get(1)?.governorates || [];
        this.governorates = egyptGovernorates;
        console.log('Egypt Governorates:', this.governorates);
      },
      (error) => {
        console.error('Error fetching governorates:', error);
      }
    );
  }

        goBack(): void {
    this.location.back();
  }
}
