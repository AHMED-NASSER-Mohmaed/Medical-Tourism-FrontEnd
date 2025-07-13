import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse, DoctorCreateDto, DoctorListResponse, DoctorProfile, DoctorRegistrationDto, Status } from '../models/doctor.model';

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
    private apiUrl = 'https://localhost:7078/api/Doctors'; // Replace with your actual API endpoint

    constructor(private http: HttpClient) {}

  getDoctors(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
    status?: string
  ): Observable<DoctorListResponse> {
    // Set up headers with bearer token
    

    // Build query parameters
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('UserStatus',status ? status : '');

       console.log("status",status);

    return this.http.get<DoctorListResponse>(`${this.apiUrl}/hospital-Doctors`, { params });
  }

  getDoctorsHospitalSpecialty(
    hospitalSpecialty:number,
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
    status?: string
  ): Observable<DoctorListResponse> {
    // Set up headers with bearer token
    

    // Build query parameters
    let params = new HttpParams()
      .set('hospitalSpecialtyId',hospitalSpecialty.toString())
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('UserStatus',status ? status : '');

       console.log("status",status);

    return this.http.get<DoctorListResponse>(`${this.apiUrl}/website/${hospitalSpecialty}`, { params });
  }

    getDoctorById(id: string): Observable<DoctorProfile> {
        return this.http.get<DoctorProfile>(`${this.apiUrl}/hosital-admin/${id}`);
    }

   createDoctor(doctorData: FormData): Observable<ApiResponse<any>> {
    
    

    console.log(doctorData);
    return this.http.post<ApiResponse<any>>(this.apiUrl, doctorData).pipe(
      catchError(error => {
        // Handle different error statuses
        if (error.status === 400) {
          return throwError(() => new Error('Validation error: ' + (error.error?.message || 'Invalid data')));
        } else if (error.status === 409) {
          return throwError(() => new Error('Conflict: ' + (error.error?.message || 'Resource already exists')));
        } else {
          return throwError(() => new Error('An unexpected error occurred'));
        }
      })
    );
  }

    updateDoctor(id: string, doctor: FormData): Observable<Doctor> {
        return this.http.put<Doctor>(`${this.apiUrl}/${id}`, doctor);
    }

    deleteDoctor(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}