// user.model.ts

export interface Time {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
  microsecond: number;
  nanosecond: number;
  ticks: number;
}

export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2
}

export enum UserStatus {
  Inactive = 0,
  Active = 1,
  Suspended = 2,
  PendingVerification = 3
}

export enum UserType {
  Patient = 0,
  Doctor = 1,
  Admin = 2,
  HospitalAdmin = 3
}

export enum AssetType {
  Clinic = 0,
  Hospital = 1,
  DiagnosticCenter = 2,
  Pharmacy = 3
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  imageURL: string;
  gender: Gender;
  address: string;
  city: string;
  governorate: string;
  country: string;
  dateOfBirth: Date | string;
  emailConfirmed: boolean;
  status: UserStatus;
  userType: UserType;
  nationalDocsURL: string;
  acquisitionDate: Date | string;
  
  // Asset/Hospital specific properties
  assetId?: string;
  assetName?: string;
  description?: string;
  credentialDocURL?: string;
  assetEmail?: string;
  verificationNotes?: string;
  latitude?: number;
  longitude?: number;
  locationDescription?: string;
  facilities?: string[];
  openingTime?: Time;
  closingTime?: Time;
  languagesSupported?: string[];
  assetType?: AssetType;
  numberOfDepartments?: number;
  emergencyServices?: boolean;
}