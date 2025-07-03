import { Component } from '@angular/core';
import { 
  faShieldAlt, faUsersCog, faUserInjured, 
  faHospital, faHotel, faCar, faListAlt, 
  faEdit, faHeadset, faPlus, faUser, faKey, faEnvelope 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dashboard-shell',
  templateUrl: './dashboard-shell.component.html',
  styleUrls: ['./dashboard-shell.component.css'],
  standalone: false
})
export class DashboardShellComponent {
  title = 'Elagy Admin';
  userRole = 'Super Admin';
  avatar = 'src/assets/images/ww.jpg';
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
      link: '/super-admin/manage-accounts',
      isExpanded: false,
      children: [
        { label: 'All Users', icon: faUser, link: '/super-admin/manage-accounts' },
      //   { 
      //     label: 'Quick Actions', 
      //     icon: faEdit,
      //     link: '#',
      //     children: [
      //       { label: 'Change Email', icon: faEnvelope, link: '/super-admin/user/USER_ID/change-email' },
      // { label: 'Reset Password', icon: faKey, link: '/super-admin/user/USER_ID/reset-password' }
      //     ]
      //   }
      ]
    },
    {
      label: 'Provider Management',
      icon: faListAlt,
      link: '/super-admin/manage-providers',
      isExpanded: false,
      children: [
        { label: 'All Providers', icon: faListAlt, link: '/super-admin/manage-providers' },
        { 
          label: 'Add New', 
          icon: faPlus,
          link: '#',
          children: [
            { label: 'Hospital', icon: faHospital, link: '/super-admin/providers/hospitals/add' },
            { label: 'Hotel', icon: faHotel, link: '/super-admin/providers/hotels/add' },
            { label: 'Car Rental', icon: faCar, link: '/super-admin/providers/car-rentals/add' }
          ]
        },
       
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