import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse, DoctorCreateDto, DoctorListResponse, DoctorRegistrationDto, Status } from '../models/doctor.model';

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
    private token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhNmJlYi0wMWE5LTRmODItYWMzNi1jZjc1MTBmNGRlMzEiLCJqdGkiOiIxZTI1MmNlZi02YjFhLTQzYWQtODVkZS0zYWMyN2VlNTAwOGUiLCJlbWFpbCI6Im1vaGFtZWQubS5lbG1haGR5MjhAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJmZWVhNmJlYi0wMWE5LTRmODItYWMzNi1jZjc1MTBmNGRlMzEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibW9oYW1lZC5tLmVsbWFoZHkyOEBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9naXZlbm5hbWUiOiJKb2huIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc3VybmFtZSI6IkRvZSIsIlNlY3VyaXR5U3RhbXAiOiJUSVRMUzZNMkZBTk0yUUxXS1pBVTZOVVFDV0lINEk2VCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ikhvc3BpdGFsU2VydmljZVByb3ZpZGVyIiwiZXhwIjoxNzUxNzQzNjgxLCJpc3MiOiJodHRwczovL3lvdXJfYXBpX2RvbWFpbi5jb20iLCJhdWQiOiJodHRwczovL3lvdXJfZnJvbnRlbmRfZG9tYWluLmNvbSJ9.RcHI9N7GmQpFQ2-1xxDBwIz03e0mEeENKUYgdXZFL6E"

    constructor(private http: HttpClient) {}

  getDoctors(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
    status?: string
  ): Observable<DoctorListResponse> {
    // Set up headers with bearer token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    // Build query parameters
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString())
      .set('UserStatus',status ? status : '');

       console.log("status",status);

    return this.http.get<DoctorListResponse>(`${this.apiUrl}/hospital-Doctors`, { headers, params });
  }

    getDoctorById(id: number): Observable<Doctor> {
        return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
    }

   createDoctor(doctorData: FormData): Observable<ApiResponse<any>> {
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
      // Don't set Content-Type - let Angular set it automatically for FormData
    });

    console.log(doctorData);
    return this.http.post<ApiResponse<any>>(this.apiUrl, doctorData, { headers }).pipe(
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

    updateDoctor(id: number, doctor: Doctor): Observable<Doctor> {
        return this.http.put<Doctor>(`${this.apiUrl}/${id}`, doctor);
    }

    deleteDoctor(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}