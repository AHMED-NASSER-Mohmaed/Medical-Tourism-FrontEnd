import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../auth/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  standalone:false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  isLoggedIn = false;
  userName = '';
  userImage: string = '';
  defaultUserImage = '/assets/images/user.png';
    // EDITED: Added property to control the mobile menu
    isMobileMenuOpen = false;

  dropdownOpen = false;
  profileDropdownOpen = false;

  activeLink: string = '';
  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {

    this.authService.loginStatus$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {

        const role = this.authService.getUserRole();


        if (role === 'Patient') {
          this.authService.getPatientProfile().subscribe({
            next: (res) => {
              this.userName = `${res.firstName} ${res.lastName}`;
              this.userImage = res.imageURL || this.defaultUserImage;
            },
            error: () => {
              this.userName = 'Patient';
              this.userImage = this.defaultUserImage;
            }
          });
        } else {

          this.userName = role || 'User';
          this.userImage = this.defaultUserImage;
        }

      } else {
        this.userName = '';
        this.userImage = this.defaultUserImage;
      }
    });

    this.authService.profileImage$.subscribe(url => {
      this.userImage = url || this.defaultUserImage;
    });

    // --- Active Link Logic ---
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveLink();
    });

    this.updateActiveLink();
  }

  private updateActiveLink(): void {
    if (this.router.url.includes('#faq-section')) {
      this.activeLink = 'faq';
    } else {
      this.activeLink = this.router.url;
    }
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  setActive(link: string): void {
      this.activeLink = link;
  }

  // --- Authentication Methods ---
  login(): void {
    this.router.navigate(['/auth/login']);
  }

  logout(): void {
    this.authService.logout();
    this.authService.setLoggedIn(false);
    this.router.navigate(['/auth/login']);
    this.profileDropdownOpen = false; // Close dropdown on logout
  }

  goToDashboard() {
    this.router.navigate(['/profile'], { queryParams: { tab: 'dashboard' } });
    this.profileDropdownOpen = false; // Close dropdown after navigation
  }

  goToProfileSettings() {
    this.router.navigate(['/profile'], { queryParams: { tab: 'settings' } });
    this.profileDropdownOpen = false; // Close dropdown after navigation
  }
    // EDITED: New method to toggle the mobile sidebar
    toggleMobileMenu(): void {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }


}
