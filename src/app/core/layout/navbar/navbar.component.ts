import { Component } from '@angular/core';


@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
isLoggedIn = false; // Track login state
  userName = '';
    logout(): void {
    this.isLoggedIn = false;
    this.userName = '';
  }
}
