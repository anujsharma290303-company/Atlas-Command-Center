import withDataRefresh from "../../hocs/withDataRefresh";
import { useGetWeatherByCoordsQuery } from "../../api/weatherApi";
import WeatherWidget from "./WeatherWidget";

const useWeatherRefresh = () => {
  const raw = sessionStorage.getItem("weather_coords");
  const coords = raw ? JSON.parse(raw) : null;
  return useGetWeatherByCoordsQuery(coords, { skip: !coords });
};

const WeatherWidgetWithRefresh = withDataRefresh(
  useWeatherRefresh,
  30000,
)(WeatherWidget);

export default WeatherWidgetWithRefresh;