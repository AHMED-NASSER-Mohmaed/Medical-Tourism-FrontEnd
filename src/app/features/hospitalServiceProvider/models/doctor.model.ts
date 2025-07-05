// doctor.model.ts

export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2
}

export enum Status {
  Inactive = 0,
  Active = 1,
  Suspended = 2,
  PendingVerification = 3
}

export interface DoctorDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageURL?: string | null;
  gender: Gender;
  
  // Address information
  address: string;
  city: string;
  governorateId: number;
  governorateName: string;
  countryId: number;
  countryName: string;
  
  // Contact information
  phone: string;
  dateOfBirth?: Date | string | null;
  status: Status;
  
  // Professional information
  medicalLicenseNumber: string;
  yearsOfExperience: number;
  bio: string;
  qualification: string;
  
  // Specialty information
  specialtyId: number;
  specialtyName: string;
  
  // Hospital affiliation
  hospitalId: string;
  hospitalName: string;
}

// For list responses with pagination
export interface DoctorListResponse {
  items: DoctorDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

// For create/update requests (optional fields)
export interface DoctorRegistrationDto {
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
  dateOfBirth: Date | string;
  medicalLicenseNumber: string;
  yearsOfExperience: number;
  bio: string;
  qualification: string;
  hospitalSpecialtyId: number;
}

// models/doctor-create.dto.ts
export interface DoctorCreateDto {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string; // or use an enum if you have one
  address: string;
  city: string;
  governorateId: number;
  countryId: number;
  dateOfBirth: string; // ISO date string
  medicalLicenseNumber?: string;
  yearsOfExperience?: number;
  bio?: string;
  qualification?: string;
  hospitalSpecialtyId: number;
}

// models/api-response.ts
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success: boolean;
  statusCode: number;
}