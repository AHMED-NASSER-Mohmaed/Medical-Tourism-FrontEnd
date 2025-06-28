import { Component, Input } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css'],
  standalone:false
})

export class DashboardCardComponent {
  
  @Input() title!: string;
  @Input() value!: number | string;
  @Input() icon = faUser;
  @Input() color: CardColor = 'primary';
  @Input() trendValue?: number;
  @Input() trendUp = true;
}
export type CardColor = 'primary' | 'success' | 'warning' | 'danger';
