import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScheduleService } from '../../../Services/Schedule.service';
import { ScheduleListResponse } from '../../../models/schedule.model';

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
    pageSize: 3
  };
  
  orgAppointments: ScheduleListResponse = {
    items: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 6
  };
  
  loading: boolean = true;
  searchTerm: string = '';
  selectedFilter: string = 'all';
  showFilters: boolean = false;
  
  filterOptions = [
    { value: 'all', label: 'All Appointments' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
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
    this.appointmentService.getSchedules().subscribe({
      next: (data) => {
        this.orgAppointments = data;
        this.appointments = { ...this.orgAppointments, pageNumber: 1 };
        this.applyFilters();
        this.loading = false;
        console.log('Appointments loaded successfully', this.appointments);
      },
      error: (err) => {
        console.error('Failed to load appointments', err);
        this.loading = false;
      }
    });
  }

  startSearch() {
    console.log('Search term:', this.searchTerm);
    this.appointments.pageNumber = 1;
    this.applyFilters();
  }

  onFilterChange() {
    this.appointments.pageNumber = 1;
    this.applyFilters();
  }

  applyFilters() {
    let filteredItems = [...this.orgAppointments.items];

    // Apply search filter
    if (this.searchTerm.trim() !== '') {
      filteredItems = filteredItems.filter(item => 
        item.doctorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.specialty.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.hospital.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (this.selectedFilter !== 'all') {
      filteredItems = filteredItems.filter(item => 
        this.selectedFilter === 'active' ? item.isActive : !item.isActive
      );
    }

    this.appointments = {
      ...this.orgAppointments,
      items: filteredItems,
      totalCount: filteredItems.length
    };
    
    this.paginateAppointments();
  }

  changeStatus(scheduleId: number, status: boolean) {
    this.appointmentService.ChangeSpecialtyStatus(scheduleId, status).subscribe({
      next: (response) => {
        console.log('Status changed successfully', response);
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Failed to change status', err);
      }
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.getTotalPages()) {
      return;
    }
    this.appointments.pageNumber = page;
    this.paginateAppointments();
  }

  paginateAppointments() {
    const startIndex = (this.appointments.pageNumber! - 1) * this.appointments.pageSize!;
    const endIndex = startIndex + this.appointments.pageSize!;
    
    let items = [...this.orgAppointments.items];

    // Apply search filter
    if (this.searchTerm.trim() !== '') {
      items = items.filter(item => 
        item.doctorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.specialty.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.hospital.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (this.selectedFilter !== 'all') {
      items = items.filter(item => 
        this.selectedFilter === 'active' ? item.isActive : !item.isActive
      );
    }

    this.appointments.items = items.slice(startIndex, endIndex);
    this.appointments.totalCount = Math.ceil(items.length / this.appointments.pageSize!);
  }

  getTotalPages(): number {
    let items = [...this.orgAppointments.items];

    // Apply search filter
    if (this.searchTerm.trim() !== '') {
      items = items.filter(item => 
        item.doctorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.specialty.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.hospital.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (this.selectedFilter !== 'all') {
      items = items.filter(item => 
        this.selectedFilter === 'active' ? item.isActive : !item.isActive
      );
    }

    return Math.max(1, Math.ceil(items.length / this.appointments.pageSize!));
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

  getAvailabilityPercentage(schedule: any): number {
    if (schedule.maxCapacity === 0) return 0;
    return Math.round((schedule.availableSlots / schedule.maxCapacity) * 100);
  }

  getAvailabilityClass(percentage: number): string {
    if (percentage >= 70) return 'availability-high';
    if (percentage >= 40) return 'availability-medium';
    return 'availability-low';
  }
  get activeAppointmentsCount(): number {
    return this.orgAppointments.items?.filter(item => item.isActive).length || 0;
  }

  get inactiveAppointmentsCount(): number {
    return this.orgAppointments.items?.filter(item => !item.isActive).length || 0;
  }
}