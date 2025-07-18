import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Clinic, DisplayHospitals, Doctor } from '../models/Hospital.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  private baseUrl = `${environment.apiUrl}/Website/Hospitals`;
  public cachedDoctors: any[] = [];

  constructor(private http: HttpClient) {}

getHospitals(
  pageNumber: number = 1,
  pageSize: number = 10,
  search: string = '',
  specialtyId: number = 0,
  governorateId: number = 0
): Observable<any> {

  let url = `${this.baseUrl}?PageNumber=${pageNumber}&PageSize=${pageSize}&SearchTerm=${search}`;

  if (specialtyId !== 0 ) {
    url += `&specialtyId=${specialtyId}`;
  }

  if (governorateId !== 0) {
    url += `&GovernerateId=${governorateId}`;
  }

  return this.http.get<any>(url);
}


  getSpecialties(): Observable<any[]> {
    const url = `${environment.apiUrl}/Website/Specilties`;
    return this.http.get<any>(url).pipe(
      map((data: any) => {
        return data?.items || [];
      })
    );
  }

  filterHospitals(filterCriteria: { name: string; specialty: string; location: string }): Observable<any[]> {
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  getDoctorsByHospitalAndClinic(hospitalId: number, clinicId: number): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseUrl}/${hospitalId}/clinics/${clinicId}/doctors`);
  }

  getDoctorSchedule(hospitalId: number, clinicId: number, doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${hospitalId}/clinics/${clinicId}/doctors/${doctorId}/schedule`);
  }

  getClinicsByHospitalId(hospitalId: string): Observable<Clinic[]> {
    return this.http.get<Clinic[]>(`${this.baseUrl}/${hospitalId}/clinics`);
  }

  filterClinics(hospitalId: string, searchTerm: string, selectedSpecialists: string[]): Observable<Clinic[]> {
    return new Observable(observer => {
      observer.next([]);
      observer.complete();
    });
  }

  getSpecialistsForSuperAdmin(pageNumber: number, pageSize: number, searchQuery: string): Observable<any> {
    const url = `${environment.apiUrl}/Specialties/SuperAdmin?pageNumber=${pageNumber}&pageSize=${pageSize}&SearchTerm=${searchQuery}`;
    return this.http.get<any>(url);
  }


  getSpecialistsForHospital(hospitalId: string, pageNumber: number, pageSize: number, searchQuery: string): Observable<any> {
    const url = `${environment.apiUrl}/Website/Specilties-in-Hospital/${hospitalId}?pageNumber=${pageNumber}&pageSize=${pageSize}&SearchTerm=${searchQuery}`;
    return this.http.get<any>(url);
  }
    getDoctorsForSpecialty(specialtyId: string, hospitalId: string, pageNumber: number, pageSize: number, searchQuery: string): Observable<any> {
    const url = `${environment.apiUrl}/Website/Doctors-in-Specialty/${specialtyId}/${hospitalId}?PageNumber=${pageNumber}&PageSize=${pageSize}&SearchTerm=${searchQuery}`;
    return this.http.get<any>(url);
  }
    getDoctorScheduleById(doctorId: string): Observable<any[]> {
    const url = `${environment.apiUrl}/HospitalProvider/schedule/available-slots?FilterDoctorId=${doctorId}`;
    return this.http.get<any[]>(url);
  }

    getAppointmentHistory(pageNumber: number, pageSize: number): Observable<any> {
    const url = `${environment.apiUrl}/patient/profile/history?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<any>(url);
  }
    getBookingDetails(packageId: string): Observable<any> {
    const url = `${environment.apiUrl}/patient/profile/history/details?packageId=${packageId}`;
    return this.http.post<any>(url,{});
  }



  cancelBooking(bookingId: string): Observable<any> {
    const url = `${environment.apiUrl}/patient/profile/history?packageId=${bookingId}`;
    return this.http.post(url, {});
  }

}
