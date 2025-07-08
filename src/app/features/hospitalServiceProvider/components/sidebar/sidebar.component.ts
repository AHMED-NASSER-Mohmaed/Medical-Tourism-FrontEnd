import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { faCar, faHospital, faHotel, faListAlt, faShieldAlt, faUser, faUserInjured, faUsersCog } from '@fortawesome/free-solid-svg-icons';
import { DashboardModule } from "../../../../dashboard/dashboard.module";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, DashboardModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
title = 'Hospital Service Provider';
  userRole = 'hospitalServiceProvider';
  avatar = 'assets/images/www-avatat.png';
  breadcrumbs = [
    { label: 'Home', link: '/super-admin/dashboard' },
    { label: 'Dashboard' }
  ];

  menuItems = [
    {
      label: 'Dashboard',
      icon: faShieldAlt,
      link: 'dashboard',
      isExpanded: false
    },
    {
      label: 'Specialist Management',
      icon: faUsersCog,
      link: 'specialists',
      isExpanded: false
    },
    {
      label: 'Doctor Management',
      icon: faListAlt,
      link: 'doctors',
      isExpanded: false
    },
    {
      label: 'Appointment Management',
      icon: faUser,
      link: 'appointments',
      isExpanded: false
    }
  ];
}
