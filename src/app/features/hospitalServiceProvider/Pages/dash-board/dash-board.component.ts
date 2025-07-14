import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.css'
})
export class DashBoardComponent {
specialistsCount: number = 2;
  doctorsCount: number = 0;
  todaysAppointments: number = 0;
  pendingAppointments: number = 0;
  recentAppointments: any[] = [];

  // constructor(private dashboardService: DashboardService) { }

  // ngOnInit(): void {
  //   this.loadDashboardData();
  // }

  // loadDashboardData() {
  //   this.dashboardService.getDashboardStats().subscribe({
  //     next: (data) => {
  //       this.specialistsCount = data.specialistsCount;
  //       this.doctorsCount = data.doctorsCount;
  //       this.todaysAppointments = data.todaysAppointments;
  //       this.pendingAppointments = data.pendingAppointments;
  //       this.recentAppointments = data.recentAppointments;
  //     },
  //     error: (err) => {
  //       console.error('Failed to load dashboard data', err);
  //     }
  //   });
  // }
}

