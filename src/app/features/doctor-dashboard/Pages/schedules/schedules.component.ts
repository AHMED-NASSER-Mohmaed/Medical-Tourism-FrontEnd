import { Component } from '@angular/core';
import { AppointmentStatus, DoctorAppointmentDto } from '../../models/schedules.model';
import { appointementService } from '../../Services/appointment.service';
import { data } from 'jquery';

@Component({
  selector: 'app-schedules',
  standalone: false,
  templateUrl: './schedules.component.html',
  styleUrl: './schedules.component.css'
})
export class SchedulesComponent {
  appointments:DoctorAppointmentDto[]=[];
  pageSize = 5;
  currentPage = 1;
  pagedItems: DoctorAppointmentDto[] = [];
  totalPages = 0;

  constructor(private appointmentService:appointementService){}

  ngOnInit(): void {

    this.appointmentService.getDoctorappointment().subscribe({
      next:(data)=>
        {
          console.log("appointments data:" +data);
          this.appointments=data.items;
          console.log(this.appointments);
          this.updatePagedItems();
        },
        error:(error)=>
        {

        }
    })
    this.updatePagedItems();
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
    switch (status) {
      case AppointmentStatus.Confirmed:
        return 'bg-success';
      case AppointmentStatus.Pending:
        return 'bg-warning text-dark';
      case AppointmentStatus.Completed:
        return 'bg-primary';
      case AppointmentStatus.Cancelled:
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
