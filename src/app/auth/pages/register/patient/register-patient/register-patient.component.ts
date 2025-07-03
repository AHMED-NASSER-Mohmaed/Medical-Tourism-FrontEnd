import {
  Component, OnInit, ViewChild, ElementRef, AfterViewInit
} from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors
} from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { RegisterPatientRequest } from '../../../../models/auth.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CountryService } from '../../../../services/country.service';
import { LoadingService } from '../../../../../shared/services/loading.service';
// bootstrap Tab typings
// @ts-ignore
import * as bootstrap from 'bootstrap';

interface Gov { id: number; name: string; }
interface CountryInfo { name: string; governorates: Gov[]; }

@Component({
  selector   : 'app-register-patient',
  standalone : false,
  templateUrl: './register-patient.component.html',
  styleUrls  : ['./register-patient.component.css']
})
export class RegisterPatientComponent implements OnInit, AfterViewInit {

  /* ── wizard refs ── */
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLDivElement>;
  @ViewChild('wizardNav')  wizardNav!  : ElementRef<HTMLUListElement>;

  countryMap = new Map<number, CountryInfo>();
  countryList: { id: number; name: string }[] = [];

  bloodGroups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

  registerForm!: FormGroup;
  filteredGovernorates: Gov[] = [];

  submitted = false;
  loading   = false;

  constructor( private loadingService: LoadingService,private fb: FormBuilder, private auth: AuthService, private router: Router,private countriesSrv:CountryService) {}

  /* ───── life-cycle ───── */
  ngOnInit(): void {
     this.buildForm();
this.countriesSrv.getCountries().subscribe(
  (res: {
     countryMap: Map<number, CountryInfo>;
     countryList: { id: number; name: string }[];
   }) => {
      this.countryMap  = res.countryMap;
      this.countryList = res.countryList;
});

  }
  ngAfterViewInit(): void {
    const links = this.wizardNav.nativeElement.querySelectorAll('.nav-link');
    links.forEach(l => l.addEventListener('shown.bs.tab', () => this.updateProgress()));
    this.updateProgress();
  }

  /* ───── build form ───── */
private buildForm(): void {
  this.registerForm = this.fb.group({
    firstName  : ['', [Validators.required, Validators.minLength(3)]],
    lastName   : ['', [Validators.required, Validators.minLength(3)]],
    email      : ['', [Validators.required, Validators.email]],
    phone      : ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
    gender     : [null, [Validators.required]],
    dateOfBirth: ['', Validators.required],

    bloodGroup : ['', Validators.required],
    height     : [null, [Validators.required, Validators.min(1)]],
    weight     : [null, [Validators.required, Validators.min(1)]],
    address    : ['', [Validators.required, Validators.minLength(10)]],
    city       : ['', Validators.required],

    countryId     : [null, Validators.required],
    governorateId : [null, Validators.required],

    password       : ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  }, { validators: this.passwordMatch });
}


  /* ───── dynamic gov list ───── */
onCountryChange(val: any): void {

  const id = typeof val === 'number' ? val : val?.id;
  this.registerForm.patchValue({ governorateId: null }, { emitEvent: false });
  this.filteredGovernorates = [...(this.countryMap.get(id)?.governorates ?? [])];
}


  /* ───── wizard helpers ───── */
goTo(tabId: string): void {
  // Get the current active tab
  const currentTab = this.wizardNav.nativeElement.querySelector('.nav-link.active');
  const currentStep = currentTab?.getAttribute('href')?.split('#')[1];

  // Check if the currentStep is valid only when moving forward (not for "Back")
  if (tabId !== 'step-personal' && currentStep && this.isStepValid(currentStep)) {
    // Navigate to the next step if the current step is valid
    const el = this.wizardNav.nativeElement.querySelector(`a[href='#${tabId}']`) as HTMLElement;
    if (el) {
      new bootstrap.Tab(el).show();
      this.updateProgress(); // Update the progress bar when switching tabs
    }
  } else if (tabId === 'step-personal' || !currentStep) {
    // Allow navigating backward without validation (skip validation check)
    const el = this.wizardNav.nativeElement.querySelector(`a[href='#${tabId}']`) as HTMLElement;
    if (el) {
      new bootstrap.Tab(el).show();
      this.updateProgress(); // Update the progress bar when switching tabs
    }
  } else {
    // If the current step is invalid or undefined, mark all form fields as touched
    this.registerForm.markAllAsTouched();
  }
}



isStepValid(stepId: string): boolean {
  let isValid = false;

  if (stepId === 'step-personal') {
    isValid = this.registerForm.get('firstName')?.valid === true &&
              this.registerForm.get('lastName')?.valid === true &&
              this.registerForm.get('email')?.valid === true &&
              this.registerForm.get('phone')?.valid === true &&
              this.registerForm.get('gender')?.valid === true &&
              this.registerForm.get('dateOfBirth')?.valid === true;
  } else if (stepId === 'step-medical') {
    isValid = this.registerForm.get('bloodGroup')?.valid === true &&
              this.registerForm.get('height')?.valid === true &&
              this.registerForm.get('weight')?.valid === true &&
              this.registerForm.get('address')?.valid === true &&
              this.registerForm.get('city')?.valid === true;
  } else if (stepId === 'step-account') {
    isValid = this.registerForm.get('password')?.valid === true &&
              this.registerForm.get('confirmPassword')?.valid === true;
  }

  return isValid;
}






  private updateProgress(): void {
    const navLinks = this.wizardNav.nativeElement.querySelectorAll('.nav-link');
    const activeIx = Array.from(navLinks).findIndex(l => l.classList.contains('active'));
    const percent  = ((activeIx + 1) / navLinks.length) * 100;
    this.progressBar.nativeElement.style.width = `${percent}%`;
  }

  /* ───── validation helpers ───── */
  msg(ctrl: string): string|null {
    const c = this.registerForm.get(ctrl);
    if (!c || !(c.touched || this.submitted)) return null;

    if (c.errors?.['required'])  return 'Required';
    if (c.errors?.['email'])     return 'Invalid email';
    if (c.errors?.['minlength']) return `Min ${c.errors['minlength'].requiredLength} chars`;
    if (c.errors?.['min'])       return 'Value > 0';
    if (this.registerForm.errors?.['mismatch'] &&
        (ctrl === 'password' || ctrl === 'confirmPassword'))
      return 'Passwords mismatch';

    return null;
  }

  private passwordMatch = (g: AbstractControl): ValidationErrors|null =>
    g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };

  private toast(icon: 'success' | 'error', title: string): void {
    void Swal.fire({
      toast: true,
      position: 'top-end',
      icon, title,
      timer: 3000,
      showConfirmButton: false,
      background: '#fff'
    });
  }


  /* ───── submit ───── */
onSubmit(): void {
  // Show the loader before making the request
  this.loadingService.show();

  const payload: RegisterPatientRequest = this.registerForm.value;

  // Simulate registration logic
  this.auth.registerPatient(payload).subscribe({
    next: () => {
      this.loadingService.hide();  // Hide the loader when the request is successful

      // Show success toast notification using the toast function
      this.toast('success', 'Registration Successful');

      this.registerForm.reset();
      this.submitted = false;
      this.router.navigate(['/auth/login']);
    },
    error: (err) => {
      this.loadingService.hide();  // Hide the loader when there is an error

      // Show error toast notification using the toast function
      const msg = err?.error?.message ||
                  err?.error?.title   ||
                  err?.message        ||
                  'Registration failed';
      this.toast('error', msg);
    }
  });
}


}
