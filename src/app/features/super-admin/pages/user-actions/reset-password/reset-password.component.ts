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
  isSubmitting = false;

  constructor(
    private superAdminService: SuperAdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userId = this.route.snapshot.params['id'];
  }

  goBack() {
    this.router.navigate(['/super-admin/manage-accounts']);
  }

  resetPassword() {
    if (!this.userId || this.isSubmitting) return;
    this.isSubmitting = true;
    this.superAdminService.resetUserPassword(this.userId).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.goBack();
      },
      error: () => {
        this.isSubmitting = false;
        // Error toast is handled by the service
      }
    });
  }
}