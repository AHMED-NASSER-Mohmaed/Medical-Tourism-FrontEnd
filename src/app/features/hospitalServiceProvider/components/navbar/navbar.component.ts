import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  currentUser: any;

  constructor(
    //private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //this.currentUser = this.authService.currentUserValue;
  }

  logout() {
   // this.authService.logout();
    this.router.navigate(['/login']);
  }

}
