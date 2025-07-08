import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarRental } from '../models/car-rental.model';
import { environment } from '../../../../environments/environment';
import { Governate } from '../models/governate.model';
import { map } from 'rxjs/operators';

export interface CarRentalApiResponse {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: CarRental[];
}

@Injectable({
  providedIn: 'root'
})
export class CarRentalWebsiteService {
  private readonly apiUrl = `${environment.apiUrl}/website/CarRentals`;

  constructor(private http: HttpClient) {}

  getCarRentals(params: {
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    userStatus?: number | string;
    governerateId?: number;
  }): Observable<CarRentalApiResponse> {
    let httpParams = new HttpParams();
    if (params.pageNumber !== undefined) httpParams = httpParams.set('PageNumber', params.pageNumber.toString());
    if (params.pageSize !== undefined) httpParams = httpParams.set('PageSize', params.pageSize.toString());
    if (params.searchTerm) httpParams = httpParams.set('SearchTerm', params.searchTerm);
    if (params.userStatus !== undefined) httpParams = httpParams.set('UserStatus', params.userStatus.toString());
    if (params.governerateId !== undefined) httpParams = httpParams.set('GovernerateId', params.governerateId.toString());
    return this.http.get<CarRentalApiResponse>(this.apiUrl, { params: httpParams });
  }

  getAvailableCars(
    carRentalId: string,
    params: {
      pageNumber?: number;
      pageSize?: number;
      searchTerm?: string;
      carType?: number;
      minPrice?: number;
      maxPrice?: number;
    }
  ): Observable<any> {
    let httpParams = new HttpParams();
    if (params.pageNumber !== undefined) httpParams = httpParams.set('PageNumber', params.pageNumber.toString());
    if (params.pageSize !== undefined) httpParams = httpParams.set('PageSize', params.pageSize.toString());
    if (params.searchTerm) httpParams = httpParams.set('SearchTerm', params.searchTerm);
    if (params.carType !== undefined) httpParams = httpParams.set('CarType', params.carType.toString());
    if (params.minPrice !== undefined) httpParams = httpParams.set('MinPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) httpParams = httpParams.set('MaxPrice', params.maxPrice.toString());
    return this.http.get<any>(`${environment.apiUrl}/website/CarAvailable/${carRentalId}`, { params: httpParams });
  }

  getEgyptGovernates(): Observable<Governate[]> {
    return this.http.get<any>(`${environment.apiUrl}/Country/Countries-Governates`).pipe(
      map(response => {
        const egypt = response?.data?.['1'];
        if (!egypt || !egypt.governates) return [];
        return Object.values(egypt.governates) as Governate[];
      })
    );
  }
} 