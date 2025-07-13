export interface DoctorScheduleSlotDto {
  id: number;
  doctorId: string;
  doctorName: string;
  hospital: string;
  hospitalAssetId: string;
  hospitalSpecialtyId: number;
  specialty: string;
  dayOfWeekId: number;
  startTime: string;          // "10:00:00"
  endTime: string;            // "11:00:00"
  timeSlotSize: string;       // "11:00:00"
  price: number;
  maxCapacity: number;
  availableSlots: number;
  blookedDates: string[];     // مصفوفة تواريخ محجوزة أو فارغة
  isActive: boolean;
}
export interface PagedSlotsResponse {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  items: DoctorScheduleSlotDto[]; // أو أي اسم مناسب للعنصر
}

