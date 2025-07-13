import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private specialtiesUrl = `${environment.apiUrl}/Website/Specilties`;
private topHotelsUrl = `${environment.apiUrl}/Website/Top-Hotels`;
  private topHospitalsUrl = `${environment.apiUrl}/Website/Hospitals`;
    private topCarsUrl = `${environment.apiUrl}/Website/Top-Cars`;
  constructor(private http: HttpClient) { }

  getTopTreatments(): Observable<any> {
    return this.http.get<any>(this.specialtiesUrl);
  }
    getTopHotels(): Observable<any[]> {
    return this.http.get<any[]>(this.topHotelsUrl);
  }
    getTopHospitals(): Observable<any> {
    return this.http.get<any>(this.topHospitalsUrl);
  }
  getTopCars(): Observable<any[]> {

  return this.http.get<any[]>(this.topCarsUrl);
}
}
