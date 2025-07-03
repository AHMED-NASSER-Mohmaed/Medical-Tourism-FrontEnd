import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor() { }

  // Show the loading spinner
  show(): void {
    this.isLoadingSubject.next(true);
  }

  // Hide the loading spinner
  hide(): void {
    this.isLoadingSubject.next(false);
  }
}
