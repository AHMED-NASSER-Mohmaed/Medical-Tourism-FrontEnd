import { Component } from '@angular/core';
import { AppointmentStatus, DoctorAppointmentDto } from '../../models/schedules.model';
import { appointementService } from '../../Services/appointment.service';
import { data } from 'jquery';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { trigger, transition, style, animate } from '@angular/animations';
import { DoctorScheduleSlotDto, PagedSlotsResponse } from '../../models/appointment.model';

@Component({
  selector: 'app-schedules',
  standalone: false,
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class SchedulesComponent {
  appointments: DoctorAppointmentDto[] = [];
  pageSize = 5;
  currentPage = 1;
  pagedItems: DoctorAppointmentDto[] = [];
  totalPages = 0;
  isLoading = false;

  // Dynamic day of week dropdown
  availableDayOfWeekList: { id: number, name: string }[] = [];
  selectedDayOfWeekId: number | null = null;
  selectedDate: Date | null = null;
  dateControl = new FormControl();

  // Store doctor schedule slots for extracting available days
  doctorScheduleSlots: DoctorScheduleSlotDto[] = [];

  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  AppointmentStatusMap: { [key: number]: string } = {
    0: 'Pending',
    1: 'Booked',
    2: 'Cancelled',
    3: 'Completed'
  };

  getStatusText(status: number | string): string {
    if (typeof status === 'number') {
      return this.AppointmentStatusMap[status] || 'Unknown';
    }
    return status;
  }

  constructor(private appointmentService: appointementService) { }

  ngOnInit(): void {
    this.fetchDoctorSchedules();
    this.fetchAppointments();
    this.updatePagedItems();
  }

  fetchDoctorSchedules() {
    this.isLoading = true;
    this.appointmentService.getDoctorschedules().subscribe({
      next: (data: PagedSlotsResponse) => {
        this.doctorScheduleSlots = data.items || [];
        // Extract unique dayOfWeekId values
        const uniqueDays = Array.from(new Set(this.doctorScheduleSlots.map(slot => slot.dayOfWeekId)));
        this.availableDayOfWeekList = uniqueDays.map(id => ({ id, name: this.dayNames[id - 1] }));
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  fetchAppointments(filter?: { dayOfWeekId?: number, date?: Date }) {
    this.appointmentService.getDoctorappointment().subscribe({
      next: (data) => {
        this.appointments = data.items;
          this.updatePagedItems();
        },
      error: () => { }
    });
  }

  // Helper to map JS getDay() (0=Sunday, 6=Saturday) to 1=Sunday, ..., 7=Saturday
  getDayOfWeekIdFromDate(date: Date): number {
    const jsDay = date.getDay();
    return jsDay === 0 ? 1 : jsDay + 1; // 1=Sunday, 2=Monday, ..., 7=Saturday
  }

  // Calendar date filter: only allow dates matching selected dayOfWeekId
  dateFilter = (date: Date | null): boolean => {
    if (!date || !this.selectedDayOfWeekId) return false;
    // Map JS getDay() to 1=Sunday, ..., 7=Saturday
    const mappedDay = this.getDayOfWeekIdFromDate(date);
    return mappedDay === this.selectedDayOfWeekId;
  };

  onDayOfWeekChange(dayId: number) {
    this.selectedDayOfWeekId = dayId;
    this.selectedDate = null;
    this.dateControl.setValue(null);
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
  }

  applyFilter() {
    if (!this.selectedDate || !this.selectedDayOfWeekId) return;
    const year = this.selectedDate.getFullYear().toString();
    const month = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = this.selectedDate.getDate().toString().padStart(2, '0');
    const appointmetnDate = `${year}-${month}-${day}`;
    // Map JS getDay() to 1=Sunday, ..., 7=Saturday for the filter
    const dayofWeekId = this.getDayOfWeekIdFromDate(this.selectedDate);
    this.isLoading = true;
    this.appointmentService.getDoctorappointmentFiltered(appointmetnDate, dayofWeekId.toString()).subscribe({
      next: (data) => {
        this.appointments = data.items;
    this.updatePagedItems();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  updatePagedItems(): void {
    if (!this.appointments) return;
    this.totalPages = Math.ceil(this.appointments.length / this.pageSize);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedItems = this.appointments.slice(start, end);
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updatePagedItems();
    }
  }

  getStatusBadgeClass(status: AppointmentStatus): string {
    switch (this.getStatusText(status)) {
      case 'Booked':
        return 'bg-success';
      case 'Pending':
        return 'bg-warning';
      case 'Cancelled':
        return 'bg-danger';
      case 'Completed':
        return 'bg-completed';
      default:
        return 'bg-secondary';
    }
  }
}
