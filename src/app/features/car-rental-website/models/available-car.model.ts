export interface CarImage {
  id: number;
  imageId: string;
  imageURL: string;
}

export interface AvailableCar {
  id: number;
  factoryMake: string;
  modelName: string;
  modelYear: number;
  type: number;
  capacity: number;
  pricePerDay: number;
  transmission: number; // TransmissionType enum
  fuelType: number; // FuelType enum
  isAvailable: boolean;
  status: number;
  description: string;
  carImages: CarImage[];
  carRentalAssetId: string;
  carRentalAssetName: string;
} 