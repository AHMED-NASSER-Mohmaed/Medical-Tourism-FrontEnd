import { environment } from './../../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
import { 
  UserBase, 
  Patient, 
  HotelProvider, 
  HospitalProvider,
  CarRentalProvider,
  PaginatedResponse,
  StatusChangeRequest
} from '../models/super-admin.model';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SuperAdminService {
  private apiUrl = `${environment.apiUrl}/api/SuperAdmin`;
  private defaultError = 'An unexpected error occurred. Please try again later.';

  constructor(private http: HttpClient) {}

  // ==================== ERROR HANDLER ====================
  private handleError(error: HttpErrorResponse, customMessage?: string): Observable<never> {
    console.error('SuperAdmin Service Error:', error);
    
    let errorMessage = customMessage || this.defaultError;
    let details = '';
    
    // Handle different error types
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      details = `Client error: ${error.error.message}`;
    } else if (error.status === 0) {
      // Network error
      details = 'Network error: Could not connect to server';
    } else {
      // Server-side error
      details = `Server error: ${error.status} - ${error.statusText}`;
      
      // Extract server error message if available
      if (error.error?.message) {
        details += ` | ${error.error.message}`;
      } else if (error.error) {
        details += ` | ${JSON.stringify(error.error)}`;
      }
    }
    
    // Show SweetAlert notification
    this.showError(errorMessage, details);
    
    // Rethrow for component handling if needed
    return throwError(() => new Error(details));
  }

  private showError(title: string, text: string): void {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
      customClass: {
        container: 'sweet-alert-container',
        popup: 'sweet-alert-popup',
        title: 'sweet-alert-title',
        confirmButton: 'sweet-alert-confirm'
      }
    });
  }

  private showSuccess(title: string): void {
    Swal.fire({
      title,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      customClass: {
        container: 'sweet-alert-container',
        popup: 'sweet-alert-popup',
        title: 'sweet-alert-title'
      }
    });
  }

  // ==================== PROFILE ====================
  getProfile(): Observable<UserBase> {
    return this.http.get<UserBase>(`${this.apiUrl}/profile`).pipe(
      catchError(error => this.handleError(error, 'Failed to load profile'))
    );
  }

  // ==================== USER MANAGEMENT ====================
  activateUser(userId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/activate-user/${userId}`, {}).pipe(
      catchError(error => this.handleError(error, 'Failed to activate user')),
      tap(() => this.showSuccess('User activated successfully'))
    );
  }

  deactivateUser(userId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/deactivate-user/${userId}`, {}).pipe(
      catchError(error => this.handleError(error, 'Failed to deactivate user')),
      tap(() => this.showSuccess('User deactivated successfully'))
    );
  }

  changeUserEmail(userId: string, newEmail: string): Observable<void> {
    const params = new HttpParams().set('userId', userId);
    return this.http.put<void>(
      `${this.apiUrl}/change-user-email`, 
      `"${newEmail}"`, 
      { params, headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to change email')),
      tap(() => this.showSuccess('Email changed successfully'))
    );
  }

  resetUserPassword(userId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-user-password/${userId}`, {}).pipe(
      catchError(error => this.handleError(error, 'Failed to reset password')),
      tap(() => this.showSuccess('Password reset initiated'))
    );
  }

  // ==================== PROVIDER APPROVAL ====================
  approveProvider(providerId: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/approve-provider/${providerId}`, {}).pipe(
      catchError(error => this.handleError(error, 'Failed to approve provider')),
      tap(() => this.showSuccess('Provider approved successfully'))
    );
  }

  rejectProvider(providerId: string, notes: string): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/reject-provider/${providerId}`, 
      `"${notes}"`, 
      { headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to reject provider')),
      tap(() => this.showSuccess('Provider rejected successfully'))
    );
  }

  setAssetVerificationStatus(
    assetId: string, 
    status: number, 
    notes: string
  ): Observable<void> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.put<void>(
      `${this.apiUrl}/set-asset-verification-status/${assetId}`,
      `"${notes}"`,
      { params, headers: { 'Content-Type': 'application/json' } }
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to update asset status')),
      tap(() => this.showSuccess('Asset status updated'))
    );
  }

  // ==================== PATIENT MANAGEMENT ====================
  addPatient(patientData: any): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/add-patient`, patientData).pipe(
      catchError(error => this.handleError(error, 'Failed to create patient')),
      tap(() => this.showSuccess('Patient created successfully'))
    );
  }

  getPatient(patientId: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/patients/${patientId}`).pipe(
      catchError(error => this.handleError(error, 'Failed to load patient details'))
    );
  }

  getPatients(
    page: number = 1, 
    limit: number = 10, 
    searchQuery: string = ''
  ): Observable<PaginatedResponse<Patient>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (searchQuery) params = params.set('searchQuery', searchQuery);

    return this.http.get<PaginatedResponse<Patient>>(
      `${this.apiUrl}/patients`, 
      { params }
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to load patients'))
    );
  }

  // ==================== HOTEL PROVIDER MANAGEMENT ====================
  addHotelProvider(providerData: any): Observable<HotelProvider> {
    return this.http.post<HotelProvider>(
      `${this.apiUrl}/add-hotel-provider`, 
      providerData
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to create hotel provider')),
      tap(() => this.showSuccess('Hotel provider created successfully'))
    );
  }

  getHotelProvider(providerId: string): Observable<HotelProvider> {
    return this.http.get<HotelProvider>(
      `${this.apiUrl}/hotel-providers/${providerId}`
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to load hotel provider'))
    );
  }

  getHotelProviders(
    page: number = 1, 
    limit: number = 10, 
    searchQuery: string = '', 
    userStatus?: number,
    assetStatus?: number
  ): Observable<PaginatedResponse<HotelProvider>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (searchQuery) params = params.set('searchQuery', searchQuery);
    if (userStatus !== undefined) params = params.set('userStatus', userStatus.toString());
    if (assetStatus !== undefined) params = params.set('assetStatus', assetStatus.toString());

    return this.http.get<PaginatedResponse<HotelProvider>>(
      `${this.apiUrl}/hotel-providers`, 
      { params }
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to load hotel providers'))
    );
  }

  // ==================== HOSPITAL PROVIDER MANAGEMENT ====================
  addHospitalProvider(providerData: any): Observable<HospitalProvider> {
    return this.http.post<HospitalProvider>(
      `${this.apiUrl}/add-hospital-provider`, 
      providerData
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to create hospital provider')),
      tap(() => this.showSuccess('Hospital provider created successfully'))
    );
  }

  getHospitalProvider(providerId: string): Observable<HospitalProvider> {
    return this.http.get<HospitalProvider>(
      `${this.apiUrl}/hospital-providers/${providerId}`
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to load hospital provider'))
    );
  }

  getHospitalProviders(
    page: number = 1, 
    limit: number = 10, 
    searchQuery: string = '', 
    userStatus?: number,
    assetStatus?: number
  ): Observable<PaginatedResponse<HospitalProvider>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (searchQuery) params = params.set('searchQuery', searchQuery);
    if (userStatus !== undefined) params = params.set('userStatus', userStatus.toString());
    if (assetStatus !== undefined) params = params.set('assetStatus', assetStatus.toString());

    return this.http.get<PaginatedResponse<HospitalProvider>>(
      `${this.apiUrl}/hospital-providers`, 
      { params }
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to load hospital providers'))
    );
  }

  // ==================== CAR RENTAL PROVIDER MANAGEMENT ====================
  addCarRentalProvider(providerData: any): Observable<CarRentalProvider> {
    return this.http.post<CarRentalProvider>(
      `${this.apiUrl}/add-car-rental-provider`, 
      providerData
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to create car rental provider')),
      tap(() => this.showSuccess('Car rental provider created successfully'))
    );
  }

  getCarRentalProvider(providerId: string): Observable<CarRentalProvider> {
    return this.http.get<CarRentalProvider>(
      `${this.apiUrl}/car-rental-providers/${providerId}`
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to load car rental provider'))
    );
  }

  getCarRentalProviders(
    page: number = 1, 
    limit: number = 10, 
    searchQuery: string = '', 
    userStatus?: number,
    assetStatus?: number
  ): Observable<PaginatedResponse<CarRentalProvider>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (searchQuery) params = params.set('searchQuery', searchQuery);
    if (userStatus !== undefined) params = params.set('userStatus', userStatus.toString());
    if (assetStatus !== undefined) params = params.set('assetStatus', assetStatus.toString());

    return this.http.get<PaginatedResponse<CarRentalProvider>>(
      `${this.apiUrl}/car-rental-providers`, 
      { params }
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to load car rental providers'))
    );
  }

  // ==================== UTILITY METHODS ====================
  private createPaginationParams(
    page: number, 
    limit: number, 
    searchQuery?: string, 
    userStatus?: number,
    assetStatus?: number
  ): HttpParams {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (searchQuery) params = params.set('searchQuery', searchQuery);
    if (userStatus !== undefined) params = params.set('userStatus', userStatus.toString());
    if (assetStatus !== undefined) params = params.set('assetStatus', assetStatus.toString());

    return params;
  }
}