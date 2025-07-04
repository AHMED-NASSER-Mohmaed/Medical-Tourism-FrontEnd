import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';  // Import map operator
import { Clinic, DisplayHospitals, Doctor } from '../models/Hospital.model';  // Assuming your hospital model is correctly defined

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  private baseUrl = 'http://localhost:5211/api/Website/Hospitals'; // Replace with your real API URL

  constructor(private http: HttpClient) {}

getHospitals(
  pageNumber: number = 1,
  pageSize: number = 10,
  search: string = '',
  specialtyId: number = 0,
  governorateId: number = 0
): Observable<any> {
  // Build query params dynamically based on the values of specialtyId and governorateId
  let url = `${this.baseUrl}?PageNumber=${pageNumber}&PageSize=${pageSize}&SearchTerm=${search}`;

  if (specialtyId !== 0 ) {
    url += `&specialtyId=${specialtyId}`;
  }

  if (governorateId !== 0) {
    url += `&GovernerateId=${governorateId}`;
  }

  console.log('API URL:', url);  // Log the URL for debugging
  return this.http.get<any>(url);
}


  getSpecialties(): Observable<any[]> {
    const url = 'http://localhost:5211/api/Website/Specilties';  // Your API URL for specialties
    return this.http.get<any>(url).pipe(
      map((data: any) => {
        // Ensure that we're returning the items array (the specialties)
        return data?.items || [];
      })
    );
  }

  filterHospitals(filterCriteria: { name: string; specialty: string; location: string }): Observable<any[]> {
    return new Observable(observer => {
      observer.next([]); // Modify as needed based on actual backend filtering
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
      observer.next([]);  // Modify this line based on actual filtering logic
      observer.complete();
    });
  }
}
