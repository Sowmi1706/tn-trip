import React, { useState } from 'react';
import { Language, UserAccount, UserPreferences, Destination } from '../types/tourism';
import { TRANSLATIONS } from '../data/translations';
import { TN_DESTINATIONS } from '../data/tamilNaduData';
import { 
  Compass, Search, Globe, User, LogOut, ShieldCheck, 
  Sparkles, Gift, CloudRain, Wifi, WifiOff, Menu, X, SlidersHorizontal, Ticket, Bus, Building2
} from 'lucide-react';

interface HeaderNavProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  currentUser: UserAccount | null;
  userPreferences: UserPreferences | null;
  onOpenPreferences: () => void;
  onOpenBookingWizard: () => void;
  onOpenDailySpin: () => void;
  onOpenTerms: () => void;
  onOpenAdmin: () => void;
  onSelectDestination: (dest: Destination) => void;
  onLogout: () => void;
  onOpenLogin: () => void;
  activeNavTab: string;
  onNavTabChange: (tab: string) => void;
  onOpenChat?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentLanguage,
  onLanguageChange,
  currentUser,
  userPreferences,
  onOpenPreferences,
  onOpenBookingWizard,
  onOpenDailySpin,
  onOpenTerms,
  onOpenAdmin,
  onSelectDestination,
  onLogout,
  onOpenLogin,
  activeNavTab,
  onNavTabChange,
  onOpenChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[currentLanguage];

  // Search filter
  const searchResults = searchQuery.trim().length > 1
    ? TN_DESTINATIONS.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.popularAttractions.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.tamilName && d.tamilName.includes(searchQuery))
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800">
      {/* Top Preference / Notice Bar if user has preferences */}
      {userPreferences && (
        <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/5 border-b border-amber-500/20 px-4 py-1.5 text-xs text-slate-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-[11px]">
              <span className="font-bold text-amber-400">Your Trip Focus:</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 capitalize">
                {userPreferences.groupType} Trip
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 capitalize">
                {userPreferences.tripPurpose.replace('_', ' ')}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 capitalize">
                {userPreferences.budgetTier} (₹{userPreferences.approxBudgetINR.toLocaleString('en-IN')})
              </span>
            </div>

            <button
              onClick={onOpenPreferences}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 shrink-0 text-[11px]"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{t.editPreferences}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <button
            onClick={() => onNavTabChange('home')}
            className="flex items-center gap-2.5 text-left shrink-0 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Compass className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="font-black text-lg text-white tracking-tight flex items-center gap-1">
                <span>TN STORIES</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">AI</span>
              </div>
              <div className="text-[10px] text-amber-300/80 -mt-0.5 tracking-wide">
                {t.tagline}
              </div>
            </div>
          </button>

          {/* Autocomplete Search Bar */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Dropdown Suggestions */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 divide-y divide-slate-800 text-xs">
                  {searchResults.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => {
                        onSelectDestination(dest);
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                      className="w-full p-2.5 rounded-xl hover:bg-slate-800 text-left flex items-center justify-between text-white"
                    >
                      <div>
                        <div className="font-bold">{dest.name}</div>
                        <div className="text-[10px] text-slate-400">{dest.district} • ₹{dest.estimatedCostPerDay}/day</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                        View
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions & Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <button
              onClick={() => onNavTabChange('home')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeNavTab === 'home' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavTabChange('destinations')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeNavTab === 'destinations' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              Destinations
            </button>

            <button
              onClick={onOpenBookingWizard}
              className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Book Trip</span>
            </button>

            <button
              onClick={() => onNavTabChange('flexible_booking')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeNavTab === 'flexible_booking' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              Flexible Booking
            </button>

            <button
              onClick={() => onNavTabChange('bus_agent')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                activeNavTab === 'bus_agent' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Bus className="w-3.5 h-3.5 text-amber-400" />
              <span>Bus & Agent</span>
            </button>

            <button
              onClick={onOpenDailySpin}
              className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-300 font-bold hover:bg-amber-500/30 flex items-center gap-1"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>Spin & Win</span>
            </button>
          </div>

          {/* Right Controls: Language Selector, User Profile / Auth */}
          <div className="flex items-center gap-2">
            {/* Language Dropdown */}
            <div className="relative">
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="bg-slate-900 border border-slate-700 text-white rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ml">മലയാളം</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavTabChange('my_bookings')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white"
                >
                  <Ticket className="w-3.5 h-3.5 text-amber-400" />
                  <span>My Bookings</span>
                </button>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={onOpenAdmin}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-extrabold flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Admin</span>
                  </button>
                )}

                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="py-1.5 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => { onNavTabChange('home'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-slate-900 text-left text-white"
            >
              Home
            </button>
            <button
              onClick={() => { onNavTabChange('destinations'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-slate-900 text-left text-white"
            >
              Destinations
            </button>
            <button
              onClick={() => { onOpenBookingWizard(); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-left"
            >
              Book Trip Wizard
            </button>
            <button
              onClick={() => { onNavTabChange('flexible_booking'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-slate-900 text-left text-white"
            >
              Flexible Booking
            </button>
            <button
              onClick={() => { onNavTabChange('bus_agent'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-slate-900 text-left text-white"
            >
              Bus & Agent
            </button>
            <button
              onClick={() => { onOpenDailySpin(); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 text-left"
            >
              Spin & Win
            </button>
            <button
              onClick={() => { onNavTabChange('weather'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-slate-900 text-left text-white"
            >
              Weather & Climate
            </button>
            <button
              onClick={() => { onNavTabChange('offline'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-slate-900 text-left text-cyan-300"
            >
              Offline Trip Mode
            </button>
            <button
              onClick={() => { onNavTabChange('beach'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-slate-900 text-left text-white"
            >
              Beach Changing
            </button>
            <button
              onClick={() => { onNavTabChange('savings'); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-slate-900 text-left text-emerald-300"
            >
              Monthly Savings
            </button>
            <button
              onClick={() => { onOpenTerms(); setMobileMenuOpen(false); }}
              className="p-2.5 rounded-xl bg-slate-900 text-left text-slate-300"
            >
              Terms & Conditions
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-left"
              >
                Admin Hub
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
