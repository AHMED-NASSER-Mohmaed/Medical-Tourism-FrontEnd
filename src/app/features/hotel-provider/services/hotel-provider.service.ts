import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class HotelProviderService {
  private readonly apiUrl = `${environment.apiUrl}/api/HotelProvider`;
  private readonly jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse, context: string = ''): Observable<never> {
    console.error(`[HotelProviderService] Error in ${context || 'operation'}`, error);
    let userMessage = 'Operation failed. Please try again.';
    let technicalMessage = error.message;
    if (error.status === 0) {
      userMessage = 'Network error: Please check your internet connection';
    } else if (error.status >= 400 && error.status < 500) {
      if (error.error?.errors) {
        technicalMessage = Object.entries(error.error.errors)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n');
      }
      userMessage = error.error?.message || userMessage;
    }
    this.showToast({
      title: 'Error',
      text: userMessage,
      icon: 'error',
      timer: 5000,
    });
    return throwError(() => ({ userMessage, technicalMessage, status: error.status }));
  }

  private showToast(config: { title: string; text: string; icon: 'success' | 'error' | 'warning' | 'info'; timer?: number; }): void {
    Swal.fire({
      position: 'top-end',
      toast: true,
      showConfirmButton: false,
      ...config,
      timer: config.timer || (config.icon === 'success' ? 3000 : undefined),
      timerProgressBar: true,
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' },
    });
  }

  private buildParams(params: Record<string, string | number | boolean>): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return httpParams;
  }

  // ==================== PROFILE ====================
  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Profile`).pipe(
      catchError((error) => this.handleError(error, 'fetching profile'))
    );
  }

  updateProfile(profile: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Profile`, profile, { headers: this.jsonHeaders }).pipe(
      catchError((error) => this.handleError(error, 'updating profile'))
    );
  }

  uploadProfileImage(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    return this.http.put<any>(`${this.apiUrl}/Profile/Profile-image`, formData).pipe(
      catchError((error) => this.handleError(error, 'uploading profile image'))
    );
  }

  deleteProfileImage(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Profile/Profile-image`).pipe(
      catchError((error) => this.handleError(error, 'deleting profile image'))
    );
  }
} 