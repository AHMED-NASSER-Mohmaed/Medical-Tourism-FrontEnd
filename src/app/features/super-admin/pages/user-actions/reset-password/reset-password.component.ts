import { Component } from '@angular/core';
import { SuperAdminService } from '../../../services/super-admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
    standalone: false

})
export class ResetPasswordComponent {
  userId: string;

  constructor(
    private superAdminService: SuperAdminService,
    private route: ActivatedRoute,
            private router: Router // Add Router
    
  ) {
    this.userId = this.route.snapshot.params['id'];
  }
 goBack() {
    this.router.navigate(['/super-admin/manage-accounts']);
    // Or navigate to previous page: this.location.back();
  }
  resetPassword() {
    this.superAdminService.resetUserPassword(this.userId).subscribe({
      next: () => {
        console.log('Password reset initiated');
        this.goBack();
      },
      error: (err) => console.error('Error resetting password:', err)
    });
  }
}