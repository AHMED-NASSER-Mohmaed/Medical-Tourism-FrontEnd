import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectionStrategy,ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { Language } from '../../../../models/enums';
import { AuthService } from '../../../../services/auth.service';
// bootstrap Tab typings
// @ts-ignore
import * as bootstrap from 'bootstrap';
import { RegisterHotelRequest } from '../../../../models/auth.model';
import * as L from 'leaflet';                 // ① Leaflet itself
import 'leaflet/dist/leaflet.css';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

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
showLocationError = false;

  /* ───────── Static country / governorate map ───────── */
  private countryMap = new Map<number, CountryInfo>([
    [5, { name: 'Egypt',   governorates: [ { id: 6,  name: 'Cairo' }, { id: 1,  name: 'Alexandria' }, { id: 11, name: 'Giza' } ] }],
    [1, { name: 'Algeria', governorates: [ { id: 101, name: 'Algiers' }, { id: 102, name: 'Oran'      } ] }]
  ]);
  countryList = Array.from(this.countryMap.entries()).map(([id, info]) => ({ id, name: info.name }));
  filteredGovernorates: Gov[] = [];



  dropdownSettings = {
    singleSelection   : false,
    idField           : 'id',
    textField         : 'name',
    allowSearchFilter : true,
    itemsShowLimit    : 5
  };

  /* ───────── Reactive‑form state ───────── */

  registerForm!: FormGroup;
  languages: { id: number, name: string }[] = [];
  submitted = false;
  uploadError = false;
imageFiles: File[] = [];
imagePreviews: string[] = [];
  constructor(private fb: FormBuilder, private auth: AuthService, private cd: ChangeDetectorRef, private router: Router ) {}

  /* ═════════════════════════════════ LIFECYCLE ═════════════════════════════ */
  ngOnInit(): void {
    this.buildForm();
    this.languages = Object.entries(Language)
      .filter(([key, value]) => !isNaN(Number(value)))
      .map(([key, value]) => ({ id: Number(value), name: key.replace(/([A-Z])/g, ' $1').trim() }));

  }
@ViewChild('map') mapDiv!: ElementRef<HTMLElement>;

ngAfterViewInit(): void {
  /* ① listen once on the whole nav  (bubbles from anchors) */
  this.wizardNav.nativeElement
      .addEventListener('shown.bs.tab', () => this.updateProgress());

  this.updateProgress();         // first paint
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
goTo(id: string): void {
  const el = this.wizardNav.nativeElement
                 .querySelector(`a[data-bs-target='#${id}']`) as HTMLElement;
  if (el) {
    new bootstrap.Tab(el).show();
    this.updateProgress();       // ← add this line
  }
}

onNextStep(): void {
  // Check if lat/lng are set
  const lat = this.registerForm.controls['Latitude'].value;
  const lng = this.registerForm.controls['Longitude'].value;

  if (!lat || !lng) {
    this.showLocationError = true;
    return; // stop navigation
  }

  this.showLocationError = false;
  this.goTo('step-business');
  // كمل للخطوة اللي بعدها
}
  /* ═════════════════════════════════ FORM ════════════════════════════════ */
  private buildForm(): void {
    this.registerForm = this.fb.group({
      /* Asset (حسب الـ Swagger) */
      AssetType           : [1, Validators.required],               // 1 = Hotel
      AssetName           : ['', [Validators.required, Validators.minLength(3)]],
      AssetDescription    : ['', [Validators.required, Validators.minLength(10)]],
      AssetEmail          : ['', [Validators.required, Validators.email]],
      LocationDescription : ['', Validators.required],
      Latitude            : [null, [Validators.required, Validators.min(-90),  Validators.max(90)]],
      Longitude           : [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      HasPool             : [false],
      HasRestaurant       : [false],
      StarRating          : [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      Facilities          : ['', Validators.maxLength(500)],
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
      Address        : ['', Validators.required],
      City           : ['', Validators.required],
      CountryId      : [null, Validators.required],
      GovernorateId  : [null, Validators.required],




    }, { validators: this.passwordMatch, updateOn   : 'blur' });
  }

  /* ═════════════════════════════ HELPERS ════════════════════════════════ */
  /** تحديث قائمة المحافظات عند اختيار الدولة */
onCountryChange(event: Event) {
  const selectElement = event.target as HTMLSelectElement;
  const selectedCountryId = +selectElement.value;

  this.registerForm.patchValue({
    countryId: selectedCountryId,
    governorateId: null
  });

  this.filteredGovernorates = this.countryMap.get(selectedCountryId)?.governorates || [];
}



  /** validator تطابق كلمتى المرور */
  private passwordMatch = (g: AbstractControl): ValidationErrors | null =>
    g.get('Password')?.value === g.get('ConfirmPassword')?.value ? null : { mismatch: true };

  /** إظهار رسالة خطأ لحقل ما */
  error(ctrl: string): string | null {
    const c = this.registerForm.get(ctrl);
    if (!c || !(c.touched || this.submitted)) return null;   // ✨ لا تظهر الأخطاء قبل اللمس أو الإرسال

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



  /** تحديث شريط التقدم */
  private updateProgress(): void {
    const links   = this.wizardNav.nativeElement.querySelectorAll('.nav-link');
    const activeI = Array.from(links).findIndex(l => l.classList.contains('active'));
    const percent = ((activeI + 1) / links.length) * 100;
    this.progressBar.nativeElement.style.width = `${percent}%`;
  }


  /* ---------- files ---------- */
onImagesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) { return; }

  const selected = Array.from(input.files);

  /* ➊ تجاوز الحد الأقصى */
  if (this.imageFiles.length + selected.length > 2) {
    this.uploadError = true;
    input.value = '';          // إعادة تهيئة الـ input
    this.cd.markForCheck();    // 🔔 أخبر أنجولار
    return;
  }

  this.uploadError = false;

  /* ➋ حفظ الملفات وصُنع معاينة */
  selected.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      this.imageFiles.push(file);
      this.imagePreviews.push(reader.result as string);
      this.cd.markForCheck();          // 🔔 أخبر أنجولار كلما انتهت صورة
    };
    reader.readAsDataURL(file);
  });

  input.value = '';                 // يسمح برفع نفس الملف إن حُذف
}

/** حذف صورة مُختارة */
removeImage(index: number): void {
  this.imageFiles.splice(index, 1);
  this.imagePreviews.splice(index, 1);

  /* لو بقى أقل من 2 ألغِ الخطأ */
  if (this.imageFiles.length < 3) {
    this.uploadError = false;
  }

  this.cd.markForCheck();           // 🔔 أخبر أنجولار ليرسم من جديد
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

    LanguagesSupported: r.LanguagesSupported as number[]
  } as RegisterHotelRequest;
}

  /* ═════════════════════════════ SUBMIT ════════════════════════════════ */
submit(): void {
  this.submitted = true;
  this.registerForm.markAllAsTouched();
  if (this.registerForm.invalid || this.uploadError) { return; }

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
  next : () => {this.toast('success', 'Registration successful!');
    this.registerForm.reset();         // 1. reset form
        this.submitted = false;
          this.router.navigate(['/auth/login']);
  },

  /* ⬇️ مرِّر الخطأ القادم من الخادم إلى الـ Swal */
  error: (err) => {
    /* جرّب استخراج نص مفيد من الـ API */
    const serverMsg =
      err?.error?.message   ||   // ⬅️ الشكل الشائع فى ASP.NET / NestJS
      err?.error?.title     ||   // ⬅️ بعض الـ APIs ترسل title
      err?.message          ||   // ⬅️ خطأ شبكة مثلاً
      'Registration failed';    // ⬅️ fallback افتراضي

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
