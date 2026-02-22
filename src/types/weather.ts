export interface WeatherCoordinates {
  lon: number;
  lat: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WeatherWind {
  speed: number;
  deg: number;
}

export interface WeatherClouds {
  all: number;
}

export interface WeatherSys {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherResponse {
  coord: WeatherCoordinates;
  weather: WeatherCondition[];
  main: WeatherMain;
  wind: WeatherWind;
  clouds: WeatherClouds;
  sys: WeatherSys;
  name: string;
}
