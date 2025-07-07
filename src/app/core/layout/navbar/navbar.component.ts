import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector   : 'app-navbar',
  standalone : false,
  templateUrl: './navbar.component.html',
  styleUrls  : ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userName   = '';
activeSection: string | null = null;
  constructor(
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService
  ) {}



userImage: string = '';
defaultUserImage = '/assets/images/user.png';
// Add this to your navbar.component.ts
dropdownOpen = false;
ngOnInit(): void {
  this.authService.loginStatus$.subscribe(status => {
    this.isLoggedIn = status;

    if (status) {

      this.authService.getPatientProfile().subscribe({
        next: (res) => {
          this.userName = `${res.firstName} ${res.lastName}`;
          this.userImage = res.imageURL || this.defaultUserImage;
        },
        error: () => {
          this.userName = 'User';
          this.userImage = this.defaultUserImage;
        }
      });
    } else {
      this.userName = '';
      this.userImage = this.defaultUserImage;
    }
  });


  this.authService.profileImage$.subscribe(url => {
    this.userImage = url || this.defaultUserImage;
  });
}





  login(): void {
    this.router.navigate(['/auth/login']);
  }

  logout(): void {
    this.authService.logout();
    this.authService.setLoggedIn(false);
    this.router.navigate(['/auth/login']);
  }
  goToProfileSettings() {
  this.router.navigate(['/profile'], { queryParams: { tab: 'settings' } });
}
goToDashboard() {
  this.router.navigate(['/profile'], { queryParams: { tab: 'dashboard' } });
}

}
