interface WeatherInfo {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Coordinates {
  lon: number;
  lat: number;
}

interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust?: number;
}

interface Snow {
  '1h'?: number;
}

interface Clouds {
  all: number;
}

interface SystemInfo {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherResponse {
  coord: Coordinates;
  weather: WeatherInfo[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: Wind;
  snow?: Snow;
  clouds: Clouds;
  dt: number;
  sys: SystemInfo;
  timezone: number;
  id: number;
  cod: number;
}

export interface ExtendedWeatherResponse extends WeatherResponse {
  name: string;
}
