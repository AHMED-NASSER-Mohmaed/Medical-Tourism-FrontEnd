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

  // If form is invalid, do not proceed
  if (this.recoveryForm.invalid) return;

  const email = this.recoveryForm.value.email as string;

  this.auth.forgotPassword(email).subscribe({
    next: res => {
      Swal.fire({
        icon: 'success',
        title: 'Request Sent',
        text:  'A reset link has been sent!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true
      });

      // Reset form on success
      this.recoveryForm.reset();
      this.submitted = false;
    },
    error: (err) => {
      // Handle backend error and display the message
      const errorMessage = err?.error?.message || 'Something went wrong. Please try again.';

      // Show error message using Swal
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: errorMessage,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: true
      });

      // Optionally log the error
      console.error('Backend Error:', err);
    }
  });
}

}

