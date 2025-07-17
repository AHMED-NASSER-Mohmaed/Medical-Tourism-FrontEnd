import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScheduleService } from '../../../Services/Schedule.service';
import { ScheduleListResponse, ScheduleResponseDto } from '../../../models/schedule.model';

@Component({
  selector: 'app-appointments-list',
  standalone: false,
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent {
  appointments: ScheduleListResponse = {
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 6
  };

  orgAppointments: ScheduleResponseDto[] = []; // البيانات الأصلية
  filteredItems: ScheduleResponseDto[] = [];   // نتائج بعد الفلترة

  loading: boolean = true;
  searchTerm: string = '';
  selectedFilter: string = 'all';
  showFilters: boolean = false;
  statusFilter: string = '';
  selectedDayId: number | null = null;

  filterOptions = [
    { value: 'all', label: 'All Appointments' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  daysOfWeek = [
    { id: 1, name: 'Sunday' },
    { id: 2, name: 'Monday' },
    { id: 3, name: 'Tuesday' },
    { id: 4, name: 'Wednesday' },
    { id: 5, name: 'Thursday' },
    { id: 6, name: 'Friday' },
    { id: 7, name: 'Saturday' }
  ];

  constructor(
    private appointmentService: ScheduleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getSchedulesWithFilter(this.searchTerm,this.statusFilter,this.selectedDayId!).subscribe({
      next: (data) => {
        this.orgAppointments = data.items;
        this.filteredItems = [...this.orgAppointments];
        this.appointments.pageNumber = 1;
        this.appointments.totalCount = this.filteredItems.length;
        this.paginateAppointments();
        this.loading = false;
        console.log(this.filteredItems)
      },
      error: (err) => {
        console.error('Failed to load appointments', err);
        this.loading = false;
      }
    });
  }

  // pagination logic
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredItems.length / this.appointments.pageSize!));
  }

  paginateAppointments() {
    const start = (this.appointments.pageNumber! - 1) * this.appointments.pageSize!;
    const end = start + this.appointments.pageSize!;
    this.appointments.items = this.filteredItems.slice(start, end);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.appointments.pageNumber = page;
    this.paginateAppointments();
  }

  applyFilters() {
    

    this.loadAppointments();
    console.log(this.filteredItems)
 
    this.appointments.pageNumber = 1;
    this.appointments.totalCount = this.filteredItems.length;
    this.paginateAppointments();
  }

  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedFilter = 'all';
    this.appointments.pageNumber = 1;
    this.applyFilters();
  }

  changeStatus(scheduleId: number, status: boolean) {
    this.appointmentService.ChangeSpecialtyStatus(scheduleId, status).subscribe({
      next: () => this.loadAppointments(),
      error: (err) => console.error('Failed to change status', err)
    });
  }

  get activeAppointmentsCount(): number {
    return this.orgAppointments.filter(item => item.isActive).length;
  }

  get inactiveAppointmentsCount(): number {
    return this.orgAppointments.filter(item => !item.isActive).length;
  }

  getDayName(id: number): string {
    const day = this.daysOfWeek.find(d => d.id === id);
    return day ? day.name : '';
  }

  getAvailabilityPercentage(schedule: any): number {
    if (schedule.maxCapacity === 0) return 0;
    return Math.round((schedule.availableSlots / schedule.maxCapacity) * 100);
  }

  getAvailabilityClass(percentage: number): string {
    if (percentage >= 70) return 'availability-high';
    if (percentage >= 40) return 'availability-medium';
    return 'availability-low';
  }
  onDayChange() {
  this.applyFilters();
}

onStatusFilterChange() {
  this.applyFilters();
}
}
