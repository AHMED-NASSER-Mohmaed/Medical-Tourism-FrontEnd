import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { CountryService } from '../../../../auth/services/country.service';
import { PatientProfile } from '../../../../auth/models/auth.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LoadingService } from '../../../../shared/services/loading.service';
import { HospitalService } from '../../services/Hospital.service';
import { CarTypeMap, FuelTypeMap, TransmissionTypeMap } from '../../../car-rental-website/utils/car-enums.utils';
// EDITED: Moved interfaces to a more appropriate location, or they can be in their own model file.
interface MedicalCard { title: string; value: string | number; icon: string; }
interface SidebarLink { text: string; icon: string; badge?: number; }
interface Gov { id: number; name: string; }
interface CountryInfo { name: string; governorates: Gov[]; }
export interface Booking {
  id: string;
  createdAt: string;
  tatalAmount: number;
  status: number;
  specialtyAppoinment: any;
  roomAppointment: any;
  carAppointment: any;
  canCancel:boolean;
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  /** ---------- state ---------- */
  profile!: PatientProfile;
  age = 0;
  medicalCards: MedicalCard[] = [];
  maxDate: string;

  public currentPage = 1;
  public totalPages = 1;
  public pageSize = 4;
  public isLoading=false;
    // EDITED: Added properties for the modal
  isModalOpen = false;
  selectedBookingDetails: any = null;

  // EDITED: Updated appointments property to be 'bookings' to match the new logic
  bookings: Booking[] = [];

  /** ---------- UI helpers ---------- */
  defaultAvatar = 'assets/images/user.png';
  activeTab: string = 'Dashboard';
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  /** ---------- forms ---------- */
  profileForm!: FormGroup;
  changeEmailForm!: FormGroup;
  changePasswordForm!: FormGroup;
  submittedEmail = false;
  submittedPass = false;
  saving = false;

  /** ---------- location data ---------- */
  countryMap = new Map<number, CountryInfo>();
  countryList: { id: number; name: string }[] = [];
  filteredGovernorates: Gov[] = [];

  /** ---------- sidebar ---------- */
  sidebarLinks: SidebarLink[] = [
    { text: 'Dashboard', icon: 'bi bi-grid' },
    { text: 'Profile Settings', icon: 'bi bi-file-earmark-medical' },
    { text: 'Change Email', icon: 'bi bi-gear' },
    { text: 'Change Password', icon: 'bi bi-lock' },
    { text: 'Logout', icon: 'bi bi-box-arrow-right' }
  ];

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private countriesSrv: CountryService,
    private route: ActivatedRoute,
    private loadingSrv: LoadingService,
    private hospitalService: HospitalService, // EDITED: Inject the PatientService
  ) {
     const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    this.maxDate = `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => {
      this.activeTab = p['tab'] === 'settings' ? 'Profile Settings' : 'Dashboard';
    });

    // EDITED: Load appointments when the component initializes
    this.loadAppointments();

    forkJoin({
      profile: this.auth.getPatientProfile(),
      countries: this.countriesSrv.getCountries()
    }).subscribe(({ profile, countries }) => {
      this.countryList = countries.countryList;
      this.countryMap = countries.countryMap;
      this.profile = profile;
      this.age = this.calculateAge(profile.dateOfBirth);
      this.setupMedicalCards(profile);
      this.setupForms(profile);
      this.onCountryChange(profile.countryId, true);
      this.profileForm.get('countryId')!.valueChanges.subscribe(id => this.onCountryChange(+id || null));
    });
  }
    // EDITED: Added the getBookingServices function
  getBookingServices(booking: Booking): string[] {
    const services: string[] = [];
    if (booking.specialtyAppoinment) {
      services.push('Doctor');
    }
    if (booking.roomAppointment) {
      services.push('Hotel');
    }
    if (booking.carAppointment) {
      services.push('Car');
    }
    if (services.length === 0) {
        return ['Package'];
    }
    console.log(booking);
    console.log('Services',services);
    return services;
  }

   goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadAppointments(page);
    }
  }

  // Update your existing loadAppointments method to accept a page number
  loadAppointments(page: number = 1): void {
    this.currentPage = page;
    this.isLoading=true;
    this.hospitalService.getAppointmentHistory(this.currentPage, this.pageSize).subscribe({
        next: (response: any) => {
            this.bookings = response.items;
            this.totalPages = response.totalPages;
            this.isLoading=false;
        },
        error: (err) => {
            console.error("Failed to fetch appointments:", err);
            this.isLoading=false;
        }
    });
  }
  setupMedicalCards(profile: PatientProfile): void {
    this.medicalCards = [
      { title: 'Height', value: `${profile.height || '-'} cm`, icon: 'bi bi-arrows-expand' },
      { title: 'Weight', value: `${profile.weight || '-'} kg`, icon: 'bi bi-bar-chart-line' },
      { title: 'Blood Group', value: profile.bloodGroup || '-', icon: 'bi bi-droplet' },
      { title: 'Age', value: this.age, icon: 'bi bi-person' }
    ];
  }

  setupForms(profile: PatientProfile): void {
    this.profileForm = this.fb.group({
      firstName: [profile.firstName, Validators.required],
      lastName: [profile.lastName, Validators.required],
      phone: [profile.phone, Validators.required],
      gender: [profile.gender, Validators.required],
      dateOfBirth: [profile.dateOfBirth.split('T')[0], Validators.required],
      address: [profile.address],
      city: [profile.city],
      countryId: [profile.countryId],
      governorateId: [profile.governorateId],
      bloodGroup: [profile.bloodGroup],
      height: [profile.height],
      weight: [profile.weight]
    });

    this.changeEmailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]],
      currentPassword: ['', Validators.required]
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmNewPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

private calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();


    if (birthDate > today) {
        return 0;
    }
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

  private passwordMatchValidator = (g: FormGroup) =>
    g.get('newPassword')?.value === g.get('confirmNewPassword')?.value
      ? null : { mismatch: true };

  // EDITED: New helper functions for the appointment table
  getStatusLabel(status: number): string {
    switch (status) {

      case 1: return 'Booked';
      case 2: return 'Cancelled';
      default: return 'Unknown';
    }
  }

  getPrimaryService(booking: Booking): string {
    if (booking.specialtyAppoinment) return 'Doctor Appointment';
    if (booking.roomAppointment) return 'Hotel Stay';
    if (booking.carAppointment) return 'Car Rental';
    return 'Package';
  }

  getAppointmentDate(booking: Booking): string {
    if (booking.specialtyAppoinment) return booking.specialtyAppoinment.date;
    if (booking.roomAppointment) return booking.roomAppointment.checkInDate;
    return 'N/A';
  }

viewDetails(booking: Booking): void {
    this.loadingSrv.show();
    this.hospitalService.getBookingDetails(booking.id).subscribe({
      next: (details) => {
        this.selectedBookingDetails = {
          ...details,
          id: booking.id,
          bookingDate: booking.createdAt,
          totalAmount: booking.tatalAmount,
          status: this.getStatusLabel(booking.status)
        };
        this.isModalOpen = true;
        this.loadingSrv.hide();
        console.log("dfgfdgfdg",this.selectedBookingDetails)
      },
      error: (err) => {
        console.error("Failed to fetch booking details:", err);
        this.loadingSrv.hide();
        Swal.fire('Error', 'Could not load booking details.', 'error');
      }
    });
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedBookingDetails = null;
  }

  // EDITED: Added helper functions for the modal template
  getRoomTypeLabel(type?: number): string {
    switch (type) {
      case 0: return 'Standard';
      case 1: return 'Deluxe';
      case 2: return 'Suite';
      default: return 'N/A';
    }
  }

  getRoomViewLabel(type?: number): string {
    switch (type) {
      case 0: return 'City View';
      case 1: return 'Sea View';
      case 2: return 'Pool View';
      default: return 'N/A';
    }
  }

  cancelBooking(bookingId: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalService.cancelBooking(bookingId).subscribe({
          next: () => {
            Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
            this.loadAppointments();
          },
          error: () => Swal.fire('Error!', 'Could not cancel the booking.', 'error')
        });
      }
    });
  }

  onCountryChange(id: number | null, isInit: boolean = false): void {
    this.filteredGovernorates = id ? (this.countryMap.get(id)?.governorates ?? []) : [];
    if (!isInit) {
      this.profileForm.patchValue({ governorateId: null });
    }
  }

  onSaveProfile() {
    if (this.profileForm.invalid) return;
    this.saving = true;
    this.auth.updatePatientProfile(this.profileForm.value).subscribe({
      next: () => {
        this.saving = false;
        Object.assign(this.profile, this.profileForm.value);

        this.setupMedicalCards(this.profile);

        Swal.fire('Saved!', 'Profile updated successfully.', 'success');
      },
      error: err => {
        this.saving = false;
        Swal.fire('Error', err?.error?.message || 'Failed to update profile.', 'error');
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
  this.loadingSrv.show();
    this.submittedPass = true;
    if (this.changePasswordForm.invalid) return;

    this.auth.changePassword(this.changePasswordForm.value).subscribe({
      next: () => {
        this.loadingSrv.hide();
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
        this.loadingSrv.hide();
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.error?.message || 'Unable to change password'
        });
      }
    });
  }

  onChangeEmail() {
    this.loadingSrv.show();
    this.submittedEmail = true;
    if (this.changeEmailForm.invalid) return;

    this.auth.changeEmail(this.changeEmailForm.value).subscribe({
      next: (res) => {
        this.loadingSrv.hide();
        Swal.fire({
          icon: 'success',
          title: 'Email change',
          text: res.message,
          confirmButtonText: 'OK'
        }).then(() =>{
           this.auth.logout();
          this.router.navigate(['/auth/login'])});
      },
      error: err => {
        this.loadingSrv.hide();
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.error?.message || 'Something went wrong'
        });
      }
    });
  }



}
