import React, { useState } from 'react';
import { Destination, Language, AlertLevel } from '../types/tourism';
import { TN_DESTINATIONS } from '../data/tamilNaduData';
import { 
  CloudRain, Wind, AlertTriangle, ShieldAlert, CheckCircle2, 
  MapPin, Thermometer, ShieldCheck, ArrowRight, Info
} from 'lucide-react';

interface WeatherDangerZoneSectionProps {
  language: Language;
  onSelectAlternative?: (dest: Destination) => void;
}

export const WeatherDangerZoneSection: React.FC<WeatherDangerZoneSectionProps> = ({
  language,
  onSelectAlternative
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>('valparai'); // default to the red alert destination for immediate demonstration
  const [filterLevel, setFilterLevel] = useState<AlertLevel | 'all'>('all');

  const selectedDest = TN_DESTINATIONS.find(d => d.id === selectedDestId) || TN_DESTINATIONS[0];
  const isRedAlert = selectedDest.weather.alertLevel === 'red' || selectedDest.weather.bookingRestricted;

  const alertColors: Record<AlertLevel, { badge: string; border: string; text: string; bg: string; dot: string }> = {
    green: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      dot: 'bg-emerald-400'
    },
    yellow: {
      badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      dot: 'bg-yellow-400'
    },
    orange: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      dot: 'bg-amber-400'
    },
    red: {
      badge: 'bg-rose-600 text-white border-rose-500',
      border: 'border-rose-500/80',
      text: 'text-rose-400',
      bg: 'bg-rose-950/40',
      dot: 'bg-rose-500 animate-ping'
    }
  };

  const filteredDestinations = filterLevel === 'all'
    ? TN_DESTINATIONS
    : TN_DESTINATIONS.filter(d => d.weather.alertLevel === filterLevel);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>CLIMATE RISK & DANGER ZONE INTELLIGENCE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Tamil Nadu Weather Safety & Danger Zone Restriction
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Real-time IMD meteorology integration: automated booking restriction protects travelers during severe monsoons, cyclones, and Western Ghats landslides.
          </p>
        </div>

        {/* 4 Warning Categories Legend */}
        <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs flex-wrap">
          <button
            onClick={() => setFilterLevel('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              filterLevel === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterLevel('green')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1.5 ${
              filterLevel === 'green' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Green (Safe)</span>
          </button>
          <button
            onClick={() => setFilterLevel('orange')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1.5 ${
              filterLevel === 'orange' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Orange (High)</span>
          </button>
          <button
            onClick={() => setFilterLevel('red')}
            className={`px-2 py-1 rounded-lg flex items-center gap-1.5 ${
              filterLevel === 'red' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Red (Danger)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Destinations Cards & Interactive Danger Zone Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Destination List (Col 5) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
          {filteredDestinations.map((dest) => {
            const isSelected = selectedDestId === dest.id;
            const w = dest.weather;
            const style = alertColors[w.alertLevel];

            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => setSelectedDestId(dest.id)}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-400 ring-1 ring-amber-400 shadow-lg'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={dest.images[0]}
                      alt={dest.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${style.dot}`} />
                  </div>

                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-1.5">
                      <span>{dest.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{dest.district} • {w.tempC}°C</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{w.condition}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
                    {w.alertLevel.toUpperCase()}
                  </span>
                  {w.bookingRestricted && (
                    <div className="text-[9px] text-rose-400 font-extrabold mt-1">
                      RESTRICTED
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Destination Climate Panel & Interactive Danger Map Simulation (Col 7) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Alert Level Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${alertColors[selectedDest.weather.alertLevel].badge}`}>
                    {selectedDest.weather.alertLevel === 'red' ? '🔴 SEVERE DANGER ZONE' : `ALERT LEVEL: ${selectedDest.weather.alertLevel.toUpperCase()}`}
                  </span>
                  <span className="text-xs text-slate-400">Coordinates: {selectedDest.coordinates.lat}°N, {selectedDest.coordinates.lng}°E</span>
                </div>
                <h3 className="text-xl font-black text-white mt-2">
                  {selectedDest.name}
                </h3>
              </div>

              {isRedAlert && (
                <div className="px-3 py-1.5 rounded-xl bg-rose-600/30 border border-rose-500 text-rose-300 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>BOOKING BLOCKED</span>
                </div>
              )}
            </div>

            {/* Weather Metrics */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px] flex items-center justify-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Temperature</span>
                </div>
                <div className="text-lg font-black text-white mt-0.5">{selectedDest.weather.tempC}°C</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px] flex items-center justify-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Rainfall (24h)</span>
                </div>
                <div className="text-lg font-black text-white mt-0.5">{selectedDest.weather.rainfallMm} mm</div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px] flex items-center justify-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-teal-400" />
                  <span>Wind Speed</span>
                </div>
                <div className="text-lg font-black text-white mt-0.5">{selectedDest.weather.windSpeedKmh} km/h</div>
              </div>
            </div>

            {/* Official Alert Bulletin */}
            <div className={`p-4 rounded-2xl border ${
              isRedAlert
                ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            } space-y-2 text-xs`}>
              <div className="font-bold text-sm flex items-center gap-2">
                {isRedAlert ? (
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>{selectedDest.weather.alertTitle}</span>
              </div>
              <p className="leading-relaxed text-slate-300 text-xs">
                {selectedDest.weather.alertDetails}
              </p>
            </div>

            {/* Alternative Destinations Re-routing */}
            {isRedAlert && selectedDest.weather.safeAlternativeDestinations && (
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <div className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Proactive Safe Alternative Destinations (Outside Danger Zone):</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedDest.weather.safeAlternativeDestinations.map((altId) => {
                    const altDest = TN_DESTINATIONS.find(d => d.id === altId);
                    if (!altDest) return null;

                    return (
                      <button
                        key={altId}
                        onClick={() => {
                          setSelectedDestId(altId);
                          if (onSelectAlternative) onSelectAlternative(altDest);
                        }}
                        className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{altDest.name} ({altDest.weather.tempC}°C)</span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Tourist Safety Reassurance Footer */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Full 100% refund eligibility guaranteed for bookings affected by severe weather red alerts.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
