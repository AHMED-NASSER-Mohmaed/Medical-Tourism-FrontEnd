export interface Disbursement {
  id: number;
  disbursementDateMonth: Date;  // Using Date instead of DateOnly for Angular
  totalAmount: number;
  generatedAt: Date;
  paymentMethod: string;
  assetName: string;
}
export interface DisbursementListResponse {
  items: Disbursement[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}
export interface DisbursementHospitalDTO {
  id: number;
  totalAmount: number;
  generatedAt: string;
  disbursementDateMonth: string; 
  disbursementItems: DisbursementItemDto[];
}

export interface DisbursementItemDto {
  id: number;
  appointment: AppointmentDto | null;  // nullable لأنه ممكن ما يكون فيه appointment
}

export interface AppointmentDto {
  id: number;
  price: number;
  status: number;
  type: number;
  specialtySchedule: SpecialtyScheduleDto | null; // nullable لأنه مش دايمًا يكون موجود
}

export interface SpecialtyScheduleDto {
  id: number;
  name: string;
  specialty:string;
  doctor: DoctorDto | null; // nullable لأنه ممكن doctor يكون null
}

export interface DoctorDto {
  id: string;
  name: string;
}

