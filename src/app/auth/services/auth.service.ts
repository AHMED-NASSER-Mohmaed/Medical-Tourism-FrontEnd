import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterPatientRequest,
  AssetType,
} from '../models/auth.model';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(data: LoginRequest): Observable<LoginResponse> {
     const headers = this.getAuthHeaders();
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, data, { headers });
  }

private getAuthHeaders(): HttpHeaders {
  const token = this.cookieService.get('auth_token');
  return new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
}


confirmEmail(userId: string, token: string) {
  const params = new HttpParams({ fromObject: { userId, token } });

  /* استعمل back-ticks ` … ` لكى تُستبدل قيمة baseUrl */
  return this.http.get<void>(`${this.baseUrl}/auth/confirm-email`, { params });
}



  registerPatient(data: RegisterPatientRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register-patient`, data);
  }

  RegisterHotelRequest(payload: FormData) {
  return this.http.post(`${this.baseUrl}/auth/register-hotel-provider`, payload);
}
  RegisterHospitalRequest(payload: FormData) {
  return this.http.post(`${this.baseUrl}/auth/register-hospital-provider`, payload);
}

  RegisterCarRentalRequest(payload: FormData) {
  return this.http.post(`${this.baseUrl}/auth/register-car-rental-provider`, payload);
}
}
