export interface DoctorProfileDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string; // Inherited from IdentityUser [from username]
  imageURL: string;
  gender: Gender;
  address: string;
  city: string;
  governorateId: number;
  governorateName: string;

  // MODIFIED: Replace Country object with ID and Name
  countryId: number;
  countryName: string;

  phone: string;
  dateOfBirth?: Date; // Nullable date
  status: Status;

  medicalLicenseNumber: string;
  yearsOfExperience: number;
  bio: string;
  qualification: string;

  // Associated Specialty information
  specialtyId: number;
  specialtyName: string;

  hospitalId: string; // The hospital the doctor is affiliated with
  hospitalName: string; // Name of the hospital
}
export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other'
}

export enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
  Pending = 'Pending'
}
