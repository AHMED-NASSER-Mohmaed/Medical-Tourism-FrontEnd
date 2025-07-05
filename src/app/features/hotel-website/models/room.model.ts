export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  roomType: number;
  occupancy: number;
  images: string[];
  hotelId: string;
  facilities?: string[];
  hasPool?: boolean;
  hasRestaurant?: boolean;
  governorateId?: number;
  // Add more fields as needed based on actual API response
} 