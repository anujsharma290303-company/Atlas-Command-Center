export interface CountryName {
  common: string;
  official: string;
}

export interface CountryFlags {
  png: string;
  svg: string;
}

export interface CountryCurrencies {
  [code: string]: {
    name: string;
    symbol: string;
  };
}

export interface CountryLanguages {
  [code: string]: string;
}

export interface CountryResponse {
  name: CountryName;
  flags: CountryFlags;
  population: number;
  region: string;
  subregion: string;
  capital?: string[];
  currencies?: CountryCurrencies;
  languages?: CountryLanguages;
  [key: string]: unknown; 
}