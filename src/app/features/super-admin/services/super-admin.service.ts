// Full SuperAdminService with caching and all existing methods

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
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
  AssetStatus,
  ProviderCacheUpdatePayload,
  ProviderStatusChangeResponse,
  ProviderStatusChangeRequest,
  ProviderType,
  ApprovalAction,
  BaseProvider,
} from '../models/super-admin.model';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SuperAdminService {
  private readonly jsonHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  // Caches
  private patientCache: Patient[] = [];
  private isPatientCacheLoaded = false;

  private hotelProviderCache: HotelProvider[] = [];
  private isHotelProviderCacheLoaded = false;

  private hospitalProviderCache: HospitalProvider[] = [];
  private isHospitalProviderCacheLoaded = false;

  private carRentalProviderCache: CarRentalProvider[] = [];
  private isCarRentalProviderCacheLoaded = false;

  // ==================== UTILITIES ====================
  private handleError(
    error: HttpErrorResponse,
    context: string = ''
  ): Observable<never> {
    console.error(
      `[SuperAdminService] Error in ${context || 'operation'}`,
      error
    );

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

    return throwError(() => ({
      userMessage,
      technicalMessage,
      status: error.status,
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
      hideClass: { popup: 'animate__animated animate__fadeOutUp' },
    });
  }

  private buildParams(
    params: Record<string, string | number | boolean>
  ): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });
    return httpParams;
  }

  // ==================== PROFILE ====================
  getProfile(): Observable<UserBase> {
    return this.http
      .get<UserBase>(`${environment.apiUrl}/superadmin/profile`)
      .pipe(catchError((error) => this.handleError(error, 'fetching profile')));
  }

  // ==================== PATIENTS ====================
  addPatient(patientData: AddPatientRequest): Observable<Patient> {
    return this.http
      .post<Patient>(`${environment.apiUrl}/superadmin/add-patient`, patientData)
      .pipe(
        tap(() =>
          this.showToast({
            title: 'Success',
            text: 'Patient created successfully',
            icon: 'success',
          })
        ),
        catchError((error) => this.handleError(error, 'creating patient'))
      );
  }

  getPatients(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters: any = {}
  ): Observable<PaginatedResponse<Patient>> {
    const params = this.buildParams({
      PageNumber: pageNumber,
      PageSize: pageSize,
      ...filters,
    });
    return this.http
      .get<PaginatedResponse<Patient>>(`${environment.apiUrl}/superadmin/patients`, { params })
      .pipe(
        catchError((error) => this.handleError(error, 'fetching patients'))
      );
  }

  getPatientByIdFromCacheOrLoad(id: string): Observable<Patient | undefined> {
    if (this.isPatientCacheLoaded) {
      return of(this.patientCache.find((p) => p.id === id));
    }
    return this.getPatients(1, 100).pipe(
      tap((res) => {
        this.patientCache = res.items;
        this.isPatientCacheLoaded = true;
      }),
      map((res) => res.items.find((p) => p.id === id))
    );
  }

  // ==================== HOTEL PROVIDERS ====================
  addHotelProvider(
    providerData: Omit<HotelProvider, keyof UserBase | 'assetId'>
  ): Observable<HotelProvider> {
    return this.http
      .post<HotelProvider>(`${environment.apiUrl}/superadmin/add-hotel-provider`, providerData)
      .pipe(
        tap(() =>
          this.showToast({
            title: 'Success',
            text: 'Hotel provider created',
            icon: 'success',
          })
        ),
        catchError((error) =>
          this.handleError(error, 'creating hotel provider')
        )
      );
  }

  getHotelProviders(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters: any = {}
  ): Observable<PaginatedResponse<HotelProvider>> {
    const params = this.buildParams({
      PageNumber: pageNumber,
      PageSize: pageSize,
      ...filters,
    });
    return this.http
      .get<PaginatedResponse<HotelProvider>>(`${environment.apiUrl}/superadmin/hotel-providers`, {
        params,
      })
      .pipe(
        catchError((error) =>
          this.handleError(error, 'fetching hotel providers')
        )
      );
  }

  getHotelProviderByIdFromCacheOrLoad(
    id: string
  ): Observable<HotelProvider | undefined> {
    if (this.isHotelProviderCacheLoaded) {
      return of(this.hotelProviderCache.find((p) => p.id === id));
    }
    return this.getHotelProviders(1, 100).pipe(
      tap((res) => {
        this.hotelProviderCache = res.items;
        this.isHotelProviderCacheLoaded = true;
      }),
      map((res) => res.items.find((p) => p.id === id))
    );
  }

  // ==================== HOSPITAL PROVIDERS ====================
  addHospitalProvider(
    providerData: Omit<HospitalProvider, keyof UserBase | 'assetId'>
  ): Observable<HospitalProvider> {
    return this.http
      .post<HospitalProvider>(
        `${environment.apiUrl}/superadmin/add-hospital-provider`,
        providerData
      )
      .pipe(
        tap(() =>
          this.showToast({
            title: 'Success',
            text: 'Hospital provider created',
            icon: 'success',
          })
        ),
        catchError((error) =>
          this.handleError(error, 'creating hospital provider')
        )
      );
  }

  getHospitalProviders(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters: any = {}
  ): Observable<PaginatedResponse<HospitalProvider>> {
    const params = this.buildParams({
      PageNumber: pageNumber,
      PageSize: pageSize,
      ...filters,
    });
    return this.http
      .get<PaginatedResponse<HospitalProvider>>(
        `${environment.apiUrl}/superadmin/hospital-providers`,
        { params }
      )
      .pipe(
        catchError((error) =>
          this.handleError(error, 'fetching hospital providers')
        )
      );
  }

  getHospitalProviderByIdFromCacheOrLoad(
    id: string
  ): Observable<HospitalProvider | undefined> {
    if (this.isHospitalProviderCacheLoaded) {
      return of(this.hospitalProviderCache.find((p) => p.id === id));
    }
    return this.getHospitalProviders(1, 100).pipe(
      tap((res) => {
        this.hospitalProviderCache = res.items;
        this.isHospitalProviderCacheLoaded = true;
      }),
      map((res) => res.items.find((p) => p.id === id))
    );
  }

  updateHospitalProvider(
    providerId: string,
    updates: Partial<HospitalProvider>
  ): Observable<HospitalProvider> {
    return this.http
      .put<HospitalProvider>(
        `${environment.apiUrl}/superadmin/hospital-providers/${providerId}`,
        updates
      )
      .pipe(
        tap(() =>
          this.showToast({
            title: 'Success',
            text: 'Hospital provider updated',
            icon: 'success',
          })
        ),
        catchError((error) =>
          this.handleError(error, 'updating hospital provider')
        )
      );
  }

  // ==================== CAR RENTAL PROVIDERS ====================
  addCarRentalProvider(
    providerData: Omit<CarRentalProvider, keyof UserBase | 'assetId'>
  ): Observable<CarRentalProvider> {
    return this.http
      .post<CarRentalProvider>(
        `${environment.apiUrl}/superadmin/add-car-rental-provider`,
        providerData
      )
      .pipe(
        tap(() =>
          this.showToast({
            title: 'Success',
            text: 'Car rental provider created',
            icon: 'success',
          })
        ),
        catchError((error) =>
          this.handleError(error, 'creating car rental provider')
        )
      );
  }

  getCarRentalProviders(
    pageNumber: number = 1,
    pageSize: number = 10,
    filters: any = {}
  ): Observable<PaginatedResponse<CarRentalProvider>> {
    const params = this.buildParams({
      PageNumber: pageNumber,
      PageSize: pageSize,
      ...filters,
    });
    return this.http
      .get<PaginatedResponse<CarRentalProvider>>(
        `${environment.apiUrl}/superadmin/CarRental-providers`,
        { params }
      )
      .pipe(
        catchError((error) =>
          this.handleError(error, 'fetching car rental providers')
        )
      );
  }

  getCarRentalProviderByIdFromCacheOrLoad(
    id: string
  ): Observable<CarRentalProvider | undefined> {
    if (this.isCarRentalProviderCacheLoaded) {
      return of(this.carRentalProviderCache.find((p) => p.id === id));
    }
    return this.getCarRentalProviders(1, 100).pipe(
      tap((res) => {
        this.carRentalProviderCache = res.items;
        this.isCarRentalProviderCacheLoaded = true;
      }),
      map((res) => res.items.find((p) => p.id === id))
    );
  }

  uploadProviderDocuments(
    providerId: string,
    files: { nationalId?: File; credentials?: File }
  ): Observable<{ nationalDocUrl: string; credentialDocUrl: string }> {
    const formData = new FormData();
    if (files.nationalId) formData.append('nationalId', files.nationalId);
    if (files.credentials) formData.append('credentials', files.credentials);

    return this.http
      .post<{ nationalDocUrl: string; credentialDocUrl: string }>(
        `${environment.apiUrl}/superadmin/providers/${providerId}/documents`,
        formData
      )
      .pipe(
        tap(() =>
          this.showToast({
            title: 'Success',
            text: 'Documents uploaded successfully',
            icon: 'success',
          })
        ),
        catchError((error) => this.handleError(error, 'uploading documents'))
      );
  }

  // ==================== USER STATE MANAGEMENT ====================
  changeUserState(
    userId: string,
    action: 'activate' | 'deactivate' | 'approve' | 'reject',
    notes?: string
  ): Observable<any> {
    const endpointMap = {
      activate: 'activate-user',
      deactivate: 'deactivate-user',
      approve: 'approve-provider',
      reject: 'reject-provider',
    };

   const url = `${environment.apiUrl}/superadmin/${endpointMap[action]}/${userId}`;
  const body = action === 'reject' ? JSON.stringify(notes || '') : null;
  return this.http
    .put<any>(url, body, {
      headers: action === 'reject' ? this.jsonHeaders : undefined,
    })
      .pipe(
        tap(() =>
          this.showToast({
            title: 'Success',
            text: `User ${action}d successfully`,
            icon: 'success',
          })
        ),
        catchError((error) => this.handleError(error, `${action} user`))
      );
  }



  // Create query parameters with userId
  // Email as plain string in body
   changeUserEmail(userId: string, newEmail: string): Observable<void> {
    const params = { userId };
    return this.http.put<void>(
      `${environment.apiUrl}/superadmin/change-user-email`,
      JSON.stringify(newEmail),
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: params
      }
    )
    .pipe(
      tap({
        next: () => {
          this.showToast({
            title: 'Success',
            text: 'Email updated successfully',
            icon: 'success',
          });
        }
      }),
      catchError((error) => this.handleError(error, 'changing user email'))
    );
  }



 resetUserPassword(userId: string): Observable<void> {
    return this.http
      .post<void>(
        `${environment.apiUrl}/superadmin/reset-user-password/${userId}`, // userId in path
        null, // No request body
        {
          headers: this.jsonHeaders
        }
      )
      .pipe(
        tap(() =>
          this.showToast({
            title: 'Success',
            text: 'Password reset successfully',
            icon: 'success',
          })
        ),
        catchError((error) =>
          this.handleError(error, 'resetting user password')
        )
      );
  }

  exportProvidersToExcel(
    providerType: 'hotel' | 'hospital' | 'car-rental',
    filters: any = {}
  ): Observable<Blob> {
    const params = this.buildParams(filters);
    return this.http
      .get(`${environment.apiUrl}/${providerType}-providers/export`, {
        params,
        responseType: 'blob',
      })
      .pipe(
        tap(() =>
          this.showToast({
            title: 'Success',
            text: 'Export started successfully',
            icon: 'success',
          })
        ),
        catchError((error) => this.handleError(error, 'exporting data'))
      );
  }
// private updateProviderCache(providerId: string, newStatus: AssetStatus, type: string) {
//   const cacheMap = {
//     'hotel': this.hotelProviderCache,
//     'hospital': this.hospitalProviderCache,
//     'car-rental': this.carRentalProviderCache
//   };

//   const cache = cacheMap[type as keyof typeof cacheMap];
//   if (cache) {
//     const provider = cache.find(p => p.id === providerId);
//     if (provider) {
//       provider.verificationStatus = newStatus;
//     }
//   }
// }
  // ==================== PROVIDER STATUS MANAGEMENT ====================
approveProvider(
  providerId: string,
  providerType: ProviderType
): Observable<ProviderStatusChangeResponse> {
  const url = `${environment.apiUrl}/superadmin/approve-provider/${providerId}`;

  return this.http.put<ProviderStatusChangeResponse>(url, null).pipe(
    tap((response) => {
      this.showToast({
        title: 'Success',
        text: response.message || 'Provider approved successfully',
        icon: 'success'
      });
      this.clearProviderCaches();
      this.updateProviderCache({
        providerId,
        providerType,
        newStatus: response.newStatus
      });
    }),
    catchError((error) => this.handleError(error, 'approving provider'))
  );
}

  rejectProvider(
  providerId: string,
  providerType: ProviderType,
  notes: string
): Observable<ProviderStatusChangeResponse> {
  const url = `${environment.apiUrl}/superadmin/reject-provider/${providerId}`;
  return this.http.put<ProviderStatusChangeResponse>(url, JSON.stringify(notes), {
    headers: { 'Content-Type': 'application/json' }
  }).pipe(
    tap((response) => {
      this.showToast({
        title: 'Success',
        text: response.message || 'Provider rejected successfully',
        icon: 'success'
      });
      this.clearProviderCaches();
      this.updateProviderCache({
        providerId,
        providerType,
        newStatus: response.newStatus
      });
    }),
    catchError((error) => this.handleError(error, 'rejecting provider'))
  );
}

  // ==================== CACHE MANAGEMENT ====================
  private updateProviderCache(payload: ProviderCacheUpdatePayload): void {
    const { providerId, providerType, newStatus } = payload;

    let cache: BaseProvider[] | undefined;
    switch (providerType) {
      case ProviderType.HOTEL:
        cache = this.hotelProviderCache;
        break;
      case ProviderType.HOSPITAL:
        cache = this.hospitalProviderCache;
        break;
      case ProviderType.CAR_RENTAL:
        cache = this.carRentalProviderCache;
        break;
    }

    if (cache) {
      const provider = cache.find(p => p.id === providerId);
      if (provider) {
        provider.status = newStatus as unknown as UserStatus;
      }
    }
  }

  // ==================== HELPER METHODS ====================
  private handleStatusChangeSuccess(
    response: ProviderStatusChangeResponse,
    action: string
  ): void {
    this.showToast({
      title: 'Success',
      text: response.message || `Provider ${action} successfully`,
      icon: 'success'
    });

    // Log the status change for audit purposes
    console.log(`Provider status changed:`, {
      providerId: response.providerId,
      from: response.previousStatus,
      to: response.newStatus,
      at: response.changedAt,
      by: response.changedBy
    });
  }
private clearProviderCaches(): void {
  this.hotelProviderCache = [];
  this.isHotelProviderCacheLoaded = false;
  this.hospitalProviderCache = [];
  this.isHospitalProviderCacheLoaded = false;
  this.carRentalProviderCache = [];
  this.isCarRentalProviderCacheLoaded = false;
}
  clearAllCaches(): void {
    this.patientCache = [];
    this.isPatientCacheLoaded = false;

    this.hotelProviderCache = [];
    this.isHotelProviderCacheLoaded = false;

    this.hospitalProviderCache = [];
    this.isHospitalProviderCacheLoaded = false;

    this.carRentalProviderCache = [];
    this.isCarRentalProviderCacheLoaded = false;
  }


}
