import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy,ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { Language } from '../../../../models/enums';
import { AuthService } from '../../../../services/auth.service';
// bootstrap Tab typings
// @ts-ignore
import * as bootstrap from 'bootstrap';
import { RegisterHotelRequest } from '../../../../models/auth.model';
import * as L from 'leaflet';                 // ① Leaflet itself
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { CountryService } from '../../../../services/country.service';
import { LoadingService } from '../../../../../shared/services/loading.service';

interface Gov { id: number; name: string; }
interface CountryInfo { name: string; governorates: Gov[]; }

@Component({
  selector   : 'app-register-hotel',
  standalone : false,
  templateUrl: './register-hotel.component.html',
  styleUrls  : ['./register-hotel.component.css'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterHotelComponent implements OnInit, AfterViewInit {
  /* ───────── View refs for wizard ───────── */
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLDivElement>;
  @ViewChild('wizardNav')   wizardNav!  : ElementRef<HTMLUListElement>;
    private map?: L.Map;            // keep a reference to avoid re-creating
  private marker?: L.Marker;
  egyptianGovernorates: Gov[] = [];
    countryMap = new Map<number, CountryInfo>();
  countryList: { id: number; name: string }[] = [];
showLocationError = false;
  maxDate: string;


  filteredGovernorates: Gov[] = [];



  // dropdownSettings = {
  //   singleSelection   : false,
  //   idField           : 'id',
  //   textField         : 'name',
  //   allowSearchFilter : true,
  //   itemsShowLimit    : 5
  // };

  /* ───────── Reactive‑form state ───────── */

  registerForm!: FormGroup;
  languages: { id: number, name: string }[] = [];
  submitted = false;
imageFiles: File[] = [];
imagePreviews: string[] = [];
  constructor(private fb: FormBuilder, private auth: AuthService, private cd: ChangeDetectorRef, private router: Router,private countriesSrv:CountryService,private loadingService:LoadingService ) {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.maxDate = `${year}-${month}-${day}`;
  }

  /* ═════════════════════════════════ LIFECYCLE ═════════════════════════════ */
  ngOnInit(): void {
    this.buildForm();
    this.languages = Object.entries(Language)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => ({ id: Number(value), name: key.replace(/([A-Z])/g, ' $1').trim() }));
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

  }
@ViewChild('map') mapDiv!: ElementRef<HTMLElement>;

ngAfterViewInit(): void {
  /* ① listen once on the whole nav  (bubbles from anchors) */
  this.wizardNav.nativeElement
      .addEventListener('shown.bs.tab', () => this.updateProgress());

  this.updateProgress();
  this.initLeaflet();





}


private initLeaflet(): void {
    if (this.map) return;                // guard – HMR can re-enter

    /* ① create the map */
    this.map = L.map(this.mapDiv.nativeElement, {
      center: [26.8206, 30.8025],        // somewhere in Egypt
      zoom  : 5
    });

    /* ② OSM tiles (no API-key needed) */
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap' }
    ).addTo(this.map);

    /* ③ place a marker when the user clicks */
    this.map.on('click', (e: L.LeafletMouseEvent) => this.placeMarker(e.latlng));

    /* ④ if the form already contains coordinates, show them */
    const lat = this.registerForm.get('Latitude')?.value;
    const lng = this.registerForm.get('Longitude')?.value;
    if (lat && lng) this.placeMarker(L.latLng(lat, lng));
  }

  /** Put / move the marker and sync the reactive-form --------------------------- */
  private placeMarker(latlng: L.LatLng): void {
    /* first time – create a draggable marker */
    if (!this.marker) {
      this.marker = L.marker(latlng, { draggable: true }).addTo(this.map!);
      this.marker.on('dragend', () => {
        const p = this.marker!.getLatLng();
        this.patchLatLng(p.lat, p.lng);
      });
    } else {
      this.marker.setLatLng(latlng);
    }

    /* update form & recenter map */
    this.patchLatLng(latlng.lat, latlng.lng);
    this.map!.panTo(latlng);
  }

  private patchLatLng(lat: number, lng: number): void {
    this.registerForm.patchValue({ Latitude: lat, Longitude: lng });
  }


/* ② also call it after every programmatic switch */
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

              this.registerForm.get('Longitude')?.valid === true &&
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


  /* ═════════════════════════════════ FORM ════════════════════════════════ */
  private buildForm(): void {
    this.registerForm = this.fb.group({
      /* Asset */
      AssetType           : [1, Validators.required],               // 1 = Hotel
      AssetName           : ['', [Validators.required, Validators.minLength(3)]],
      AssetDescription    : ['', [Validators.required, Validators.minLength(10)]],
      AssetEmail          : ['', [Validators.required, Validators.email]],
      LocationDescription : ['',[Validators.required, Validators.minLength(10)]],
      AssetGovernorateId: [null, Validators.required],
      Latitude            : [null, [Validators.required, Validators.min(-90),  Validators.max(90)]],
      Longitude           : [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      HasPool             : [false],
      HasRestaurant       : [false],
      StarRating          : [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      Facilities          : ['',Validators.required],
      VerificationNotes   : ['', Validators.required],
      LanguagesSupported  : [[],  Validators.required],

      /* Account */
      FirstName      : ['', Validators.required],
      LastName       : ['', Validators.required],
      Email          : ['', [Validators.required, Validators.email]],
      Phone          : ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
      Password       : ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', Validators.required],
      Gender         : [null, Validators.required],  // 0 / 1
      DateOfBirth    : ['', Validators.required],
      Address        : ['', [Validators.required, Validators.minLength(10)]],
      City           : ['', Validators.required],
      countryId      : [null, Validators.required],
      governorateId  : [null, Validators.required],




    }, { validators: this.passwordMatch, updateOn   : 'blur' });
  }

  /* ═════════════════════════════ HELPERS ════════════════════════════════ */

onCountryChange(val: any): void {

  const id = typeof val === 'number' ? val : val?.id;
  this.registerForm.patchValue({ governorateId: null }, { emitEvent: false });
  this.filteredGovernorates = [...(this.countryMap.get(id)?.governorates ?? [])];
}




  private passwordMatch = (g: AbstractControl): ValidationErrors | null =>
    g.get('Password')?.value === g.get('ConfirmPassword')?.value ? null : { mismatch: true };


  error(ctrl: string): string | null {
    const c = this.registerForm.get(ctrl);
    if (!c || !(c.touched || this.submitted)) return null;

    if (c.errors?.['required'])   return 'Required';
    if (c.errors?.['Email'])      return 'Invalid email';
    if (c.errors?.['minlength'])  return `Min ${c.errors['minlength'].requiredLength} chars`;
    if (c.errors?.['maxlength'])  return `Max ${c.errors['maxlength'].requiredLength} chars`;
    if (c.errors?.['pattern'])    return 'Invalid format';
    if (c.errors?.['min'])        return `Min ${c.errors['min'].min}`;
    if (c.errors?.['max'])        return `Max ${c.errors['max'].max}`;
    if (this.registerForm.errors?.['mismatch'] && (ctrl === 'Password' || ctrl === 'ConfirmPassword'))
      return 'Passwords mismatch';

    return null;
  }





  private updateProgress(): void {
    const links   = this.wizardNav.nativeElement.querySelectorAll('.nav-link');
    const activeI = Array.from(links).findIndex(l => l.classList.contains('active'));
    const percent = ((activeI + 1) / links.length) * 100;
    this.progressBar.nativeElement.style.width = `${percent}%`;
  }



onImagesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
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


removeImage(index: number): void {
  this.imageFiles.splice(index, 1);
  this.imagePreviews.splice(index, 1);


  this.cd.markForCheck();
}

/** Convert reactive-form raw value ➜ strongly typed payload */
private buildPayload(): RegisterHotelRequest {
  const r = this.registerForm.value;

  return {
    ...r,
    Facilities: (r.Facilities ?? '')
                .split(',')
                .map((x: string) => x.trim())
                .filter(Boolean),

    LanguagesSupported: r.LanguagesSupported as number[],
    AssetGovernorateId: r.AssetGovernorateId
  } as RegisterHotelRequest;
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

  /* ═════════════════════════════ SUBMIT ════════════════════════════════ */
submit(): void {
  this.loadingService.show();
  this.submitted = true;
  this.registerForm.markAllAsTouched();
  if (this.registerForm.invalid) { return; }

  /* 1️⃣  Get the typed data */
  const data: RegisterHotelRequest = this.buildPayload();

  /* 2️⃣  Build multipart/form-data */
  const fd = new FormData();

  // primitive fields ---------------------------------
  Object.entries(data).forEach(([k, v]) => {
    if (k === 'Facilities' || k === 'LanguagesSupported') { return; }
    fd.append(k, String(v));
  });

  // arrays -------------------------------------------
  data.Facilities.forEach(f => fd.append('Facilities', f));
  data.LanguagesSupported.forEach(id => fd.append('LanguagesSupported', id.toString()));

  // images -------------------------------------------
  this.imageFiles.forEach(f => fd.append('files', f));

  /* 3️⃣  Send … */
this.auth.RegisterHotelRequest(fd).subscribe({
  next : () => {
    this.loadingService.hide();
    this.toast('success', 'Registration successful!');
    this.registerForm.reset();
        this.submitted = false;
          this.router.navigate(['/auth/login']);
  },


  error: (err) => {
  this.loadingService.hide();

    const serverMsg =
      err?.error?.message   ||
      err?.error?.title     ||
      err?.message          ||
      'Registration failed';

    this.toast('error', serverMsg);
  }
});

}

/** one-liner SweetAlert toast */
private toast(icon: 'success' | 'error', title: string): void {
  void Swal.fire({
    toast : true,
    position: 'top-end',
    icon,
    title,
    timer: 3000,
    showConfirmButton: false,
    background: '#fff'
  });
}



}
