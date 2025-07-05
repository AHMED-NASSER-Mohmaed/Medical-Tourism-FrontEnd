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

  deleteSpecialist(id: number) {
    // this.confirmationService.confirm({
    //   message: 'Are you sure you want to delete this specialist?',
    //   header: 'Confirm',
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     this.specialistService.deleteSpecialist(id).subscribe({
    //       next: () => {
    //         this.messageService.add({severity:'success', summary:'Success', detail:'Specialist deleted successfully'});
    //         this.loadSpecialists();
    //       },
    //       error: (err) => {
    //         this.messageService.add({severity:'error', summary:'Error', detail:'Failed to delete specialist'});
    //       }
    //     });
    //   }
    // });
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
    this.specilaistservice.addSpecialistToList(this.selectedSpecialistId).subscribe({
      next: () => {
        this.showAddSpecialistPopup = false;
        this.selectedSpecialistId = null;
        this.loadSpecialists();
      },
      error: (err) => {
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
}
