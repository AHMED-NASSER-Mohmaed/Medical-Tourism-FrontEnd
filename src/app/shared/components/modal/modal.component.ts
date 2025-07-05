// shared/components/modal/modal.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
    standalone: false

})
export class ModalComponent {
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  isOpen = false;
  
  open() {
    this.isOpen = true;
  }
  
  close() {
    this.isOpen = false;
  }
}