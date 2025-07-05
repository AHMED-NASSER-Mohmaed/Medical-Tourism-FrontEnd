import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorListResponse, Status } from '../../../models/doctor.model';
import { DoctorService } from '../../../Services/Doctor.service';

@Component({
  selector: 'app-doctors-list',
  standalone: false,
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.css'
})
export class DoctorsListComponent {
 doctors: DoctorListResponse | null = null;
 OrgDoctors: DoctorListResponse | null = null;
  Showlistdoctors: boolean = true;
  loading: boolean = true;
  searchTerm: string = '';
   currentPage: number = 1;
  pageSize: number = 5;
  statusFilter: string =""; 

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
    this.doctorService.getDoctors(1,10,this.statusFilter).subscribe({
      next: (data) => {
        console.log('Doctors loaded successfully', data);
        this.OrgDoctors= data;
        this.loading = false;
        this.doctors ={ ...this.OrgDoctors};
         this.currentPage = 1;
        this.paginateDoctors();
        console.log('Original doctors:', this.OrgDoctors.items);
        
      },
      error: (err) => {
        console.error('Failed to load doctors', err);
        this.loading = false;
      }
    });
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

 
  get totalPages(): number {
    return this.doctors ? Math.ceil(this.doctors.totalCount / this.pageSize) : 1;
  }

  changePage(page: number) {
    if (page < 1 || (this.doctors && page > this.totalPages)) return;
    this.currentPage = page;
    this.paginateDoctors();
  }

  paginateDoctors() {
    if (!this.OrgDoctors) return;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.doctors = {
      ...this.OrgDoctors,
      items: this.OrgDoctors.items.slice(start, end),
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };
  }


 
  onSearchChange() {
    // Reset pagination or any other logic if needed
    if( this.searchTerm.trim() === '') {
     this.doctors = this.OrgDoctors
       ? { ...this.OrgDoctors, items: this.OrgDoctors.items ?? [] }
       : { items: [], totalCount: 0, pageNumber: 1, pageSize: 10 }; 
      }else if (this.doctors && this.OrgDoctors) {
      this.doctors.items = this.OrgDoctors.items.filter((doctor) => doctor.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) );
    }
    
  }

  // Default status filter

  onStatusFilterChange() {
    console.log('Status filter changed:', this.statusFilter);
    this.loading = true;
    this.doctorService.getDoctors( 1,10,"",this.statusFilter ).subscribe({
      next: (data) => {
        this.OrgDoctors = data;
        this.doctors = { ...data };
        this.currentPage = 1;
        this.paginateDoctors();
        this.onSearchChange()
        
        
        this.loading = false;
        console.log('Doctors after status filter:', this.doctors.items);
      },
      error: (err) => {
        console.error('Failed to filter doctors by status', err);
        this.loading = false;
      }
    });
  }
}
