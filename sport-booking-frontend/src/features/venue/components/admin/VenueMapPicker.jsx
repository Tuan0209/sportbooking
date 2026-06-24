import React, { useEffect, useState, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import axios from 'axios';

const VenueMapPicker = ({ address, lat, lng, onSelect }) => {
  const [search, setSearch] = useState(address || '');
  const [suggestions, setSuggestions] = useState([]);
  const apiKey = import.meta.env.VITE_GOONG_API_KEY;

  const handleSearch = async (val) => {
    setSearch(val);
    if (val.length > 2) {
      try {
        const res = await axios.get(`https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(val)}`);
        setSuggestions(res.data.predictions || []);
      } catch (e) { console.error(e); }
    }
  };

  const selectPlace = async (place) => {
    setSuggestions([]);
    setSearch(place.description);
    try {
      const res = await axios.get(`https://rsapi.goong.io/Place/Detail?api_key=${apiKey}&place_id=${place.place_id}`);
      const location = res.data.result.geometry.location;
      onSelect({
        address: place.description,
        latitude: location.lat,
        longitude: location.lng
      });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <label className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 block">Địa chỉ & Bản đồ</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-chalk border border-line rounded-xl text-sm text-ink outline-none focus:ring-2 focus:ring-pitch"
            placeholder="Tìm kiếm địa chỉ trên Goong Maps..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {suggestions.length > 0 && (
          <div className="absolute w-full mt-1 bg-white border border-line rounded-xl shadow-card-hover z-50 max-h-60 overflow-y-auto scrollbar-thin">
            {suggestions.map((p) => (
              <button
                key={p.place_id}
                onClick={() => selectPlace(p)}
                className="w-full text-left px-4 py-3 text-sm text-ink hover:bg-chalk flex items-start gap-2 border-b border-line last:border-none"
              >
                <MapPin size={16} className="text-pitch mt-0.5 shrink-0" />
                <span>{p.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-chalk rounded-xl border border-line text-[11px] font-semibold text-muted uppercase tracking-wide">
          Lat: <span className="text-pitch">{lat || '0.0'}</span>
        </div>
        <div className="p-3 bg-chalk rounded-xl border border-line text-[11px] font-semibold text-muted uppercase tracking-wide">
          Lng: <span className="text-pitch">{lng || '0.0'}</span>
        </div>
      </div>
    </div>
  );
};

export default VenueMapPicker;