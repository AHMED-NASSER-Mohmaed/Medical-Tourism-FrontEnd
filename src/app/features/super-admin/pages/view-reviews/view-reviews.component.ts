// // features/super-admin/pages/view-reviews/view-reviews.component.ts
// import { Component } from '@angular/core';
// import { SuperAdminService } from '../../super-admin.service';
// import { Review } from '../../super-admin.model';

// @Component({
//   selector: 'app-view-reviews',
//   templateUrl: './view-reviews.component.html',
//   styleUrls: ['./view-reviews.component.scss'],
//   standalone: false
// })
// export class ViewReviewsComponent {
//   reviews: Review[] = [];
//   isLoading = false;

//   constructor(private superAdminService: SuperAdminService) {}

//   ngOnInit() {
//     this.loadReviews();
//   }

//   loadReviews() {
//     this.isLoading = true;
//     this.superAdminService.getReviews()
//       .subscribe({
//         next: (reviews) => {
//           this.reviews = reviews;
//           this.isLoading = false;
//         },
//         error: (error) => {
//           console.error('Failed to load reviews', error);
//           this.isLoading = false;
//         }
//       });
//   }
// }