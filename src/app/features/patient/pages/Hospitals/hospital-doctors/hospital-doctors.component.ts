import { Component } from '@angular/core';
import { HospitalService } from '../../../services/Hospital.service';
import { Doctor } from '../../../models/Hospital.model';

@Component({
  selector: 'app-hospital-doctors',
  standalone: false,
  templateUrl: './hospital-doctors.component.html',
  styleUrl: './hospital-doctors.component.css'
})
export class HospitalDoctorsComponent {

  selectedDoctor: any = null;
  showSchedulePopup: boolean = false;
  doctorSchedule: any[][] = []; // 2D array for weeks and days
  selectedDate: Date | null = null;
  Doctors: Doctor[] = [];

  constructor(private doctorService: HospitalService) {}

  ngOnInit() {
    // Initialize any necessary data or fetch initial doctor list
    this.doctorService.getDoctorsByHospitalAndClinic(1,1).subscribe(doctors => {
      this.Doctors = doctors!;
      console.log('Doctors:', this.Doctors);
    })
  }

  onShowAvailableDates(doctor: any) {
    const hospitalId = 1; // Replace with actual hospitalId if available
    const clinicId = 1; // Replace with actual clinicId if available
    this.selectedDoctor = doctor;
    this.showSchedulePopup = true;
    this.selectedDate = null;
    this.doctorService.getDoctorSchedule(hospitalId, clinicId, doctor.id).subscribe(schedule => {
      // Ensure schedule is a 2D array for the calendar
      this.doctorSchedule = Array.isArray(schedule) && Array.isArray(schedule[0]) ? schedule : [];
      console.log('Doctor Schedule:', this.doctorSchedule);

      console.log(schedule);
    });
  }

  onCloseSchedulePopup() {
    this.showSchedulePopup = false;
    this.selectedDoctor = null;
    this.doctorSchedule = [];
    this.selectedDate = null;
  }

  selectDate(date: any) {
    if (date && date.available) {
      this.selectedDate = date.date ? new Date(date.date) : null;
      // Optionally mark selected in UI
      this.doctorSchedule.forEach(week => {
        week.forEach(d => d.selected = false);
      });
      date.selected = true;
    }
  }
}
