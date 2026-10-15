import React, { useState } from 'react';
import { Destination, Language } from '../types/tourism';
import { TRANSLATIONS } from '../data/translations';
import { Star, MapPin, IndianRupee, Sparkles, AlertTriangle, ArrowRight, Eye, ShieldAlert } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  language: Language;
  onViewDetails: (dest: Destination) => void;
  onBookNow: (dest: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  language,
  onViewDetails,
  onBookNow
}) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  const t = TRANSLATIONS[language];
  const isRedAlert = destination.weather.alertLevel === 'red' || destination.weather.bookingRestricted;

  const fallbackImage = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80';
  const displayImage = hasError
    ? fallbackImage
    : (destination.images[imgIndex] || fallbackImage);

  return (
    <div className={`group relative bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl ${
      isRedAlert
        ? 'border-rose-500/50 shadow-rose-950/20'
        : 'border-slate-800 hover:border-slate-700 shadow-slate-950/30'
    }`}>
      {/* Top Image Section */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-950">
        <img
          src={displayImage}
          alt={destination.name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

        {/* Category & Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
            {destination.district}
          </span>
          {destination.isHiddenSpot && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/80 text-white backdrop-blur-md">
              Hidden Gem
            </span>
          )}
        </div>

        {/* Weather Alert Badge */}
        {isRedAlert && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-600 text-white shadow-lg animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>DANGER ZONE</span>
            </span>
          </div>
        )}

        {/* Rating overlay */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-xs font-semibold text-white border border-slate-800">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{destination.averageRating.toFixed(1)}</span>
          <span className="text-slate-400 text-[10px]">({destination.reviewCount})</span>
        </div>

        {/* Cost estimate badge */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold shadow-md">
          <span>₹{destination.estimatedCostPerDay.toLocaleString('en-IN')}</span>
          <span className="text-[10px] font-medium">/ day</span>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors">
                {destination.name}
              </h3>
              {destination.tamilName && (
                <div className="text-xs text-amber-300/80 font-medium mt-0.5">
                  {destination.tamilName}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {destination.shortDescription}
          </p>

          {/* Attractions Tags */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {destination.popularAttractions.slice(0, 3).map((attr) => (
              <span
                key={attr}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                {attr}
              </span>
            ))}
            {destination.popularAttractions.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md text-slate-400">
                +{destination.popularAttractions.length - 3} more
              </span>
            )}
          </div>

          {/* Packages count & weather note */}
          <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>{destination.packages.length} Tour Package{destination.packages.length > 1 ? 's' : ''}</span>
            <span className={`text-[11px] font-medium ${
              isRedAlert ? 'text-rose-400 font-bold' : 'text-emerald-400'
            }`}>
              {destination.weather.condition} ({destination.weather.tempC}°C)
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(destination)}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{t.viewDetails}</span>
          </button>

          <button
            onClick={() => onBookNow(destination)}
            disabled={isRedAlert}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isRedAlert
                ? 'bg-rose-950/60 text-rose-300 border border-rose-800/80 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/20 active:scale-[0.98] cursor-pointer'
            }`}
          >
            {isRedAlert ? (
              <>
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Restricted</span>
              </>
            ) : (
              <>
                <span>{t.bookNow}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
