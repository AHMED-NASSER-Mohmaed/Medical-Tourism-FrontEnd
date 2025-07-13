import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleRequestDto } from '../../../models/schedule.model';
import { SpecialistService } from '../../../Services/specilaist.service';
import { DoctorService } from '../../../Services/Doctor.service';
import { ScheduleService } from '../../../Services/Schedule.service';
import { HospitalAppointmentDto } from '../../../models/Appointment.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-appointment-form',
  standalone: false,
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {
  appointments: HospitalAppointmentDto[] = [];         // البيانات الأصلية
filteredAppointments: HospitalAppointmentDto[] = []; // بعد التصفية
searchTerm: string = '';
selectedStatus: string = '1'; // string لإرسال للقائمة
loading: boolean = true;
scheduleId: string = '';
selectedDate:string='';
Dayofweek:number=0;
constructor(private appointementService:ScheduleService,private route: ActivatedRoute, private router: Router,private location:Location) { }

ngOnInit() {
  this.scheduleId = this.route.snapshot.paramMap.get('id') || '';
  this.Dayofweek = parseInt(this.route.snapshot.paramMap.get('day')!);
  if (this.Dayofweek) {

  this.selectedDate = this.getDateOfNextWeekDay(this.Dayofweek)
  console.log('Selected Date:', this.selectedDate);
}
  this.loadAppointments();
}

loadAppointments() {
  console.log(this.scheduleId);
  this.loading = true;
  // استدعاء السيرفيس:
  this.appointementService.getAppointments(this.scheduleId,this.selectedDate,this.selectedStatus).subscribe({
    next: (data) => {
      console.log(data)
      this.appointments = data.items;
      this.filteredAppointments = data.items;
      
      this.loading = false;
      this.totalPages = Math.ceil(this.filteredAppointments.length / this.pageSize);
      this.pageNumber = 1;
      this.updatePagedItems(this.filteredAppointments);
    },
    error: (err) => {
      console.error('Failed to load appointments', err);
      this.filteredAppointments=[];
      this.loading = false;
    }
  });
}
// Pagination variables
pageNumber: number = 1;
pageSize: number = 5; // عدد العناصر في الصفحة
totalPages: number = 1;
selectedDates:Date|null=null;
filterAppointments() {
if (this.selectedDate) {
    const year = this.selectedDates!.getFullYear();
    const month = (this.selectedDates!.getMonth() + 1).toString().padStart(2, '0');
    const day = this.selectedDates?.getDate().toString().padStart(2, '0');
    this.selectedDate = `${year}/${month}/${day}`;
    console.log('Formatted date:', this.selectedDate);
  }
 this.loadAppointments();

  this.totalPages = Math.ceil(this.filteredAppointments.length / this.pageSize);
      this.pageNumber = 1;
      this.updatePagedItems(this.filteredAppointments);
}

updatePagedItems(allItems: HospitalAppointmentDto[]) {
  const startIndex = (this.pageNumber - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.filteredAppointments = allItems.slice(startIndex, endIndex);
}

goToPage(page: number) {
  if (page < 1 || page > this.totalPages) return;
  this.pageNumber = page;

  let filtered = [...this.appointments];

  if (this.searchTerm.trim() !== '') {
    const term = this.searchTerm.toLowerCase();
    filtered = filtered.filter(a =>
      (a.patientName?.toLowerCase().includes(term) || '') ||
      (a.doctorName?.toLowerCase().includes(term) || '')
    );
  }

  if (this.selectedStatus !== '') {
    const statusNum = parseInt(this.selectedStatus, 10);
    filtered = filtered.filter(a => a.status === statusNum);
  }

  this.updatePagedItems(filtered);
}
// ترجمة status لعرض النص المناسب
getStatusText(status: number): string {
  switch (status) {
    case 1: return 'Confirmed';
   case 2: return 'Cancelled';
    default: return '-';
  }
}

// إرجاع كلاس البادج حسب الحالة
getStatusBadgeClass(status: number): string {
  switch (status) {
    case 1: return 'badge bg-success';
    case 2: return 'badge bg-danger';
    default: return 'badge bg-secondary';
  }
}

// إرجاع اسم اليوم
daysOfWeek = [
  { id: 1, name: 'Sunday' },
  { id: 2, name: 'Monday' },
  { id: 3, name: 'Tuesday' },
  { id: 4, name: 'Wednesday' },
  { id: 5, name: 'Thursday' },
  { id: 6, name: 'Friday' },
  { id: 7, name: 'Saturday' }
];

getDayName(id?: number | null): string {
  return this.daysOfWeek.find(day => day.id === id)?.name || '-';
}
getDateOfNextWeekDay(dayId: number): string {
  const today = new Date();

  let currentDayId = today.getDay(); // Sunday=0, Monday=1, ..., Saturday=6
  currentDayId = currentDayId === 0 ? 7 : currentDayId; // make Sunday=7 to match dayId

  let daysUntilNext = dayId - currentDayId + 7;
  if (daysUntilNext <= 0) {
    daysUntilNext += 7;
  }

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntilNext);

  // Format as "yyyy-mm-dd"
  const year = nextDate.getFullYear();
  const month = String(nextDate.getMonth() + 1).padStart(2, '0'); // getMonth is 0-based
  const day = String(nextDate.getDate()-1).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
resetFilters() {
  this.searchTerm = '';
  this.selectedStatus = '1'; // Reset to default status 
  this.selectedDate ="";
  this.loadAppointments(); // Reload appointments without filters
}


onlyAllowedDay = (date: Date | null): boolean => {
  return date ? date.getDay() === this.Dayofweek-1 : false;
};
  goBack(): void {
  this.location.back();
}

}