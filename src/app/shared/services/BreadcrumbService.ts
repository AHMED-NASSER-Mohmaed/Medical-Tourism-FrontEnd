import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


export interface Breadcrumb {
  label: string;
  url: string;
}


@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$: Observable<Breadcrumb[]> = this._breadcrumbs$.asObservable();

  constructor() { }

  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this._breadcrumbs$.next(breadcrumbs);
  }
}
