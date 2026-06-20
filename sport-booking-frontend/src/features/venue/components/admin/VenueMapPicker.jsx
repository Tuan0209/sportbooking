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
        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Địa chỉ & Bản đồ</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Tìm kiếm địa chỉ trên Goong Maps..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        {suggestions.length > 0 && (
          <div className="absolute w-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
            {suggestions.map((p) => (
              <button 
                key={p.place_id} 
                onClick={() => selectPlace(p)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 flex items-start gap-2 border-b border-slate-50 last:border-none"
              >
                <MapPin size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                <span>{p.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
          Lat: <span className="text-indigo-600">{lat || '0.0'}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
          Lng: <span className="text-indigo-600">{lng || '0.0'}</span>
        </div>
      </div>
    </div>
  );
};

export default VenueMapPicker;