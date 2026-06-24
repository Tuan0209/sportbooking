import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { venueService } from '../../services/venueService';
import { Loader2 } from 'lucide-react';

const pin = L.divIcon({
  html: `<div style="background:#0E8C4E;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 10px rgba(6,35,26,.4);display:flex;align-items:center;justify-content:center;border:2px solid #fff;"><span style="transform:rotate(45deg);color:#fff;font-weight:800;font-size:13px;">S</span></div>`,
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// Tự động zoom khít tất cả marker
const FitToMarkers = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 15);
    } else {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
};

const MapPage = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    venueService.getAllVenues()
      .then((res) => { if (res.data.code === 0) setVenues(res.data.result || []); })
      .finally(() => setLoading(false));
  }, []);

  const points = useMemo(
    () => venues
      .map((v) => ({ ...v, lat: Number(v.latitude), lng: Number(v.longitude) }))
      .filter((v) => !Number.isNaN(v.lat) && !Number.isNaN(v.lng) && (v.lat !== 0 || v.lng !== 0)),
    [venues]
  );

  const center = [21.0285, 105.8542]; // Hà Nội mặc định

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-chalk">
      <div className="stadium pitch-lines text-white px-4 h-14 flex items-center shrink-0">
        <div>
          <h1 className="text-[18px] font-display font-bold tracking-tight">Bản đồ sân</h1>
          <p className="text-[11px] text-white/70">{points.length} cơ sở trên bản đồ</p>
        </div>
      </div>

      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-pitch" size={34} /></div>
        ) : (
          <MapContainer center={center} zoom={6} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <FitToMarkers points={points} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {points.map((v) => (
              <Marker key={v.id} position={[v.lat, v.lng]} icon={pin}>
                <Popup>
                  <div style={{ minWidth: 160 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: '#5B6B61', marginBottom: 6 }}>{v.address}</div>
                    <button
                      onClick={() => navigate(`/venue/${v.id}`)}
                      style={{ background: '#0E8C4E', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontWeight: 600, cursor: 'pointer', width: '100%' }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default MapPage;
