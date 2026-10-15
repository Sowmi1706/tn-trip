import React, { useState, useEffect } from 'react';
import { Destination, Language, UserAccount, Booking, TourPackage } from '../types/tourism';
import { StorageService } from '../services/storageService';
import { TN_DESTINATIONS } from '../data/tamilNaduData';
import { 
  X, Check, ArrowRight, ArrowLeft, Calendar, Users, MapPin, IndianRupee, 
  ShieldCheck, Sparkles, User, Heart, Compass, Bus, Tag, Clock, CheckCircle2, ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingWizardModalProps {
  initialDestination?: Destination | null;
  currentUser: UserAccount | null;
  language: Language;
  onClose: () => void;
  onBookingConfirmed: (booking: Booking) => void;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  initialDestination,
  currentUser,
  language,
  onClose,
  onBookingConfirmed
}) => {
  // Wizard Step (1 to 9)
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  // Step 1: Destination
  const [selectedDestId, setSelectedDestId] = useState<string>(
    initialDestination?.id || TN_DESTINATIONS[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Step 2: Travel Details
  const [startDate, setStartDate] = useState('2026-11-20');
  const [returnDate, setReturnDate] = useState('2026-11-23');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Step 3: Companion Type
  const [companionType, setCompanionType] = useState<'solo' | 'family' | 'friends' | 'group' | 'meet_new'>('family');

  // Step 4: Arrangement
  const [arrangementType, setArrangementType] = useState<'package' | 'custom'>('package');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [customHotelType, setCustomHotelType] = useState('Deluxe Heritage Room (₹2,200/night)');
  const [customHotelCostPerNight, setCustomHotelCostPerNight] = useState(2200);
  const [customVehicleType, setCustomVehicleType] = useState('AC Sedan with Chauffeur (₹1,800/day)');
  const [customVehicleCostPerDay, setCustomVehicleCostPerDay] = useState(1800);

  // Step 5: Caretaker & Guide
  const [caretakerChoice, setCaretakerChoice] = useState<'none' | 'caretaker' | 'guide' | 'both'>('guide');

  // Step 6: Add-ons
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['Special Temple Darshan VIP Guidance']);

  // Calculated pricing
  const [isEligibleFirstDiscount, setIsEligibleFirstDiscount] = useState(false);
  const [confirmedBookingRef, setConfirmedBookingRef] = useState<Booking | null>(null);

  const selectedDest = TN_DESTINATIONS.find(d => d.id === selectedDestId) || TN_DESTINATIONS[0];
  const isRedAlert = selectedDest.weather.alertLevel === 'red' || selectedDest.weather.bookingRestricted;

  // Set default package when destination changes
  useEffect(() => {
    if (selectedDest.packages && selectedDest.packages.length > 0) {
      setSelectedPackageId(selectedDest.packages[0].id);
    }
  }, [selectedDestId]);

  // Calculate days count
  const calculateDays = () => {
    const s = new Date(startDate).getTime();
    const e = new Date(returnDate).getTime();
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  };
  const daysCount = calculateDays();
  const totalTravelers = adults + children;

  // Calculate pricing
  const calculatePrices = () => {
    let base = 0;
    const selectedPkg = selectedDest.packages.find(p => p.id === selectedPackageId);

    if (arrangementType === 'package' && selectedPkg) {
      base = selectedPkg.pricePerPerson * totalTravelers;
    } else {
      // Custom breakdown
      const hotelTotal = customHotelCostPerNight * Math.max(daysCount - 1, 1);
      const vehicleTotal = customVehicleCostPerDay * daysCount;
      const activityTotal = totalTravelers * 600;
      base = hotelTotal + vehicleTotal + activityTotal;
    }

    // Caretaker fee
    let caretakerFee = 0;
    if (caretakerChoice === 'caretaker') caretakerFee = 800 * daysCount;
    if (caretakerChoice === 'guide') caretakerFee = 1200 * daysCount;
    if (caretakerChoice === 'both') caretakerFee = 1800 * daysCount;

    // Addons
    let addonsTotal = 0;
    if (selectedAddons.includes('Special Temple Darshan VIP Guidance')) addonsTotal += 500 * adults;
    if (selectedAddons.includes('Professional Vacation Photography')) addonsTotal += 1200;
    if (selectedAddons.includes('Eco-Trek Forest Department Permit')) addonsTotal += 350 * totalTravelers;

    const originalPrice = base + caretakerFee + addonsTotal;

    // First booking discount validation
    const offerConfig = StorageService.getOfferConfig();
    const eligible = currentUser
      ? StorageService.isFirstBookingEligible(currentUser.id)
      : false;

    let discountPercentage = 0;
    let discountAmount = 0;

    if (eligible && offerConfig.active && originalPrice >= offerConfig.minBookingAmountINR) {
      discountPercentage = offerConfig.discountPercentage;
      discountAmount = Math.min(
        Math.round((originalPrice * discountPercentage) / 100),
        offerConfig.maxDiscountAmountINR
      );
    }

    const taxes = Math.round((originalPrice - discountAmount) * 0.05);
    const finalPrice = originalPrice - discountAmount + taxes;

    return {
      originalPrice,
      discountPercentage,
      discountAmount,
      taxes,
      finalPrice,
      caretakerFee,
      isEligible: eligible && originalPrice >= offerConfig.minBookingAmountINR
    };
  };

  const pricing = calculatePrices();

  // Step validation
  const validateCurrentStep = (): boolean => {
    if (currentStep === 1) {
      if (isRedAlert) {
        alert(`${selectedDest.name} is currently in a DANGER ZONE (Red Alert). Please choose a safe destination outside the danger zone.`);
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!startDate || !returnDate) {
        alert('Please specify your travel start and return dates.');
        return false;
      }
      if (new Date(returnDate) < new Date(startDate)) {
        alert('Return date cannot be earlier than start date.');
        return false;
      }
      if (adults < 1) {
        alert('At least 1 adult traveler is required.');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 9));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleConfirmBooking = () => {
    if (!currentUser) {
      alert('Please sign in to confirm and record your booking.');
      return;
    }

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      referenceNumber: `TN-${selectedDest.id.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone || '+91 98401 23456',
      bookingType: 'combined',
      destinationId: selectedDest.id,
      destinationName: selectedDest.name,
      district: selectedDest.district,
      travelDates: {
        start: startDate,
        end: returnDate,
        daysCount
      },
      travelerCount: totalTravelers,
      adults,
      children,
      companionType: companionType === 'meet_new' ? 'group' : companionType,
      arrangementPreference: arrangementType,
      selectedPackage: arrangementType === 'package' ? selectedDest.packages.find(p => p.id === selectedPackageId) : undefined,
      selectedServices: arrangementType === 'custom' ? {
        accommodation: {
          name: customHotelType,
          roomType: 'Heritage Deluxe',
          costPerNight: customHotelCostPerNight,
          nights: Math.max(daysCount - 1, 1)
        },
        transportation: {
          vehicleType: customVehicleType,
          pickupLocation: 'Chennai / Selected City',
          cost: customVehicleCostPerDay * daysCount
        }
      } : undefined,
      caretakerService: caretakerChoice,
      caretakerFee: pricing.caretakerFee,
      originalPrice: pricing.originalPrice,
      discountPercentage: pricing.discountPercentage,
      discountAmount: pricing.discountAmount,
      taxesAndFees: pricing.taxes,
      finalPrice: pricing.finalPrice,
      bookingStatus: 'confirmed',
      paymentStatus: 'pending_at_arrival', // Safe transparent pending-at-arrival per user instruction
      createdAt: new Date().toISOString(),
      qrCodeData: `TN-VERIFIED-${selectedDest.id.toUpperCase()}-${Date.now()}`,
      isFirstBookingDiscountApplied: pricing.discountAmount > 0,
      sponsoredKitEligible: true,
      sponsoredKitClaimed: false,
      offlineSaved: false
    };

    StorageService.saveBooking(newBooking);
    setConfirmedBookingRef(newBooking);
    onBookingConfirmed(newBooking);

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const stepsList = [
    'Destination', 'Dates & Guests', 'Companion', 'Arrangement', 
    'Caretaker', 'Add-ons', 'First Discount', 'Summary', 'Confirm'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Top Header & Progress Indicator */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Step {currentStep} of 9 — {stepsList[currentStep - 1]}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Personalized Travel Booking Wizard
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full transition-all duration-300"
              style={{ width: `${(currentStep / 9) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-sm text-slate-200">
          {/* STEP 1: SELECT DESTINATION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">STEP 1 — Select Your Destination</h3>
                <p className="text-xs text-slate-400">Choose from verified destinations within Tamil Nadu</p>
              </div>

              {/* Search filter */}
              <input
                type="text"
                placeholder="Filter Tamil Nadu destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                {TN_DESTINATIONS.filter(d => 
                  d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  d.district.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((dest) => {
                  const isSelected = selectedDestId === dest.id;
                  const isDestRedAlert = dest.weather.alertLevel === 'red' || dest.weather.bookingRestricted;

                  return (
                    <button
                      key={dest.id}
                      type="button"
                      disabled={isDestRedAlert}
                      onClick={() => setSelectedDestId(dest.id)}
                      className={`p-3 rounded-2xl border text-left flex gap-3 transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400 shadow-md'
                          : isDestRedAlert
                          ? 'bg-rose-950/20 border-rose-900/60 opacity-60 cursor-not-allowed'
                          : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <img
                        src={dest.images[0]}
                        alt={dest.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs text-white truncate">{dest.name}</span>
                          {isDestRedAlert && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-600 text-white shrink-0">
                              RED ALERT
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-amber-300/80">{dest.district}</div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                          <span>₹{dest.estimatedCostPerDay} / day</span>
                          <span>★ {dest.averageRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {isRedAlert && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>This destination is currently in a restricted Red Alert zone. Please choose a safe alternative.</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: TRAVEL DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">STEP 2 — Travel Dates & Travelers</h3>
                <p className="text-xs text-slate-400">Specifying for {selectedDest.name}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Travel Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-amber-300">
                Calculated Trip Duration: <span className="font-bold">{daysCount} Days / {Math.max(daysCount - 1, 1)} Nights</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Number of Adults (12+ yrs)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Number of Children (below 12 yrs)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={15}
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TRAVEL COMPANION */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">STEP 3 — Who are you travelling with?</h3>
                <p className="text-xs text-slate-400">Select your travel companion group</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { id: 'solo', label: 'Solo Travel', icon: User, desc: 'Travelling alone with personalized peaceful itinerary.' },
                  { id: 'family', label: 'Family Trip', icon: Users, desc: 'Travelling with family, children, and elders.' },
                  { id: 'friends', label: 'Friends Trip', icon: Compass, desc: 'Travelling with friends; adventure and fun focus.' },
                  { id: 'group', label: 'Group Trip', icon: Bus, desc: 'Organized group traveling together with shared transport.' },
                  { id: 'meet_new', label: 'Meet New Travellers', icon: Sparkles, desc: 'Join a verified scheduled group experience.' }
                ].map((item) => {
                  const isSelected = companionType === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCompanionType(item.id as any)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400 text-white'
                          : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400 mb-2">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="font-bold text-sm text-white">{item.label}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
                    </button>
                  );
                })}
              </div>

              {companionType === 'meet_new' && (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-amber-300">Verified Group Joining Status:</div>
                  <p>
                    Currently, verified community batches for {selectedDest.name} are available for next weekend. Your booking will be grouped with verified travelers matching your interest tier.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: TRAVEL ARRANGEMENT */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">STEP 4 — How would you like to plan your trip?</h3>
                <p className="text-xs text-slate-400">Choose between an all-inclusive package or customized self-planning</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setArrangementType('package')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    arrangementType === 'package'
                      ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400 text-white'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm text-white">Option A: Plan My Trip for Me</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Pre-packaged verified package including resort, cab, activities & sightseeing.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setArrangementType('custom')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    arrangementType === 'custom'
                      ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400 text-white'
                      : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-sm text-white">Option B: I'll Plan My Own Trip</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Select individual hotel, vehicle, and activities separately with transparent itemized costs.
                  </div>
                </button>
              </div>

              {/* Package Details */}
              {arrangementType === 'package' && (
                <div className="space-y-2.5 pt-2">
                  <label className="text-xs font-semibold text-slate-300">Choose Available Tour Package:</label>
                  {selectedDest.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackageId(pkg.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        selectedPackageId === pkg.id
                          ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400'
                          : 'bg-slate-800/30 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-white">{pkg.title} ({pkg.duration})</div>
                        <div className="text-[11px] text-slate-400">{pkg.inclusions.join(' • ')}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold text-amber-400">₹{pkg.pricePerPerson}</div>
                        <div className="text-[10px] text-slate-400">/ person</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Custom Details */}
              {arrangementType === 'custom' && (
                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Accommodation Tier</label>
                    <select
                      value={customHotelCostPerNight}
                      onChange={(e) => {
                        setCustomHotelCostPerNight(Number(e.target.value));
                        setCustomHotelType(e.target.selectedOptions[0].text);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value={1500}>Standard Homestay (₹1,500/night)</option>
                      <option value={2200}>Deluxe Heritage Room (₹2,200/night)</option>
                      <option value={4500}>Luxury Hill / Shore View Resort (₹4,500/night)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Transportation Option</label>
                    <select
                      value={customVehicleCostPerDay}
                      onChange={(e) => {
                        setCustomVehicleCostPerDay(Number(e.target.value));
                        setCustomVehicleType(e.target.selectedOptions[0].text);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value={1200}>Self-Drive Hatchback (₹1,200/day)</option>
                      <option value={1800}>AC Sedan with Chauffeur (₹1,800/day)</option>
                      <option value={3200}>14-Seater AC Tempo Traveller (₹3,200/day)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: CARETAKER AND LOCAL GUIDE */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">STEP 5 — Would you like someone to assist you during your trip?</h3>
                <p className="text-xs text-slate-400">Verified local travel guides and assistance caretakers for your destination</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'caretaker', label: 'Yes, I need a caretaker', fee: '₹800 / day', desc: 'Assists elderly travelers, manages luggage, logistics & local coordination.' },
                  { id: 'guide', label: 'Yes, I need a local travel guide', fee: '₹1,200 / day', desc: 'Certified historian/guide for temple darshan, monuments, stories & hidden routes.' },
                  { id: 'both', label: 'Yes, I need both', fee: '₹1,800 / day (Special Combo)', desc: 'Dedicated caretaker plus certified local storytelling guide.' },
                  { id: 'none', label: 'No, I can manage on my own', fee: '₹0 (Free)', desc: 'Self-guided travel experience.' }
                ].map((opt) => {
                  const isSelected = caretakerChoice === opt.id;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCaretakerChoice(opt.id as any)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400 text-white'
                          : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{opt.label}</span>
                        <span className="text-[11px] font-semibold text-amber-400">{opt.fee}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">{opt.desc}</div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs text-slate-300">
                Additional charge for {daysCount} days: <span className="font-bold text-amber-400">₹{pricing.caretakerFee.toLocaleString('en-IN')}</span> (included in final total)
              </div>
            </div>
          )}

          {/* STEP 6: PACKAGES AND ADD-ON SERVICES */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">STEP 6 — Packages & Add-on Services</h3>
                <p className="text-xs text-slate-400">Enhance your Tamil Nadu experience with curated services</p>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'Special Temple Darshan VIP Guidance', price: '₹500 / adult', desc: 'Priority access coordination, archana assistance, and prasad collection.' },
                  { name: 'Professional Vacation Photography', price: '₹1,200 total', desc: '1-hour high-resolution photo session at scenic heritage monuments or viewpoints.' },
                  { name: 'Eco-Trek Forest Department Permit', price: '₹350 / person', desc: 'Official pass for Western Ghats nature trails and waterfall cascades.' }
                ].map((addon) => {
                  const isChecked = selectedAddons.includes(addon.name);

                  return (
                    <div
                      key={addon.name}
                      onClick={() => {
                        if (isChecked) {
                          setSelectedAddons(selectedAddons.filter(a => a !== addon.name));
                        } else {
                          setSelectedAddons([...selectedAddons, addon.name]);
                        }
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400'
                          : 'bg-slate-800/30 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-slate-600'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white">{addon.name}</div>
                          <div className="text-[11px] text-slate-400">{addon.desc}</div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-amber-400 shrink-0 ml-2">
                        {addon.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: FIRST-BOOKING DISCOUNT */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">STEP 7 — First-Booking Discount Eligibility</h3>
                <p className="text-xs text-slate-400">Validated on backend against authenticated booking history</p>
              </div>

              {pricing.discountAmount > 0 ? (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 space-y-3">
                  <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>Congratulations! You are eligible for 10% First-Trip OFF</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    As a verified customer booking your first adventure with TN Stories, your 10% discount has been automatically applied to this booking.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Original Price</div>
                      <div className="font-bold text-slate-300 line-through">₹{pricing.originalPrice.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40">
                      <div className="text-amber-300 text-[10px]">10% Discount</div>
                      <div className="font-bold text-amber-400">-₹{pricing.discountAmount.toLocaleString('en-IN')}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40">
                      <div className="text-emerald-300 text-[10px]">Payable Total</div>
                      <div className="font-bold text-emerald-300">₹{pricing.finalPrice.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-white">Standard Best-Rate Guarantee:</div>
                  <p>
                    {pricing.originalPrice < 3000
                      ? 'The 10% first-trip discount applies to bookings above ₹3,000 minimum spend.'
                      : 'You have previously redeemed your first-booking voucher or your booking is already discounted at peak seasonal rate.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 8: BOOKING SUMMARY */}
          {currentStep === 8 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">STEP 8 — Complete Booking Summary</h3>
                <p className="text-xs text-slate-400">Review every choice before placing your booking</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-bold text-white">{selectedDest.name} ({selectedDest.district})</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
                  <span className="text-slate-400">Travel Dates:</span>
                  <span className="font-semibold text-white">{startDate} to {returnDate} ({daysCount} Days)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
                  <span className="text-slate-400">Travelers:</span>
                  <span className="font-semibold text-white">{adults} Adults, {children} Children ({totalTravelers} Total)</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
                  <span className="text-slate-400">Companion Type:</span>
                  <span className="font-semibold text-white capitalize">{companionType.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
                  <span className="text-slate-400">Arrangement:</span>
                  <span className="font-semibold text-white capitalize">{arrangementType === 'package' ? 'Pre-Packaged Tour' : 'Custom Planned'}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
                  <span className="text-slate-400">Assistance:</span>
                  <span className="font-semibold text-white capitalize">{caretakerChoice} (+₹{pricing.caretakerFee})</span>
                </div>
                {selectedAddons.length > 0 && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700/80">
                    <span className="text-slate-400">Add-ons:</span>
                    <span className="font-semibold text-amber-300 text-right">{selectedAddons.join(', ')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-400">Original Price:</span>
                  <span className="text-slate-300 font-mono">₹{pricing.originalPrice.toLocaleString('en-IN')}</span>
                </div>
                {pricing.discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-400">
                    <span>First-Trip Promotion (10%):</span>
                    <span className="font-mono font-bold">-₹{pricing.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-400">
                  <span>Taxes & Tourism Cess (5%):</span>
                  <span className="font-mono">₹{pricing.taxes.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700 text-sm">
                  <span className="font-bold text-white">Final Payable Amount:</span>
                  <span className="font-black text-amber-400 text-base font-mono">
                    ₹{pricing.finalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Transparent Pricing: No hidden surcharges. Free Sponsored Travel Kit included upon confirmation!</span>
              </div>
            </div>
          )}

          {/* STEP 9: CONFIRM BOOKING */}
          {currentStep === 9 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">STEP 9 — Review & Confirm Booking</h3>
                <p className="text-xs text-slate-400">Instant confirmation with secure booking reference number</p>
              </div>

              {confirmedBookingRef ? (
                <div className="p-6 rounded-3xl bg-slate-800/80 border border-emerald-500/40 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <div>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      BOOKING CONFIRMED
                    </span>
                    <h4 className="text-xl font-black text-white mt-2">
                      Trip Successfully Reserved!
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Booking Reference: <span className="font-mono font-bold text-amber-400">{confirmedBookingRef.referenceNumber}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-left text-xs space-y-1.5">
                    <div><span className="text-slate-400">Destination:</span> <span className="font-bold text-white">{confirmedBookingRef.destinationName}</span></div>
                    <div><span className="text-slate-400">Dates:</span> <span className="font-semibold text-white">{confirmedBookingRef.travelDates.start} to {confirmedBookingRef.travelDates.end}</span></div>
                    <div><span className="text-slate-400">Payment Status:</span> <span className="text-amber-400 font-bold">Payable at Arrival (₹{confirmedBookingRef.finalPrice.toLocaleString('en-IN')})</span></div>
                    <div><span className="text-slate-400">Sponsored Kit QR:</span> <span className="text-emerald-400 font-mono">Ready in Sponsored Kit section</span></div>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all"
                  >
                    View in My Bookings
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                    <div className="font-semibold">Safe Confirmation Workflow:</div>
                    <p>
                      Your trip will be recorded with confirmed status and an authentic booking reference. Payment can be settled securely at arrival or via verified counter payment.
                    </p>
                  </div>

                  <button
                    onClick={handleConfirmBooking}
                    className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Booking & Generate Reference (₹{pricing.finalPrice.toLocaleString('en-IN')})</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!confirmedBookingRef && (
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`py-2 px-4 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                currentStep === 1
                  ? 'opacity-30 cursor-not-allowed text-slate-600'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {currentStep < 9 ? (
              <button
                onClick={handleNext}
                className="py-2.5 px-6 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
