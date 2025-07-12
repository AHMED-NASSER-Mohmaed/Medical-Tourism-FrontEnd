import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { faBook, faCar, faHospital, faHotel, faListAlt, faListUl, faShieldAlt, faUser, faUserInjured, faUsersCog } from '@fortawesome/free-solid-svg-icons';
import { DashboardModule } from '../../../Dash-Layout/dashboard.module';
@Component({
  selector: 'app-lay-out',
  standalone: true,
  imports: [DashboardModule,RouterModule],
  templateUrl: './lay-out.component.html',
  styleUrl: './lay-out.component.css'
})
export class LayOutComponent  implements OnInit {

  userName = 'Doctor';
  title = 'Doctor ';
  userRole = this.userName;
  avatar = 'assets/images/www-avatat.png';
  breadcrumbs = [
    { label: 'Home', link: '/doctor/appointments' },
    { label: 'Appointments' }
  ];

  menuItems = [
    {
      label: 'Appointment',
      icon: faListUl,
      link: '/doctor/schedules',
      isExpanded: false,
    },
    {
      label: 'Schedules',
      icon: faListUl,
      link: '/doctor/appointments',
      isExpanded: false,
    },
    {
      label: 'Profile',
      icon: faUser,
      link: '/doctor/profile',
      isExpanded: false,
    }
   
     
  ];


  constructor(@Inject(AuthService) public auth: AuthService, public router: Router) {}
  ngOnInit(): void {
    console.log('LayOutComponent initialized');
   this.userName = this.auth.getUserName() || 'Hospital Service Provider';

  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}
