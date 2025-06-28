import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { 
  UserBase,
  Patient,
  HotelProvider,
  HospitalProvider,
  CarRentalProvider,
  PaginatedResponse,
  AddPatientRequest,
  StatusChangeRequest,
  UserStatus,
  Gender,
  AssetStatus
} from '../models/super-admin.model';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SuperAdminService {
  private readonly apiUrl = `${environment.apiUrl}/api/SuperAdmin`;
  private readonly jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  // ==================== CORE UTILITIES ====================
  private handleError(error: HttpErrorResponse, context: string = ''): Observable<never> {
    console.error(`[SuperAdminService] Error in ${context || 'operation'}`, error);
    
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
      timer: 5000
    });

    return throwError(() => ({ 
      userMessage,
      technicalMessage,
      status: error.status 
    }));
  }

  private showToast(config: {
    title: string;
    text: string;
    icon: 'success' | 'error' | 'warning' | 'info';
    timer?: number;
  }): void {
    Swal.fire({
      position: 'top-end',
      toast: true,
      showConfirmButton: false,
      ...config,
      timer: config.timer || (config.icon === 'success' ? 3000 : undefined),
      timerProgressBar: true,
      showClass: { popup: 'animate__animated animate__fadeInDown' },
      hideClass: { popup: 'animate__animated animate__fadeOutUp' }
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

  // ==================== PROFILE MANAGEMENT ====================
  getProfile(): Observable<UserBase> {
    return this.http.get<UserBase>(`${this.apiUrl}/profile`).pipe(
      catchError(error => this.handleError(error, 'fetching profile'))
    );
  }

  // ==================== USER STATE MANAGEMENT ====================
  changeUserState(
    userId: string, 
    action: 'activate' | 'deactivate' | 'approve' | 'reject',
    notes?: string
  ): Observable<void> {
    const endpointMap = {
      activate: 'activate-user',
      deactivate: 'deactivate-user',
      approve: 'approve-provider',
      reject: 'reject-provider'
    };

    const url = `${this.apiUrl}/${endpointMap[action]}/${userId}`;
    const body = action === 'reject' ? JSON.stringify(notes || '') : null;

    return this.http.put<void>(url, body, {
      headers: action === 'reject' ? this.jsonHeaders : undefined
    }).pipe(
      tap(() => this.showToast({
        title: 'Success',
        text: `User ${action}d successfully`,
        icon: 'success'
      })),
      catchError(error => this.handleError(error, `${action} user`))
    );
  }

  // ==================== PATIENT MANAGEMENT ====================
  addPatient(patientData: AddPatientRequest): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/add-patient`, patientData).pipe(
      tap(() => this.showToast({
        title: 'Success',
        text: 'Patient created successfully',
        icon: 'success'
      })),
      catchError(error => this.handleError(error, 'creating patient'))
    );
  }

  getPatients(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters: {
      searchTerm?: string;
      userStatus?: UserStatus;
      fromDate?: string;
      toDate?: string;
    } = {}
  ): Observable<PaginatedResponse<Patient>> {
    const params = this.buildParams({
      PageNumber: pageNumber,
      PageSize: pageSize,
      ...filters
    });

    return this.http.get<PaginatedResponse<Patient>>(
      `${this.apiUrl}/patients`,
      { params }
    ).pipe(
      catchError(error => this.handleError(error, 'fetching patients'))
    );
  }

  // ==================== HOTEL PROVIDERS ====================
  addHotelProvider(providerData: Omit<HotelProvider, keyof UserBase | 'assetId'>): Observable<HotelProvider> {
    return this.http.post<HotelProvider>(
      `${this.apiUrl}/add-hotel-provider`,
      providerData
    ).pipe(
      tap(() => this.showToast({
        title: 'Success',
        text: 'Hotel provider created',
        icon: 'success'
      })),
      catchError(error => this.handleError(error, 'creating hotel provider'))
    );
  }

  getHotelProviders(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters: {
      searchTerm?: string;
      userStatus?: UserStatus;
      assetStatus?: AssetStatus;
    } = {}
  ): Observable<PaginatedResponse<HotelProvider>> {
    const params = this.buildParams({
      PageNumber: pageNumber,
      PageSize: pageSize,
      ...filters
    });

    return this.http.get<PaginatedResponse<HotelProvider>>(
      `${this.apiUrl}/hotel-providers`,
      { params }
    ).pipe(
      catchError(error => this.handleError(error, 'fetching hotel providers'))
    );
  }

  // ==================== HOSPITAL PROVIDERS ====================
  addHospitalProvider(providerData: Omit<HospitalProvider, keyof UserBase | 'assetId'>): Observable<HospitalProvider> {
    return this.http.post<HospitalProvider>(
      `${this.apiUrl}/add-hospital-provider`,
      providerData
    ).pipe(
      tap(() => this.showToast({
        title: 'Success',
        text: 'Hospital provider created',
        icon: 'success'
      })),
      catchError(error => this.handleError(error, 'creating hospital provider'))
    );
  }

  getHospitalProviders(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters: {
      searchTerm?: string;
      userStatus?: UserStatus;
      assetStatus?: AssetStatus;
      hasEmergency?: boolean;
    } = {}
  ): Observable<PaginatedResponse<HospitalProvider>> {
    const params = this.buildParams({
      PageNumber: pageNumber,
      PageSize: pageSize,
      ...filters
    });

    return this.http.get<PaginatedResponse<HospitalProvider>>(
      `${this.apiUrl}/hospital-providers`,
      { params }
    ).pipe(
      catchError(error => this.handleError(error, 'fetching hospital providers'))
    );
  }

  updateHospitalProvider(
    providerId: string,
    updates: Partial<HospitalProvider>
  ): Observable<HospitalProvider> {
    return this.http.put<HospitalProvider>(
      `${this.apiUrl}/hospital-providers/${providerId}`,
      updates
    ).pipe(
      tap(() => this.showToast({
        title: 'Success',
        text: 'Hospital provider updated',
        icon: 'success'
      })),
      catchError(error => this.handleError(error, 'updating hospital provider'))
    );
  }

  // ==================== CAR RENTAL PROVIDERS ====================
  addCarRentalProvider(providerData: Omit<CarRentalProvider, keyof UserBase | 'assetId'>): Observable<CarRentalProvider> {
    return this.http.post<CarRentalProvider>(
      `${this.apiUrl}/add-car-rental-provider`,
      providerData
    ).pipe(
      tap(() => this.showToast({
        title: 'Success',
        text: 'Car rental provider created',
        icon: 'success'
      })),
      catchError(error => this.handleError(error, 'creating car rental provider'))
    );
  }

getCarRentalProviders(
  pageNumber: number = 1,
  pageSize: number = 10,
  filters: { searchTerm?: string; userStatus?: number } = {}
): Observable<PaginatedResponse<CarRentalProvider>> {
  const params: any = {
    PageNumber: pageNumber,
    PageSize: pageSize,
    SearchTerm: filters.searchTerm || '',
    UserStatus: filters.userStatus
  };
  // Remove undefined params
  Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

  return this.http.get<PaginatedResponse<CarRentalProvider>>(
    `${this.apiUrl}/CarRental-providers`, // <-- Corrected endpoint
    { params }
  ).pipe(
    catchError(error => this.handleError(error, 'fetching car rental providers'))
  );
}
  uploadProviderDocuments(
    providerId: string,
    files: { 
      nationalId?: File; 
      credentials?: File 
    }
  ): Observable<{ nationalDocUrl: string; credentialDocUrl: string }> {
    const formData = new FormData();
    if (files.nationalId) formData.append('nationalId', files.nationalId);
    if (files.credentials) formData.append('credentials', files.credentials);

    return this.http.post<{ nationalDocUrl: string; credentialDocUrl: string }>(
      `${this.apiUrl}/providers/${providerId}/documents`,
      formData
    ).pipe(
      tap(() => this.showToast({
        title: 'Success',
        text: 'Documents uploaded successfully',
        icon: 'success'
      })),
      catchError(error => this.handleError(error, 'uploading documents'))
    );
  }

  // ==================== BULK OPERATIONS ====================
  exportProvidersToExcel(
    providerType: 'hotel' | 'hospital' | 'car-rental',
    filters: any = {}
  ): Observable<Blob> {
    const params = this.buildParams(filters);
    
    return this.http.get(
      `${this.apiUrl}/${providerType}-providers/export`,
      { 
        params,
        responseType: 'blob' 
      }
    ).pipe(
      tap(() => this.showToast({
        title: 'Success',
        text: 'Export started successfully',
        icon: 'success'
      })),
      catchError(error => this.handleError(error, 'exporting data'))
    );
  }
  changeUserEmail(userId: string, newEmail: string): Observable<void> {
  return this.http.put<void>(
    `${this.apiUrl}/change-user-email/${userId}`,
    JSON.stringify(newEmail),
    { headers: this.jsonHeaders }
  ).pipe(
    tap(() => this.showToast({
      title: 'Success',
      text: 'Email updated successfully',
      icon: 'success'
    })),
    catchError(error => this.handleError(error, 'changing user email'))
  );
}
resetUserPassword(userId: string): Observable<void> {
  return this.http.post<void>(
    `${this.apiUrl}/reset-user-password-${userId}`,
    null
  ).pipe(
    tap(() => this.showToast({
      title: 'Success',
      text: 'Password reset successfully',
      icon: 'success'
    })),
    catchError(error => this.handleError(error, 'resetting user password'))
  );
}
}