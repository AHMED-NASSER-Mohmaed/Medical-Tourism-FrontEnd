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

  private _pendingBreadcrumbTrail: Breadcrumb[] | null = null;

  constructor() { }

  setBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    this._breadcrumbs$.next(breadcrumbs);
  }

  getBreadcrumbs(): Breadcrumb[] {
    return this._breadcrumbs$.getValue();
  }

  setPendingBreadcrumbTrail(trail: Breadcrumb[]) {
    this._pendingBreadcrumbTrail = trail;
  }

  getPendingBreadcrumbTrail(): Breadcrumb[] | null {
    return this._pendingBreadcrumbTrail;
  }

  clearPendingBreadcrumbTrail() {
    this._pendingBreadcrumbTrail = null;
  }
}
