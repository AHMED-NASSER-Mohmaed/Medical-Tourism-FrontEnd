import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedSpecialtiesResponse } from '../models/specialist.model';
export interface Specialist {
    id: number;
    name: string;
    specialty: string;
    description?: string;
    // Add more fields as needed
}

@Injectable({
    providedIn: 'root'
})
export class SpecialistService {
    private apiUrl = 'https://localhost:7078/api/Specialties/'; // Replace with your API endpoint
    private token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhNmJlYi0wMWE5LTRmODItYWMzNi1jZjc1MTBmNGRlMzEiLCJqdGkiOiIxZTI1MmNlZi02YjFhLTQzYWQtODVkZS0zYWMyN2VlNTAwOGUiLCJlbWFpbCI6Im1vaGFtZWQubS5lbG1haGR5MjhAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJmZWVhNmJlYi0wMWE5LTRmODItYWMzNi1jZjc1MTBmNGRlMzEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibW9oYW1lZC5tLmVsbWFoZHkyOEBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9naXZlbm5hbWUiOiJKb2huIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc3VybmFtZSI6IkRvZSIsIlNlY3VyaXR5U3RhbXAiOiJUSVRMUzZNMkZBTk0yUUxXS1pBVTZOVVFDV0lINEk2VCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ikhvc3BpdGFsU2VydmljZVByb3ZpZGVyIiwiZXhwIjoxNzUxNzQzNjgxLCJpc3MiOiJodHRwczovL3lvdXJfYXBpX2RvbWFpbi5jb20iLCJhdWQiOiJodHRwczovL3lvdXJfZnJvbnRlbmRfZG9tYWluLmNvbSJ9.RcHI9N7GmQpFQ2-1xxDBwIz03e0mEeENKUYgdXZFL6E"
    constructor(private http: HttpClient) {}

    getAllSpecialists(): Observable<PaginatedSpecialtiesResponse> {
        const headers = { 'Authorization': `Bearer ${this.token}` };
        return this.http.get<PaginatedSpecialtiesResponse>(`${this.apiUrl}HospitalAdmin`, { headers });
    }

    getSpecialistById(id: number): Observable<Specialist> {
        return this.http.get<Specialist>(`${this.apiUrl}/${id}`);
    }

    addSpecialist(specialist: Specialist): Observable<Specialist> {
        return this.http.post<Specialist>(this.apiUrl, specialist);
    }

    updateSpecialist(id: number, specialist: Specialist): Observable<Specialist> {
        return this.http.put<Specialist>(`${this.apiUrl}/${id}`, specialist);
    }

    deleteSpecialist(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    getAvailableSpecialists(): Observable<PaginatedSpecialtiesResponse> {
        const headers = { 'Authorization': `Bearer ${this.token}` };
        return this.http.get<PaginatedSpecialtiesResponse>(`${this.apiUrl}available-for-linking/my-hospital`, { headers });
    }
    addSpecialistToList(specialistId: number): Observable<Specialist> {
        const headers = { 'Authorization': `Bearer ${this.token}` };
        return this.http.post<Specialist>(`${this.apiUrl}link-to-hospital-admin/${specialistId}`,null ,{ headers });
    }
    ChangeSpecialtyStatus(specialtyId: number,status:boolean): Observable<any> {
        const statusvalue = status ? 1 : 0; // Convert boolean to 1 or 0
        const headers = { 'Authorization': `Bearer ${this.token}` ,'Content-Type': 'application/json' };
        return this.http.put(`${this.apiUrl}myhospital/status-link/${specialtyId}`, statusvalue, { headers });
    }
}