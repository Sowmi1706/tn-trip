import React from 'react';
import { Language } from '../types/tourism';
import { TRANSLATIONS } from '../data/translations';
import { Globe, ArrowRight, Compass, Sparkles } from 'lucide-react';

interface LanguageScreenProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onContinue: () => void;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({
  currentLanguage,
  onSelectLanguage,
  onContinue
}) => {
  const languages: Array<{ code: Language; label: string; subLabel: string; region: string }> = [
    { code: 'en', label: 'English', subLabel: 'English', region: 'Global' },
    { code: 'ta', label: 'தமிழ்', subLabel: 'Tamil', region: 'தமிழ்நாடு' },
    { code: 'hi', label: 'हिंदी', subLabel: 'Hindi', region: 'भारत' },
    { code: 'ml', label: 'മലയാളം', subLabel: 'Malayalam', region: 'കേരളം' },
    { code: 'te', label: 'తెలుగు', subLabel: 'Telugu', region: 'ఆంధ్ర & తెలంగాణ' }
  ];

  const t = TRANSLATIONS[currentLanguage];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      {/* Background with Tamil Nadu Heritage aesthetics */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 transform scale-105 filter blur-xs"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/90" />

      {/* Decorative glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl mx-auto text-center space-y-8 py-8">
        {/* Brand Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-semibold tracking-wide shadow-sm">
            <Compass className="w-4 h-4 animate-spin-slow text-amber-400" />
            <span>TN STORIES AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            {t.welcomeHeadline}
          </h1>
          <p className="text-lg text-amber-200/90 font-medium">
            "{t.tagline}"
          </p>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Experience the sacred temples, misty hill stations, vibrant coastal shores, and ancient Sangam heritage of Tamil Nadu.
          </p>
        </div>

        {/* Language Grid */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Select Your Preferred Language</span>
            </div>
            <span className="text-xs text-slate-400">மொழியை தேர்ந்தெடுக்கவும்</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {languages.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => onSelectLanguage(lang.code)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/60 shadow-lg shadow-amber-500/10 text-white'
                      : 'bg-slate-800/40 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'border-amber-400 bg-amber-400' : 'border-slate-600'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                    </div>
                    <div>
                      <div className="font-bold text-base">{lang.label}</div>
                      <div className="text-xs text-slate-400">{lang.subLabel} • {lang.region}</div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Selected
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3">
            <button
              onClick={onContinue}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/25 active:scale-[0.99] cursor-pointer"
            >
              <span>Continue / தொடரவும்</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Exclusive Tamil Nadu notice */}
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Exclusively designed for exploring tourist places within Tamil Nadu, India.</span>
        </p>
      </div>
    </div>
  );
};
