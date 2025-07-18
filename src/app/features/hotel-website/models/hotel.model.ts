export interface Hotel {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  assetImages:HotelAssets[];
  gender: number;
  address: string;
  city: string;
  governorateId: number;
  governorateName: string;
  countryId: number;
  countryName: string;
  dateOfBirth: string;
  emailConfirmed: boolean;
  status: number;
  userType: number;
  nationalDocsURL: string;
  acquisitionDate: string;
  assetId: string;
  assetName: string;
  description: string;
  credentialDocURL: string;
  assetEmail: string;
  verificationNotes: string;
  assetGovernateId: number;
  assetGovernateName: string;
  latitude: number;
  longitude: number;
  locationDescription: string;
  facilities: string[];
  openingTime: {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    microsecond: number;
    nanosecond: number;
    ticks: number;
  };
  closingTime: {
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
    microsecond: number;
    nanosecond: number;
    ticks: number;
  };
  languagesSupported: string[];
  assetType: number;
  starRating: number;
  hasPool: boolean;
  hasRestaurant: boolean;
} 

export interface HotelAssets
{
  id:number;
  imageId: string;
  imageURL: string;
  assetId: string;
}