import { Component } from '@angular/core';
import { SuperAdminService } from '../../../services/super-admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { NavigationService } from '../../../../../core/services/navigation.service';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css'],
  standalone: false
})
export class ChangeEmailComponent {
  userId: string;
  emailForm: ReturnType<FormBuilder['group']>;

  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private route: ActivatedRoute,
    private router: Router,
    private navigation: NavigationService
  ) {
    this.userId = this.route.snapshot.params['id'];
    this.emailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]]
    });
  }

  goBack() {
    this.router.navigate(['/super-admin/manage-accounts']);
  }

  onSubmit() {
    if (this.emailForm.valid && this.userId) {
      this.isSubmitting = true;
      const newEmail = this.emailForm.get('newEmail')?.value || '';
      this.superAdminService.changeUserEmail(this.userId, newEmail).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.navigation.navigateToUserList();
        },
        error: () => {
          this.isSubmitting = false;
          // Error toast is handled by the service
        }
      });
    } else {
      this.emailForm.markAllAsTouched();
    }
  }
}