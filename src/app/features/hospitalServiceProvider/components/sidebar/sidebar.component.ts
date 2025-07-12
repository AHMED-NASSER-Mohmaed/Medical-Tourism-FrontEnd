import { Component, Inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { faBook, faCar, faHospital, faHotel, faListAlt, faListUl, faShieldAlt, faUser, faUserInjured, faUsersCog } from '@fortawesome/free-solid-svg-icons';
import { DashboardModule } from '../../../Dash-Layout/dashboard.module';


import { AuthService } from '../../../../auth/services/auth.service';
import { DashboardLayoutComponent } from '../../../Dash-Layout/dashboard-layout/dashboard-layout.component';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule ,DashboardModule],
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
      icon: faListUl,
      link: '/hospitalProvider/appointments',
      isExpanded: false
     },
     {
      label: 'Disbursements',
      icon: faBook, // faListUl is commonly used for schedule/list
      link: '/hospitalProvider/disbursements',
      isExpanded: false
    }
    // {
    //   label: 'Profile',
    //   icon: faUser,
    //   link: '/hospitalProvider/profile',
    //   isExpanded: false
    // }
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
