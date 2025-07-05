import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  submitted = false;
  userId = '';
  token = '';
  email = '';

  resetForm!: FormGroup;
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {


    this.userId = this.route.snapshot.queryParamMap.get('userId') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.resetForm.invalid) return;

    const { newPassword, confirmPassword } = this.resetForm.value;

  this.auth.resetPassword({
  token: this.token,
  userId: this.userId,
  newPassword,
  confirmNewPassword: confirmPassword
})
.subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset',
          text: res.message || 'Password updated successfully.',
          confirmButtonText: 'Go to Login'
        }).then(() => {
          sessionStorage.removeItem('reset_email');
          this.router.navigate(['/auth/login']);
        });
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong. Please try again.'
        });
        console.error(err);
      }
    });
  }
}
