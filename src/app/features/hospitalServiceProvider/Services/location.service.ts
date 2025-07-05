// location.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CountriesGovernoratesDTO } from '../models/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'https://localhost:7078/api/Country/'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getCountriesWithGovernorates(): Observable<CountriesGovernoratesDTO> {
    return this.http.get<CountriesGovernoratesDTO>(`${this.apiUrl}Countries-Governates`);
  }
}