import React, { useState } from 'react';
import { UserPreferences, TravelGroupType, TravelCategory, TripPurpose, BudgetTier, PlanningStyle, Language } from '../types/tourism';
import { StorageService } from '../services/storageService';
import { 
  User, Users, Heart, Compass, LandPlot, BookOpen, Trees, Camera, UtensilsCrossed, 
  GraduationCap, Sparkles, ArrowRight, Check, Calendar, MapPin, IndianRupee, Bus, Clock
} from 'lucide-react';

interface TravelPreferencesWizardProps {
  language: Language;
  onComplete: (prefs: UserPreferences) => void;
  initialPreferences?: UserPreferences | null;
}

export const TravelPreferencesWizard: React.FC<TravelPreferencesWizardProps> = ({
  language,
  onComplete,
  initialPreferences
}) => {
  // 1. Group type
  const [groupType, setGroupType] = useState<TravelGroupType>(initialPreferences?.groupType || 'family');
  
  // Family specific
  const [adults, setAdults] = useState<number>(initialPreferences?.familyDetails?.adults || 2);
  const [children, setChildren] = useState<number>(initialPreferences?.familyDetails?.children || 1);
  const [childAges, setChildAges] = useState<string>(initialPreferences?.familyDetails?.childAgeGroups || 'Under 10 years');
  const [familyStayPref, setFamilyStayPref] = useState<string>(initialPreferences?.familyDetails?.accommodationPreference || 'Kid-friendly Resort / Cottage');

  // Friends specific
  const [friendsCount, setFriendsCount] = useState<number>(initialPreferences?.friendsDetails?.count || 4);
  const [friendsActivities, setFriendsActivities] = useState<string[]>(
    initialPreferences?.friendsDetails?.activities || ['Trekking', 'Campfire', 'Local Food Streets']
  );

  // 2. Traveler Categories (Multi-select)
  const [categories, setCategories] = useState<TravelCategory[]>(
    initialPreferences?.travelerCategories || ['temple_spiritual', 'historical_heritage']
  );

  // 3. Trip Purpose
  const [tripPurpose, setTripPurpose] = useState<TripPurpose>(initialPreferences?.tripPurpose || 'temple_tour');

  // 4. Budget
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(initialPreferences?.budgetTier || 'standard');
  const [approxBudget, setApproxBudget] = useState<number>(initialPreferences?.approxBudgetINR || 12000);

  // 5. Planning style
  const [planningStyle, setPlanningStyle] = useState<PlanningStyle>(initialPreferences?.planningStyle || 'planned');
  
  // Planned details
  const [startDate, setStartDate] = useState<string>(initialPreferences?.plannedDetails?.startDate || '2026-11-15');
  const [returnDate, setReturnDate] = useState<string>(initialPreferences?.plannedDetails?.returnDate || '2026-11-18');
  const [startCity, setStartCity] = useState<string>(initialPreferences?.plannedDetails?.startingLocation || 'Chennai');
  const [vehiclePref, setVehiclePref] = useState<string>(initialPreferences?.plannedDetails?.vehiclePreference || 'Tempo Traveller / AC Coach');
  const [requestBusQuote, setRequestBusQuote] = useState<boolean>(initialPreferences?.plannedDetails?.requestBusQuotation || false);

  // Unplanned details
  const [currentLoc, setCurrentLoc] = useState<string>(initialPreferences?.unplannedDetails?.currentLocation || 'Madurai');
  const [availableHours, setAvailableHours] = useState<number>(initialPreferences?.unplannedDetails?.availableTimeHours || 8);
  const [maxDistKm, setMaxDistKm] = useState<number>(initialPreferences?.unplannedDetails?.preferredDistanceKm || 120);
  const [needsImmediateVehicle, setNeedsImmediateVehicle] = useState<boolean>(
    initialPreferences?.unplannedDetails?.needsImmediateVehicle || true
  );

  const toggleCategory = (cat: TravelCategory) => {
    if (categories.includes(cat)) {
      if (categories.length > 1) {
        setCategories(categories.filter(c => c !== cat));
      }
    } else {
      setCategories([...categories, cat]);
    }
  };

  const handleFinish = () => {
    const prefs: UserPreferences = {
      groupType,
      familyDetails: groupType === 'family' ? {
        adults,
        children,
        childAgeGroups: childAges,
        accommodationPreference: familyStayPref
      } : undefined,
      friendsDetails: groupType === 'friends' ? {
        count: friendsCount,
        activities: friendsActivities,
        nightlifeLevel: 'Moderate evening entertainment',
        interests: friendsActivities
      } : undefined,
      travelerCategories: categories,
      tripPurpose,
      budgetTier,
      approxBudgetINR: approxBudget,
      planningStyle,
      plannedDetails: planningStyle === 'planned' ? {
        startDate,
        returnDate,
        daysCount: 3,
        startingLocation: startCity,
        vehiclePreference: vehiclePref,
        requestBusQuotation: requestBusQuote
      } : undefined,
      unplannedDetails: planningStyle === 'unplanned' ? {
        currentLocation: currentLoc,
        availableTimeHours: availableHours,
        currentBudgetINR: approxBudget,
        preferredDistanceKm: maxDistKm,
        sameDayTrip: true,
        needsImmediateVehicle
      } : undefined
    };

    StorageService.savePreferences(prefs);
    onComplete(prefs);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>PERSONALIZED TRIP DISCOVERY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            What type of trip are you planning?
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Tell us about your travel style. TN Stories will customize destinations, temple timings, research guides, and group transportation specifically for you.
          </p>
        </div>

        {/* Section 1: Travel Group Type */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>1. Travel Group Type</span>
              </h2>
              <p className="text-xs text-slate-400">Who is traveling with you on this Tamil Nadu journey?</p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Required
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { id: 'solo', label: 'Solo Trip', icon: User, desc: 'Individual exploration & budget stays' },
              { id: 'family', label: 'Family Trip', icon: Users, desc: 'Kid-friendly, safe & relaxed comfort' },
              { id: 'friends', label: 'Friends Trip', icon: Compass, desc: 'Adventure, food streets & shared costs' },
              { id: 'couple', label: 'Couple Trip', icon: Heart, desc: 'Scenic viewpoints, peace & quiet' },
              { id: 'group', label: 'Group / New People', icon: Bus, desc: 'Bus booking, community & verified groups' }
            ].map((item) => {
              const isSelected = groupType === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setGroupType(item.id as TravelGroupType)}
                  className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10 ring-1 ring-amber-400'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                  <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{item.label}</div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Conditional questions for Family */}
          {groupType === 'family' && (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Number of Adults</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Number of Children</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Child Age Groups</label>
                <select
                  value={childAges}
                  onChange={(e) => setChildAges(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option>Toddlers (0-4 yrs)</option>
                  <option>Kids (5-12 yrs)</option>
                  <option>Teens (13-17 yrs)</option>
                  <option>Mixed Age Groups</option>
                </select>
              </div>
            </div>
          )}

          {/* Conditional questions for Friends */}
          {groupType === 'friends' && (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Number of Friends</label>
                <input
                  type="number"
                  min={2}
                  max={40}
                  value={friendsCount}
                  onChange={(e) => setFriendsCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Primary Activity Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Hill station road trip, waterfalls, night cafes"
                  value={friendsActivities.join(', ')}
                  onChange={(e) => setFriendsActivities(e.target.value.split(',').map(s => s.trim()))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Traveler Categories and Interest-Based Discovery */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <LandPlot className="w-5 h-5 text-amber-400" />
                <span>2. Traveler Categories & Interest-Based Discovery</span>
              </h2>
              <p className="text-xs text-slate-400">Select one or more categories (each gets its own dedicated section on your dashboard)</p>
            </div>
            <span className="text-xs text-slate-400">Multi-select enabled</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                id: 'temple_spiritual',
                label: 'Temple & Spiritual Travelers',
                desc: 'Famous shrines, opening hours, pooja timings, dress codes & satvic veg food',
                icon: LandPlot
              },
              {
                id: 'historical_heritage',
                label: 'Historical & Heritage Researchers',
                desc: 'Keezhadi, Chola living temples, Pallava rock cuts, inscriptions, ASI permits',
                icon: BookOpen
              },
              {
                id: 'nature_wildlife',
                label: 'Nature, Wildlife & Eco-Tourism',
                desc: 'Forest reserves, hill peaks, medicinal waterfalls, Pichavaram mangroves & safaris',
                icon: Trees
              },
              {
                id: 'photography_visual',
                label: 'Photography & Visual Exploration',
                desc: 'Sunrise/sunset vantage points, ancient Dravidian gopurams, lighting advice',
                icon: Camera
              },
              {
                id: 'food_culture',
                label: 'Food & Culture Travelers',
                desc: 'Madurai Jigarthanda, Chettinad spices, traditional festivals & local markets',
                icon: UtensilsCrossed
              },
              {
                id: 'educational_research',
                label: 'Educational & Student Groups',
                desc: 'Archaeological site visits, college/school group tours & bus arrangements',
                icon: GraduationCap
              },
              {
                id: 'general_tourist',
                label: 'General Tourist / First-Time Visitor',
                desc: 'Balanced mix of Tamil Nadu top highlights, beaches, hills & heritage',
                icon: Sparkles
              }
            ].map((cat) => {
              const isSelected = categories.includes(cat.id as TravelCategory);
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id as TravelCategory)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                    isSelected ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{cat.label}</div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">{cat.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Trip Purpose & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trip Purpose */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <span>3. Main Trip Purpose</span>
              </h2>
              <p className="text-xs text-slate-400">What is the central focus of this journey?</p>
            </div>

            <select
              value={tripPurpose}
              onChange={(e) => setTripPurpose(e.target.value as TripPurpose)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="temple_tour">Full Tamil Nadu Temple Tour / Pilgrimage Circuit</option>
              <option value="heritage_research">Historical Research, Archaeology & Museum Tour</option>
              <option value="nature_hills">Nature, Misty Hills & Tea Plantation Stays</option>
              <option value="beaches_coastal">Beaches & Coastal Scenic Route (Marina, Mahabalipuram, Kanyakumari)</option>
              <option value="entertainment_friends">Friends Fun, Waterfalls, Trekking & Street Food</option>
              <option value="adventure">Western Ghats Trekking & Eco-Safari</option>
              <option value="relaxation">Quiet Relaxation & Ayurvedic Wellness (Courtallam, Yercaud)</option>
              <option value="food_culture">Culinary & Chettinad Spice Culture Tour</option>
              <option value="photography">Landscape & Architectural Photography Expedition</option>
              <option value="festival_special">Seasonal Temple Festival / Pournami Girivalam</option>
            </select>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300">
              <span className="font-semibold text-amber-400">Personalization Note: </span>
              {tripPurpose === 'temple_tour' && 'Dedicated temple circuits with darshan hours and sattvic restaurants will be prioritized.'}
              {tripPurpose === 'heritage_research' && 'Keezhadi, Gangaikonda Cholapuram, and ASI timelines will take center stage.'}
              {tripPurpose === 'entertainment_friends' && 'Waterfalls, viewpoints, cafes, and group bus options will lead your recommendations.'}
              {tripPurpose === 'nature_hills' && 'Nilgiris, Highwavys, and Anamalai ranges will be featured with weather alerts.'}
            </div>
          </div>

          {/* Budget */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-amber-400" />
                <span>4. Budget Preference</span>
              </h2>
              <p className="text-xs text-slate-400">Total estimated budget for this journey</p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'budget', label: 'Budget' },
                { id: 'standard', label: 'Standard' },
                { id: 'premium', label: 'Premium' },
                { id: 'luxury', label: 'Luxury' }
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setBudgetTier(b.id as BudgetTier);
                    if (b.id === 'budget') setApproxBudget(5000);
                    if (b.id === 'standard') setApproxBudget(12000);
                    if (b.id === 'premium') setApproxBudget(25000);
                    if (b.id === 'luxury') setApproxBudget(50000);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    budgetTier === b.id
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Approximate Total Budget (INR ₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                <input
                  type="number"
                  step={500}
                  value={approxBudget}
                  onChange={(e) => setApproxBudget(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-4 py-2 text-xs text-white"
                />
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {groupType === 'friends' && `Approx. ₹${Math.round(approxBudget / Math.max(friendsCount, 1))} per friend`}
                {groupType === 'family' && `Covers stays, verified vehicles & sightseeing for ${adults + children} travelers`}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Planning Style */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span>5. Planning Style</span>
              </h2>
              <p className="text-xs text-slate-400">Do you have fixed travel dates or are you taking off spontaneously?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'planned', label: 'Planned Trip', desc: 'Advance reservations, structured day itineraries & bus quotations' },
              { id: 'unplanned', label: 'Unplanned / Spontaneous', desc: 'Nearby getaways, same-day travel & immediately available cabs/vans' },
              { id: 'flexible', label: 'Flexible Trip', desc: 'Browse options and decide dates later' }
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setPlanningStyle(style.id as PlanningStyle)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  planningStyle === style.id
                    ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400 text-white'
                    : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="font-bold text-sm text-white">{style.label}</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">{style.desc}</div>
              </button>
            ))}
          </div>

          {/* Planned specifics */}
          {planningStyle === 'planned' && (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Travel Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Return Date</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Starting City in TN</label>
                <select
                  value={startCity}
                  onChange={(e) => setStartCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option>Chennai</option>
                  <option>Madurai</option>
                  <option>Coimbatore</option>
                  <option>Tiruchirappalli (Trichy)</option>
                  <option>Salem</option>
                  <option>Tirunelveli</option>
                </select>
              </div>
              <div className="sm:col-span-3 flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="bus-quote-check"
                  checked={requestBusQuote}
                  onChange={(e) => setRequestBusQuote(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded border-slate-600 bg-slate-900 cursor-pointer"
                />
                <label htmlFor="bus-quote-check" className="text-xs text-slate-200 cursor-pointer">
                  Request verified tourist bus / tempo traveller agent quotes for our group route.
                </label>
              </div>
            </div>
          )}

          {/* Unplanned specifics */}
          {planningStyle === 'unplanned' && (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Current Location in TN</label>
                <input
                  type="text"
                  value={currentLoc}
                  onChange={(e) => setCurrentLoc(e.target.value)}
                  placeholder="e.g. Madurai, Coimbatore"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Available Time (Hours)</label>
                <input
                  type="number"
                  value={availableHours}
                  onChange={(e) => setAvailableHours(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Max Travel Distance (KM)</label>
                <input
                  type="number"
                  value={maxDistKm}
                  onChange={(e) => setMaxDistKm(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="pt-2 pb-6 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            You can always modify these preferences anytime from the top navigation bar.
          </div>
          <button
            onClick={handleFinish}
            className="flex items-center gap-2.5 py-3.5 px-8 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all shadow-xl shadow-amber-500/25 active:scale-[0.99] cursor-pointer"
          >
            <span>Launch Personalized Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
