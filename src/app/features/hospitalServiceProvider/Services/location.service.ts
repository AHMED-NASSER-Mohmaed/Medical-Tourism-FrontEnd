// location.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CountriesGovernoratesDTO } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}/Country/`;

  constructor(private http: HttpClient) { }

  getCountriesWithGovernorates(): Observable<CountriesGovernoratesDTO> {
    return this.http.get<CountriesGovernoratesDTO>(`${this.apiUrl}Countries-Governates`);
  }
}
