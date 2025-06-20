import { Component } from '@angular/core';
import { HospitalService } from '../../../services/Hospital.service';
import { DisplayHospitals } from '../../../models/Hospital.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-display-all-hospitals',
  standalone: false,
  
  templateUrl: './display-all-hospitals.component.html',
  styleUrl: './display-all-hospitals.component.css'
})
export class DisplayAllHospitalsComponent {

  hospitals: DisplayHospitals[] = [];

  constructor(private hospitalService: HospitalService , private router: Router) {
    
  }

  ngOnInit() {
    this.hospitalService.getHospitals().subscribe((data: any[]) => {
      this.hospitals = data;
    });
    this.filterCriteria={
    name: '',
    specialty: '',
    location: ''
  };
  }

  filterCriteria = {
    name: '',
    specialty: '',
    location: ''
  };

  applyFilters() {
    console.log('Filter criteria:');
    console.log('Applying filters:', this.filterCriteria);
    this.hospitalService.filterHospitals(this.filterCriteria).subscribe((data: any[]) => {
      this.hospitals = data;
    });
  }

  ViewHospitalDetails(hospitalId: number) 
  {
    this.router.navigate(['/Clinics'], { queryParams: { hospitalId: hospitalId } });
  }

  
}
