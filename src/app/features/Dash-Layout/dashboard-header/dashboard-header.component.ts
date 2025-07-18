// src/app/dashboard/components/dashboard-header/dashboard-header.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { BreadcrumbItem } from '../dashboard.types';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css'],
  standalone: false
})
export class DashboardHeaderComponent implements OnInit {
  @Input() title = '';
  @Input() userRole = '';
  @Input() avatar = 'assets/images/www-avatat.png';
  @Input() breadcrumbs: BreadcrumbItem[] = [];
  @Output() menuToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  constructor(private auth:AuthService, private router: Router) {}
  ngOnInit(): void {
    this.userRole = this.auth.getUserName() || 'Guest';
  }

  onAvatarClick() {
    this.router.navigate(['/super-admin/profile']);
  }


  onLogout() {
    this.logout.emit();

  }

}
