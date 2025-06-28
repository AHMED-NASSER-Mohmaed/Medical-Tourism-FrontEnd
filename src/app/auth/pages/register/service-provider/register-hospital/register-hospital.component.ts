import {
  Component, OnInit, ViewChild, ElementRef, AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {
  FormBuilder, FormGroup, Validators,
  ValidationErrors, AbstractControl
} from '@angular/forms';

import { Language } from '../../../../models/enums';
import { AuthService } from '../../../../services/auth.service';
// bootstrap Tab typings
// @ts-ignore
import * as bootstrap from 'bootstrap';

import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { RegisterHospitalRequest } from '../../../../models/auth.model';

interface Gov { id: number; name: string; }
interface CountryInfo { name: string; governorates: Gov[]; }

@Component({
  selector       : 'app-register-hospital',
  standalone     : false,
  templateUrl    : './register-hospital.component.html',
  styleUrls      : ['./register-hospital.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterHospitalComponent
       implements OnInit, AfterViewInit {

  /* wizard refs */
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLDivElement>;
  @ViewChild('wizardNav')   wizardNav!  : ElementRef<HTMLUListElement>;
  @ViewChild('map')         mapDiv!    : ElementRef<HTMLElement>;

  private map?: L.Map;
  private marker?: L.Marker;

  showLocationError = false;

  /* country list */
  private countryMap = new Map<number, CountryInfo>([
    [5, {
      name: 'Egypt',
      governorates: [
        { id: 6,  name: 'Cairo'       },
        { id: 1,  name: 'Alexandria'  },
        { id: 11, name: 'Giza'        }
      ]
    }],
    [1, {
      name: 'Algeria',
      governorates: [
        { id: 101, name: 'Algiers' },
        { id: 102, name: 'Oran'    }
      ]
    }]
  ]);

  countryList = Array.from(this.countryMap.entries())
                      .map(([id, info]) => ({ id, name: info.name }));
  filteredGovernorates: Gov[] = [];

  /* form */
  registerForm!: FormGroup;
  languages: { id: number, name: string }[] = [];
  submitted    = false;

  /* uploads */
  uploadError   = false;
  imageFiles    : File[]   = [];
  imagePreviews : string[] = [];

  constructor(
    private fb     : FormBuilder,
    private auth   : AuthService,
    private cd     : ChangeDetectorRef,
    private router : Router
  ) {}

  /* ───────── lifecycle ───────── */
  ngOnInit(): void {
    this.buildForm();
    this.languages = Object.entries(Language)
      .filter(([, v]) => !isNaN(Number(v)))
      .map(([k, v]) => ({
        id: Number(v),
        name: k.replace(/([A-Z])/g, ' $1').trim()
      }));
  }

  ngAfterViewInit(): void {
    this.wizardNav.nativeElement
        .addEventListener('shown.bs.tab', () => this.updateProgress());

    this.updateProgress();
    this.initLeaflet();
  }

  /* ───────── leaflet ───────── */
  private initLeaflet(): void {
    if (this.map) { return; }

    this.map = L.map(this.mapDiv.nativeElement, {
      center: [26.8206, 30.8025], zoom: 5
    });

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap' }
    ).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) =>
      this.placeMarker(e.latlng)
    );

    const lat = this.registerForm.get('Latitude')?.value;
    const lng = this.registerForm.get('Longitude')?.value;
    if (lat && lng) { this.placeMarker(L.latLng(lat, lng)); }
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

  /* ───────── wizard helpers ───────── */
goTo(id: string): void {
  const el = this.wizardNav.nativeElement
                 .querySelector(`a[data-bs-target='#${id}']`) as HTMLElement;
  if (el) {
    new bootstrap.Tab(el).show();
    this.updateProgress();       // ← add this line
  }
}

  onNextStep(): void {
    if (!this.registerForm.value.Latitude ||
        !this.registerForm.value.Longitude) {
      this.showLocationError = true;
      return;
    }
    this.showLocationError = false;
    this.goTo('step-business');
  }

  private updateProgress(): void {
    const links   = this.wizardNav.nativeElement.querySelectorAll('.nav-link');
    const activeI = Array.from(links).findIndex(l => l.classList.contains('active'));
    const percent = ((activeI + 1) / links.length) * 100;
    this.progressBar.nativeElement.style.width = `${percent}%`;
  }

  /* ───────── form ───────── */
  private buildForm(): void {
    this.registerForm = this.fb.group({

      /* asset info */
      AssetType           : [2, Validators.required],   // 2 = Hospital
      AssetName           : ['', [Validators.required, Validators.minLength(3)]],
      AssetDescription    : ['', [Validators.required, Validators.minLength(10)]],
      AssetEmail          : ['', [Validators.required, Validators.email]],
      LocationDescription : ['', Validators.required],
      Latitude            : [null, [Validators.required, Validators.min(-90),  Validators.max(90)]],
      Longitude           : [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      NumberOfDepartments : [null, [Validators.required, Validators.min(1)]],
      EmergencyServices   : [false],
      Facilities          : ['', Validators.maxLength(500)],
      VerificationNotes   : ['', Validators.required],
      LanguagesSupported  : [[],  Validators.required],

      /* country / gov */
      CountryId      : [null, Validators.required],
      GovernorateId  : [null, Validators.required],

      /* account */
      FirstName      : ['', Validators.required],
      LastName       : ['', Validators.required],
      Email          : ['', [Validators.required, Validators.email]],
      Phone          : ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
      Password       : ['', [Validators.required, Validators.minLength(6)]],
      ConfirmPassword: ['', Validators.required],
      Gender         : [null, Validators.required],
      DateOfBirth    : ['', Validators.required],
      Address        : ['', Validators.required],
      City           : ['', Validators.required]

    }, {
      validators: this.passwordMatch,
      updateOn  : 'blur'
    });
  }

  onCountryChange(evt: Event): void {
    const val = +(evt.target as HTMLSelectElement).value;
    this.registerForm.patchValue({ countryId: val, governorateId: null });
    this.filteredGovernorates =
      this.countryMap.get(val)?.governorates || [];
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
    if (c.errors?.['maxlength'])  { return `Max ${c.errors['maxlength'].requiredLength} chars`; }
    if (c.errors?.['pattern'])    { return 'Invalid format'; }
    if (c.errors?.['min'])        { return `Min ${c.errors['min'].min}`; }
    if (c.errors?.['max'])        { return `Max ${c.errors['max'].max}`; }
    if (this.registerForm.errors?.['mismatch'] &&
        (ctrl === 'Password' || ctrl === 'ConfirmPassword')) {
      return 'Passwords mismatch';
    }
    return null;
  }

  /* ───────── uploads ───────── */
  onImagesSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) { return; }

    const selected = Array.from(input.files);
    if (this.imageFiles.length + selected.length > 2) {
      this.uploadError = true;
      input.value = '';
      this.cd.markForCheck();
      return;
    }
    this.uploadError = false;

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
    if (this.imageFiles.length < 3) { this.uploadError = false; }
    this.cd.markForCheck();
  }

  /* build payload */
  private buildPayload(): RegisterHospitalRequest {
    const r = this.registerForm.value;
    return {
      ...r,
      Facilities: (r.Facilities ?? '')
        .split(',')
        .map((x: string) => x.trim())
        .filter(Boolean),
      LanguagesSupported: r.LanguagesSupported as number[]
    } as RegisterHospitalRequest;
  }

  /* ───────── submit ───────── */
  submit(): void {
    this.submitted = true;
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid || this.uploadError) { return; }

    const data = this.buildPayload();
    const fd   = new FormData();

    /* primitives */
    Object.entries(data).forEach(([k, v]) => {
      if (k === 'Facilities' || k === 'LanguagesSupported') { return; }
      fd.append(k, String(v));
    });

    /* arrays */
    data.Facilities
        .forEach(f => fd.append('Facilities', f));
    data.LanguagesSupported
        .forEach(id => fd.append('LanguagesSupported', id.toString()));

    /* images */
    this.imageFiles
        .forEach(f => fd.append('files', f));

    this.auth.RegisterHospitalRequest(fd).subscribe({
      next: () => {
        this.toast('success', 'Registration successful!');
        this.registerForm.reset();
        this.submitted = false;
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        const msg = err?.error?.message ||
                    err?.error?.title   ||
                    err?.message        ||
                    'Registration failed';
        this.toast('error', msg);
      }
    });
  }

  /* toast */
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
