// Assuming Doctor and Clinic models look like this:

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  image: string;
  schedules: Schedule[];
}

export interface Clinic {
  id: number;
  name: string;
  image: string;
  doctors: Doctor[];
}

export interface Schedule {
  day: string;
  time: string;
  image: string;
  available: boolean;
  date?: string;  // Optional, depending on your calendar logic
}


export interface Hospital {
    id: number;
    name: string;
    address: string;
    phone: string;
    image: string;
    clinics: Clinic[];
}
export interface DisplayHospitals {
  id: string;
  assetName: string;  // Add this property if it's missing
  description: string;
  address: string;
  phone: string;
  reviews: number;
  // other properties as needed...
}

