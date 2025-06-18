// features/super-admin/models/super-admin.model.ts

// User Base Interface
export interface UserBase {
  id: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationality: string;
  nationalId: string;
  passportId: string;
  imageId: string;
  imageURL: string;
  gender: string;
  status: number; // 0 = Inactive, 1 = Active, 2 = Pending, 3 = Suspended
  zipCode: string;
  streetNumber: string;
  governorate: string;
  dateOfBirth: string;
  userType: number;
  lockoutEnd: string;
  emailConfirmed: boolean;
}

// Patient Interface
export interface Patient extends UserBase {
  bloodGroup: string;
  height: number;
  weight: number;
}

// Hotel Provider Interface
export interface HotelProvider extends UserBase {
  providerDocsURL: string;
  assetId: string;
  assetName: string;
  description: string;
  assetDocsURL: string;
  assetEmail: string;
  acquisitionDate: string;
  verificationStatus: number; // 0 = Pending, 1 = Under Review, 2 = Approved
  verificationNotes: string;
  verifiedCountryCode: string;
  assetType: number;
  latitude: number;
  longitude: number;
  locationDescription: string;
  facilities: string[];
  openingHours: string;
  languagesSupported: string[];
  starRating: number;
  hasPool: boolean;
  hasRestaurant: boolean;
}

// Hospital Provider Interface
export interface HospitalProvider extends UserBase {
  providerDocsURL: string;
  assetId: string;
  assetName: string;
  description: string;
  assetDocsURL: string;
  assetEmail: string;
  acquisitionDate: string;
  verificationStatus: number;
  verificationNotes: string;
  verifiedCountryCode: string;
  assetType: number;
  latitude: number;
  longitude: number;
  locationDescription: string;
  facilities: string[];
  openingHours: string;
  languagesSupported: string[];
  numberOfDepartments: number;
  hasEmergencyRoom: boolean;
  isTeachingHospital: boolean;
  emergencyServices: boolean;
}

// Car Rental Provider Interface
export interface CarRentalProvider extends UserBase {
  providerDocsURL: string;
  assetId: string;
  assetName: string;
  description: string;
  assetDocsURL: string;
  assetEmail: string;
  acquisitionDate: string;
  verificationStatus: number;
  verificationNotes: string;
  verifiedCountryCode: string;
  assetType: number;
  latitude: number;
  longitude: number;
  locationDescription: string;
  facilities: string[];
  openingHours: string;
  languagesSupported: string[];
  operationalAreas: string;
  vehicleType: string[];
  transmission: string[];
  fuelType: string[];
  rentalPolicies: string[];
  additionalServices: string[];
  carFeatures: string[];
}

// Paginated Response Interface
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

// Status Change Request
export interface StatusChangeRequest {
  notes?: string;
}

// Email Change Request
export interface EmailChangeRequest {
  userId: string;
  newEmail: string;
}

// Asset Status Request
export interface AssetStatusRequest {
  assetId: string;
  status: number; // 0, 1, or 2
  notes: string;
}

// User Status
export enum UserStatus {
  INACTIVE = 0,
  ACTIVE = 1,
  PENDING = 2,
  SUSPENDED = 3
}

// Asset Status
export enum AssetStatus {
  PENDING = 0,
  UNDER_REVIEW = 1,
  APPROVED = 2
}