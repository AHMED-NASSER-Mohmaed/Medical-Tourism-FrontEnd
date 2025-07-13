import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScheduleService } from '../../../Services/Schedule.service';
import { ScheduleListResponse } from '../../../models/schedule.model';
import { SpecialistService } from '../../../Services/specilaist.service';

@Component({
  selector: 'app-specialists-list',
  standalone: false,
  templateUrl: './specialists-list.component.html',
  styleUrl: './specialists-list.component.css'
})
export class SpecialistsListComponent {
specialists: any[] = [] ;
  loading: boolean = true;
 searchTerm: string = '';
 statusFilter: boolean =true; 
 isSuccess:boolean=false;
 isfailed:boolean=false;
 isLoading: boolean = false;
 messageError:string='';
  successMessage:string='';
  constructor(
   private specilaistservice: SpecialistService,
    private router: Router,
    // private confirmationService: ConfirmationService,
    // private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadSpecialists();
  }

  loadSpecialists() {
    this.loading = true;
    this.specilaistservice.getAllSpecialists().subscribe({
      next: (data) => {
        console.log('Specialists loaded:', data);
        this.specialists = data.items; // Assuming the response has an 'items' property
        //this.specialists = data;  
        this.loading = false;
        console.log('Specialists:', this.specialists);
      },
      error: (err) => {
        console.error('Failed to load specialists', err);
        this.loading = false;
      }
    });
  }

  

 

  filterSpecialists() {
    if (!this.searchTerm) {
      this.loadSpecialists();
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.specialists = this.specialists.filter(specialist =>
      Object.values(specialist).some(value =>
        value && value.toString().toLowerCase().includes(term)
      )
    );
  }
  showAddSpecialistPopup: boolean = false;
  availableSpecialists: any[] = [];
  selectedSpecialistId: number | null = null;

  openAddSpecialistPopup() {
    this.showAddSpecialistPopup = true;
    this.loadAvailableSpecialists();
  }

  loadAvailableSpecialists() {
    this.specilaistservice.getAvailableSpecialists().subscribe({
      next: (data) => {
        this.availableSpecialists = data.items || data;
        console.log('Available specialists:', this.availableSpecialists);
      },
      error: (err) => {
        console.error('Failed to load available specialists', err);
      }
    });
  }

  addSpecialist() {
    if (!this.selectedSpecialistId) return;
    console.log('Adding specialist with ID:', this.selectedSpecialistId);
    this.isLoading = true;
    this.specilaistservice.addSpecialistToList(this.selectedSpecialistId).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        this.successMessage = 'Specialist added successfully';
        this.showAddSpecialistPopup = false;
        this.selectedSpecialistId = null;
        this.loadSpecialists();
        
      },
      error: (err) => {
        this.isLoading = false;
        this.isfailed = true;
        this.messageError = 'Failed to add specialist';
        console.error('Failed to add specialist', err);
      }
    });
  }
  ChangeSpecialtyStatus(specialtyId: number,status: boolean) {
    console.log('Changing specialty status for ID:', specialtyId, 'to status:', status);
    this.specilaistservice.ChangeSpecialtyStatus(specialtyId,status ).subscribe({
      next: () => {
        this.loadSpecialists();
      },
      error: (err) => {
        console.error('Failed to change specialty status', err);
      }
    });
  }

    onStatusFilterChange() {
    console.log('Status filter changed:', this.statusFilter);
    this.loading = true;
    this.specilaistservice.getAllSpecialists( 1,10,this.statusFilter ).subscribe({
      next: (data) => {
        this.specialists = data.items;
      
        
        
        this.loading = false;
       
      },
      error: (err) => {
        console.error('Failed to filter doctors by status', err);
        this.loading = false;
      }
    });
  }
   closeError()
  {
    this.isfailed=false;
  }
}
