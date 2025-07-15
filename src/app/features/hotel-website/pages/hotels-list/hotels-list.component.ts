import { Component, OnInit } from '@angular/core';
import { HotelWebsiteService } from '../../services/hotel-website.service';
import { Hotel } from '../../models/hotel.model';
import { Location } from '@angular/common';
import { LoadingService } from '../../../../shared/services/loading.service';
@Component({
  selector: 'app-hotels-list',
  standalone: false,
  templateUrl: './hotels-list.component.html',
  styleUrl: './hotels-list.component.css'
})
export class HotelsListComponent implements OnInit {
  hotels: Hotel[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 6;
  totalPages = 1;
  filters: any = {};

  constructor(private hotelService: HotelWebsiteService,   private location: Location,private loadingService: LoadingService) {}

  ngOnInit() {
    this.fetchHotels();
  }

  onFiltersChanged(filters: any) {
    this.filters = filters;
    this.currentPage = 1;
    this.fetchHotels();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchHotels();
  }

  fetchHotels() {
    this.loading = true;
    this.loadingService.show();
    const params: any = {
      PageNumber: this.currentPage,
      PageSize: this.pageSize,
      SearchTerm: this.filters.searchTerm || undefined,
      UserStatus: this.filters.userStatus !== '' ? this.filters.userStatus : undefined,
      GovernerateId: this.filters.governorateId !== '' ? this.filters.governorateId : undefined,
      // Add more filters as needed
    };
    this.hotelService.getHotels(params).subscribe({
      next: (data: any) => {
        this.hotels = data.items || data || [];
        this.totalPages = data.totalPages || 1;
        this.loading = false;
        this.loadingService.hide();
        console.log(this.hotels, 'Hotels fetched successfully');
      this.hotels.forEach(element => {
          element.assetImages.forEach(image => {
           console.log(image.imageURL, 'Image URL');
          })
        });
      },
      error: () => {
        this.hotels = [];
        this.loading = false;
        this.loadingService.hide();
      }
    });
  }

  getEmptySlots() {
    return Array(Math.max(0, 10 - this.hotels.length));
  }
     goBack(): void {
    this.location.back();
  }

}
