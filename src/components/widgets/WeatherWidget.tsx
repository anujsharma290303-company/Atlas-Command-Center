import { useEffect, useState } from "react";
import { useGetWeatherByCoordsQuery } from "../../api/weatherApi";
import { mapApiState } from "../../utils/apistate";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { pushNotification } from "../../features/notification/notificationSlice";

type Coords = { lat: number; lon: number };

const WeatherWidget = () => {
  const dispatch = useAppDispatch();

  // ✅ lazy init (NO setState in effect)
  const [coords, setCoords] = useState<Coords | null>(() => {
    const saved = sessionStorage.getItem("weather_coords");
    return saved ? JSON.parse(saved) : null;
  });

  // ✅ Only ask geolocation if coords not found
  useEffect(() => {
    if (coords) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };

        sessionStorage.setItem(
          "weather_coords",
          JSON.stringify(newCoords)
        );

        setCoords(newCoords);
      },
      () => {
        dispatch(
          pushNotification({
            message: "Location permission denied",
            type: "warning",
          })
        );
      }
    );
  }, [coords, dispatch]);

  // ✅ safe query usage
  const query = useGetWeatherByCoordsQuery(coords as Coords, {
    skip: !coords,
  });

  const state = mapApiState(query);

  // ✅ notifications
  useEffect(() => {
    if (state.status === "error") {
      dispatch(
        pushNotification({
          message: "Weather data unavailable",
          type: "error",
        })
      );
    }

    if (state.status === "success") {
      dispatch(
        pushNotification({
          message: "Weather updated",
          type: "success",
        })
      );
    }
  }, [state.status, dispatch]);

  if (!coords || state.status === "idle")
    return <div className="p-4">Detecting Location...</div>;

  if (state.status === "loading")
    return <div className="p-4">Loading Weather...</div>;

  if (state.status === "error")
    return <div className="p-4">Weather Unavailable</div>;

  const { data } = state;

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl p-6 text-white shadow-md">
      <h2 className="text-lg font-semibold mb-2">
        {data.name}, {data.sys.country}
      </h2>

      <p className="text-3xl text-gray-300">
        {Math.round(data.main.temp)}°C
      </p>

      <p className="capitalize text-gray-300">
        {data.weather[0].description}
      </p>

      <div className="mt-3 text-sm text-gray-400 space-y-1">
        <p>Humidity: {data.main.humidity}%</p>
        <p>Wind: {data.wind.speed} m/s</p>
      </div>
    </div>
  );
};

export default WeatherWidget;

WeatherWidget.displayName = "WeatherWidget";
