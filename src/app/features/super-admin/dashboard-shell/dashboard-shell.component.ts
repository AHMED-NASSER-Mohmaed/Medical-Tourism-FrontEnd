import { Component, Inject } from '@angular/core';
import { 
  faShieldAlt, faUsersCog, faUserInjured, 
  faHospital, faHotel, faCar, faListAlt, 
  faEdit, faHeadset, faPlus, faUser, faKey, faEnvelope, 
  faBrain
} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { icon } from 'leaflet';

@Component({
  selector: 'app-dashboard-shell',
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.css'],
  standalone: false
})
export class DashboardShellComponent {
  title = 'Elagy Admin';
  userRole = 'Super Admin';
  avatar = 'assets/images/www-avatat.png';

  ;

  menuItems = [
    // {
    //   label: 'Dashboard',
    //   icon: faShieldAlt,
    //   link: '/super-admin/manage-accounts/hospitals',
    //   isExpanded: false
    // },
    {
      label: 'User Management',
      icon: faUsersCog,
      link: '/super-admin/manage-accounts',
      isExpanded: false,
      children: [
        { label: 'Hospitals', icon: faHospital, link: '/super-admin/manage-accounts/hospitals' },
        { label: 'Hotels', icon: faHotel, link: '/super-admin/manage-accounts/hotels' },
        { label: 'Car Rentals', icon: faCar, link: '/super-admin/manage-accounts/car-rentals' },
        { label: 'Patients', icon: faUserInjured, link: '/super-admin/manage-accounts/patients' },
      ]
    },
    {
      label: 'Provider Management',
      icon: faListAlt,
      link: '/super-admin/manage-providers',
      isExpanded: false,
      children: [
        { label: 'All Providers', icon: faListAlt, link: '/super-admin/manage-providers' },
        // { 
        //   label: 'Add New', 
        //   icon: faPlus,
        //   link: '#',
        //   children: [
        //     { label: 'Hospital', icon: faHospital, link: '/super-admin/providers/hospitals/add' },
        //     { label: 'Hotel', icon: faHotel, link: '/super-admin/providers/hotels/add' },
        //     { label: 'Car Rental', icon: faCar, link: '/super-admin/providers/car-rentals/add' }
        //   ]
        // },
       
      ]
    },
    {
      label:'Ai Models',
      icon: faBrain,
      link: '/super-admin/aiModels',

    }
    // {
    //   label: 'Profile',
    //   icon: faUser,
    //   link: '/super-admin/profile',
    //   isExpanded: false
    // }
  ];

  constructor(@Inject(AuthService) public auth: AuthService, public router: Router) {}

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}