import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
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
    private apiUrl = `${environment.apiUrl}/Doctors`;

    constructor(private http: HttpClient) {}



    getDoctorschedules(): Observable<PagedSlotsResponse>{
        return this.http.get<PagedSlotsResponse>(`${this.apiUrl}/Doctor-Schedules`);
    }
     getDoctorappointment(): Observable<any>{
        return this.http.get<any>(`${this.apiUrl}/doctor-appointments`);
    }

    getDoctorappointmentFiltered(appointmetnDate: string, dayofWeekId: string): Observable<any> {
        // Mocked data for specific date and dayofWeekId combinations
        const mockData = [
            {
                appointmentId: 95,
                appointmetnDate: '2025-07-15',
                status: 1,
                patientName: 'Maged Ahmed',
                patientPhone: '01270548216',
                patientCountry: 'United Arab Emirates',
                dayofWeekId: 3
            },
            {
                appointmentId: 97,
                appointmetnDate: '2025-07-19',
                status: 1,
                patientName: 'Maged Ahmed',
                patientPhone: '01270548216',
                patientCountry: 'United Arab Emirates',
                dayofWeekId: 7
            },
            {
                appointmentId: 96,
                appointmetnDate: '2025-07-24',
                status: 1,
                patientName: 'Maged Ahmed',
                patientPhone: '01270548216',
                patientCountry: 'United Arab Emirates',
                dayofWeekId: 5
            }
        ];
        const filtered = mockData.filter(a => a.appointmetnDate === appointmetnDate && a.dayofWeekId.toString() === dayofWeekId);
        return of({
            pageNumber: 1,
            pageSize: 10,
            totalPages: 1,
            totalCount: filtered.length,
            hasPreviousPage: false,
            hasNextPage: false,
            items: filtered
        });
    }







}
