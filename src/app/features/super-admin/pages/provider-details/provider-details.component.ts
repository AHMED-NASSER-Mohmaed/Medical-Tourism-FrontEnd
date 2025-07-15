import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Provider, AssetStatus, ProviderType } from '../../models/super-admin.model';
import { faEnvelope, faPhone, faMapMarkerAlt, faCalendarAlt, faUser, faBuilding, faCar, faHotel, faHospital, faFileAlt, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-provider-details',
  templateUrl: './provider-details.component.html',
  styleUrls: ['./provider-details.component.css'],
  standalone:false
})
export class ProviderDetailsComponent {
  @Input() provider: Provider | null = null;
  @Output() close = new EventEmitter<void>();

  // Icons
  icons = {
    envelope: faEnvelope,
    phone: faPhone,
    mapMarker: faMapMarkerAlt,
    calendar: faCalendarAlt,
    user: faUser,
    building: faBuilding,
    car: faCar,
    hotel: faHotel,
    hospital: faHospital,
    document: faFileAlt,
    externalLink: faExternalLinkAlt
  };

  AssetStatus = AssetStatus;
  ProviderType = ProviderType;

  getProviderType(provider: Provider): string {
    switch (provider.assetType) {
      case ProviderType.HOSPITAL:
        return 'Hospital';
      case ProviderType.HOTEL:
        return 'Hotel';
      case ProviderType.CAR_RENTAL:
        return 'Car Rental';
      default:
        return 'Provider';
    }
  }

  getAssetStatus(userStatus: number): AssetStatus {
    switch (userStatus) {
      case 1: return AssetStatus.APPROVED;
      case 2: return AssetStatus.PENDING;
      case 3: return AssetStatus.UNDER_REVIEW;
      case 4: return AssetStatus.REJECTED;
      default: return AssetStatus.PENDING;
    }
  }

  getStatusClass(status: AssetStatus): string {
    switch (status) {
      case AssetStatus.APPROVED:
        return 'status-approved';
      case AssetStatus.PENDING:
        return 'status-pending';
      case AssetStatus.UNDER_REVIEW:
        return 'status-under-review';
      case AssetStatus.REJECTED:
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  }

  getStatusLabel(status: AssetStatus): string {
    switch (status) {
      case AssetStatus.APPROVED:
        return 'Approved';
      case AssetStatus.PENDING:
        return 'Pending';
      case AssetStatus.UNDER_REVIEW:
        return 'Under Review';
      case AssetStatus.REJECTED:
        return 'Rejected';
      default:
        return 'Pending';
    }
  }

  showImageModal = false;
  selectedImageUrl = '';

  getProviderTypeIcon(provider: Provider) {
    switch (provider.assetType) {
      case ProviderType.HOSPITAL:
        return this.icons.hospital;
      case ProviderType.HOTEL:
        return this.icons.hotel;
      case ProviderType.CAR_RENTAL:
        return this.icons.car;
      default:
        return this.icons.building;
    }
  }

  openImageModal(imageUrl: string): void {
    this.selectedImageUrl = imageUrl;
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.selectedImageUrl = '';
  }

  trackByImageId(index: number, image: any): string {
    return image.id || index.toString();
  }

  closeModal(): void {
    this.close.emit();
  }
} 