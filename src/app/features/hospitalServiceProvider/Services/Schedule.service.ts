import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduleListResponse, ScheduleRequestDto, ScheduleResponseDto } from '../models/schedule.model';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    private apiUrl = 'https://localhost:7078/api/HospitalProvider/'; // Replace with your actual API endpoint
    
    constructor(private http: HttpClient) {}

   getSchedules(
    pageNumber: number = 1,
    pageSize: number = 10,
    searchTerm?: string,
    filterDayOfWeekId?: number,
    filterIsActive?: boolean
  ): Observable<ScheduleListResponse> {
    // Set up headers with bearer token
    

    // Build query parameters
    let params = new HttpParams()
      .set('PageNumber', pageNumber.toString())
      .set('PageSize', pageSize.toString());

    if (searchTerm) params = params.set('SearchTerm', searchTerm);
    if (filterDayOfWeekId) params = params.set('FilterDayOfWeekId', filterDayOfWeekId.toString());
    if (filterIsActive !== undefined) params = params.set('FilterIsActive', filterIsActive.toString());

    return this.http.get<ScheduleListResponse>(`${this.apiUrl}Hospital-Schedules`, {  params });
  }

    getScheduleById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createSchedule(schedule: ScheduleRequestDto): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}schedule`, schedule);
    }

    updateSchedule(id: number, schedule: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, schedule);
    }

    deleteSchedule(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
     ChangeSpecialtyStatus(scheduleID: number,status:boolean): Observable<any> {
        return this.http.put(`${this.apiUrl}schedule/status/${scheduleID}`, status);
    }
}