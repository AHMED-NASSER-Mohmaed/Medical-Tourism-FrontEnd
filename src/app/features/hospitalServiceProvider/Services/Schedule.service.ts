import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduleListResponse, ScheduleRequestDto, ScheduleResponseDto } from '../models/schedule.model';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    private apiUrl = 'https://localhost:7078/api/HospitalProvider/'; // Replace with your actual API endpoint
    private token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhNmJlYi0wMWE5LTRmODItYWMzNi1jZjc1MTBmNGRlMzEiLCJqdGkiOiIxZTI1MmNlZi02YjFhLTQzYWQtODVkZS0zYWMyN2VlNTAwOGUiLCJlbWFpbCI6Im1vaGFtZWQubS5lbG1haGR5MjhAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJmZWVhNmJlYi0wMWE5LTRmODItYWMzNi1jZjc1MTBmNGRlMzEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibW9oYW1lZC5tLmVsbWFoZHkyOEBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9naXZlbm5hbWUiOiJKb2huIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc3VybmFtZSI6IkRvZSIsIlNlY3VyaXR5U3RhbXAiOiJUSVRMUzZNMkZBTk0yUUxXS1pBVTZOVVFDV0lINEk2VCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6Ikhvc3BpdGFsU2VydmljZVByb3ZpZGVyIiwiZXhwIjoxNzUxNzQzNjgxLCJpc3MiOiJodHRwczovL3lvdXJfYXBpX2RvbWFpbi5jb20iLCJhdWQiOiJodHRwczovL3lvdXJfZnJvbnRlbmRfZG9tYWluLmNvbSJ9.RcHI9N7GmQpFQ2-1xxDBwIz03e0mEeENKUYgdXZFL6E"
    
    constructor(private http: HttpClient) {}

   getSchedules(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
    filterDayOfWeekId?: number,
    filterIsActive?: boolean
  ): Observable<ScheduleListResponse> {
    // Set up headers with bearer token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    // Build query parameters
    let params = new HttpParams()
      .set('PageNumber', pageNumber.toString())
      .set('PageSize', pageSize.toString());

    if (searchTerm) params = params.set('SearchTerm', searchTerm);
    if (filterDayOfWeekId) params = params.set('FilterDayOfWeekId', filterDayOfWeekId.toString());
    if (filterIsActive !== undefined) params = params.set('FilterIsActive', filterIsActive.toString());

    return this.http.get<ScheduleListResponse>(`${this.apiUrl}Hospital-Schedules`, { headers, params });
  }

    getScheduleById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createSchedule(schedule: ScheduleRequestDto): Observable<any> {
      const headers = { 'Authorization': `Bearer ${this.token}` ,'Content-Type': 'application/json' };
      return this.http.post<any>(`${this.apiUrl}schedule`, schedule, { headers });
    }

    updateSchedule(id: number, schedule: any): Observable<any> {
        const headers = { 'Authorization': `Bearer ${this.token}` ,'Content-Type': 'application/json' };
        return this.http.put<any>(`${this.apiUrl}/${id}`, schedule,{headers});
    }

    deleteSchedule(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
     ChangeSpecialtyStatus(scheduleID: number,status:boolean): Observable<any> {
        const headers = { 'Authorization': `Bearer ${this.token}` ,'Content-Type': 'application/json' };
        return this.http.put(`${this.apiUrl}schedule/status/${scheduleID}`, status, { headers });
    }
}