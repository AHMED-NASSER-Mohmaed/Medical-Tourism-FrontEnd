type UserId = string & { readonly _brand: 'UserId' };
type AssetId = string & { readonly _brand: 'AssetId' };


export  enum UserStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  PENDING = 2,
  SUSPENDED = 3
}


export  enum Gender {
  UNSPECIFIED = 0,
  MALE = 1,
  FEMALE = 2
}


export  enum AssetStatus {
  PENDING = 0,
  UNDER_REVIEW = 1,
  APPROVED = 2,
  REJECTED = 3
}


export  enum ProviderType {
  HOTEL = 0,
  HOSPITAL = 1,
  CAR_RENTAL = 2
}


export  enum TransmissionType {
  MANUAL = 0,
  AUTOMATIC = 1
}


export  enum FuelType {
  GASOLINE = 0,
  DIESEL = 1,
  ELECTRIC = 2,
  HYBRID = 3
}


export  enum ApprovalAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT'
}


export interface TimeObject {
  hour: number & { _brand: 'hour' }; // 0-23
  minute: number & { _brand: 'minute' }; // 0-59
  second: number & { _brand: 'second' }; // 0-59
  millisecond?: number & { _brand: 'millisecond' }; // 0-999
}

/**
 * Helper functions for time validation
 */
export const TimeValidation = {
  isValidHour: (hour: number): hour is number & { _brand: 'hour' } => 
    Number.isInteger(hour) && hour >= 0 && hour <= 23,
  
  isValidMinute: (minute: number): minute is number & { _brand: 'minute' } => 
    Number.isInteger(minute) && minute >= 0 && minute <= 59,
  
  isValidSecond: (second: number): second is number & { _brand: 'second' } => 
    Number.isInteger(second) && second >= 0 && second <= 59,
  
  isValidMillisecond: (ms: number): ms is number & { _brand: 'millisecond' } => 
    Number.isInteger(ms) && ms >= 0 && ms <= 999
};

/**
 * Generic paginated response interface
 */
export interface PaginatedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: T[];
}

/**
 * Base interface for all user types
 */
export interface UserBase {
  id: UserId;
  email: string; 
  firstName: string;
  lastName: string;
  phone: string; 
  imageURL: string | null;
  gender: Gender;
  address: string;
  city: string;
  governorate: string;
  country: string;
  dateOfBirth: string; // ISO date string
  emailConfirmed: boolean;
  status: UserStatus;
  userType: number;
  docs?: string;
  acquisitionDate?: string;
}

/**
 * Interface for patient-specific data
 */
export interface Patient extends UserBase {
  bloodGroup: string;
  height: number; // in centimeters
  weight: number; // in kilograms
  governorateId: number;
  governorateName: string;
  countryId: number;
  countryName: string;
}

/**
 * Base interface for all provider types
 */
export interface BaseProvider extends UserBase {
  assetId: AssetId;
  assetName: string;
  assetDescription: string;
  assetEmail: string;
  locationDescription: string;
  latitude: number; 
  longitude: number; 
  facilities: string[];
  verificationNotes: string;
  verificationStatus: AssetStatus;
  languagesSupported: number[];
  assetType: ProviderType;
  openingTime: string;
  closingTime: string;
  nationalDocsURL?: string;
  credentialDocURL?: string;
}


export interface HotelProvider extends BaseProvider {
  starRating: number; 
  hasPool: boolean;
  hasRestaurant: boolean;
  assetGovernorateId: number;
  assetGovernateName: string;
  countryId: number;
  countryName: string;
  assetImages: AssetImage[];
  openingTime: string;
  closingTime: string;
}


export interface HospitalProvider extends BaseProvider {
  numberOfDepartments: number;
  emergencyServices: boolean;
  assetGovernorateId: number;
  assetGovernateName: string;
  countryId: number;
  countryName: string;
  assetImages: AssetImage[];
  openingTime: string;
  closingTime: string;
}


export interface CarRentalProvider extends BaseProvider {
  fuelTypes: FuelType[];
  models: string[];
  transmission: TransmissionType;
  rentalPolicies: string[];
  starRating: number;
  assetGovernorateId: number;
  assetGovernateName: string;
  countryId: number;
  countryName: string;
  assetImages: AssetImage[];
  openingTime: string;
  closingTime: string;
}

export const isHotelProvider = (provider: BaseProvider): provider is HotelProvider =>
  provider.assetType === ProviderType.HOTEL;


export const isHospitalProvider = (provider: BaseProvider): provider is HospitalProvider =>
  provider.assetType === ProviderType.HOSPITAL;


export const isCarRentalProvider = (provider: BaseProvider): provider is CarRentalProvider =>
  provider.assetType === ProviderType.CAR_RENTAL;


export interface ProviderStatusChangeRequest {
  notes?: string;
}


export interface ProviderStatusChangeResponse {
  success: boolean;
  message: string;
  providerId: string;
  providerType: ProviderType;
  previousStatus: AssetStatus;
  newStatus: AssetStatus;
  changedAt: string; // ISO date string
  changedBy: string;
  errors: string[];
}


export interface ProviderCacheUpdatePayload {
  providerId: string;
  providerType: ProviderType;
  newStatus: AssetStatus;
}


export type Provider = 
  | ({ type: 'hospital' } & HospitalProvider)
  | ({ type: 'hotel' } & HotelProvider)
  | ({ type: 'car-rental' } & CarRentalProvider);


export interface AddPatientRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: Gender;
  address: string;
  city: string;
  governorateId: number;
  countryId: number;
  dateOfBirth: string;
  bloodGroup: string;
  height: number;
  weight: number;
}

/**
 * Helper functions for status transitions
 */
export const StatusTransitions = {
  canTransitionTo: (currentStatus: AssetStatus, newStatus: AssetStatus): boolean => {
    switch (currentStatus) {
      case AssetStatus.PENDING:
        return newStatus === AssetStatus.UNDER_REVIEW;
      case AssetStatus.UNDER_REVIEW:
        return newStatus === AssetStatus.APPROVED || newStatus === AssetStatus.REJECTED;
      default:
        return false;
    }
  },

  getValidTransitions: (currentStatus: AssetStatus): AssetStatus[] => {
    switch (currentStatus) {
      case AssetStatus.PENDING:
        return [AssetStatus.UNDER_REVIEW];
      case AssetStatus.UNDER_REVIEW:
        return [AssetStatus.APPROVED, AssetStatus.REJECTED];
      default:
        return [];
    }
  }
};

/**
 * Status change validation
 */
export interface StatusChangeRequest {
  notes?: string;
}

function mapUserStatusToAssetStatus(userStatus: number): AssetStatus {
  // You must define how your UserStatus maps to AssetStatus
  // Example: treat ACTIVE as APPROVED, PENDING as PENDING, etc.
  switch (userStatus) {
    case 1: return AssetStatus.APPROVED;      // ACTIVE
    case 2: return AssetStatus.PENDING;       // PENDING
    case 3: return AssetStatus.REJECTED;      // SUSPENDED
    case 0: return AssetStatus.UNDER_REVIEW;  // INACTIVE
    default: return AssetStatus.PENDING;
  }
}

// ========== Location API Models ========== //
export interface Governate {
  governateId: number;
  governateName: string;
}

export interface CountryWithGovernates {
  countryId: number;
  countryName: string;
  governates: {
    [governateId: string]: Governate;
  };
}

export interface CountriesGovernatesResponse {
  data: {
    [countryId: string]: CountryWithGovernates;
  };
}

export interface AssetImage {
  id: number;
  imageId: string;
  imageURL: string;
  assetId: string;
}