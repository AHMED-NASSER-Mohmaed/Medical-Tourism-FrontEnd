import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../store/auth.actions';
import { AuthState } from '../../store/auth.reducer';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../../shared/services/loading.service';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string | null = null
  currentYear = new Date().getFullYear();


  constructor(private fb: FormBuilder, private store: Store<{ auth: AuthState }>, private router: Router,private authService: AuthService,private loadingSrv:LoadingService) {
  this.loginForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
  rememberMe: [false]
});

  }
goToRecover(): void {
  this.router.navigate(['/auth/recover']);
}
  onSubmit(): void {
    this.loadingSrv.show();
  this.submitted = true;

  if (this.loginForm.invalid) return;

  this.authService.login(this.loginForm.value).subscribe({

    next: (res) => {
      this.loadingSrv.hide();

      this.store.dispatch(login({ credentials: this.loginForm.value }));


      setTimeout(() => {
        const role = this.authService.getUserRole();
        console.log('User Role:', role);


        if (role === 'SuperAdmin') {
          this.router.navigate(['/super-admin/manage-accounts/patients']);
        } else if (role === 'Patient') {
          this.router.navigate(['/profile']);
        } else if (role === 'ServiceProvider') {
          this.router.navigate(['/service-provider/dashboard']);
        }
      }, 500);
    },

    error: (err) => {
      this.loadingSrv.hide();

      if (err?.error?.message) {
        this.errorMessage = err.error.message;
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
      }
    },
  });
}

    error(ctrl: string): string | null {
    const c = this.loginForm.get(ctrl);
    if (!c || !(c.touched || this.submitted)) return null;

    if (c.errors?.['required'])   return 'Required';
    if (c.errors?.['email'])      return 'Invalid email';
    if (c.errors?.['minlength'])  return `Password must be at least ${c.errors['minlength'].requiredLength} characters`;

    return null;
  }
}
