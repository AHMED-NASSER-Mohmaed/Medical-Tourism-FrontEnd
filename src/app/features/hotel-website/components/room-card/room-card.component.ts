import { Component, Input } from '@angular/core';
import { Room } from '../../models/room.model';

@Component({
  selector: 'app-room-card',
  standalone: false,
  templateUrl: './room-card.component.html',
  styleUrl: './room-card.component.css'
})
export class RoomCardComponent {
  @Input() room!: Room;
  @Input() hotelId!: string;

  getRoomType(type: number): string {
    switch (type) {
      case 0: return 'Single';
      case 1: return 'Double';
      case 2: return 'Suite';
      case 3: return 'Family';
      default: return 'Unknown';
    }
  }
} 