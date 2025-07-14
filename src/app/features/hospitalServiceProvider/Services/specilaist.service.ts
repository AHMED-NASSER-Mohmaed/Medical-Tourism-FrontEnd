import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
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
    private apiUrl = `${environment.apiUrl}/Specialties/`;
    constructor(private http: HttpClient) {}

    getAllSpecialists(pageNumber:number=1,pagesize:number=10,isActive?:boolean): Observable<PaginatedSpecialtiesResponse> {
         let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pagesize.toString())
      .set('isActive',isActive ? isActive : '');

        return this.http.get<PaginatedSpecialtiesResponse>(`${this.apiUrl}HospitalAdmin`, { params });
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

        return this.http.get<PaginatedSpecialtiesResponse>(`${this.apiUrl}available-for-linking/my-hospital`);
    }
    addSpecialistToList(specialistId: number): Observable<Specialist> {
        return this.http.post<Specialist>(`${this.apiUrl}link-to-hospital-admin/${specialistId}`,null );
    }
    ChangeSpecialtyStatus(specialtyId: number,status:boolean): Observable<any> {
        const statusvalue = status ? 1 : 0; // Convert boolean to 1 or 0
        return this.http.put(`${this.apiUrl}myhospital/status-link/${specialtyId}`, statusvalue);
    }
}
