import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Doctor } from '../models/Hospital.model';

@Injectable({
    providedIn: 'root'
})
export class HospitalService {
    private baseUrl = 'http://localhost:4200/api'; // Replace with your API endpoint
    // Dummy data for hospitals, clinics, doctors, and schedules
    private hospitals = [
        {
            id: 1,
            name: 'City Hospital',
            address: '123 Main St, Cityville',
            phone: '123-456-7890',
            image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
            reviews: 4.5,
            clinics: [
                {
                    id: 1,
                    name: 'Cardiology',
                    image: 'https://images.unsplash.com/photo-1519494080410-f9aa8f52f1e1?auto=format&fit=crop&w=600&q=80',
                    doctors: [
                        {
                            id: 1,
                            name: 'Dr. Alice Smith',
                            specialization: 'Cardiologist',
                            image: 'https://randomuser.me/api/portraits/women/44.jpg',
                            schedules: [
                                { day: 'Monday', time: '09:00-12:00', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80' },
                                { day: 'Wednesday', time: '14:00-17:00', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80' }
                            ]
                        },
                        {
                            id: 2,
                            name: 'Dr. Bob Jones',
                            specialization: 'Cardiologist',
                            image: 'https://randomuser.me/api/portraits/men/46.jpg',
                            schedules: [
                                { day: 'Tuesday', time: '10:00-13:00', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80' },
                                { day: 'Thursday', time: '15:00-18:00', image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80' }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    name: 'Neurology',
                    image: 'https://images.unsplash.com/photo-1511174511562-5f97f4f4eab6?auto=format&fit=crop&w=600&q=80',
                    doctors: [
                        {
                            id: 3,
                            name: 'Dr. Carol White',
                            specialization: 'Neurologist',
                            image: 'https://randomuser.me/api/portraits/women/47.jpg',
                            schedules: [
                                { day: 'Monday', time: '13:00-16:00', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd9?auto=format&fit=crop&w=600&q=80' },
                                { day: 'Friday', time: '09:00-12:00', image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: 'Green Valley Hospital',
            address: '456 Green Rd, Valleytown',
            phone: '987-654-3210',
            image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&w=600&q=80',
            reviews: 4.5,

            clinics: [
                {
                    id: 3,
                    name: 'Orthopedics',
                    image: 'https://images.unsplash.com/photo-1512070679279-c2f999098c01?auto=format&fit=crop&w=600&q=80',
                    doctors: [
                        {
                            id: 4,
                            name: 'Dr. David Brown',
                            specialization: 'Orthopedic Surgeon',
                            image: 'https://randomuser.me/api/portraits/men/48.jpg',
                            schedules: [
                                { day: 'Wednesday', time: '09:00-12:00', image: 'https://images.unsplash.com/photo-1465101178521-c1a9136a3fd9?auto=format&fit=crop&w=600&q=80' },
                                { day: 'Friday', time: '14:00-17:00', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: 'Sunrise Medical Center',
            address: '789 Sunrise Ave, Sunnytown',
            phone: '555-123-4567',
            image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80',
            clinics: [
                {
                    id: 4,
                    name: 'Dermatology',
                    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80',
                    doctors: [
                        {
                            id: 5,
                            name: 'Dr. Emily Green',
                            specialization: 'Dermatologist',
                            image: 'https://randomuser.me/api/portraits/women/49.jpg',
                            schedules: [
                                { day: 'Tuesday', time: '09:00-12:00', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' },
                                { day: 'Thursday', time: '13:00-16:00', image: 'https://images.unsplash.com/photo-1519494080410-f9aa8f52f1e1?auto=format&fit=crop&w=600&q=80' }
                            ]
                        }
                    ]
                },
                {
                    id: 5,
                    name: 'Pediatrics',
                    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80',
                    doctors: [
                        {
                            id: 6,
                            name: 'Dr. Frank Black',
                            specialization: 'Pediatrician',
                            image: 'https://randomuser.me/api/portraits/men/50.jpg',
                            schedules: [
                                { day: 'Monday', time: '10:00-13:00', image: 'https://images.unsplash.com/photo-1511174511562-5f97f4f4eab6?auto=format&fit=crop&w=600&q=80' },
                                { day: 'Wednesday', time: '15:00-18:00', image: 'https://images.unsplash.com/photo-1512070679279-c2f999098c01?auto=format&fit=crop&w=600&q=80' }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    constructor(private http: HttpClient) {}

    getHospitals(): Observable<any> {
        return new Observable(observer => {
            const hospitalsWithoutClinics = this.hospitals.map(({ clinics, ...rest }) => rest);
            observer.next(hospitalsWithoutClinics);
            observer.complete();
        });
       // return this.http.get<any>(this.baseUrl);
    }

    getHospitalById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`);
    }

    createHospital(hospital: any): Observable<any> {
        return this.http.post<any>(this.baseUrl, hospital);
    }

    updateHospital(id: number, hospital: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${id}`, hospital);
    }

    deleteHospital(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${id}`);
    }

    filterHospitals(filterCriteria: { name: string; specialty: string; location: string }): Observable<any[]> {
        return new Observable(observer => {
            let filtered = this.hospitals;

            if (filterCriteria.name) {
                filtered = filtered.filter(hospital =>
                    hospital.name.toLowerCase().includes(filterCriteria.name.toLowerCase())
                );
            }

            if (filterCriteria.location) {
                filtered = filtered.filter(hospital =>
                    hospital.address.toLowerCase().includes(filterCriteria.location.toLowerCase())
                );
            }

            if (filterCriteria.specialty) {
                filtered = filtered.filter(hospital =>
                    hospital.clinics &&
                    hospital.clinics.some(clinic =>
                        clinic.name.toLowerCase().includes(filterCriteria.specialty.toLowerCase())
                    )
                );
            }

            const hospitalsWithoutClinics = filtered.map(({ clinics, ...rest }) => rest);
            observer.next(hospitalsWithoutClinics);
            observer.complete();
        });
    }

    getClinicsByHospitalId(hospitalId: number): Observable<any[]> {
        return new Observable(observer => {
            const hospital = this.hospitals.find(h => h.id === hospitalId);
            observer.next(hospital ? hospital.clinics || [] : []);
            observer.complete();
        });
    }

    filterClinics(hospitalId: number, searchTerm: string, selectedSpecialists: string[]): Observable<any[]> {
        return new Observable(observer => {
            const hospital = this.hospitals.find(h => h.id === hospitalId);
            if (!hospital || !hospital.clinics) {
                observer.next([]);
                observer.complete();
                return;
            }

            let clinics = hospital.clinics;

            if (searchTerm) {
                clinics = clinics.filter(clinic =>
                    clinic.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            if (selectedSpecialists && selectedSpecialists.length > 0) {
                clinics = clinics.filter(clinic =>
                    clinic.doctors &&
                    clinic.doctors.some(doctor =>
                        selectedSpecialists.includes(doctor.specialization)
                    )
                );
            }

            observer.next(clinics);
            observer.complete();
        });
    }

    getDoctorSchedule(hospitalId: number, clinicId: number, doctorId: number): Observable<any[]> {
        return new Observable(observer => {
            const hospital = this.hospitals.find(h => h.id === hospitalId);
            if (!hospital) {
                observer.next([]);
                observer.complete();
                return;
            }
            const clinic = hospital.clinics?.find(c => c.id === clinicId);
            if (!clinic) {
                observer.next([]);
                observer.complete();
                return;
            }
            const doctor = clinic.doctors?.find(d => d.id === doctorId);
            observer.next(doctor ? doctor.schedules || [] : []);
            observer.complete();
        });
    }
    getDoctorsByHospitalAndClinic(hospitalId: number, clinicId: number): Observable<Doctor[]> {
        return new Observable(observer => {
            const hospital = this.hospitals.find(h => h.id === hospitalId);
            if (!hospital) {
                observer.next([]);
                observer.complete();
                return;
            }
            const clinic = hospital.clinics?.find(c => c.id === clinicId);
            observer.next(clinic ? clinic.doctors || [] : []);
            observer.complete();
        });
    }
}
