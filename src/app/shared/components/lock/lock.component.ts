import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lock',
  standalone: false,
  templateUrl: './lock.component.html',
  styleUrl: './lock.component.css'
})
export class LockComponent {
     currentYear = new Date().getFullYear();
    constructor(private router: Router) {}
  navigateHome() {
    this.router.navigate(['/']);
  }

}
