import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Hotel } from '../models/hotel.model';
import { Room } from '../models/room.model';
import { Governate } from '../models/governate.model';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelWebsiteService {
  private readonly baseUrl = `${environment.apiUrl}/website/hotels`;

  constructor(private http: HttpClient) { }

  getHotels(params: {
    PageNumber?: number;
    PageSize?: number;
    SearchTerm?: string;
    UserStatus?: number;
    GovernerateId?: number;
    // Add more filter params as needed
  }): Observable<Hotel[]> {
    let httpParams = new HttpParams();
    if (params.PageNumber !== undefined) httpParams = httpParams.set('PageNumber', params.PageNumber.toString());
    if (params.PageSize !== undefined) httpParams = httpParams.set('PageSize', params.PageSize.toString());
    if (params.SearchTerm) httpParams = httpParams.set('SearchTerm', params.SearchTerm);
    if (params.UserStatus !== undefined) httpParams = httpParams.set('UserStatus', params.UserStatus.toString());
    if (params.GovernerateId !== undefined) httpParams = httpParams.set('GovernerateId', params.GovernerateId.toString());
    // Add more filters as needed
    return this.http.get<Hotel[]>(this.baseUrl, { params: httpParams });
  }

  getHotelRooms(hotelId: string, params: {
    PageNumber?: number;
    PageSize?: number;
    SearchTerm?: string;
    RoomType?: number;
    MinPrice?: number;
    MaxPrice?: number;
    MinOccupancy?: number;
    MaxOccupancy?: number;
    FilterGovernorateId?: number;
  }): Observable<{ items: Room[]; totalPages: number }> {
    let httpParams = new HttpParams();
    if (params.PageNumber !== undefined) httpParams = httpParams.set('PageNumber', params.PageNumber.toString());
    if (params.PageSize !== undefined) httpParams = httpParams.set('PageSize', params.PageSize.toString());
    if (params.SearchTerm) httpParams = httpParams.set('SearchTerm', params.SearchTerm);
    if (params.RoomType !== undefined) httpParams = httpParams.set('RoomType', params.RoomType.toString());
    if (params.MinPrice !== undefined) httpParams = httpParams.set('MinPrice', params.MinPrice.toString());
    if (params.MaxPrice !== undefined) httpParams = httpParams.set('MaxPrice', params.MaxPrice.toString());
    if (params.MinOccupancy !== undefined) httpParams = httpParams.set('MinOccupancy', params.MinOccupancy.toString());
    if (params.MaxOccupancy !== undefined) httpParams = httpParams.set('MaxOccupancy', params.MaxOccupancy.toString());
    if (params.FilterGovernorateId !== undefined) httpParams = httpParams.set('FilterGovernorateId', params.FilterGovernorateId.toString());
    return this.http.get<{ items: Room[]; totalPages: number }>(`${environment.apiUrl}/website/Rooms-website/${hotelId}`, { params: httpParams });
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
