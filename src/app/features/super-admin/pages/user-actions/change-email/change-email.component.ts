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

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private route: ActivatedRoute,
        private router: Router ,
        private navigation: NavigationService// Add Router

  ) {
    this.userId = this.route.snapshot.params['id'];
    this.emailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]]
    });
  }

   onCancel() {
    this.navigation.navigateToUserList();
  }
   goBack() {
    this.router.navigate(['/super-admin/manage-accounts']);
    // Or navigate to previous page: this.location.back();
  }
  onSubmit() {
    if (this.emailForm.valid) {
      const newEmail = this.emailForm.get('newEmail')?.value || '';
      this.superAdminService.changeUserEmail(this.userId, newEmail).subscribe({
        next: () => {
          console.log('Email changed successfully');
           this.navigation.navigateToUserList(); 
        },
        error: (err) => console.error('Error changing email:', err)
      });
    }
  }
}