import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class HotelRoomService {
  private readonly apiUrl = `${environment.apiUrl}/api/HotelProvider`;
  private readonly jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse, context: string = ''): Observable<never> {
    console.error(`[HotelRoomService] Error in ${context || 'operation'}`, error);
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

  // ==================== ROOMS ====================
  getRooms(params: any = {}): Observable<any> {
    const httpParams = this.buildParams(params);
    return this.http.get<any>(`${this.apiUrl}/Rooms`, { params: httpParams }).pipe(
      catchError((error) => this.handleError(error, 'fetching rooms'))
    );
  }

  getRoomsWebsite(params: any = {}): Observable<any> {
    const httpParams = this.buildParams(params);
    return this.http.get<any>(`${this.apiUrl}/Rooms-website`, { params: httpParams }).pipe(
      catchError((error) => this.handleError(error, 'fetching website rooms'))
    );
  }

  getRoomById(roomId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Room/${roomId}`).pipe(
      catchError((error) => this.handleError(error, 'fetching room details'))
    );
  }

  addRoom(roomData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Room`, roomData).pipe(
      catchError((error) => this.handleError(error, 'adding room'))
    );
  }

  updateRoom(roomId: number, roomData: FormData): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Room/${roomId}`, roomData).pipe(
      catchError((error) => this.handleError(error, 'updating room'))
    );
  }

  updateRoomStatus(roomId: number, status: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Room/Instatus/${roomId}`, status).pipe(
      catchError((error) => this.handleError(error, 'updating room status'))
    );
  }

  updateRoomAvailability(roomId: number, isAvailable: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/Room/availability/${roomId}`, isAvailable).pipe(
      catchError((error) => this.handleError(error, 'updating room availability'))
    );
  }
} 