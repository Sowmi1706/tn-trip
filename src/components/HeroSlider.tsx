import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Compass, Tag, ArrowRight, ShieldCheck } from 'lucide-react';
import { Language } from '../types/tourism';
import { TRANSLATIONS } from '../data/translations';

interface HeroSliderProps {
  language: Language;
  onExploreClick: () => void;
  onBookTripClick: () => void;
  onClaimOfferClick: () => void;
  isFirstBookingEligible: boolean;
}

const HERO_SLIDES = [
  {
    title: 'Madurai Meenakshi Amman Temple',
    district: 'Madurai District',
    caption: 'Ancient Dravidian gopurams and sacred Sangam heritage along the Vaigai',
    image: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1920&q=80',
    fallback: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1920&q=80'
  },
  {
    title: 'Ooty (Nilgiri Tea & Blue Mountains)',
    district: 'The Nilgiris',
    caption: 'Queen of Hill Stations, UNESCO toy train & pine-scented valleys',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1920&q=80',
    fallback: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80'
  },
  {
    title: 'Mahabalipuram Shore Temples',
    district: 'Chengalpattu District',
    caption: 'UNESCO World Heritage 7th century Pallava rock-cut monolithic wonders',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=80',
    fallback: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80'
  },
  {
    title: 'Kanyakumari (Triveni Sangam)',
    district: 'Kanyakumari District',
    caption: 'Where Arabian Sea, Bay of Bengal and Indian Ocean converge at India’s tip',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=80',
    fallback: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=80'
  },
  {
    title: 'Courtallam Medicinal Waterfalls',
    district: 'Tenkasi District',
    caption: 'Natural Ayurvedic wellness cascades flowing through medicinal herbal forests',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1920&q=80',
    fallback: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80'
  },
  {
    title: 'Pichavaram Mangrove Forest',
    district: 'Cuddalore District',
    caption: 'World\'s 2nd largest mangrove labyrinth with 4,400 tranquil tidal channels',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    fallback: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80'
  }
];

export const HeroSlider: React.FC<HeroSliderProps> = ({
  language,
  onExploreClick,
  onBookTripClick,
  onClaimOfferClick,
  isFirstBookingEligible
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imgError, setImgError] = useState<Record<number, boolean>>({});

  const t = TRANSLATIONS[language];

  // Auto slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-slate-950">
      {/* Slider Container */}
      <div className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] flex items-center">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
          const bgSrc = imgError[idx] ? slide.fallback : slide.image;

          return (
            <div
              key={slide.title}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Fallback */}
              <img
                src={bgSrc}
                alt={slide.title}
                onError={() => setImgError((prev) => ({ ...prev, [idx]: true }))}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
              />

              {/* Multi-layered gradient overlay to guarantee crystal clear text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />
            </div>
          );
        })}

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="max-w-2xl space-y-6">
            {/* Brand Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold backdrop-blur-md">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>TN Stories • Explore Tamil Nadu</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-amber-200/80 font-normal">{HERO_SLIDES[currentSlide].district}</span>
            </div>

            {/* Main Headline & Subtitle */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                {t.heroHeadline}
              </h1>
              <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed max-w-xl">
                {t.heroSubtitle}
              </p>
            </div>

            {/* Current Slide Highlight Tag */}
            <div className="text-xs text-amber-300 font-medium bg-slate-900/60 border border-slate-700/60 rounded-xl px-4 py-2.5 backdrop-blur-md inline-block max-w-md">
              <span className="text-amber-400 font-bold">{HERO_SLIDES[currentSlide].title}: </span>
              <span className="text-slate-300">{HERO_SLIDES[currentSlide].caption}</span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-lg shadow-amber-500/25 active:scale-[0.98] cursor-pointer flex items-center gap-2"
              >
                <span>{t.exploreDestinations}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onBookTripClick}
                className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 backdrop-blur-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>{t.bookYourTrip}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Slide Controls (Prev / Next) */}
        <div className="absolute z-20 bottom-8 right-6 sm:right-10 flex items-center gap-2">
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center backdrop-blur-md transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 px-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`transition-all rounded-full ${
                  i === currentSlide ? 'w-6 h-2 bg-amber-400' : 'w-2 h-2 bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="w-10 h-10 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center backdrop-blur-md transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* First-Time Customer Promotion Banner */}
      <div className="relative z-20 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 border-y border-amber-400/40 text-slate-950 py-3.5 px-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-md">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base flex items-center justify-center sm:justify-start gap-1.5">
                <span>{t.firstTimeOfferTitle}</span>
                {isFirstBookingEligible && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full">
                    Eligible Now
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-900 font-medium">
                {t.firstTimeOfferDesc}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClaimOfferClick}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-900 text-white transition-all shadow-md active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.claimOffer}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
