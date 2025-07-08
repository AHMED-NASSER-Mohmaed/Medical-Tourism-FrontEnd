import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DisbursementListResponse } from '../models/disbursement';

@Injectable({
    providedIn: 'root'
})
export class DisbursementService {
    private apiUrl = ' https://localhost:7078/api/HospitalProvider/disbursement';
    constructor(private http: HttpClient) {}

    getAllDisbursements(): Observable<DisbursementListResponse> {
       
        return this.http.get<DisbursementListResponse>(this.apiUrl);
    }

    getDisbursementById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createDisbursement(data: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, data);
    }

    updateDisbursement(id: number, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    }

    deleteDisbursement(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}