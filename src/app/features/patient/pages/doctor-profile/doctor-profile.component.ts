import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HospitalService } from '../../services/Hospital.service';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingService } from '../../../../shared/services/loading.service';
import { Location } from '@angular/common';
import { BreadcrumbService } from '../../../../shared/services/BreadcrumbService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-profile',
  standalone:false,
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {

  doctor: any;
  schedule: any[] = [];


  blockedDates: Set<string> = new Set();
  selectedDate: Date | null = null;
  showDateError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private hospitalService: HospitalService,
    private loadingSrv:LoadingService,
    private location: Location,
     private breadcrumbService: BreadcrumbService,
      private router: Router,
  ) { }

  ngOnInit(): void {
    const doctorId = this.route.snapshot.paramMap.get('doctorId');
    if (doctorId) {
      this.loadDoctorData(doctorId);
    }
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Doctor-List', url: '/' },
        { label: 'Doctor', url: this.router.url }
      ]);


  }

  loadDoctorData(doctorId: string): void {
    this.loadingSrv.show();
    const cachedDoctor = this.hospitalService.cachedDoctors.find(doc => doc.id === doctorId);
    let doctorDetails$;

    if (cachedDoctor) {
      doctorDetails$ = of(cachedDoctor);
    } else {
      const hospitalId = this.route.snapshot.paramMap.get('hospitalId');
      const specialtyId = this.route.snapshot.paramMap.get('specialtyId');
      if (hospitalId && specialtyId) {
        doctorDetails$ = this.hospitalService.getDoctorsForSpecialty(specialtyId, hospitalId, 1, 100, '').pipe(
          map(response => response.items.find((doc: any) => doc.id === doctorId))
        );
      } else {
        console.error('Cannot fetch doctor details: hospitalId or specialtyId is missing.');
        this.loadingSrv.hide();
        return;
      }
    }

    forkJoin({
      doctorDetails: doctorDetails$,
      doctorSchedule: this.hospitalService.getDoctorScheduleById(doctorId)
    }).subscribe({
      next: ({ doctorDetails, doctorSchedule }) => {
        this.doctor = doctorDetails;
        this.schedule = doctorSchedule;

        const allBlockedDates = doctorSchedule.flatMap(s => s.blookedDates);
        this.blockedDates = new Set(allBlockedDates);


        this.loadingSrv.hide();
      },
      error: err => {
        console.error('Error fetching doctor data:', err);
        this.loadingSrv.hide();
      }
    });
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) {
      return true;
    }

    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedDate = `${date.getFullYear()}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    return !this.blockedDates.has(formattedDate);
  }

startBookingFlow(): void {

      if (!this.selectedDate) {
      this.showDateError = true;
      return;
    }

    this.showDateError = false;
  Swal.fire({
    title: 'Need a Place to Stay?',
    text: "We can help you find the best hotels near the hospital.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#aaa',
    confirmButtonText: '🏨 Yes, find a hotel!',
    cancelButtonText: 'Skip'
  }).then((result) => {
    if (result.isConfirmed) {
      const breadcrumbs = this.breadcrumbService.getBreadcrumbs();
      this.breadcrumbService.setPendingBreadcrumbTrail(breadcrumbs);
      this.router.navigate(['/hotels']);
    } else {
      this.promptForCar();
    }
  });
}

private promptForCar(): void {
  Swal.fire({
    title: 'Need a Ride?',
    text: "We can arrange for a rental car for your convenience.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#aaa',
    confirmButtonText: '🚗 Yes, rent a car!',
    cancelButtonText: 'Skip'
  }).then((result) => {
    if (result.isConfirmed) {
      this.router.navigate(['/car-rentals']);
    } else {
      this.router.navigate(['/payment']);
    }
  });
}

}
