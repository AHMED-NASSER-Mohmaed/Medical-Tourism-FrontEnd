import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth/services/auth.service';
import { Router,NavigationEnd  } from '@angular/router';
import { filter } from 'rxjs/operators';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {

  title = 'Medical-Tourism-FrontEnd';

  showNavFooter = true;
constructor(
  public dialog: MatDialog,
  private authService: AuthService,
    private router: Router,
) {
    this.authService.checkTokenAndLogoutIfExpired();


}
ngOnInit(): void {
    // this.handleInitialRedirect();

    this.authService.loginStatus$.subscribe(() => {
      const role = this.authService.getUserRole();
      this.showNavFooter = (role !== 'ServiceProvider') && (role !== 'SuperAdmin') && (role !=='HospitalServiceProvider')&& (role !== 'Doctor');

    });

   this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkRouteVisibility();
    });


    this.checkRouteVisibility();

}

// private handleInitialRedirect(): void {

//     this.authService.loginStatus$.pipe(take(1)).subscribe(isLoggedIn => {

//       if (isLoggedIn && this.router.url === '/') {
//         const role = this.authService.getUserRole();
//         console.log(`User is already logged in with role: ${role}. Redirecting...`);


//         if (role === 'SuperAdmin') {
//           this.router.navigate(['/super-admin']);
//         } else if (role === 'Patient') {
//           this.router.navigate(['/profile']);
//         } else if (role === 'HospitalServiceProvider') {
//           this.router.navigate(['/hospitalProvider/specialists']);
//         }
//       }
//     });
//   }
checkRouteVisibility(): void {
  const currentRoute = this.router.url;

  const hideNavFooter = this.router.routerState.snapshot.root.firstChild?.data?.['hideNavFooter'] || false;
  this.showNavFooter = !(
    currentRoute.includes('confirm') ||
    hideNavFooter ||
    currentRoute.startsWith('/doctor') || // Hide for doctor-dashboard
    this.authService.getUserRole() === 'ServiceProvider' ||
    this.authService.getUserRole() === 'SuperAdmin' ||
    this.authService.getUserRole() === 'HospitalServiceProvider'
  );
}




  // openLoginDialog(): void {
  //   const dialogRef = this.dialog.open(LoginDialogComponent, {
  //     width: '350px'
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     // Simulate successful login
  //     if (result) {
  //       this.isLoggedIn = true;
  //       this.userName = 'John Doe'; // Replace with actual user data
  //     }
  //   });
  // }


}

