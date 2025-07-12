import { Component, Inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { faCar, faHospital, faHotel, faListAlt, faShieldAlt, faUser, faUserInjured, faUsersCog } from '@fortawesome/free-solid-svg-icons';
import { DashboardModule } from "../../../../features/Dash-Layout/dashboard.module";


import { AuthService } from '../../../../auth/services/auth.service';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, DashboardModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
userName = 'Hospital Service Provider';
title = 'Hospital Service Provider ';
  userRole = this.userName;
  avatar = 'assets/images/www-avatat.png';
  breadcrumbs = [
    { label: 'Home', link: '/hospitalProvider/specialists' },
    { label: 'Specialists' }
  ];

  menuItems = [
    {
      label: 'specialists',
      icon: faUsersCog,
      link: '/hospitalProvider/specialists',
      isExpanded: false,
    },
    {
      label: 'Doctors',
      icon: faListAlt,
      link: '/hospitalProvider/doctors',
      isExpanded: false,
    },
    {
      label: 'Appointments',
      icon: faUser,
      link: '/hospitalProvider/appointments',
      isExpanded: false
     } ,
     {
      label: 'Disbursements',
      icon: faUser,
      link: '/hospitalProvider/disbursements',
      isExpanded: false
    },
    {
      label: 'Profile',
      icon: faUser,
      link: '/hospitalProvider/profile',
      isExpanded: false
    }
  ];


  constructor(@Inject(AuthService) public auth: AuthService, public router: Router) {}
  ngOnInit(): void {
   this.userName = this.auth.getUserName() || 'Hospital Service Provider';

  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
