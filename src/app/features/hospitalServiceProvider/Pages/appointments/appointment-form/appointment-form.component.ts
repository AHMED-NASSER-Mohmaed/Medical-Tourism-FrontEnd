import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleRequestDto } from '../../../models/schedule.model';
import { SpecialistService } from '../../../Services/specilaist.service';
import { DoctorService } from '../../../Services/Doctor.service';
import { ScheduleService } from '../../../Services/Schedule.service';

@Component({
  selector: 'app-appointment-form',
  standalone: false,
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {
  isEditMode: boolean = false;
  appointmentId: string | null = null;
  scheduleForm: FormGroup = new FormGroup({});
  
  daysOfWeek = [
    { id: 1, name: 'Sunday' },
    { id: 2, name: 'Monday' },
    { id: 3, name: 'Tuesday' },
    { id: 4, name: 'Wednesday' },
    { id: 5, name: 'Thursday' },
    { id: 6, name: 'Friday' },
    { id: 7, name: 'Saturday' }
  ];

  doctors: any[] = []; // Should be populated from a service
  specialties: any[] = []; // Should be populated from a service

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router, // Changed to public to access in template
    private SpecialistyService: SpecialistService,
    private doctorService: DoctorService, // Assuming this service fetches doctors
    private scheduleService: ScheduleService // Assuming this service handles schedule operations
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadSpecialties();
  }

  initializeForm() {
    this.scheduleForm = this.fb.group({
      doctorId: ['', Validators.required],
      hospitalSpecialtyId: [0, Validators.required],
      dayOfWeekId: [0, Validators.required],
      startTime: this.fb.group({
        hour: [0, [Validators.required, Validators.min(0), Validators.max(23)]],
        minute: [0, [Validators.required, Validators.min(0), Validators.max(59)]]
      }),
      endTime: this.fb.group({
        hour: [0, [Validators.required, Validators.min(0), Validators.max(23)]],
        minute: [0, [Validators.required, Validators.min(0), Validators.max(59)]]
      }),
      timeSlotSize: [15, [Validators.required, Validators.min(1)]],
      maxCapacity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadDoctors() {
    console.log("sd"+this.scheduleForm.value.hospitalSpecialtyId);
    this.doctorService.getDoctors().subscribe(
      (data) => {
        console.log('Doctors loaded:', data);
        const specialty = this.specialties.find((s: any) => s.id.toString() === this.scheduleForm.value.hospitalSpecialtyId);
        console.log('Selected specialty:', specialty);
        this.doctors = data.items.filter(doctor => doctor.status == 1 &&  doctor.specialtyId===specialty.specialtyId ) || [];
        console.log('Doctors loaded:', this.doctors);
      },
      (error) => {
        console.error('Error loading doctors', error);
      }
    );
   
  }

  loadSpecialties() {
   this.SpecialistyService.getAllSpecialists().subscribe(
      (data) => {
        this.specialties = data.items || [] ;
        console.log('Specialties loaded:', this.specialties);
      },
      (error) => {
        console.error('Error loading specialties', error);
      }
    ); 
    
  }

  getFormControl(path: string): FormControl {
    return this.scheduleForm.get(path) as FormControl;
  }

  onSubmit() {
    if (this.scheduleForm.invalid) {
      return;
    }
    const formValue = this.scheduleForm.value;

  // Create a typed request object with number conversions
  const scheduleRequest: ScheduleRequestDto = {
    doctorId: formValue.doctorId, // (string - remains unchanged)
    hospitalSpecialtyId: Number(formValue.hospitalSpecialtyId),
    dayOfWeekId: Number(formValue.dayOfWeekId),
    startTime: `${formValue.startTime.hour.toString().padStart(2, '0')}:${formValue.startTime.minute.toString().padStart(2, '0')}:00`, // Convert to HH:mm format
    endTime: `${formValue.endTime.hour.toString().padStart(2, '0')}:${formValue.endTime.minute.toString().padStart(2, '0')}:00`, // Convert to HH:mm format
    timeSlotSize: Number(formValue.timeSlotSize),
    maxCapacity: Number(formValue.maxCapacity),
    price: Number(formValue.price),
  };

    console.log('Schedule Request:', scheduleRequest);
    this.scheduleService.createSchedule(scheduleRequest).subscribe(
      (response) => {
        console.log('Schedule created successfully', response);
        // Navigate to the schedule list or show a success message
        this.router.navigate(['/hospital/schedule']);
      },(error)=>
      {
        console.error('Error creating schedule', error);
        // Handle error appropriately, e.g., show a notification
      });
    console.log(scheduleRequest);
  }
}