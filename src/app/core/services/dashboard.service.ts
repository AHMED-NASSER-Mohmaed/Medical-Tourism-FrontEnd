// src/app/core/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getRecentActivity(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recent-activity`);
  }
}