import React, { useState, useEffect } from 'react';
import { 
  Language, UserAccount, UserPreferences, Destination, Booking 
} from './types/tourism';
import { StorageService } from './services/storageService';
import { TRANSLATIONS } from './data/translations';
import { TN_DESTINATIONS } from './data/tamilNaduData';

// Screens & Modals
import { LanguageScreen } from './components/LanguageScreen';
import { AuthScreen } from './components/AuthScreen';
import { TermsModal } from './components/TermsModal';
import { TravelPreferencesWizard } from './components/TravelPreferencesWizard';
import { HeaderNav } from './components/HeaderNav';
import { HeroSlider } from './components/HeroSlider';
import { DestinationCard } from './components/DestinationCard';
import { DestinationDetailsModal } from './components/DestinationDetailsModal';
import { BookingWizardModal } from './components/BookingWizardModal';
import { FlexibleBookingSystem } from './components/FlexibleBookingSystem';
import { DailySpinWinModal } from './components/DailySpinWinModal';
import { SmartOfflineTripMode } from './components/SmartOfflineTripMode';
import { WeatherDangerZoneSection } from './components/WeatherDangerZoneSection';
import { BeachChangingBooking } from './components/BeachChangingBooking';
import { SponsoredTravelKitSection } from './components/SponsoredTravelKitSection';
import { MonthlySavingsCalculator } from './components/MonthlySavingsCalculator';
import { GroupBusAgentSection } from './components/GroupBusAgentSection';
import { MyBookingsSection } from './components/MyBookingsSection';
import { AdminDashboard } from './components/AdminDashboard';

import { 
  Compass, MapPin, Sparkles, BookOpen, LandPlot, Users, 
  Calendar, Clock, ShieldCheck, Heart, AlertTriangle, ArrowRight, ShieldAlert, Star
} from 'lucide-react';

export default function App() {
  // 1. Language state
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('tn_stories_language') as Language;
    return saved || 'en';
  });
  const [hasChosenLanguage, setHasChosenLanguage] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('tn_stories_language'));
  });

  // 2. Auth state
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    return StorageService.getCurrentUser();
  });

  // 3. User Preferences state
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(() => {
    return StorageService.getPreferences();
  });

  // 4. Navigation & Active Tab
  const [activeNavTab, setActiveNavTab] = useState<string>('home');

  // 5. Modals
  const [showPreferencesWizard, setShowPreferencesWizard] = useState(false);
  const [showBookingWizard, setShowBookingWizard] = useState(false);
  const [wizardInitialDest, setWizardInitialDest] = useState<Destination | null>(null);
  const [selectedDetailsDest, setSelectedDetailsDest] = useState<Destination | null>(null);
  const [showDailySpin, setShowDailySpin] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check first booking eligibility
  const isFirstBookingEligible = currentUser
    ? StorageService.isFirstBookingEligible(currentUser.id)
    : true;

  const t = TRANSLATIONS[currentLanguage];

  // Save language whenever changed
  const handleSelectLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('tn_stories_language', lang);
  };

  const handleLanguageContinue = () => {
    setHasChosenLanguage(true);
    localStorage.setItem('tn_stories_language', currentLanguage);
  };

  // Auth handler
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    // If user has not accepted terms, the TermsModal gate will trigger
    // If user has no preferences, preferences wizard will trigger
    if (user.hasAcceptedTerms && !userPreferences) {
      setShowPreferencesWizard(true);
    }
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  // Terms agreement handler
  const handleTermsAgree = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    setShowTermsModal(false);
    if (!userPreferences) {
      setShowPreferencesWizard(true);
    }
  };

  const handleTermsDecline = () => {
    alert('You have declined the Terms & Conditions. You must agree to the terms to book tours and access personalized features.');
    handleLogout();
  };

  // Preferences completion handler
  const handlePreferencesComplete = (prefs: UserPreferences) => {
    setUserPreferences(prefs);
    setShowPreferencesWizard(false);
    setActiveNavTab('home');
  };

  // Booking CTA
  const handleStartBooking = (dest?: Destination) => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    if (dest) {
      setWizardInitialDest(dest);
    }
    setShowBookingWizard(true);
  };

  // SCREEN 1: Language selection on first visit
  if (!hasChosenLanguage) {
    return (
      <LanguageScreen
        currentLanguage={currentLanguage}
        onSelectLanguage={handleSelectLanguage}
        onContinue={handleLanguageContinue}
      />
    );
  }

  // SCREEN 2: Mandatory login for first-time visitors who are not logged in
  if (!currentUser && !showAuthModal) {
    return (
      <AuthScreen
        language={currentLanguage}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Mandatory Terms & Conditions Gate: if logged in but hasn't accepted current terms version
  if (currentUser && !currentUser.hasAcceptedTerms) {
    return (
      <TermsModal
        user={currentUser}
        language={currentLanguage}
        onAgree={handleTermsAgree}
        onDecline={handleTermsDecline}
      />
    );
  }

  // SCREEN 3: Travel Preferences Wizard if user has no saved preferences yet or clicked edit
  if (currentUser && currentUser.hasAcceptedTerms && (!userPreferences || showPreferencesWizard)) {
    return (
      <TravelPreferencesWizard
        language={currentLanguage}
        onComplete={handlePreferencesComplete}
        initialPreferences={userPreferences}
      />
    );
  }

  // Filtered destination categories for home page sections
  const popularDestinations = TN_DESTINATIONS.filter(d => d.isPopular);
  const hiddenSpots = TN_DESTINATIONS.filter(d => d.isHiddenSpot);
  const templeDestinations = TN_DESTINATIONS.filter(d => d.category === 'temple');
  const heritageDestinations = TN_DESTINATIONS.filter(d => d.category === 'historical_site');
  const friendsDestinations = TN_DESTINATIONS.filter(d => d.suitableGroupTypes.includes('friends'));
  const familyDestinations = TN_DESTINATIONS.filter(d => d.suitableGroupTypes.includes('family'));
  const plannedDestinations = TN_DESTINATIONS.filter(d => d.packages.length > 0);
  const unplannedDestinations = TN_DESTINATIONS.filter(d => d.estimatedCostPerDay <= 2200);
  const trendingDestinations = TN_DESTINATIONS.filter(d => d.isTrending || d.averageRating >= 4.8);
  const weekendDestinations = TN_DESTINATIONS.filter(d => d.isWeekendFavorite || d.category === 'hill_station');
  const budgetDestinations = TN_DESTINATIONS.filter(d => d.estimatedCostPerDay <= 2000);

  // Personalized recommendations based on user's active preferences
  const personalizedDestinations = userPreferences
    ? TN_DESTINATIONS.filter(d => 
        d.suitableGroupTypes.includes(userPreferences.groupType) ||
        userPreferences.travelerCategories.some(cat => d.suitableCategories.includes(cat))
      )
    : popularDestinations;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white">
      {/* 1. Header Navigation Bar */}
      <HeaderNav
        currentLanguage={currentLanguage}
        onLanguageChange={handleSelectLanguage}
        currentUser={currentUser}
        userPreferences={userPreferences}
        onOpenPreferences={() => setShowPreferencesWizard(true)}
        onOpenBookingWizard={() => handleStartBooking()}
        onOpenDailySpin={() => setShowDailySpin(true)}
        onOpenTerms={() => setShowTermsModal(true)}
        onOpenAdmin={() => setShowAdminDashboard(true)}
        onSelectDestination={(dest) => setSelectedDetailsDest(dest)}
        onLogout={handleLogout}
        onOpenLogin={() => setShowAuthModal(true)}
        activeNavTab={activeNavTab}
        onNavTabChange={(tab) => {
          setActiveNavTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* If Active Tab is 'home', render the full ordered Tamil Nadu homepage */}
        {activeNavTab === 'home' && (
          <div className="space-y-16 pb-20">
            {/* 2. Full-Width Tourism Hero Slider with first-booking promo */}
            <HeroSlider
              language={currentLanguage}
              onExploreClick={() => {
                const el = document.getElementById('popular-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onBookTripClick={() => handleStartBooking()}
              onClaimOfferClick={() => handleStartBooking()}
              isFirstBookingEligible={isFirstBookingEligible}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
              {/* SECTION 1: RECOMMENDED BASED ON TRIP TYPE & TRAVELER CATEGORY */}
              {userPreferences && (
                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        <span>Personalized For You</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                        1. Recommended Based on Your {userPreferences.groupType.toUpperCase()} Trip Style
                      </h2>
                    </div>
                    <button
                      onClick={() => setShowPreferencesWizard(true)}
                      className="text-xs text-amber-400 hover:underline self-start sm:self-auto"
                    >
                      Refine Preferences ➔
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {personalizedDestinations.slice(0, 3).map((dest) => (
                      <DestinationCard
                        key={dest.id}
                        destination={dest}
                        language={currentLanguage}
                        onViewDetails={(d) => setSelectedDetailsDest(d)}
                        onBookNow={(d) => handleStartBooking(d)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* SECTION 2: POPULAR DESTINATIONS */}
              <section id="popular-section" className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Famous Highlights of Tamil Nadu
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    2. {t.popularPlaces}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Ooty, Kodaikanal, Rameswaram, Kanyakumari, Madurai, Mahabalipuram, Thanjavur, Yercaud, Courtallam
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularDestinations.slice(0, 6).map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      language={currentLanguage}
                      onViewDetails={(d) => setSelectedDetailsDest(d)}
                      onBookNow={(d) => handleStartBooking(d)}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 3: HIDDEN AREAS AND HIDDEN SPOTS */}
              <section className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <Compass className="w-4 h-4" />
                    <span>Lesser-Known Treasures</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    3. {t.hiddenSpots}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Untouched hills, 70 hairpin bends, ancient cave frescoes, and mangrove labyrinths: Meghamalai, Kolli Hills, Pichavaram, Sittanavasal
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {hiddenSpots.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      language={currentLanguage}
                      onViewDetails={(d) => setSelectedDetailsDest(d)}
                      onBookNow={(d) => handleStartBooking(d)}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 4: DEVOTIONAL AND TEMPLE TRIPS */}
              <section className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <LandPlot className="w-4 h-4" />
                    <span>Sacred Tamil Pilgrimages & Architecture</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    4. {t.templeTrips}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Complete darshan timing schedules, verified traditional dress codes, sattvic vegetarian eateries, and holy theerthams.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templeDestinations.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      language={currentLanguage}
                      onViewDetails={(d) => setSelectedDetailsDest(d)}
                      onBookNow={(d) => handleStartBooking(d)}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 5: HISTORICAL, HERITAGE, AND RESEARCH PLACES */}
              <section className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Archaeology, Inscriptions & Ancient Civilizations</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    5. {t.historicalPlaces}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Dedicated research discovery: Keezhadi Sangam civilization excavations, UNESCO living Chola temples, and Pallava rock carvings.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {heritageDestinations.map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      language={currentLanguage}
                      onViewDetails={(d) => setSelectedDetailsDest(d)}
                      onBookNow={(d) => handleStartBooking(d)}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 6: FRIENDS TRIP RECOMMENDATIONS */}
              <section className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Group Reunions & Adventure
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    6. {t.friendsTrips}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Scenic hill roads, pine forest treks, street food trails, and shared tempo-traveller tours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {friendsDestinations.slice(0, 3).map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      language={currentLanguage}
                      onViewDetails={(d) => setSelectedDetailsDest(d)}
                      onBookNow={(d) => handleStartBooking(d)}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 7: FAMILY TRIP RECOMMENDATIONS */}
              <section className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Comfort, Safety & Children-Friendly
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    7. {t.familyTrips}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Smooth transit routes, kid-friendly parks, botanical gardens, and spacious family suites.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {familyDestinations.slice(0, 3).map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      language={currentLanguage}
                      onViewDetails={(d) => setSelectedDetailsDest(d)}
                      onBookNow={(d) => handleStartBooking(d)}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 8: PLANNED TRIP DESTINATIONS */}
              <section className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Advance Booking & Detailed Schedules
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    8. {t.plannedTrips}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Well-timed travel circuits with verified hotel reservations and guaranteed AC vehicle booking.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plannedDestinations.slice(0, 3).map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      language={currentLanguage}
                      onViewDetails={(d) => setSelectedDetailsDest(d)}
                      onBookNow={(d) => handleStartBooking(d)}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 9: UNPLANNED & SPONTANEOUS TRIP DESTINATIONS */}
              <section className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    Same-Day Excursions & Immediate Departures
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    9. {t.unplannedTrips}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Flexible nearby destinations reachable in a few hours without complicated advance bookings.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unplannedDestinations.slice(0, 3).map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      language={currentLanguage}
                      onViewDetails={(d) => setSelectedDetailsDest(d)}
                      onBookNow={(d) => handleStartBooking(d)}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 10: TRENDING TOURIST PLACES */}
              <section className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    10. {t.trendingDestinations}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingDestinations.slice(0, 3).map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      language={currentLanguage}
                      onViewDetails={(d) => setSelectedDetailsDest(d)}
                      onBookNow={(d) => handleStartBooking(d)}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 11: WEEKEND GETAWAYS */}
              <section className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    11. {t.weekendGetaways}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {weekendDestinations.slice(0, 3).map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      language={currentLanguage}
                      onViewDetails={(d) => setSelectedDetailsDest(d)}
                      onBookNow={(d) => handleStartBooking(d)}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 12: BUDGET-FRIENDLY TRIPS */}
              <section className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    12. {t.budgetFriendly}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {budgetDestinations.slice(0, 3).map((dest) => (
                    <DestinationCard
                      key={dest.id}
                      destination={dest}
                      language={currentLanguage}
                      onViewDetails={(d) => setSelectedDetailsDest(d)}
                      onBookNow={(d) => handleStartBooking(d)}
                    />
                  ))}
                </div>
              </section>

              {/* SECTION 13: MONTHLY SAVINGS TRIP PLANS */}
              <section className="space-y-6">
                <MonthlySavingsCalculator
                  currentUser={currentUser}
                  language={currentLanguage}
                />
              </section>

              {/* SECTION 14: GROUP BUS BOOKING & BUS-AGENT CONNECTIONS */}
              <section className="space-y-6">
                <GroupBusAgentSection
                  currentUser={currentUser}
                  language={currentLanguage}
                />
              </section>

              {/* SECTION 15: WEATHER DANGER ZONE & SAFETY RESTRICTIONS */}
              <section className="space-y-6">
                <WeatherDangerZoneSection
                  language={currentLanguage}
                  onSelectAlternative={(dest) => setSelectedDetailsDest(dest)}
                />
              </section>
            </div>
          </div>
        )}

        {/* TAB: DESTINATIONS CATALOG */}
        {activeNavTab === 'destinations' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-3xl font-black text-white">
                Tamil Nadu Complete Destination Catalog
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Explore all verified hill stations, temples, archaeological sites, beaches, and hidden gems within Tamil Nadu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {TN_DESTINATIONS.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  language={currentLanguage}
                  onViewDetails={(d) => setSelectedDetailsDest(d)}
                  onBookNow={(d) => handleStartBooking(d)}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB: FLEXIBLE BOOKING */}
        {activeNavTab === 'flexible_booking' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <FlexibleBookingSystem
              currentUser={currentUser}
              language={currentLanguage}
              onBookingCreated={() => setActiveNavTab('my_bookings')}
            />
          </div>
        )}

        {/* TAB: BUS & AGENT */}
        {activeNavTab === 'bus_agent' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <GroupBusAgentSection
              currentUser={currentUser}
              language={currentLanguage}
            />
          </div>
        )}

        {/* TAB: WEATHER & CLIMATE */}
        {activeNavTab === 'weather' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <WeatherDangerZoneSection
              language={currentLanguage}
              onSelectAlternative={(dest) => setSelectedDetailsDest(dest)}
            />
          </div>
        )}

        {/* TAB: SMART OFFLINE TRIP MODE */}
        {activeNavTab === 'offline' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SmartOfflineTripMode
              language={currentLanguage}
            />
          </div>
        )}

        {/* TAB: BEACH CHANGING ROOMS */}
        {activeNavTab === 'beach' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <BeachChangingBooking
              currentUser={currentUser}
              language={currentLanguage}
            />
          </div>
        )}

        {/* TAB: SPONSORED TRAVEL KITS */}
        {activeNavTab === 'kits' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <SponsoredTravelKitSection
              currentUser={currentUser}
              language={currentLanguage}
            />
          </div>
        )}

        {/* TAB: MONTHLY SAVINGS */}
        {activeNavTab === 'savings' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <MonthlySavingsCalculator
              currentUser={currentUser}
              language={currentLanguage}
            />
          </div>
        )}

        {/* TAB: MY BOOKINGS */}
        {activeNavTab === 'my_bookings' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <MyBookingsSection
              currentUser={currentUser}
              language={currentLanguage}
              onOpenBookingWizard={() => handleStartBooking()}
              onOpenOfflineMode={() => setActiveNavTab('offline')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-extrabold text-base">
                <Compass className="w-5 h-5 text-amber-400" />
                <span>TN STORIES AI</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Exclusively designed for discovering and booking journeys across Tamil Nadu. Powered by intelligent itinerary planning, IMD danger zone monitoring, and offline synchronization.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Explore Tamil Nadu</h5>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => setActiveNavTab('destinations')} className="hover:text-amber-400">All Tourist Destinations</button></li>
                <li><button onClick={() => setActiveNavTab('weather')} className="hover:text-amber-400">Weather & Danger Zones</button></li>
                <li><button onClick={() => setActiveNavTab('beach')} className="hover:text-amber-400">Beach Changing Hubs</button></li>
                <li><button onClick={() => setActiveNavTab('bus_agent')} className="hover:text-amber-400">Group Bus Quotations</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Features & Rewards</h5>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => setShowDailySpin(true)} className="hover:text-amber-400">Daily Spin & Win</button></li>
                <li><button onClick={() => setActiveNavTab('kits')} className="hover:text-amber-400">Free Sponsored Travel Kits</button></li>
                <li><button onClick={() => setActiveNavTab('savings')} className="hover:text-amber-400">Monthly Savings Planner</button></li>
                <li><button onClick={() => setActiveNavTab('offline')} className="hover:text-amber-400">Smart Offline Mode</button></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-white text-xs uppercase tracking-wider">Statutory & Legal</h5>
              <ul className="space-y-1.5 text-[11px]">
                <li><button onClick={() => setShowTermsModal(true)} className="hover:text-amber-400">Terms & Conditions</button></li>
                <li><button onClick={() => setShowTermsModal(true)} className="hover:text-amber-400">Privacy Charter</button></li>
                <li><button onClick={() => setShowTermsModal(true)} className="hover:text-amber-400">100% Weather Refund Policy</button></li>
                {currentUser?.role === 'admin' && (
                  <li><button onClick={() => setShowAdminDashboard(true)} className="text-amber-400 font-bold hover:underline">Admin Officer Portal</button></li>
                )}
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div>
              © 2026 TN Stories Tourism Platform. All rights reserved. Exclusively for Tamil Nadu, India.
            </div>
            <div className="flex items-center gap-3">
              <span>Emergency SOS: 112</span>
              <span>•</span>
              <span>Tourist Helpline: 1363</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Destination Details Modal */}
      {selectedDetailsDest && (
        <DestinationDetailsModal
          destination={selectedDetailsDest}
          language={currentLanguage}
          currentUser={currentUser}
          onClose={() => setSelectedDetailsDest(null)}
          onBookNow={(dest) => {
            setSelectedDetailsDest(null);
            handleStartBooking(dest);
          }}
        />
      )}

      {/* 2. Personalized 9-Step Booking Wizard Modal */}
      {showBookingWizard && (
        <BookingWizardModal
          initialDestination={wizardInitialDest}
          currentUser={currentUser}
          language={currentLanguage}
          onClose={() => {
            setShowBookingWizard(false);
            setWizardInitialDest(null);
          }}
          onBookingConfirmed={() => {
            setShowBookingWizard(false);
            setActiveNavTab('my_bookings');
          }}
        />
      )}

      {/* 3. Daily Spin & Win Modal */}
      {showDailySpin && (
        <DailySpinWinModal
          currentUser={currentUser}
          language={currentLanguage}
          onClose={() => setShowDailySpin(false)}
        />
      )}

      {/* 4. Terms and Conditions Modal (Accessible anytime from Settings / Footer) */}
      {showTermsModal && (
        <TermsModal
          user={currentUser}
          language={currentLanguage}
          isSettingsView={true}
          onAgree={handleTermsAgree}
          onDecline={() => setShowTermsModal(false)}
          onCloseSettingsView={() => setShowTermsModal(false)}
        />
      )}

      {/* 5. Admin Dashboard Modal */}
      {showAdminDashboard && (
        <AdminDashboard
          currentUser={currentUser}
          language={currentLanguage}
          onClose={() => setShowAdminDashboard(false)}
        />
      )}

      {/* 6. Auth Modal if opened from header */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <AuthScreen
              language={currentLanguage}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
