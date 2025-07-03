import { FuelType, TransmissionType } from '../models/enums';
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}
export interface LoginResponse {
  success: boolean;
  token: string;
  userId: string;
  message: string;
  errors: string[];
}
export interface RegisterPatientRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  nationality: string;
  nationalId: string;
  passportId: string;
  gender: string;
  zipCode: string;
  streetNumber: string;
  governorate: string;
  dateOfBirth: string;
  bloodGroup: string;
  height: number;
  weight: number;
}

export interface PatientProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  imageURL: string;
  gender: number;
  address: string;
  city: string;
  governorateId:number ;
  governorateName:string;
  countryId: number;
  countryName: string;
  dateOfBirth: string;
  emailConfirmed: boolean;
  status: number;
  userType: number;
  bloodGroup: string;
  height: number;
  weight: number;
}

export interface RegisterHotelRequest {

  /* ─ Asset block ─ */
  AssetType: number;                // 1 = Hotel
  AssetName: string;
  AssetDescription: string;
  AssetEmail: string;
  AssetGovernorateId: number;
  LocationDescription: string;
  Latitude: number;
  Longitude: number;
  HasPool: boolean;
  HasRestaurant: boolean;
  StarRating: number;
  Facilities: string[];
  VerificationNotes: string;

  /* ─ Account block ─ */
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Password: string;
  ConfirmPassword: string;
  Gender: number;
  DateOfBirth: string;
  Address: string;
  City: string;

  /* ─ Location block ─ */
  CountryId: number;
  GovernorateId: number;

  /* ─ Languages ─ */
  LanguagesSupported: number[];
}

/* RegisterHospitalRequest.ts */
export interface RegisterHospitalRequest {
  /* asset-level info */
  AssetType: number;                 // 2 = Hospital
  AssetName: string;
  AssetDescription: string;
  AssetGovernorateId: number;
  AssetEmail: string;
  LocationDescription: string;
  Latitude: number;
  Longitude: number;
  NumberOfDepartments: number;
  EmergencyServices: boolean;
  Facilities: string[];
  VerificationNotes: string;
  LanguagesSupported: number[];

  CountryId: number;
  GovernorateId: number;

  /* account for the person registering */
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Password: string;
  ConfirmPassword: string;
  Gender: number;
  DateOfBirth: string;
  Address: string;
  City: string;
}
export interface RegisterCarRentalRequest {
  AssetName: string;
  AsetDescription: string;
  AssetEmail: string;
  AssetGovernorateId: number;

  LocationDescription: string;
  Latitude: number;
  Longitude: number;

  Facilities: string[];
  FuelTypes: FuelType[];
  Models: string[];
  RentalPolicies: string[];
  Transmission: TransmissionType;

  VerificationNotes?: string;

  LanguagesSupported: string[];
  AssetType: number;

  Email: string;
  Password: string;
  ConfirmPassword: string;

  FirstName: string;
  LastName: string;
  Phone: string;
  Gender: number;

  Address: string;
  City: string;
  GovernorateId: number;
  CountryId: number;

  DateOfBirth: string;


}

export enum AssetType {
  Hotel = 0,
  Hospital = 1,
  CarRental = 2
}


