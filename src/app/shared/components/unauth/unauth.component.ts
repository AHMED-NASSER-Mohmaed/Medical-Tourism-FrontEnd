import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauth',
  standalone: false,
  templateUrl: './unauth.component.html',
  styleUrl: './unauth.component.css'
})
export class UnauthComponent {
       currentYear = new Date().getFullYear();
    constructor(private router: Router) {}
  navigateLogIn() {
    this.router.navigate(['/auth/login']);
  }

}
