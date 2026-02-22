import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ============================================================================
// CONFIGURATION
// ============================================================================

// Get OpenWeatherMap API key from environment variables
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

// ============================================================================
// CUSTOM MARKER ICON
// ============================================================================

/**
 * Custom red marker icon for showing user's location on the map
 * 
 * Properties:
 * - iconUrl: The actual marker image (red pin)
 * - shadowUrl: Shadow image for the marker
 * - iconSize: Width and height of the icon in pixels [width, height]
 * - iconAnchor: Point of the icon which will correspond to marker's location [x, y]
 *               [12, 41] means the bottom center of the icon
 * - popupAnchor: Point from which the popup should open relative to the iconAnchor
 * - shadowSize: Size of the shadow image
 */
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// ============================================================================
// CHANGE VIEW COMPONENT
// ============================================================================

/**
 * Helper component to dynamically update the map's center and zoom level
 * 
 * Why needed: MapContainer's center and zoom props only work on initial render.
 * To update the map view after it's created (e.g., when user location loads),
 * we need to use the map.setView() method.
 * 
 * @param center - [latitude, longitude] coordinates to center the map on
 * @param zoom - Zoom level (1 = world view, 18 = street level)
 */
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  // Get reference to the Leaflet map instance
  const map = useMap();
  
  // Update map view whenever center or zoom changes
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  // This component doesn't render anything visible
  return null;
}

// ============================================================================
// MAIN WEATHER MAP COMPONENT
// ============================================================================

/**
 * WeatherMap Component
 * 
 * Displays an interactive map with:
 * 1. OpenStreetMap base layer (streets, cities, countries)
 * 2. OpenWeatherMap cloud overlay (real-time weather data)
 * 3. User location marker (red pin)
 * 
 * Features:
 * - Automatically centers on user's GPS location if permission granted
 * - Falls back to world view if location denied
 * - Shows real-time cloud coverage
 * - Interactive (zoom, pan, click for info)
 */
const WeatherMap = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  /**
   * Map center position [latitude, longitude]
   * Initial: [20, 0] - centered on Africa (world view)
   * Updates: User's GPS coordinates when location is obtained
   */
  const [position, setPosition] = useState<[number, number]>([20, 0]);
  
  /**
   * Map zoom level
   * Initial: 2 (zoomed out to see entire world)
   * Updates: 10 when user location is found (city-level zoom)
   * 
   * Zoom levels:
   * - 1-3: World/continent view
   * - 4-6: Country view
   * - 7-10: City view
   * - 11-13: District view
   * - 14-18: Street view
   */
  const [zoom, setZoom] = useState(2);
  
  /**
   * User's actual GPS coordinates
   * null: Location not yet obtained or permission denied
   * [lat, lon]: User's coordinates - used to display marker
   */
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // ============================================================================
  // GEOLOCATION EFFECT
  // ============================================================================
  
  /**
   * Request user's location on component mount
   * 
   * Flow:
   * 1. Browser requests location permission
   * 2. If granted: Get coordinates, center map, show marker
   * 3. If denied: Log error, keep default world view
   */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      // Success callback: User granted location permission
      (pos) => {
        // Extract latitude and longitude from geolocation result
        const coords: [number, number] = [
          pos.coords.latitude,   // e.g., 40.7128 (New York)
          pos.coords.longitude,  // e.g., -74.0060 (New York)
        ];
        
        // Update map center to user's location
        setPosition(coords);
        
        // Store location for marker display
        setUserLocation(coords);
        
        // Zoom in to city level (10 is good for seeing local area)
        setZoom(10);
      },
      // Error callback: User denied permission or location unavailable
      (error) => {
        console.log("Location permission denied", error);
        // Map stays at default world view [20, 0] with zoom level 2
      }
    );
  }, []); // Empty dependency array = run only once on mount

  // ============================================================================
  // RENDER MAP
  // ============================================================================
  
  return (
    // Outer container with styling
    <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
      {/* 
        MapContainer: Main Leaflet map container
        - center: Initial center position (updates via ChangeView component)
        - zoom: Initial zoom level (updates via ChangeView component)
        - scrollWheelZoom: Allow users to zoom with mouse wheel
        - className: Tailwind styling for height and width
      */}
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-75 md:h-100 w-full"  
      >
        {/* Component to handle dynamic map view updates */}
        <ChangeView center={position} zoom={zoom} />
        
        {/* 
          LAYER 1: Base Map (OpenStreetMap)
          Shows streets, cities, countries, terrain, etc.
          This is the foundation layer that everything else sits on top of
          
          URL pattern: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
          - {s}: Subdomain for load balancing (a, b, or c)
          - {z}: Zoom level
          - {x}, {y}: Tile coordinates
        */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* 
          LAYER 2: Weather Overlay (OpenWeatherMap Clouds)
          Shows real-time cloud coverage data
          - Layered on top of base map
          - opacity: 0.6 (60%) so you can see the map underneath
          - Requires API key for authentication
          
          Available weather layers:
          - clouds_new: Cloud coverage
          - precipitation_new: Rainfall
          - pressure_new: Atmospheric pressure
          - wind_new: Wind speed
          - temp_new: Temperature
        */}
        <TileLayer
          url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          opacity={0.6}
        />
        
        {/* 
          LAYER 3: User Location Marker
          Only renders if userLocation is not null (user granted permission)
          
          Marker: Red pin at user's exact GPS coordinates
          Popup: Info box that appears when marker is clicked
        */}
        {userLocation && (
          <Marker position={userLocation} icon={customIcon}>
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
                <br />
                {/* Display coordinates rounded to 4 decimal places (~11 meters accuracy) */}
                <small>
                  {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                </small>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

// ============================================================================
// EXPORT
// ============================================================================

export default WeatherMap;

/**
 * USAGE EXAMPLE:
 * 
 * import WeatherMap from './components/weather/WeatherMap';
 * 
 * function Dashboard() {
 *   return (
 *     <div>
 *       <h1>Weather Dashboard</h1>
 *       <WeatherMap />
 *     </div>
 *   );
 * }
 * 
 * TROUBLESHOOTING:
 * 
 * 1. Map not showing?
 *    - Make sure you imported "leaflet/dist/leaflet.css"
 *    - Check that container has a defined height
 * 
 * 2. Weather layer not showing?
 *    - Verify API key is correct in .env file
 *    - Check browser console for 401 errors
 * 
 * 3. Location not working?
 *    - Must use HTTPS (localhost is OK)
 *    - User must grant permission
 *    - Check browser console for geolocation errors
 * 
 * 4. Marker not appearing?
 *    - Check that custom icon URLs are accessible
 *    - Verify userLocation state is being set
 * 
 * CUSTOMIZATION IDEAS:
 * 
 * - Add different weather layers (temperature, wind, precipitation)
 * - Add layer toggle buttons to switch between weather types
 * - Show multiple cities with markers
 * - Add click handler to get weather for any location
 * - Display forecast data in popup
 * - Add heatmap overlay for temperature
 * - Show wind direction arrows
 * - Add time slider for forecast animation
 */



/*
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; 

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const WeatherMap = () => {
  const position: [number, number] = [20, 0]; // world view center

  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden">
      <MapContainer
        center={position}
        zoom={2}
        scrollWheelZoom={true}
        className="h-[400px] w-full" // ✅ Fixed: h-[400px] instead of h-100px
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />

        <TileLayer
          url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          opacity={0.6}
        />
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
*/