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
  pageSize: 10
};
OrgAppointments :ScheduleListResponse = {
  items: [],
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10
};;
  loading: boolean = true;
  searchTerm: string = '';

  constructor(
    private appointmentService: ScheduleService,
    private router: Router,
    // private confirmationService: ConfirmationService,
    // private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  loadAppointments() {
    this.loading = true;
    this.appointmentService.getSchedules().subscribe({
      next: (data) => {
        this.OrgAppointments = data;
        this.appointments ={...this.OrgAppointments ,  pageNumber: 1}
        this.paginateAppointments();
        this.loading = false;
        console.log('Appointments loaded successfully', this.appointments);
      },
      error: (err) => {
        console.error('Failed to load appointments', err);
        this.loading = false;
      }
    });
  }

  deleteAppointment(id: number) {
    // this.confirmationService.confirm({
    //   message: 'Are you sure you want to delete this appointment?',
    //   header: 'Confirm',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.appointmentService.deleteAppointment(id).subscribe({
    //       next: () => {
    //         this.messageService.add({severity:'success', summary:'Success', detail:'Appointment deleted successfully'});
    //         this.loadAppointments();
    //       },
    //       error: (err) => {
    //         this.messageService.add({severity:'error', summary:'Error', detail:'Failed to delete appointment'});
    //       }
    //     });
    //   }
    // });
  }
  startSearch() {
    console.log('Search term:', this.searchTerm);
  if (this.searchTerm.trim() === '') {
    this.appointments = { ...this.OrgAppointments };
    this.appointments.pageNumber = 1;
    this.paginateAppointments();

  } else {
    const filteredItems = this.OrgAppointments.items.filter(item => 
       item.doctorName.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.appointments = {
      ...this.OrgAppointments,
      items: filteredItems,
      totalCount: filteredItems.length
    };
    this.appointments.pageNumber = 1;
    this.paginateAppointments();
  }
  }
  ChangeStatus(scheduleId: number, status: boolean) {
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
    const items = this.searchTerm.trim() === ''
      ? this.OrgAppointments.items
      : this.OrgAppointments.items.filter(item =>
          item.doctorName.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    this.appointments.items = items.slice(startIndex, endIndex);
    this.appointments.totalCount = Math.ceil(items.length / this.appointments.pageSize!);
  }

  getTotalPages(): number {
    const items = this.searchTerm.trim() === ''
      ? this.OrgAppointments.items
      : this.OrgAppointments.items.filter(item =>
          item.doctorName.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    return Math.max(1, Math.ceil(items.length / this.appointments.pageSize!));
  }




}
