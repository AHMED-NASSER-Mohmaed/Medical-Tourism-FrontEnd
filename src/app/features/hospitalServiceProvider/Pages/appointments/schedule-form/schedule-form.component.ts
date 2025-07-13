import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from '../../../Services/Schedule.service';
import { SpecialistService } from '../../../Services/specilaist.service';
import { Specialty } from '../../../models/specialist.model';
import { DoctorService } from '../../../Services/Doctor.service';
import { DoctorDto } from '../../../models/doctor.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-schedule-form',
  standalone: false,
  templateUrl: './schedule-form.component.html',
  styleUrl: './schedule-form.component.css'
})
export class ScheduleFormComponent {
scheduleForm: FormGroup;
hospitalSpecialties: any[] = [];
AvailableDoctors: DoctorDto[] = [];
  
isfailed:boolean=false;
  isSuccess:boolean=false; 
  messageError:string="";
  successMessage:string="";
  isLoading:boolean=false;
  daysOfWeek = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
    { id: 7, name: 'Sunday' },
  ];

  constructor(private fb: FormBuilder,private scheduleService: ScheduleService,private specialtyService: SpecialistService,private DoctorService: DoctorService,private location: Location) {
     this.scheduleForm = this.fb.group({
       doctorId: ['', Validators.required],
      hospitalSpecialtyId: ['', Validators.required],
      dayOfWeekId: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      timeSlotSize: [
    '',
    [
      Validators.required,
      Validators.pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/)
    ]
  ],
      maxCapacity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.required]],
        });
  }

  ngOnInit(): void {
   this.specialtyService.getAllSpecialists().subscribe({
         next: (specialties) => {
         this.hospitalSpecialties = specialties.items.filter((specialty: Specialty) => specialty.status === 1);
         console.log('Specialties loaded:', this.hospitalSpecialties);
         },
         error: (err) => {
         console.error('Error loading specialties', err);
         }
       });

      
       
  }

  onSpecialtyChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const specialtyId = Number(target.value);
  if (specialtyId) {
    this.loadAvailableDoctors(specialtyId);
  } else {
    this.AvailableDoctors = []; // لو مفيش تخصص محدد, نظف القائمة
  }
}


  loadAvailableDoctors(specialtyId: number): void
   {
     this.DoctorService.getDoctors().subscribe({
         next: (doctors) => {
          this.AvailableDoctors = doctors.items.filter((doctor: any) => doctor.status === 1 && doctor.specialtyId === specialtyId );
          console.log('Doctors loaded:', this.AvailableDoctors);
         },
          error: (err) => {
          console.error('Error loading doctors', err);
          }});
   }
  

  onSubmit(): void {
    this.isLoading=true;
    if (this.scheduleForm.invalid) {
      console.error('Form is invalid');
    console.log('Form submitted:', this.scheduleForm.value); 
      
      return;}
      const formValue = { ...this.scheduleForm.value };
       const minutes = Number(formValue.timeSlotSize);
      const formattedSlotSize = `00:${minutes.toString().padStart(2, '0')}:00`;
    formValue.timeSlotSize = formattedSlotSize;
    console.log('Form submitted:', this.scheduleForm.value); 
    this.scheduleService.createSchedule(this.scheduleForm.value).subscribe({
      next: (response) => { 
        this.isLoading=false;
        this.isSuccess = true;
        this.successMessage = 'Schedule created successfully!';
        console.log('Schedule created successfully', response);
        this.scheduleForm.reset();
            },
      error: (error) => { 
        this.isLoading=false;
        this.isfailed = true;
        this.messageError = error.error || 'Failed to create schedule';
        console.error('Error creating schedule', error);
        
      }
    });
  }
  

  onReset(): void {
    this.scheduleForm.reset();
  }
  onTimeChange(event: Event, field: string): void {
    console.log(`Time changed for ${field}:`, event);
  const target = event.target as HTMLInputElement;
  if (target && target.value) {
    this.scheduleForm.get(field)?.setValue(target.value);
    console.log(`Time changed for ${field}:`, target.value);
  }
}
  closeError()
  {
    this.isfailed=false;
  }
  goBack(): void {
  this.location.back();
}
}
