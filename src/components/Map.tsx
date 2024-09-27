import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

interface MapProps {
  center: [number, number];
}

const DefaultIcon = L.icon({
  iconUrl: '/_next/static/media/marker-icon.ded0b320.png',
  shadowUrl: '/_next/static/media/marker-shadow.071016c8.png',
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent: React.FC<MapProps> = ({ center }) => {
  return (
    <MapContainer
      center={center}
      zoom={4}
      style={{ height: '100%', width: '100%', color: 'black', accentColor: 'black' }}

      zoomControl={false} // This removes the zoom control buttons
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={center} />
    </MapContainer>
  );
};

export default MapComponent;