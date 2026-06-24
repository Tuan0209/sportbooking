import React from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Marker tuỳ biến (tránh lỗi icon mặc định của Leaflet khi bundle bằng Vite)
const pitchIcon = L.divIcon({
  html: `<div style="background:#0E8C4E;width:30px;height:30px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 4px 10px rgba(6,35,26,.4);display:flex;align-items:center;justify-content:center;border:2px solid #fff;"><span style="transform:rotate(45deg);color:#fff;font-weight:800;font-size:13px;">S</span></div>`,
  className: '',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

/**
 * Bản đồ OpenStreetMap hiển thị vị trí 1 cơ sở.
 * Props: lat, lng, name, address, height (mặc định 220px).
 */
const VenueMap = ({ lat, lng, name, address, height = 220 }) => {
  const latNum = Number(lat);
  const lngNum = Number(lng);
  const valid = !Number.isNaN(latNum) && !Number.isNaN(lngNum) && (latNum !== 0 || lngNum !== 0);

  if (!valid) {
    return (
      <div
        style={{ height }}
        className="w-full rounded-2xl border border-line bg-chalk flex flex-col items-center justify-center text-muted gap-2"
      >
        <MapPin size={22} />
        <span className="text-sm">Cơ sở chưa cập nhật toạ độ bản đồ</span>
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-line shadow-card">
      <MapContainer
        center={[latNum, lngNum]}
        zoom={16}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latNum, lngNum]} icon={pitchIcon}>
          <Popup>
            <div style={{ fontWeight: 700 }}>{name}</div>
            {address && <div style={{ fontSize: 12, color: '#5B6B61' }}>{address}</div>}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default VenueMap;
