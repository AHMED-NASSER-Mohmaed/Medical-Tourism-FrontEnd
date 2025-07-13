import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { DoctorProfileDto } from '../models/Doctor.model';
import { PagedSlotsResponse } from '../models/appointment.model';
import { DoctorAppointmentDto } from '../models/schedules.model';

export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    email: string;
    phone: string;
    // Add other fields as needed
}

@Injectable({
    providedIn: 'root'
})
export class appointementService {
    private apiUrl = 'https://localhost:7078/api/Doctors'; // Replace with your actual API endpoint

    constructor(private http: HttpClient) {}



    getDoctorschedules(): Observable<PagedSlotsResponse>{
        return this.http.get<PagedSlotsResponse>(`${this.apiUrl}/Doctor-Schedules`);
    }
     getDoctorappointment(): Observable<any>{
        return this.http.get<any>(`${this.apiUrl}/doctor-appointments`);
    }
    




   

   
}