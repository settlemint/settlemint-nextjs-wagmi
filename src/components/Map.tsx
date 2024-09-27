import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';

interface MapProps {
  coordinates: [number, number][];
}

const CoffeeIcon = L.icon({
  iconUrl: '/favicon.ico',
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

// This component will handle fitting the bounds
const FitBounds: React.FC<{ coordinates: [number, number][] }> = ({ coordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, coordinates]);

  return null;
};

const MapComponent: React.FC<MapProps> = ({ coordinates }) => {
  const mapRef = useRef<L.Map>(null);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: '100%', width: '100%', color: 'black', accentColor: 'black' }}
      zoomControl={false}
      ref={mapRef}
      attributionControl={false} // Disable default attribution control
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />

      {coordinates.map((coord, index) => (
        <Marker
          key={`marker-${coord[0]}-${coord[1]}`}
          position={coord}
          icon={CoffeeIcon}
        />
      ))}

      <Polyline
        positions={coordinates}
        color="brown"
        weight={2}
        opacity={0.7}
      />

      <FitBounds coordinates={coordinates} />
    </MapContainer>
  );
};

export default MapComponent;