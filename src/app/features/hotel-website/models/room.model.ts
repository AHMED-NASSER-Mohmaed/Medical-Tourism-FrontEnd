export interface RoomImage {
  id: number;
  imageId: string;
  imageURL: string;
}

export interface Room {
  id: number;
  price: number;
  maxOccupancy: number;
  isAvailable: boolean;
  description: string;
  amenities: string[];
  roomNumber: string;
  floorNumber: number;
  hasBalcony: boolean;
  viewType: number;
  status: number;
  includesBreakfast: boolean;
  roomImages: RoomImage[];
  roomType: number;
  hotelAssetId: string;
  hotelAssetName: string;
  hotelStarRating?: number | null;
} 