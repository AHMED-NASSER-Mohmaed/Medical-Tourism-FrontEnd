import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Medical-Tourism-FrontEnd';
  // Store user name when logged in
constructor(public dialog: MatDialog) {}

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
