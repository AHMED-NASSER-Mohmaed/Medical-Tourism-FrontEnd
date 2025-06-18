// // features/super-admin/pages/system-reports/system-reports.component.ts
// import { Component, OnInit } from '@angular/core';
// import { SuperAdminService } from '../../services/super-admin.service';
// import { SystemReport } from '../../models/super-admin.model';

// @Component({
//   selector: 'app-system-reports',
//   templateUrl: './system-reports.component.html',
//   styleUrls: ['./system-reports.component.scss']
// })
// export class SystemReportsComponent implements OnInit {
//   reports: SystemReport | null = null;
//   isLoading = false;
//   lastUpdated: Date | null = null;

//   constructor(private superAdminService: SuperAdminService) {}

//   ngOnInit() {
//     this.loadReports();
//   }

//   loadReports() {
//     this.isLoading = true;
//     this.superAdminService.getSystemReports().subscribe({
//       next: (reports) => {
//         this.reports = reports;
//         this.lastUpdated = new Date();
//         this.isLoading = false;
//       },
//       error: (error) => {
//         console.error('Failed to load reports', error);
//         this.isLoading = false;
//       }
//     });
//   }

//   refreshReports() {
//     this.loadReports();
//   }

//   getReportData() {
//     return {
//       labels: ['Patients', 'Hotel Providers', 'Hospital Providers', 'Car Rental Providers'],
//       datasets: [{
//         data: [
//           this.reports?.totalPatients || 0,
//           this.reports?.totalHotelProviders || 0,
//           this.reports?.totalHospitalProviders || 0,
//           this.reports?.totalCarRentalProviders || 0
//         ],
//         backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e']
//       }]
//     };
//   }
// }