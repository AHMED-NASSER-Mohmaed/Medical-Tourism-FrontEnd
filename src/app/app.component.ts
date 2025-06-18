import { Component } from '@angular/core';
import { 
  faShieldAlt, faUsersCog, faUserInjured, 
  faHospital, faHotel, faCar, faListAlt, 
  faEdit, faHeadset, faPlus, faUser, faKey, faEnvelope 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent {
  title = 'MediTour Admin';
  userRole = 'Super Admin';
  avatar = 'assets/admin-avatar.png';
  breadcrumbs = [
    { label: 'Home', link: '/super-admin/dashboard' },
    { label: 'Dashboard' }
  ];

 menuItems = [
  {
    label: 'Dashboard',
    icon: faShieldAlt,
    link: '/super-admin/dashboard',
    isExpanded: false
  },
  {
    label: 'User Management',
    icon: faUsersCog,
    link: '/super-admin/manage-accounts', // Added link for parent item
    isExpanded: false,
    children: [
      { label: 'All Users', icon: faUser, link: '/super-admin/manage-accounts' },
      { 
        label: 'Quick Actions', 
        icon: faEdit,
        link: '#', // Added link (use '#' or a real route if available)
        children: [
          { label: 'Change Email', icon: faEnvelope, link: '/super-admin/user-actions/change-email' },
          { label: 'Reset Password', icon: faKey, link: '/super-admin/user-actions/reset-password' }
        ]
      }
    ]
  },
  {
    label: 'Provider Management',
    icon: faListAlt,
    link: '/super-admin/manage-providers', // Added link for parent item
    isExpanded: false,
    children: [
      { label: 'All Providers', icon: faListAlt, link: '/super-admin/manage-providers' },
      { 
        label: 'Add New', 
        icon: faPlus,
        link: '#', // Added link
        children: [
          { label: 'Hospital', icon: faHospital, link: '/super-admin/providers/hospitals/add' },
          { label: 'Hotel', icon: faHotel, link: '/super-admin/providers/hotels/add' },
          { label: 'Car Rental', icon: faCar, link: '/super-admin/providers/car-rentals/add' }
        ]
      },
      {
        label: 'By Type',
        icon: faListAlt,
        link: '#', // Added link
        children: [
          { label: 'Hospitals', icon: faHospital, link: '/super-admin/providers/hospitals' },
          { label: 'Hotels', icon: faHotel, link: '/super-admin/providers/hotels' },
          { label: 'Car Rentals', icon: faCar, link: '/super-admin/providers/car-rentals' }
        ]
      }
    ]
  },
  {
    label: 'Profile',
    icon: faUser,
    link: '/super-admin/profile',
    isExpanded: false
  }
];
}