import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelWebsiteService } from '../../services/hotel-website.service';
import { Room } from '../../models/room.model';

@Component({
  selector: 'app-hotel-details',
  standalone: false,
  templateUrl: './hotel-details.component.html',
  styleUrl: './hotel-details.component.css'
})
export class HotelDetailsComponent implements OnInit {
  hotelId!: string;
  rooms: Room[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  filters: any = {};

  constructor(
    private route: ActivatedRoute,
    private hotelService: HotelWebsiteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.hotelId = params.get('id')!;
      this.fetchRooms();
    });
  }

  onFiltersChanged(filters: any) {
    this.filters = filters;
    this.currentPage = 1;
    this.fetchRooms();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.fetchRooms();
  }

  fetchRooms() {
    this.loading = true;
    const params: any = {
      PageNumber: this.currentPage,
      PageSize: this.pageSize,
      SearchTerm: this.filters.searchTerm || undefined,
      RoomType: this.filters.roomType !== '' ? this.filters.roomType : undefined,
      MinPrice: this.filters.minPrice !== '' ? this.filters.minPrice : undefined,
      MaxPrice: this.filters.maxPrice !== '' ? this.filters.maxPrice : undefined,
      MinOccupancy: this.filters.minOccupancy !== '' ? this.filters.minOccupancy : undefined,
      MaxOccupancy: this.filters.maxOccupancy !== '' ? this.filters.maxOccupancy : undefined,
      FilterGovernorateId: this.filters.filterGovernorateId !== '' ? this.filters.filterGovernorateId : undefined
    };
    this.hotelService.getHotelRooms(this.hotelId, params).subscribe({
      next: (data: any) => {
        this.rooms = data.items || [];
        this.totalPages = data.totalPages || 1;
        this.loading = false;
      },
      error: () => {
        this.rooms = [];
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/hotels']);
  }
}
