import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css'],
    standalone: false

})
export class SkeletonLoaderComponent {
  @Input() isCircle = false;
}