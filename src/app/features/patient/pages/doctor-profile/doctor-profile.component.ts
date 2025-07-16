import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HospitalService } from '../../services/Hospital.service';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingService } from '../../../../shared/services/loading.service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { BookingService } from '../../services/Booking.service';

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
  workingDays: Set<number> = new Set();

  processedSchedule: { dayName: string, slots: any[] }[] = [];
  minnDate: Date;


  constructor(
    private route: ActivatedRoute,
    private hospitalService: HospitalService,
    private loadingSrv:LoadingService,
    private location: Location,
    private router: Router,
    private bookingService: BookingService ,
  ) {
    this.minnDate=new Date();
   }

  ngOnInit(): void {
    const doctorId = this.route.snapshot.paramMap.get('doctorId');

    if (doctorId) {
      this.loadDoctorData(doctorId);
    }

  }

  loadDoctorData(doctorId: string): void {
    this.loadingSrv.show();
    const cachedDoctor = this.hospitalService.cachedDoctors.find(doc => doc.id === doctorId);
    let doctorDetails$;

    if (cachedDoctor) {
      doctorDetails$ = of(cachedDoctor);
    } else {

        console.error('Cannot fetch doctor details: hospitalId or specialtyId is missing.');
        this.loadingSrv.hide();
        return;

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
        const workingDayIds = doctorSchedule.map(s => s.dayOfWeekId - 1);
        this.workingDays = new Set(workingDayIds);
        this.processScheduleForDisplay(doctorSchedule);
        this.checkAndSetPreselectedDate();

        this.loadingSrv.hide();
      },
      error: err => {
        console.error('Error fetching doctor data:', err);
        this.loadingSrv.hide();
      }
    });
  }
    checkAndSetPreselectedDate(): void {
    const bookingData = this.bookingService.getBookingData();
       console.log("bbb",bookingData);
    console.log("fff",bookingData?.specialtiyAppointment?.appointmentDate);
    const preselectedDateStr = bookingData?.specialtiyAppointment?.appointmentDate;

    if (preselectedDateStr) {
      const preselectedDate = new Date(preselectedDateStr);
      if (this.dateFilter(preselectedDate)) {
        this.selectedDate = preselectedDate;
        console.log('Pre-selected date is still available:', this.selectedDate);
      } else {
        console.warn('Previously selected date is no longer available.');
        Swal.fire({
          icon: 'warning',
          title: 'Date No Longer Available',
          text: 'The date you previously selected is no longer available. Please choose a new date.',
        });
        const currentData = this.bookingService.getBookingData();
        delete currentData.specialtyAppointment;
        this.bookingService.updateBookingData(currentData);
        this.selectedDate=null;
      }
    }
  }

  processScheduleForDisplay(schedule: any[]): void {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const grouped = schedule.reduce((acc, curr) => {
      const dayName = dayNames[curr.dayOfWeekId - 1];
      if (!acc[dayName]) {
        acc[dayName] = [];
      }
      acc[dayName].push(curr);
      return acc;
    }, {} as { [key: string]: any[] });

    this.processedSchedule = Object.keys(grouped).map(day => ({
      dayName: day,
      slots: grouped[day]
    }));
  }

  dateFilter = (date: Date | null): boolean => {
    if (!date) return true;
    const isWorkingDay = this.workingDays.has(date.getDay());
    if (!isWorkingDay) return false;
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

    const dayOfWeek = this.selectedDate.getDay() + 1;
    const relevantSchedule = this.schedule.find(s => s.dayOfWeekId === dayOfWeek);

    if (!relevantSchedule) {
      console.error('No schedule found for the selected date.');
      return;
    }
        const year = this.selectedDate.getFullYear();
    const month = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = this.selectedDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const bookingData = {
      specialtiyAppointment: {
        specialtyScheduleId: relevantSchedule.id,
        isOffline: true,
        appointmentDate: formattedDate
      },
       navigationIds: {
        doctorId: this.doctor.id,

      }
    };

    this.bookingService.updateBookingData(bookingData);

    this.router.navigate(['/patient/booking-stepper']);
  }

  goBack(): void {
    this.location.back();
  }
}
