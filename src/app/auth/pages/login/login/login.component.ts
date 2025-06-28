import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { login } from '../../../store/auth.actions';
import { AuthState } from '../../../store/auth.reducer';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private store: Store<{ auth: AuthState }>) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
     console.log('Form submitted');
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.store.dispatch(login({ credentials: this.loginForm.value }));
  }
}
