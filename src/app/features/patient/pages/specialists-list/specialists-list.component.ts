import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HospitalService } from '../../services/Hospital.service';
import { LoadingService } from '../../../../shared/services/loading.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-specialists-list',
  standalone: false,
  templateUrl: './specialists-list.component.html',
  styleUrls: ['./specialists-list.component.css']
})
export class SpecialistsListComponent implements OnInit {
  hospitalId: string | null = null;
  filterCriteria = {
    name: ''
  };
  specialists: any[] = [];
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
      this.hospitalId = params.get('id');
      this.loadSpecialists();
    });
  }


  loadSpecialists(): void {
    this.loadingService.show();

    const searchQuery = this.filterCriteria.name;

    if (this.hospitalId) {

      this.hospitalService.getSpecialistsForHospital(
        this.hospitalId, this.pageNumber, this.pageSize, searchQuery
      ).subscribe(
        (data: any) => {
          this.specialists = data.items;
          this.totalPages = data.totalPages;
          this.loadingService.hide();
        },
        (error) => {
          console.error('Error fetching specialists for hospital:', error);
          this.loadingService.hide();
        }
      );
    } else {

      this.hospitalService.getSpecialistsForSuperAdmin(
        this.pageNumber, this.pageSize, searchQuery
      ).subscribe(
        (data: any) => {
          this.specialists = data.items;
          this.totalPages = data.totalPages;
          this.loadingService.hide();
        },
        (error) => {
          console.error('Error fetching all specialties:', error);
          this.loadingService.hide();
        }
      );
    }
  }

  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.pageNumber = page;
    this.loadSpecialists();
  }

  applyFilters(): void {
    this.pageNumber = 1;
    this.loadSpecialists();
  }
      goBack(): void {
    this.location.back();
  }
}
