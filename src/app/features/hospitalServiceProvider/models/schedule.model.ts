export interface ScheduleResponseDto {
  id: number;
  doctorId: string;
  doctorName: string;
  specialty: string;
  hospital: string;
  hospitalAssetId: string;
  hospitalSpecialtyId: number;
  dayOfWeekId: number;
  startTime: string;  // or Date if you prefer
  endTime: string;    // or Date if you prefer
  timeSlotSize: number;
  price: number;      // Note: TypeScript uses 'number' instead of 'decimal'
  maxCapacity: number;
  availableSlots: number;
  bookedSlots: number;
  cancelledSlots: number;
  isActive: boolean;
}

// If you need DayOfWeekDto as well
export interface DayOfWeekDto {
  id?: number;
  name?: string;
  // other properties as needed
}
export interface ScheduleListResponse {
  items: ScheduleResponseDto[];
  totalCount?: number;
  pageNumber?: number;
  pageSize?: number;
}

export interface ScheduleRequestDto {
  doctorId: string;
  hospitalSpecialtyId: number;
  dayOfWeekId: number;
  startTime: string;
  endTime: string;
  timeSlotSize: string;
  maxCapacity: number;
  price: number;
}

export interface TimeModel {
  hour: number;
  minute: number;
}