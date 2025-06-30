// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService }            from '../../../../auth/services/auth.service';
import { CountryService }         from '../../../../auth/services/country.service';
import { PatientProfile }         from '../../../../auth/models/auth.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

interface MedicalCard { title: string; value: string | number; icon: string; }
interface SidebarLink { text: string; icon: string; badge?: number; }
interface Appointment  { doctor: string; appointmentDate: string;
                         bookingDate: string; status: 'Pending'|'Confirmed'|'Cancelled'; }
interface Gov          { id: number; name: string; }
interface CountryInfo  { name: string; governorates: Gov[]; }

@Component({
  selector   : 'app-profile',
  standalone : false,
  templateUrl: './profile.component.html',
  styleUrls  : ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  /** ---------- state ---------- */
  profile!: PatientProfile;
  age       = 0;
  medicalCards: MedicalCard[] = [];
  appointments: Appointment[] = [];

  /** ---------- UI helpers ---------- */
  defaultAvatar = 'assets/images/user.png';
  activeTab: string = 'Dashboard';
  bloodGroups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

  /** ---------- forms ---------- */
  profileForm!       : FormGroup;
  changeEmailForm!   : FormGroup;
  changePasswordForm!: FormGroup;

  submittedEmail = false;
  submittedPass  = false;
  saving         = false;

  /** ---------- location data ---------- */
  countryMap = new Map<number, CountryInfo>();
  countryList: { id:number; name:string }[] = [];
  filteredGovernorates: Gov[] = [];

  /** ---------- sidebar ---------- */
  sidebarLinks: SidebarLink[] = [
    { text:'Dashboard',        icon:'bi bi-grid' },
    { text:'Profile Settings', icon:'bi bi-file-earmark-medical' },
    { text:'Change Email',     icon:'bi bi-gear' },
    { text:'Change Password',  icon:'bi bi-lock' },
    { text:'Logout',           icon:'bi bi-box-arrow-right' }
  ];

  constructor(
      private auth:AuthService,
      private fb:FormBuilder,
      private router:Router,
      private countriesSrv:CountryService,private route:ActivatedRoute) {}

  /* ══════════════════════════════════ init ══════════════════════════════════ */

ngOnInit(): void {


  this.route.queryParams.subscribe(p => {
    this.activeTab = p['tab'] === 'settings' ? 'Profile Settings' : 'Dashboard';
  });


  forkJoin({
    profile   : this.auth.getPatientProfile(),
    countries : this.countriesSrv.getCountries()
  }).subscribe(({ profile, countries }) => {

    /* --- Countries --- */
    this.countryList = countries.countryList;

 this.countryMap  = countries.countryMap;

    /* --- Profile --- */
    this.profile = profile;
    console.log('Profile loaded:', this.profile);
    this.age     = this.calculateAge(profile.dateOfBirth);

    this.medicalCards = [
      { title:'Height',      value:`${profile.height || '-'} cm`, icon:'bi bi-arrows-expand' },
      { title:'Weight',      value:`${profile.weight || '-'} kg`, icon:'bi bi-bar-chart-line'},
      { title:'Blood Group', value: profile.bloodGroup || '-',    icon:'bi bi-droplet'       },
      { title:'Age',         value: this.age,                     icon:'bi bi-person'        }
    ];


    this.profileForm = this.fb.group({
      firstName     : [profile.firstName , Validators.required],
      lastName      : [profile.lastName  , Validators.required],
      phone         : [profile.phone     , Validators.required],
      gender        : [profile.gender    , Validators.required],
      dateOfBirth   : [profile.dateOfBirth.split('T')[0], Validators.required],
      address       : [profile.address],
      city          : [profile.city],
      countryId     : [profile.countryId],
      governorateId : [profile.governorateId],
      bloodGroup    : [profile.bloodGroup],
      height        : [profile.height],
      weight        : [profile.weight]
    });


    this.onCountryChange(profile.countryId, true); // 👈 تمرير true



    this.profileForm.get('countryId')!
        .valueChanges.subscribe(id => this.onCountryChange(+id || null));
  });

    /* e-mail / password forms */
    this.changeEmailForm = this.fb.group({
      newEmail        : ['', [Validators.required, Validators.email]],
      currentPassword : ['', Validators.required]
    });

    this.changePasswordForm = this.fb.group({
      oldPassword        : ['', Validators.required],
      newPassword        : ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword : ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  /* ══════════════════════ helpers ══════════════════════ */
  private calculateAge(dob:string): number {
    const birth = new Date(dob),  today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m===0 && today.getDate() < birth.getDate())) age--;
    return age;
  }

  private passwordMatchValidator = (g: FormGroup) =>
      g.get('newPassword')?.value === g.get('confirmNewPassword')?.value
          ? null : { mismatch:true };

  statusClass(status:Appointment['status']) {
    return { Confirmed:'badge bg-success',
             Pending  :'badge bg-warning text-dark',
             Cancelled:'badge bg-danger' }[status] ?? '';
  }

  /* ══════════════════════ governorate logic ══════════════════════ */
onCountryChange(id: number | null, isInit: boolean = false): void {
  this.filteredGovernorates = id ? (this.countryMap.get(id)?.governorates ?? []) : [];

  if (!isInit) {
    this.profileForm.patchValue({ governorateId: null });
  }
}


  /* ══════════════════════ save / reset ══════════════════════ */
  onSaveProfile() {
    if (this.profileForm.invalid) return;

    this.saving = true;
    this.auth.updatePatientProfile(this.profileForm.value).subscribe({
      next : () => {
        this.saving = false;
        Object.assign(this.profile, this.profileForm.value);   // refresh sidebar data
        Swal.fire('Saved!', 'Profile updated successfully.', 'success');
      },
      error: err => {
        this.saving = false;
        Swal.fire('Error', err?.error?.message || 'Failed to update profile.','error');
      }
    });
  }

  resetProfileForm() {
    if (!this.profile) return;
    this.profileForm.reset({
      ...this.profileForm.getRawValue(),               // keep validators
      firstName     : this.profile.firstName,
      lastName      : this.profile.lastName,
      phone         : this.profile.phone,
      gender        : this.profile.gender,
      dateOfBirth   : this.profile.dateOfBirth.split('T')[0],
      address       : this.profile.address,
      city          : this.profile.city,
      countryId     : this.profile.countryId,
      governorateId : this.profile.governorateId,
      bloodGroup    : this.profile.bloodGroup,
      height        : this.profile.height,
      weight        : this.profile.weight
    });

    this.onCountryChange(this.profile.countryId ?? null);
  }

  /* ══════════════════════ sidebar nav ══════════════════════ */
  onSidebarClick(text:string) {
    if (text === 'Logout') {
      Swal.fire({ icon:'warning', title:'Log out?', showCancelButton:true,
                  confirmButtonText:'Yes, logout' })
          .then(r => { if (r.isConfirmed) { this.auth.logout();
                                            this.router.navigate(['/auth/login']); } });
    } else {
      this.activeTab = text;
    }
  }
onDeleteProfileImage(event: MouseEvent) {
  event.stopPropagation();

  Swal.fire({
    title: 'Delete profile image?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it'
  }).then(result => {
    if (result.isConfirmed) {
      this.auth.deleteProfileImage().subscribe({
        next: res => {
          this.profile.imageURL = '';
          Swal.fire('Deleted!', 'Image deleted successfully.', 'success');
        },
        error: () => {
          Swal.fire('Error', 'Could not delete image.', 'error');
        }
      });
    }
  });
}

  onImageSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('imageFile', file);

this.auth.updateProfileImage(formData).subscribe({
  next: (res) => {
    this.profile.imageURL = res.url;
    Swal.fire('Success', 'Profile image updated!', 'success');
  },
  error: () => {
    Swal.fire('Error', 'Failed to upload image.', 'error');
  }
});

}

onChangePassword() {
    this.submittedPass = true;
    if (this.changePasswordForm.invalid) return;

    this.auth.changePassword(this.changePasswordForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Password updated',
          text: 'Please login with your new password.',
          confirmButtonText: 'Login'
        }).then(() => {

          this.auth.logout();

          this.router.navigate(['/auth/login'])});
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.error?.message || 'Unable to change password'
        });
      }
    });
  }

  onChangeEmail() {
    this.submittedEmail = true;
    if (this.changeEmailForm.invalid) return;

    this.auth.changeEmail(this.changeEmailForm.value).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Email change',
          text: res.message,
          confirmButtonText: 'OK'
        }).then(() => this.router.navigate(['/auth/login']));
      },
      error: err => {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.error?.message || 'Something went wrong'
        });
      }
    });
  }



}
