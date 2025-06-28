// Enums must match backend values exactly
export enum UserStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  PENDING = 2,
  SUSPENDED = 3
}

export enum Gender {
  UNSPECIFIED = 0,
  MALE = 1,
  FEMALE = 2
}

export enum AssetStatus {
  PENDING = 0,
  UNDER_REVIEW = 1,
  APPROVED = 2,
  REJECTED = 3
}

export enum ProviderType {
  HOTEL = 0,
  HOSPITAL = 1,
  CAR_RENTAL = 2
}

export enum TransmissionType {
  MANUAL = 0,
  AUTOMATIC = 1
}

export enum FuelType {
  GASOLINE = 0,
  DIESEL = 1,
  ELECTRIC = 2,
  HYBRID = 3
}

// Core Interfaces
export interface TimeObject {
  hour: number;
  minute: number;
  second: number;
  millisecond?: number;
}

export interface PaginatedResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  items: T[];
}

export interface UserBase {
  id: string;
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
  acquisitionDate?: string; // optional
 // Document URLs
}

export interface Patient extends UserBase {
  bloodGroup: string;
  height: number;
  weight: number;
}

export interface BaseProvider extends UserBase {
  assetId: string;
  assetName: string;
  assetDescription: string;
  assetEmail: string;
  locationDescription: string;
  latitude: number;
  longitude: number;
  facilities: string[];
  verificationNotes: string;
  verificationStatus: AssetStatus; // Add this
  languagesSupported: number[];
  assetType: ProviderType;
  openingTime: TimeObject;
  closingTime: TimeObject;
  nationalDocsURL?: string;
  credentialDocURL?: string;
}

export interface HotelProvider extends BaseProvider {
  starRating: number;
  hasPool: boolean;
  hasRestaurant: boolean;
}

export interface HospitalProvider extends BaseProvider {
  numberOfDepartments: number;
  emergencyServices: boolean;
}

export interface CarRentalProvider extends BaseProvider {
  fuelTypes: FuelType[];
  models: string[];
  transmission: TransmissionType;
  rentalPolicies: string[];
}

// Request Interfaces
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

export interface StatusChangeRequest {
  notes?: string;
}