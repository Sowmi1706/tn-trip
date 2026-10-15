import React, { useState } from 'react';
import { Destination, Language, UserAccount, Booking } from '../types/tourism';
import { StorageService } from '../services/storageService';
import { TN_DESTINATIONS } from '../data/tamilNaduData';
import { 
  Building2, Car, Check, Calendar, MapPin, Users, IndianRupee, 
  ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Filter, Luggage
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlexibleBookingSystemProps {
  currentUser: UserAccount | null;
  language: Language;
  onBookingCreated: (booking: Booking) => void;
}

export const FlexibleBookingSystem: React.FC<FlexibleBookingSystemProps> = ({
  currentUser,
  language,
  onBookingCreated
}) => {
  const [selectedOption, setSelectedOption] = useState<'combined' | 'hotel_only' | 'travel_only'>('hotel_only');
  
  // Destination
  const [selectedDestId, setSelectedDestId] = useState(TN_DESTINATIONS[0].id);
  const selectedDest = TN_DESTINATIONS.find(d => d.id === selectedDestId) || TN_DESTINATIONS[0];

  // Dates
  const [checkIn, setCheckIn] = useState('2026-11-15');
  const [checkOut, setCheckOut] = useState('2026-11-18');
  const [guestsCount, setGuestsCount] = useState(2);

  // Hotel specifics
  const [roomType, setRoomType] = useState('Deluxe Heritage Room');
  const [hotelCostPerNight, setHotelCostPerNight] = useState(2200);

  // Travel specifics
  const [pickupCity, setPickupCity] = useState('Chennai');
  const [vehicleType, setVehicleType] = useState('AC Sedan (4-Seater)');
  const [vehicleCostPerDay, setVehicleCostPerDay] = useState(1800);

  const [bookingSuccess, setBookingSuccess] = useState<Booking | null>(null);

  const calculateDays = () => {
    const s = new Date(checkIn).getTime();
    const e = new Date(checkOut).getTime();
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 1);
  };
  const days = calculateDays();

  // Price calculations
  let basePrice = 0;
  if (selectedOption === 'combined') {
    basePrice = (hotelCostPerNight * Math.max(days - 1, 1)) + (vehicleCostPerDay * days);
  } else if (selectedOption === 'hotel_only') {
    basePrice = hotelCostPerNight * Math.max(days - 1, 1);
  } else if (selectedOption === 'travel_only') {
    basePrice = vehicleCostPerDay * days;
  }

  const taxes = Math.round(basePrice * 0.05);
  const finalPrice = basePrice + taxes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please sign in to place a verified booking.');
      return;
    }

    const newBooking: Booking = {
      id: `flex-bk-${Date.now()}`,
      referenceNumber: `TN-${selectedOption.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser.id,
      customerName: currentUser.fullName,
      customerEmail: currentUser.email,
      customerPhone: currentUser.phone || '+91 98401 23456',
      bookingType: selectedOption,
      destinationId: selectedDest.id,
      destinationName: selectedDest.name,
      district: selectedDest.district,
      travelDates: {
        start: checkIn,
        end: checkOut,
        daysCount: days
      },
      travelerCount: guestsCount,
      adults: guestsCount,
      children: 0,
      companionType: 'friends',
      arrangementPreference: 'custom',
      selectedServices: {
        accommodation: selectedOption !== 'travel_only' ? {
          name: `${selectedDest.name} Heritage Stay`,
          roomType,
          costPerNight: hotelCostPerNight,
          nights: Math.max(days - 1, 1)
        } : undefined,
        transportation: selectedOption !== 'hotel_only' ? {
          vehicleType,
          pickupLocation: pickupCity,
          cost: vehicleCostPerDay * days
        } : undefined
      },
      caretakerService: 'none',
      caretakerFee: 0,
      originalPrice: basePrice,
      discountPercentage: 0,
      discountAmount: 0,
      taxesAndFees: taxes,
      finalPrice,
      bookingStatus: 'confirmed',
      paymentStatus: 'pending_at_arrival',
      createdAt: new Date().toISOString(),
      qrCodeData: `TN-FLEX-${selectedOption.toUpperCase()}-${Date.now()}`,
      isFirstBookingDiscountApplied: false,
      sponsoredKitEligible: selectedOption === 'combined' || selectedOption === 'travel_only',
      sponsoredKitClaimed: false
    };

    StorageService.saveBooking(newBooking);
    setBookingSuccess(newBooking);
    onBookingCreated(newBooking);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
          <Luggage className="w-4 h-4 text-amber-400" />
          <span>FLEXIBLE BOOKING ENGINE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Flexible Travel & Hotel Booking System
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Book accommodation and transportation together, or book either service individually without forcing a bundled package.
        </p>
      </div>

      {/* Selectable 3 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            id: 'combined',
            title: 'Option 1: Travel + Hotel',
            desc: 'Complete journey solution combining verified hotel stay with chauffeur-driven vehicle.',
            icon: Sparkles
          },
          {
            id: 'hotel_only',
            title: 'Option 2: Hotel Only',
            desc: 'Book verified resorts and heritage homestays without requiring a transport booking.',
            icon: Building2
          },
          {
            id: 'travel_only',
            title: 'Option 3: Travel Only',
            desc: 'Book cars, tempo travellers, and tourist coaches without requiring a hotel reservation.',
            icon: Car
          }
        ].map((opt) => {
          const isSelected = selectedOption === opt.id;
          const Icon = opt.icon;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                setSelectedOption(opt.id as any);
                setBookingSuccess(null);
              }}
              className={`p-5 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400 shadow-xl ring-1 ring-amber-400 text-white'
                  : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-300'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-extrabold text-base text-white">{opt.title}</div>
                <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">{opt.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {bookingSuccess ? (
        <div className="p-6 rounded-2xl bg-slate-800/80 border border-emerald-500/40 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              RESERVATION CREATED
            </span>
            <h4 className="text-lg font-bold text-white mt-1">
              Booking Ref: {bookingSuccess.referenceNumber}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Category: <span className="text-amber-400 uppercase font-semibold">{bookingSuccess.bookingType.replace('_', ' ')}</span> • Total: ₹{bookingSuccess.finalPrice.toLocaleString('en-IN')}
            </p>
          </div>
          <button
            onClick={() => setBookingSuccess(null)}
            className="py-2.5 px-5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300"
          >
            Create Another Reservation
          </button>
        </div>
      ) : (
        /* Booking Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Destination Selection */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Target Destination in Tamil Nadu
              </label>
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
              >
                {TN_DESTINATIONS.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.district})</option>
                ))}
              </select>
            </div>

            {/* Check-In / Start */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {selectedOption === 'travel_only' ? 'Travel Start Date' : 'Check-In Date'}
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                required
              />
            </div>

            {/* Check-Out / End */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {selectedOption === 'travel_only' ? 'Travel Return Date' : 'Check-Out Date'}
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                required
              />
            </div>
          </div>

          {/* Hotel Only or Combined Specifics */}
          {selectedOption !== 'travel_only' && (
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
              <div className="font-bold text-xs text-amber-300 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Hotel & Accommodation Specifics</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Room Category</label>
                  <select
                    value={hotelCostPerNight}
                    onChange={(e) => {
                      setHotelCostPerNight(Number(e.target.value));
                      setRoomType(e.target.selectedOptions[0].text);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value={1600}>Comfort Heritage Room (₹1,600/night)</option>
                    <option value={2200}>Deluxe Heritage Room with Balcony (₹2,200/night)</option>
                    <option value={4200}>Luxury Valley/Shore Villa (₹4,200/night)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Number of Guests</label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                Amenities Included: 24/7 Hot Water, Complimentary Breakfast, Free WiFi, Travel Desk.
              </div>
            </div>
          )}

          {/* Travel Only or Combined Specifics */}
          {selectedOption !== 'hotel_only' && (
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3">
              <div className="font-bold text-xs text-amber-300 flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-400" />
                <span>Transportation & Vehicle Specifics</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pickup City in Tamil Nadu</label>
                  <select
                    value={pickupCity}
                    onChange={(e) => setPickupCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option>Chennai (Central / Airport)</option>
                    <option>Madurai Junction</option>
                    <option>Coimbatore Gandhipuram</option>
                    <option>Tiruchirappalli (Trichy)</option>
                    <option>Salem New Bus Stand</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Vehicle Selection</label>
                  <select
                    value={vehicleCostPerDay}
                    onChange={(e) => {
                      setVehicleCostPerDay(Number(e.target.value));
                      setVehicleType(e.target.selectedOptions[0].text);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value={1400}>Economy Hatchback (4-Seater) - ₹1,400/day</option>
                    <option value={1800}>AC Sedan with Chauffeur (4-Seater) - ₹1,800/day</option>
                    <option value={2600}>Innova / SUV (7-Seater) - ₹2,600/day</option>
                    <option value={3500}>Tempo Traveller (14-Seater) - ₹3,500/day</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Price Calculation Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">
                Calculated Duration: {days} Days • Subtotal: ₹{basePrice.toLocaleString('en-IN')} + 5% GST
              </div>
              <div className="text-xl font-black text-amber-400">
                Total Payable: ₹{finalPrice.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto py-3 px-6 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>Confirm & Place Reservation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
