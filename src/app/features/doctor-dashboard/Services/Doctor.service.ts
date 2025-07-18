import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DoctorProfileDto } from '../models/Doctor.model';

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
export class DoctorService {
    private apiUrl = `${environment.apiUrl}/Doctors`;

    constructor(private http: HttpClient) {}



    getDoctorProfile(): Observable<DoctorProfileDto> {
        return this.http.get<DoctorProfileDto>(`${this.apiUrl}/Doctor-Profile/`);
    }





}
