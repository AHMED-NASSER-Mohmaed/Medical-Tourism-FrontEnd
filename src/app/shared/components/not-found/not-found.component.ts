import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: false,
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
   currentYear = new Date().getFullYear();
    constructor(private router: Router) {}
  navigateHome() {
    this.router.navigate(['/']);  // Navigate to home programmatically
  }
}
