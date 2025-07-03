import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth/services/auth.service';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {

  title = 'Medical-Tourism-FrontEnd';
  // Store user name when logged in
  showNavFooter = true;
constructor(
  public dialog: MatDialog,
  private authService: AuthService
) {


}
ngOnInit(): void {
    // Subscribe to login status and update role accordingly
    this.authService.loginStatus$.subscribe(() => {
      const role = this.authService.getUserRole();
      this.showNavFooter = (role !== 'ServiceProvider') && (role !== 'SuperAdmin');

    });

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

