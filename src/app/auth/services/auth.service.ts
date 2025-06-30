import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterPatientRequest,
  AssetType,
  PatientProfile
} from '../models/auth.model';
import { tap } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;

  private loginStatusSubject: BehaviorSubject<boolean>;
  loginStatus$: Observable<boolean>;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    const tokenExists = this.cookieService.check('auth_token');
    this.loginStatusSubject = new BehaviorSubject<boolean>(tokenExists);
    this.loginStatus$ = this.loginStatusSubject.asObservable();
  }




  login(data: LoginRequest): Observable<LoginResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, data, { headers });
  }
logout(): void {

  this.cookieService.delete('auth_token', '/');


  localStorage.clear();
  sessionStorage.clear();

  this.setLoggedIn(false);
}


  setLoggedIn(status: boolean): void {
    this.loginStatusSubject.next(status);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('auth_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  confirmEmail(userId: string, token: string) {
    const params = new HttpParams({ fromObject: { userId, token } });
    return this.http.get<void>(`${this.baseUrl}/auth/confirm-email`, { params });
  }
  confirmNewEmail(userId: string, newEmail: string, token: string) {
  const params = new HttpParams({
    fromObject: { userId, newEmail, token }
  });

  return this.http.get<void>(`${this.baseUrl}/auth/confirm-new-email`, { params });
}

  forgotPassword(email: string): Observable<{ success: boolean; message: string }> {
  return this.http.post<{ success: boolean; message: string }>(
    `${this.baseUrl}/auth/forgot-password`,
    { email }
  );
}
resetPassword(data: {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
  userId: string;
}) {
  const params = new URLSearchParams({
    userId: data.userId,
  });

  return this.http.post(
    `${this.baseUrl}/auth/reset-password?${params.toString()}`,
    {
      token:data.token,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmNewPassword
    }
  );
}

getPatientProfile(): Observable<PatientProfile> {
  return this.http.get<PatientProfile>(`${this.baseUrl}/Patient/profile`);
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

changeEmail(payload: {
  newEmail: string;
  currentPassword: string;
}): Observable<{ success: boolean; message: string }> {

  return this.http.put<{ success: boolean; message: string }>(
    `${this.baseUrl}/auth/change-email`,
    payload,
    { headers: this.getAuthHeaders() }
  );
}


changePassword(payload: {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}): Observable<{ success: boolean; message: string }> {

  return this.http.put<{ success: boolean; message: string }>(
    `${this.baseUrl}/auth/change-password`,
    payload,
    { headers: this.getAuthHeaders() }
  );
}
private profileImageSubject = new BehaviorSubject<string>('');
profileImage$ = this.profileImageSubject.asObservable();

updateProfileImage(formData: FormData) {
  return this.http.put<any>(`${this.baseUrl}/Patient/profile/profile-image`, formData).pipe(
    tap(res => {
      this.profileImageSubject.next(res.url);
    })
  );
}


deleteProfileImage() {
  return this.http.delete<any>(`${this.baseUrl}/Patient/profile/profile-image`).pipe(
    tap(() => {
      this.profileImageSubject.next('');
    })
  );
}
updatePatientProfile(data: any) {
  return this.http.put(`${this.baseUrl}/Patient/profile`, data);
}





}
