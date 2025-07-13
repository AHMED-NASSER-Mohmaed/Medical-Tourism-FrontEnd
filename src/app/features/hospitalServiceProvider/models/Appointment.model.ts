export interface HospitalAppointmentDto {
  appointmentId: number;
  date: string;            // DateOnly عادة نحوله string بصيغة "YYYY-MM-DD"
  time: string;            // TimeSpan عادة نحوله string بصيغة "HH:mm:ss"
  status: number; // enum (تحتاج تعريفه أو استيراده)
  dayOfWeekId?: number | null;

  patientName?: string | null;
  patientEmail?: string | null;
  patientPhone?: string | null;
  patientCountry?: string | null;

  doctorId?: string | null;
  doctorName?: string | null;

  specialty?: string | null;
}
export interface HospitalAppointmentRespone
{
  items: HospitalAppointmentDto[];
  totalCount: number;
  
}
