import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuperAdminService } from '../../services/super-admin.service';
import {
  Patient,
  HospitalProvider,
  HotelProvider,
  CarRentalProvider,
  UserStatus,
  Gender,
  AssetStatus,
  ProviderType
} from '../../models/super-admin.model';
import { faEnvelope, faKey, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs';

type AccountType = Patient | HospitalProvider | HotelProvider | CarRentalProvider;

function isPatient(account: AccountType): account is Patient {
  return !('assetType' in account);
}
function isProvider(account: AccountType): account is HospitalProvider | HotelProvider | CarRentalProvider {
  return 'assetType' in account;
}

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css'],
  standalone: false
})
export class AccountDetailsComponent implements OnChanges {
  @Input() account: AccountType | null = null;
  @Output() close = new EventEmitter<void>();

  faUserCircle = faUserCircle;
  faEnvelope = faEnvelope;
  faKey = faKey;

  isUpdating = false;
  isResettingPassword = false;
  errorMessage = '';
  successMessage = '';
  emailForm: FormGroup;
  showEmailForm = false;
  pendingEmail: string | null = null;

  readonly HOTEL = ProviderType.HOTEL;
  readonly HOSPITAL = ProviderType.HOSPITAL;
  readonly CAR_RENTAL = ProviderType.CAR_RENTAL;

  enrichedAccount: AccountType | null = null;

  constructor(
    private superAdminService: SuperAdminService,
    private fb: FormBuilder
  ) {
    this.emailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]]
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['account'] && this.account) {
      this.enrichedAccount = await this.superAdminService.enrichCountryAndGovernorate({ ...this.account });
    }
  }

  updateEmail(): void {
    if (!this.account || !this.emailForm.valid) return;
    this.isUpdating = true;
    this.superAdminService.changeUserEmail(this.account.id, this.emailForm.value.newEmail)
      .pipe(finalize(() => this.isUpdating = false))
      .subscribe({
        next: () => {
          this.successMessage = 'A confirmation email has been sent to the new address. The email will be updated after confirmation.';
          this.pendingEmail = this.emailForm.value.newEmail;
          this.showEmailForm = false;
          setTimeout(() => this.successMessage = '', 5000);
        },
        error: (err) => {
          this.errorMessage = err.userMessage || 'Failed to update email. Please try again.';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
  }

  resetPassword(): void {
    if (!this.account) return;
    this.isResettingPassword = true;
    this.superAdminService.resetUserPassword(this.account.id)
      .pipe(finalize(() => this.isResettingPassword = false))
      .subscribe({
        next: () => {
          this.successMessage = 'Password reset successfully! A temporary password has been sent to the user\'s email.';
          setTimeout(() => this.successMessage = '', 5000);
        },
        error: (err) => {
          this.errorMessage = err.userMessage || 'Failed to reset password. Please try again.';
          setTimeout(() => this.errorMessage = '', 3000);
        }
      });
  }

  getStatusLabel(status: UserStatus): string {
    switch (status) {
      case UserStatus.ACTIVE: return 'Active';
      case UserStatus.INACTIVE: return 'Inactive';
      case UserStatus.PENDING: return 'Pending';
      case UserStatus.SUSPENDED: return 'Suspended';
      default: return 'Unknown';
    }
  }

  getGenderLabel(gender: Gender): string {
    switch (gender) {
      case Gender.MALE: return 'Male';
      case Gender.FEMALE: return 'Female';
      default: return 'Unspecified';
    }
  }

  getUserTypeLabel(account: AccountType): string {
    if (isProvider(account)) {
      switch (account.assetType) {
        case this.HOSPITAL: return 'Hospital';
        case this.HOTEL: return 'Hotel';
        case this.CAR_RENTAL: return 'Car Rental';
        default: return 'Provider';
      }
    }
    return 'Patient';
  }

  getVerificationStatusLabel(status?: AssetStatus): string {
    if (status === undefined) return 'Unknown';
    switch (status) {
      case AssetStatus.APPROVED: return 'Approved';
      case AssetStatus.REJECTED: return 'Rejected';
      default: return 'Unknown';
    }
  }

  getStatusClass(status: UserStatus): string {
    switch(status) {
      case UserStatus.ACTIVE: return 'active';
      case UserStatus.PENDING: return 'pending';
      case UserStatus.INACTIVE: return 'inactive';
      case UserStatus.SUSPENDED: return 'suspended';
      default: return '';
    }
  }

  isPatientAccount(): boolean {
    return this.account ? isPatient(this.account) : false;
  }

  isProviderAccount(): boolean {
    return this.account ? isProvider(this.account) : false;
  }

  getPatient(): Patient | null {
    return this.isPatientAccount() ? this.account as Patient : null;
  }

  getHotelProvider(): HotelProvider | null {
    return this.account && isProvider(this.account) && this.account.assetType === this.HOTEL
      ? this.account as HotelProvider
      : null;
  }

  getHospitalProvider(): HospitalProvider | null {
    return this.account && isProvider(this.account) && this.account.assetType === this.HOSPITAL
      ? this.account as HospitalProvider
      : null;
  }

  getCarRentalProvider(): CarRentalProvider | null {
    return this.account && isProvider(this.account) && this.account.assetType === this.CAR_RENTAL
      ? this.account as CarRentalProvider
      : null;
  }

  getFuelTypeLabel(fuelType: number): string {
    switch (fuelType) {
      case 0: return 'Gasoline';
      case 1: return 'Diesel';
      case 2: return 'Electric';
      case 3: return 'Hybrid';
      default: return 'Unknown';
    }
  }

  getAssetType(): ProviderType | null {
    return this.account && isProvider(this.account) ? this.account.assetType : null;
  }

  getAssetName(): string | null {
    return this.account && isProvider(this.account) ? this.account.assetName : null;
  }

  getVerificationStatus(): AssetStatus | null {
    return this.account && isProvider(this.account) ? this.account.verificationStatus : null;
  }

  getLocationDescription(): string | null {
    return this.account && isProvider(this.account) ? this.account.locationDescription : null;
  }

  getVerificationNotes(): string | null {
    return this.account && isProvider(this.account) ? this.account.verificationNotes : null;
  }

  getDisplayCountry(account: any): string {
    if (!account) return 'N/A';
    return account.country || account.countryName || (account.countryId ? ('#' + account.countryId) : 'N/A');
  }

  getDisplayGovernorate(account: any): string {
    if (!account) return 'N/A';
    return account.governorate || account.governorateName || (account.governorateId ? ('#' + account.governorateId) : 'N/A');
  }
}