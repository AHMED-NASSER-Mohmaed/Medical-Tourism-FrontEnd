import { Component } from '@angular/core';
import { DoctorProfileDto } from '../../models/Doctor.model';
import { DoctorService } from '../../Services/Doctor.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {


  doctor ?:DoctorProfileDto;

  constructor(private doctorService:DoctorService) {}

  ngOnInit() {
    console.log("loading doctor ...")
    this.doctorService.getDoctorProfile().subscribe({
      next: (data: DoctorProfileDto) => 
        {
          this.doctor = data;
          console.log(this.doctor);
         }
      ,
      error: (error) => { 
        console.error('Error fetching doctor profile:', error);
      }
  });
}
  
}
