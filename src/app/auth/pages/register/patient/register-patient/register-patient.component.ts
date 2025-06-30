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

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router,private countriesSrv:CountryService) {}

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
      firstName  : ['', Validators.required],
      lastName   : ['', Validators.required],
      email      : ['', [Validators.required, Validators.email]],
      phone      : ['', Validators.required],
      gender     : [null, [Validators.required]],
      dateOfBirth: ['', Validators.required],

      bloodGroup : ['', Validators.required],
      height     : [null, [Validators.required, Validators.min(1)]],
      weight     : [null, [Validators.required, Validators.min(1)]],
      address    : ['', Validators.required],
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
    (document.querySelector(`a[href="#${tabId}"]`) as HTMLElement)?.click();
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

  /* ───── submit ───── */
onSubmit(): void {
  this.submitted = true;
  this.registerForm.markAllAsTouched();
  if (this.registerForm.invalid) return;

  const payload: RegisterPatientRequest = this.registerForm.value;
  this.loading = true;

  this.auth.registerPatient(payload).subscribe({
    next: () => {
      this.loading = false;

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Your account has been created!',
        showConfirmButton: true,
      }).then(() => {
        this.registerForm.reset();
        this.submitted = false;
        this.router.navigate(['/auth/login']);
      });
    },
    error: (err) => {
      this.loading = false;

      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: err?.error?.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#e46e6e'
      });
    }
  });
}

}
