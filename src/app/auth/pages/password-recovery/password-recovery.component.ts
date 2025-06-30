import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-recovery',
  standalone: false,
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.css']
})
export class PasswordRecoveryComponent {

  submitted = false;
  recoveryForm: any;
  currentYear = new Date().getFullYear();

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.recoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.recoveryForm.invalid) return;

    const email = this.recoveryForm.value.email as string;

    this.auth.forgotPassword(email).subscribe({
      next: res => {
        Swal.fire({
          icon: 'success',
          title: 'Request Sent',
          text: res.message || 'If the email exists, a reset link has been sent!',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3500,
          timerProgressBar: true
        });

        this.recoveryForm.reset();
        this.submitted = false;
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Something went wrong. Please try again.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3500,
          timerProgressBar: true
        });

        console.error(err);
      }
    });
  }
}

