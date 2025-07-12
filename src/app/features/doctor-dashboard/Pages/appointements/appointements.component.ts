import { Component, OnInit } from '@angular/core';
import { appointementService } from '../../Services/appointment.service';
import { data, error } from 'jquery';
import { DoctorScheduleSlotDto, PagedSlotsResponse } from '../../models/appointment.model';

@Component({
  selector: 'app-appointements',
  standalone: false,
  templateUrl: './appointements.component.html',
  styleUrl: './appointements.component.css'
})
export class AppointementsComponent implements OnInit {

  schedulesResp ?:PagedSlotsResponse;
  schedules: DoctorScheduleSlotDto[]=[]
 currentPage:number=1;
 pageSize=5;
 totalPages:number=1;
  constructor(private appointmentService:appointementService){}
  ngOnInit(): void {
    this.appointmentService.getDoctorschedules().subscribe({
      next:(data)=>
      {
        this.schedulesResp=data;
       console.log(this.schedulesResp)
       this.schedules=this.schedulesResp.items;
      },
      error:(error)=>
      {
        console.log("appointemn error:" +error.error  )
      }
    })
  }
  getDayName(dayOfWeekId: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayOfWeekId - 1] || '';
}

  updatePagedItems(): void {
    if (!this.schedules) return;
    this.totalPages = Math.ceil(this.schedules.length / this.pageSize);

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.schedules = this.schedules.slice(start, end);
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage = newPage;
      this.updatePagedItems();
    }
  }
}
