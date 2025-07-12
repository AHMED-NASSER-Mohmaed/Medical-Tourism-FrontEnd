import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-lock',
  standalone: false,
  templateUrl: './lock.component.html',
  styleUrl: './lock.component.css'
})
export class LockComponent {
     currentYear = new Date().getFullYear();
       public dashboardUrl: string = '/';
         public buttonText: string = 'Back to Home';
    constructor(private authService: AuthService,private router: Router) {}
 ngOnInit(): void {
    // When the component loads, get the user's role
    const role = this.authService.getUserRole();

    // EDITED: Set both the URL and the button text based on the user's role
    if (role === 'SuperAdmin') {
      this.dashboardUrl = '/super-admin';
      this.buttonText = 'Back to Dashboard';
    } else if (role === 'HospitalServiceProvider') {
      this.dashboardUrl = '/hospitalProvider/specialists';
      this.buttonText = 'Back to Dashboard';
    }else {
      // Default to the homepage if the role is unknown or the user is not logged in
      this.dashboardUrl = '/';
      this.buttonText = 'Back to Home';
    }
  }

  // This method will be called by the button in the template
  navigateToDashboard(): void {
    this.router.navigateByUrl(this.dashboardUrl);
  }

}
