export interface CountriesGovernoratesDTO {
  data: { [key: number]: CountryGovernoratesDTO };
}

export interface CountryGovernoratesDTO {
  countryId: number;
  countryName: string;
  governates: GovernorateDTO[] ; // Fixed spelling from "governates"
}

export interface GovernorateDTO {
  governateId: number;
  governateName: string;
}