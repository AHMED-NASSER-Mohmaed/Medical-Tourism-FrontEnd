import {
  Component, OnInit, ViewChild, ElementRef, AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {
  FormBuilder, FormGroup, Validators,
  ValidationErrors, AbstractControl
} from '@angular/forms';

import * as L from 'leaflet';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Language, FuelType, TransmissionType } from '../../../../models/enums';
import {
  RegisterCarRentalRequest
} from '../../../../models/auth.model';
import { AuthService } from '../../../../services/auth.service';
// bootstrap Tab typings
// @ts-ignore
import * as bootstrap from 'bootstrap';
import { CountryService } from '../../../../services/country.service';
import { LoadingService } from '../../../../../shared/services/loading.service';

// ── tiny helper types
interface Gov { id: number; name: string; }
interface CountryInfo { name: string; governorates: Gov[]; }

@Component({
  selector       : 'app-register-car-rental',
  standalone     : false,
  templateUrl    : './register-car-rental.component.html',
  styleUrls      : ['./register-car-rental.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterCarRentalComponent
       implements OnInit, AfterViewInit {

  /* wizard refs */
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLDivElement>;
  @ViewChild('wizardNav')   wizardNav!  : ElementRef<HTMLUListElement>;
  @ViewChild('map')         mapDiv!    : ElementRef<HTMLElement>;
  countryMap = new Map<number, CountryInfo>();
  countryList: { id: number; name: string }[] = [];
  filteredGovernorates: Gov[] = [];
  private map?: L.Map;
  private marker?: L.Marker;
  egyptianGovernorates: Gov[] = [];
  maxDate: string;

  showLocationError = false;



  /* enums → selects  */
  languages: { id: number, name: string }[] = [];
  fuelTypeOptions = Object.entries(FuelType)
    .filter(([, v]) => !isNaN(Number(v)))
    .map(([k, v]) => ({ id: Number(v), name: k }));
  transmissionOptions = Object.entries(TransmissionType)
    .filter(([, v]) => !isNaN(Number(v)))
    .map(([k, v]) => ({ id: Number(v), name: k }));

  /* form state */
  registerForm!: FormGroup;
  submitted = false;

  /* uploads */
  imageFiles    : File[]   = [];
  imagePreviews : string[] = [];

  constructor(
    private fb     : FormBuilder,
    private auth   : AuthService,
    private cd     : ChangeDetectorRef,
    private router : Router,
    private countriesSrv: CountryService,
    private loadingService: LoadingService
  ) {
       const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.maxDate = `${year}-${month}-${day}`;
  }

  /* ───── lifecycle ───── */
  ngOnInit(): void {
    this.buildForm();
    this.countriesSrv.getCountries().subscribe(
  (res: {
     countryMap: Map<number, CountryInfo>;
     countryList: { id: number; name: string }[];
   }) => {
      this.countryMap  = res.countryMap;
      this.countryList = res.countryList;
             const egypt = this.countryMap.get(1);
        if (egypt) {
          this.egyptianGovernorates = egypt.governorates;
        }
});


    this.languages = Object.entries(Language)
      .filter(([, v]) => !isNaN(Number(v)))
      .map(([k, v]) => ({
        id: Number(v),
        name: k.replace(/([A-Z])/g, ' $1').trim()
      }));
  }

  ngAfterViewInit(): void {
    /* progress bar sync */
    this.wizardNav.nativeElement
      .addEventListener('shown.bs.tab', () => this.updateProgress());

    this.updateProgress();
    this.initLeaflet();
  }

  /* ───── leaflet ───── */
  private initLeaflet(): void {
    if (this.map) { return; }

    this.map = L.map(this.mapDiv.nativeElement,
                     { center: [26.82, 30.8], zoom: 5 });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                { attribution: '&copy; OpenStreetMap' })
      .addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) =>
      this.placeMarker(e.latlng)
    );
  }

  private placeMarker(latlng: L.LatLng): void {
    if (!this.marker) {
      this.marker = L.marker(latlng, { draggable: true }).addTo(this.map!);
      this.marker.on('dragend', () => {
        const p = this.marker!.getLatLng();
        this.patchLatLng(p.lat, p.lng);
      });
    } else {
      this.marker.setLatLng(latlng);
    }
    this.patchLatLng(latlng.lat, latlng.lng);
    this.map!.panTo(latlng);
  }

  private patchLatLng(lat: number, lng: number): void {
    this.registerForm.patchValue({ Latitude: lat, Longitude: lng });
  }

  /* ───── wizard helpers ───── */
goTo(tabId: string): void {
  // Get the current active tab
  const currentTab = this.wizardNav.nativeElement.querySelector('.nav-link.active');
  const currentStep = currentTab?.getAttribute('href')?.split('#')[1];

  // Check if the currentStep is valid only when moving forward (not for "Back")
  if (tabId !== 'step-asset' && currentStep && this.isStepValid(currentStep)) {
    // Navigate to the next step if the current step is valid
    const el = this.wizardNav.nativeElement.querySelector(`a[href='#${tabId}']`) as HTMLElement;
    if (el) {
      new bootstrap.Tab(el).show();
      this.updateProgress(); // Update the progress bar when switching tabs
    }
  } else if (tabId === 'step-asset' || !currentStep) {
    // Allow navigating backward without validation (skip validation check)
    const el = this.wizardNav.nativeElement.querySelector(`a[href='#${tabId}']`) as HTMLElement;
    if (el) {
      new bootstrap.Tab(el).show();
      this.updateProgress(); // Update the progress bar when switching tabs
    }
  }
  else if(tabId === 'step-business' )
    {
    // Allow navigating backward without validation (skip validation check)
    const el = this.wizardNav.nativeElement.querySelector(`a[href='#${tabId}']`) as HTMLElement;
    if (el) {
      new bootstrap.Tab(el).show();
      this.updateProgress(); // Update the progress bar when switching tabs
    }
  }

}




isStepValid(stepId: string): boolean {
  let isValid = false;

  if (stepId === 'step-asset') {
    // Validate Asset fields
    isValid = this.registerForm.get('AssetName')?.valid === true &&
              this.registerForm.get('AssetDescription')?.valid === true &&
              this.registerForm.get('AssetEmail')?.valid === true &&
              this.registerForm.get('AssetGovernorateId')?.valid === true &&

              this.registerForm.get('LocationDescription')?.valid === true &&
              this.registerForm.get('Latitude')?.valid === true &&
              this.registerForm.get('Longitude')?.valid === true&&

              this.registerForm.get('FuelTypes')?.valid === true &&
              this.registerForm.get('Transmission')?.valid === true &&
              this.registerForm.get('Models')?.valid === true &&
              this.registerForm.get('RentalPolicies')?.valid === true &&
              this.registerForm.get('Facilities')?.valid === true ;


  } else if (stepId === 'step-business') {
    // Validate Business fields
    isValid = this.registerForm.get('LanguagesSupported')?.valid === true &&
              this.registerForm.get('countryId')?.valid === true &&
              this.registerForm.get('governorateId')?.valid === true&&
                            this.registerForm.get('VerificationNotes')?.valid === true&&
                            this.imageFiles.length==2;
  } else if (stepId === 'step-account') {
    // Validate Account fields
    isValid = this.registerForm.get('FirstName')?.valid === true &&
              this.registerForm.get('LastName')?.valid === true &&
              this.registerForm.get('Email')?.valid === true &&
              this.registerForm.get('Phone')?.valid === true &&
              this.registerForm.get('Password')?.valid === true &&
              this.registerForm.get('ConfirmPassword')?.valid === true&&
               this.registerForm.get('Gender')?.valid === true&&
                this.registerForm.get('DateOfBirth')?.valid === true&&
                 this.registerForm.get('Address')?.valid === true&&
                  this.registerForm.get('City')?.valid === true;
  }

  return isValid;
}



  private updateProgress(): void {
    const links   = this.wizardNav.nativeElement.querySelectorAll('.nav-link');
    const activeI = Array.from(links).findIndex(l => l.classList.contains('active'));
    const percent = ((activeI + 1) / links.length) * 100;
    this.progressBar.nativeElement.style.width = `${percent}%`;
  }

  /* ───── form ───── */
  private buildForm(): void {
    this.registerForm = this.fb.group({

      /* asset info */
      AssetType           : [2, Validators.required],      // 2 = car-rental
      AssetName           : ['', [Validators.required, Validators.minLength(3)]],
      AssetDescription    : ['', [Validators.required, Validators.minLength(10)]],
      AssetEmail          : ['', [Validators.required, Validators.email]],
      LocationDescription : ['', [Validators.required, Validators.minLength(10)]],
      AssetGovernorateId: [null, Validators.required],
      Latitude            : [null, [Validators.required, Validators.min(-90),  Validators.max(90)]],
      Longitude           : [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      FuelTypes           : [[],Validators.required],
      Transmission        : [null,Validators.required],
      Models              : ['',Validators.required],
      RentalPolicies      : ['',Validators.required],
      Facilities          : ['',Validators.required],
      VerificationNotes   : ['',Validators.required],

      /* business */
      LanguagesSupported  : [[], Validators.required],
      countryId      : [null, Validators.required],
      governorateId  : [null, Validators.required],


      /* account holder */
      FirstName      : ['', Validators.required],
      LastName       : ['', Validators.required],
      Email          : ['', [Validators.required, Validators.email]],
      Phone          : ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
      Password       : ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', Validators.required],
      Gender         : [null, [Validators.required, Validators.minLength(10)]],
      DateOfBirth    : ['', Validators.required],
      Address        : ['', [Validators.required, Validators.minLength(10)]],
      City           : ['', Validators.required]

    }, { validators: this.passwordMatch, updateOn: 'blur' });
  }

onCountryChange(val: any): void {

  const id = typeof val === 'number' ? val : val?.id;
  this.registerForm.patchValue({ governorateId: null }, { emitEvent: false });
  this.filteredGovernorates = [...(this.countryMap.get(id)?.governorates ?? [])];
}

  private passwordMatch =
    (g: AbstractControl): ValidationErrors | null =>
      g.get('Password')?.value === g.get('ConfirmPassword')?.value
        ? null : { mismatch: true };

  error(ctrl: string): string | null {
    const c = this.registerForm.get(ctrl);
    if (!c || !(c.touched || this.submitted)) { return null; }

    if (c.errors?.['required'])   { return 'Required'; }
    if (c.errors?.['email'])      { return 'Invalid email'; }
    if (c.errors?.['minlength'])  { return `Min ${c.errors['minlength'].requiredLength} chars`; }
    if (c.errors?.['pattern'])    { return 'Invalid format'; }
     if (this.registerForm.errors?.['mismatch'] &&
        (ctrl === 'Password' || ctrl === 'ConfirmPassword')) {
      return 'Passwords mismatch';}
    return null;
  }

  /* ───── uploads ───── */
  onImagesSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) { return; }

    const selected = Array.from(input.files);
    if (this.imageFiles.length + selected.length > 2) {

      input.value = '';
      this.cd.markForCheck();
      return;
    }


    selected.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageFiles.push(file);
        this.imagePreviews.push(reader.result as string);
        this.cd.markForCheck();
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

  removeImage(i: number): void {
    this.imageFiles.splice(i, 1);
    this.imagePreviews.splice(i, 1);
    this.cd.markForCheck();
  }

  /* build payload */
  private buildPayload(): RegisterCarRentalRequest {
    const r = this.registerForm.value;
    return {
      ...r,
      Facilities:  (r.Facilities  ?? '').split(',').map((x: string) => x.trim()).filter(Boolean),
      Models:      (r.Models      ?? '').split(',').map((x: string) => x.trim()).filter(Boolean),
      RentalPolicies: (r.RentalPolicies ?? '').split(',').map((x: string) => x.trim()).filter(Boolean),
      LanguagesSupported: r.LanguagesSupported as number[],
      FuelTypes: r.FuelTypes as FuelType[],
      AssetGovernorateId: r.AssetGovernorateId
    } as RegisterCarRentalRequest;
  }

 msg(ctrl: string): string|null {
    const c = this.registerForm.get(ctrl);
    if (!c || !(c.touched || this.submitted)) return null;
   if (ctrl === 'governorateId' && c.errors?.['required'] &&  this.registerForm.get('countryId')?.value==null) {
    return 'Please select a country first';
  }
    if (c.errors?.['required'])  return 'Required';
    if (c.errors?.['email'])     return 'Invalid email';
    if (c.errors?.['minlength']) return `Min ${c.errors['minlength'].requiredLength} chars`;
    if (c.errors?.['min'])       return 'Value > 0';
    if (this.registerForm.errors?.['mismatch'] &&
        (ctrl === 'password' || ctrl === 'confirmPassword'))
      return 'Passwords mismatch';

    return null;
  }

  /* ───── submit ───── */
  submit(): void {
    this.loadingService.show();
    this.submitted = true;
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid ) { return; }

    const data = this.buildPayload();
    const fd   = new FormData();

    /* primitives */
    Object.entries(data).forEach(([k, v]) => {
      if (Array.isArray(v) || k === 'files') { return; }
      fd.append(k, String(v));
    });

    /* arrays */
    data.Facilities.forEach(f => fd.append('Facilities', f));
    data.Models.forEach(m => fd.append('Models', m));
    data.RentalPolicies.forEach(p => fd.append('RentalPolicies', p));
    data.FuelTypes.forEach(ft => fd.append('FuelTypes', ft.toString()));
    data.LanguagesSupported.forEach(l => fd.append('LanguagesSupported', l.toString()));

    /* images */
    this.imageFiles.forEach(f => fd.append('files', f));

    this.auth.RegisterCarRentalRequest(fd).subscribe({
      next: () => {
        this.loadingService.hide();
        this.toast('success', 'Registration successful!');
        this.registerForm.reset();
        this.submitted = false;
        this.router.navigate(['/auth/login']);
      },
      error: err => {
        this.loadingService.hide();

        const msg = err?.error?.message ||
                    err?.error?.title   ||
                    err?.message        ||
                    'Registration failed';
        this.toast('error', msg);
      }
    });
  }

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
}
