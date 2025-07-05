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


}
ngOnInit(): void {

    this.authService.loginStatus$.subscribe(() => {
      const role = this.authService.getUserRole();
      this.showNavFooter = (role !== 'ServiceProvider') && (role !== 'SuperAdmin');

    });

   this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkRouteVisibility();
    });


    this.checkRouteVisibility();

}
 checkRouteVisibility(): void {
    const currentRoute = this.router.url;
    if (currentRoute.includes('confirm')) {
      this.showNavFooter = false;
    } else {
      this.showNavFooter = (this.authService.getUserRole() !== 'ServiceProvider') && (this.authService.getUserRole() !== 'SuperAdmin');
    }
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

