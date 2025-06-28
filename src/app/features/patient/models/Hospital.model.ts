export interface Schedule {
    day: string;
    time: string;
    image: string;
}

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

export interface Hospital {
    id: number;
    name: string;
    address: string;
    phone: string;
    image: string;
    clinics: Clinic[];
}
export interface DisplayHospitals {
     id: number;
    name: string;
    address: string;
    phone: string;
    image: string;
    reviews: number;
}