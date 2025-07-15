import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../../services/home.service'; // Adjust the path if needed
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone:false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  treatments: any[] = [];
  hotels: any[] = [];
  hospitals: any[] = [];
    topCars: any[] = [];

  constructor(
    private homeService: HomeService,
    private router: Router,
     private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loadTreatments();
    this.loadTopHotels();
    this.loadTopHospitals();
     this.loadTopCars();
  }

  loadTreatments(): void {
    this.homeService.getTopTreatments().subscribe(response => {

      this.treatments = response.items;
    });
  }



  viewHospitalsForSpecialty(specialtyId: number): void {

    this.router.navigate(['/hospitals', specialtyId]);
  }

    loadTopHotels(): void {
    this.homeService.getTopHotels().subscribe(data => {
      this.hotels = data;
    });
  }
    loadTopCars(): void {
    this.homeService.getTopCars().subscribe(data => {
      this.topCars = data;
    });
  }

    getStarRating(rate: number): SafeHtml {
    let starsHtml = '';
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star"></i>';
    }
    if (halfStar === 1) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHtml += '<i class="far fa-star"></i>';
    }


    return this.sanitizer.bypassSecurityTrustHtml(starsHtml);
  }
    loadTopHospitals(): void {
    this.homeService.getTopHospitals().subscribe(response => {

      this.hospitals = response.items;
    });
  }

}
