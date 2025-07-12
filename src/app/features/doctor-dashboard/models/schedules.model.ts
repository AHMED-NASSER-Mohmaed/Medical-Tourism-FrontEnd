export interface DoctorAppointmentDto {
  appointmentId: number;
  date: string; // أو Date إذا ستحولها في Angular
  status: AppointmentStatus;
  patientName?: string;
  patientPhone?: string;
  patientCountry?: string;
  hospitalName?: string;
  specialty?: string;
}

export enum AppointmentStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Completed = 'Completed',
  Cancelled = 'Cancelled'
}
