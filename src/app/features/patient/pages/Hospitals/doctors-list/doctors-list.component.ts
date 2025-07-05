import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../../../shared/services/loading.service';
import { HospitalService } from '../../../services/Hospital.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-doctors-list',
  standalone: false,
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.css']
})
export class DoctorsListComponent implements OnInit {
  hospitalId: string | null = null;
  specialtyId: string | null = null;
  filterCriteria = {
    name: ''
  };
  doctors: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 8;
  totalPages: number = 1;



  constructor(
    private route: ActivatedRoute,
    private hospitalService: HospitalService,
    private loadingService: LoadingService,
     private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
        console.log("Params:", params);
      this.hospitalId = params.get('hospitalId');
      this.specialtyId = params.get('specialtyId');
      console.log("Hospital ID:", this.hospitalId);
    console.log("Specialty ID:", this.specialtyId);
      this.loadDoctors();
    });
  }


  loadDoctors(): void {
    this.loadingService.show();

    if (this.hospitalId && this.specialtyId) {
      this.hospitalService.getDoctorsForSpecialty(
        this.specialtyId, this.hospitalId, this.pageNumber, this.pageSize, this.filterCriteria.name
      ).subscribe(
        (data: any) => {
          this.doctors = data.items;
          this.totalPages = data.totalPages;
          this.loadingService.hide();
        },
        (error) => {
          console.error('Error fetching doctors:', error);
          this.loadingService.hide();
        }
      );
    }
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.loadDoctors();
  }

  applyFilters(): void {
    this.pageNumber = 1;
    this.loadDoctors();
  }
    goBack(): void {
    this.location.back();
  }
}
