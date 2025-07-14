import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ScheduleListResponse, ScheduleRequestDto, ScheduleResponseDto } from '../models/schedule.model';
import { HospitalAppointmentDto, HospitalAppointmentRespone } from '../models/Appointment.model';

@Injectable({
    providedIn: 'root'
})
export class ScheduleService {
    private apiUrl = `${environment.apiUrl}/HospitalProvider/`;

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
    getSchedulesWithFilter(searchTerm: string, statusFilter: string,filterDayOfWeekId?:number): Observable<ScheduleListResponse> {
let params = new HttpParams()
      .set('PageNumber', "1")
      .set('PageSize', "10");

    if (searchTerm) params = params.set('SearchTerm', searchTerm);
    if (filterDayOfWeekId) params = params.set('FilterDayOfWeekId', filterDayOfWeekId.toString());
    if (statusFilter !== undefined) params = params.set('FilterIsActive', statusFilter === 'active' ? 'true' : statusFilter === 'inactive' ? 'false' : '');

  return this.http.get<ScheduleListResponse>(`${this.apiUrl}Hospital-Schedules`, { params });
}
    getAppointments(ScheduleId:string,date?:any,status?:string): Observable<HospitalAppointmentRespone> {

      let params = new HttpParams()
      .set('ScheduleId', ScheduleId);
      if (date) params = params.set('Date', date);
      if (status !== undefined) params = params.set('appointmentStatus', status.toString());

      console.log("Fetching appointments with params:", params.toString());

        return this.http.get<HospitalAppointmentRespone>(`${this.apiUrl}hospital-appointments`,{params});
    }
}
