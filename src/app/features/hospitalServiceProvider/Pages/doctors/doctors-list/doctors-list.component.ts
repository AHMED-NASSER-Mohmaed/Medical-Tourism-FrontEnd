import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorListResponse, DoctorDto } from '../../../models/doctor.model';
import { DoctorService } from '../../../Services/Doctor.service';

@Component({
  selector: 'app-doctors-list',
  standalone: false,
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.css'
})
export class DoctorsListComponent {
  OrgDoctors: DoctorDto[] = [];          // الأصلية
  displayedDoctors: DoctorDto[] = [];    // التي تُعرض بعد البحث/الفلترة/pagination
  Showlistdoctors: boolean = true;
  loading: boolean = true;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 4;
  statusFilter: string = "";

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    // private confirmationService: ConfirmationService,
    // private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.Showlistdoctors = true;
    this.loadDoctors();
  }

  loadDoctors() {
    this.loading = true;
    console.log('Loading doctors...');
    this.doctorService.getDoctors(1, 1000, this.statusFilter).subscribe({
      next: (data) => {
        console.log('Doctors loaded successfully', data);
        this.OrgDoctors = data.items ?? [];
        this.currentPage = 1;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load doctors', err);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let filtered = this.OrgDoctors;

    // فلترة بالبحث
    if (this.searchTerm.trim() !== '') {
      filtered = filtered.filter(doc =>
        (doc.firstName + ' ' + doc.lastName).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // فلترة بالحالة
    if (this.statusFilter !== '') {
      filtered = filtered.filter(doc => doc.status?.toString() === this.statusFilter);
    }

    const start = (this.currentPage - 1) * this.pageSize;
    this.displayedDoctors = filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    let filtered = this.OrgDoctors;

    if (this.searchTerm.trim() !== '') {
      filtered = filtered.filter(doc =>
        (doc.firstName + ' ' + doc.lastName).toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.statusFilter !== '') {
      filtered = filtered.filter(doc => doc.status?.toString() === this.statusFilter);
    }

    return Math.max(1, Math.ceil(filtered.length / this.pageSize));
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilters();
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  onStatusFilterChange() {
    console.log('Status filter changed:', this.statusFilter);
    this.currentPage = 1;
    this.applyFilters();
  }

  deleteDoctor(id: number) {
  //   this.confirmationService.confirm({
  //     message: 'Are you sure you want to delete this doctor?',
  //     header: 'Confirm',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       this.doctorService.deleteDoctor(id).subscribe({
  //         next: () => {
  //           this.messageService.add({severity:'success', summary:'Success', detail:'Doctor deleted successfully'});
  //           this.loadDoctors();
  //         },
  //         error: (err) => {
  //           this.messageService.add({severity:'error', summary:'Error', detail:'Failed to delete doctor'});
  //         }
  //       });
  //     }
  //   });
  }
}
