import { Component,OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  public isHomePage: boolean = false;
    currentYear = new Date().getFullYear();

    constructor(private router: Router) { }
      ngOnInit(): void {
    // This code listens for route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // It checks if the current URL is the home page ('/')
      // and sets the isHomePage flag accordingly.
      this.isHomePage =  (this.router.url === '/' || this.router.url.includes('#contact'));
    });

    // We also run the check once initially when the component loads
    this.isHomePage = (this.router.url === '/' || this.router.url.includes('#contact'));
  }
}


