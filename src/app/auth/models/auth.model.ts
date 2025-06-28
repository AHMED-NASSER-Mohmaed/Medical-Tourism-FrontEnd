import { FuelType, TransmissionType } from '../models/enums';
export interface LoginRequest {
  email: string;
  password: string;
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


export interface RegisterHotelRequest {

  /* ─ Asset block ─ */
  AssetType: number;                // 1 = Hotel
  AssetName: string;
  AssetDescription: string;
  AssetEmail: string;
  LocationDescription: string;
  Latitude: number;
  Longitude: number;
  HasPool: boolean;
  HasRestaurant: boolean;
  StarRating: number;
  Facilities: string[];             // ← already split into array
  VerificationNotes: string;

  /* ─ Account block ─ */
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Password: string;
  ConfirmPassword: string;
  Gender: number;                   // 0 / 1
  DateOfBirth: string;              // “YYYY-MM-DD”
  Address: string;
  City: string;

  /* ─ Location block ─ */
  CountryId: number;
  GovernorateId: number;

  /* ─ Languages ─ */
  LanguagesSupported: number[];     // array of ids
}

/* RegisterHospitalRequest.ts */
export interface RegisterHospitalRequest {
  /* asset-level info */
  AssetType: number;                 // 2 = Hospital (set by UI)
  AssetName: string;
  AssetDescription: string;
  AssetEmail: string;
  LocationDescription: string;
  Latitude: number;
  Longitude: number;
  NumberOfDepartments: number;
  EmergencyServices: boolean;
  Facilities: string[];              // split on “,” in the UI
  VerificationNotes: string;
  LanguagesSupported: number[];      // enum IDs

  CountryId: number;
  GovernorateId: number;

  /* account for the person registering */
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Password: string;
  ConfirmPassword: string;           // used only for server-side check
  Gender: number;                    // 0 = Male, 1 = Female
  DateOfBirth: string;               // ISO yyyy-MM-dd
  Address: string;
  City: string;
}
export interface RegisterCarRentalRequest {
  AssetName: string;
  AsetDescription: string;
  AssetEmail: string;

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


