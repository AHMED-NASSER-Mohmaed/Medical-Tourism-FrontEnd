import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
interface ApiResponse {
  data: {
    [countryId: string]: {
      countryId: number;
      countryName: string;
      governates: {
        [govId: string]: {
          governateId: number;
          governateName: string;
        };
      };
    };
  };
}

@Injectable({ providedIn: 'root' })
export class CountryService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


  getCountries(): Observable<{
    countryMap: Map<number, { name: string; governorates: { id: number; name: string }[] }>;
    countryList: { id: number; name: string }[];
  }> {
    return this.http.get<ApiResponse>(`${this.baseUrl}/country/Countries-Governates`).pipe(
      map(res => {
        const countryMap = new Map<number, { name: string; governorates: { id: number; name: string }[] }>();

        Object.values(res.data).forEach(c => {
          countryMap.set(c.countryId, {
            name: c.countryName,
            governorates: Object.values(c.governates).map(g => ({
              id: g.governateId,
              name: g.governateName
            }))
          });
        });

        const countryList = Array.from(countryMap.entries()).map(([id, info]) => ({
          id,
          name: info.name
        }));

        return { countryMap, countryList };
      })
    );
  }
}
