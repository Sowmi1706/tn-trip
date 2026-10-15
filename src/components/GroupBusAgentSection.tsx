import React, { useState } from 'react';
import { Language, UserAccount, BusAgentQuotationRequest } from '../types/tourism';
import { StorageService } from '../services/storageService';
import { 
  Bus, Users, Calendar, MapPin, CheckCircle2, 
  ArrowRight, ShieldCheck, PhoneCall, Sparkles, Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface GroupBusAgentSectionProps {
  currentUser: UserAccount | null;
  language: Language;
}

export const GroupBusAgentSection: React.FC<GroupBusAgentSectionProps> = ({ currentUser, language }) => {
  const [startCity, setStartCity] = useState('Chennai');
  const [targetDestinations, setTargetDestinations] = useState('Madurai, Rameswaram, Kanyakumari (Temple Circuit)');
  const [startDate, setStartDate] = useState('2026-11-25');
  const [endDate, setEndDate] = useState('2026-11-28');
  const [passengerCount, setPassengerCount] = useState(24);
  const [tripType, setTripType] = useState('Temple Tour & Devotional Circuit');
  const [busType, setBusType] = useState<'volvo_multi_axle' | 'deluxe_ac_bus' | 'mini_bus_21' | 'tempo_traveller_14' | 'tourist_coach_54'>('deluxe_ac_bus');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98401 23456');
  const [specialNeeds, setSpecialNeeds] = useState('Luggage carrier for family bags, push-back comfortable recliner seats.');

  const [submittedQuote, setSubmittedQuote] = useState<BusAgentQuotationRequest | null>(null);

  // Price estimate calculation
  const calculateEstimatedQuote = () => {
    let basePerDay = 4500;
    if (busType === 'tempo_traveller_14') basePerDay = 3500;
    if (busType === 'mini_bus_21') basePerDay = 5200;
    if (busType === 'deluxe_ac_bus') basePerDay = 7500;
    if (busType === 'volvo_multi_axle') basePerDay = 11000;
    if (busType === 'tourist_coach_54') basePerDay = 9500;

    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    const days = Math.max(Math.ceil((e - s) / (1000 * 60 * 60 * 24)), 1);

    const min = basePerDay * days;
    const max = Math.round(min * 1.25);
    return { min, max, days };
  };

  const { min: quoteMin, max: quoteMax, days } = calculateEstimatedQuote();

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please sign in to request verified bus agent quotations.');
      return;
    }

    const created = StorageService.submitBusRequest({
      customerName: currentUser.fullName,
      customerEmail: currentUser.email,
      customerPhone: phone,
      tripType,
      startCity,
      routeDestinations: targetDestinations.split(',').map(s => s.trim()),
      startDate,
      endDate,
      passengerCount,
      busType,
      specialRequirements: specialNeeds,
      estimatedCostMin: quoteMin,
      estimatedCostMax: quoteMax
    });

    setSubmittedQuote(created);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <Bus className="w-4 h-4 text-amber-400" />
            <span>GROUP TRAVEL & COACH CHARTER</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Group Bus Booking & Bus-Agent Connections
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Book AC tourist coaches, mini-buses, and tempo travellers through verified Tamil Nadu bus operators for temple circuits, weddings, college research, and friends reunions.
          </p>
        </div>
      </div>

      {submittedQuote ? (
        <div className="p-6 rounded-3xl bg-slate-950 border border-emerald-500/40 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              QUOTATION REQUEST SUBMITTED
            </span>
            <h4 className="text-xl font-black text-white mt-2">
              Quotation Ref: {submittedQuote.referenceNumber}
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Estimated Rate: <span className="font-bold text-amber-400">₹{submittedQuote.estimatedCostMin.toLocaleString('en-IN')} – ₹{submittedQuote.estimatedCostMax.toLocaleString('en-IN')}</span> ({days} Days)
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left text-xs space-y-1.5 text-slate-300">
            <div><span className="text-slate-400">Route:</span> <span className="text-white font-semibold">{submittedQuote.startCity} ➔ {submittedQuote.routeDestinations.join(', ')}</span></div>
            <div><span className="text-slate-400">Vehicle Type:</span> <span className="text-white font-semibold uppercase">{submittedQuote.busType.replace(/_/g, ' ')}</span></div>
            <div><span className="text-slate-400">Travelers:</span> <span className="text-white font-semibold">{submittedQuote.passengerCount} passengers</span></div>
            <div className="pt-2 text-[11px] text-amber-300">
              Verified TN tourist operators will contact you via phone/email with vehicle photos, registration permits, and driver details within 2 business hours.
            </div>
          </div>

          <button
            onClick={() => setSubmittedQuote(null)}
            className="py-2.5 px-6 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all"
          >
            Submit Another Route Quotation
          </button>
        </div>
      ) : (
        /* Quotation Form Grid */
        <form onSubmit={handleQuoteSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Starting City</label>
              <select
                value={startCity}
                onChange={(e) => setStartCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
              >
                <option>Chennai</option>
                <option>Madurai</option>
                <option>Coimbatore</option>
                <option>Tiruchirappalli (Trichy)</option>
                <option>Salem</option>
                <option>Tirunelveli</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Route & Key Destinations in TN</label>
              <input
                type="text"
                value={targetDestinations}
                onChange={(e) => setTargetDestinations(e.target.value)}
                placeholder="e.g. Madurai, Rameswaram, Thanjavur, Kanyakumari"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Return Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Passenger Count</label>
              <input
                type="number"
                min={5}
                max={150}
                value={passengerCount}
                onChange={(e) => setPassengerCount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Trip Type / Occasion</label>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option>Temple Tour & Devotional Circuit</option>
                <option>Family Occasion / Wedding Transport</option>
                <option>College / Research Educational Tour</option>
                <option>Friends Getaway & Adventure Trip</option>
              </select>
            </div>
          </div>

          {/* Vehicle Type Cards */}
          <div>
            <label className="block text-slate-300 font-semibold text-xs mb-2">
              Select Desired Vehicle Type:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {[
                { id: 'tempo_traveller_14', label: '14-Seater Tempo', capacity: 'Up to 14 Pax', dailyRate: '₹3,500/day' },
                { id: 'mini_bus_21', label: '21-Seater Mini Bus', capacity: 'Up to 21 Pax', dailyRate: '₹5,200/day' },
                { id: 'deluxe_ac_bus', label: '35-Seater Deluxe AC', capacity: 'Up to 35 Pax', dailyRate: '₹7,500/day' },
                { id: 'tourist_coach_54', label: '54-Seater Coach', capacity: 'Up to 54 Pax', dailyRate: '₹9,500/day' },
                { id: 'volvo_multi_axle', label: 'Volvo Multi-Axle', capacity: 'Ultra Comfort Air', dailyRate: '₹11,000/day' }
              ].map((veh) => {
                const isSelected = busType === veh.id;

                return (
                  <button
                    key={veh.id}
                    type="button"
                    onClick={() => setBusType(veh.id as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 ring-1 ring-amber-400'
                        : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{veh.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{veh.capacity}</div>
                    <div className="text-[11px] font-bold text-amber-400 mt-1">{veh.dailyRate}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contact & Special Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Operator Callback Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Special Requirements (Luggage, AC, Elderly care)</label>
              <input
                type="text"
                value={specialNeeds}
                onChange={(e) => setSpecialNeeds(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          {/* Estimate Breakdown and Submit */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400">
                Duration: {days} Days • Estimated Rate Range (All Tolls & Driver Batta included)
              </div>
              <div className="text-xl font-black text-amber-400">
                ₹{quoteMin.toLocaleString('en-IN')} – ₹{quoteMax.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-400 ml-2">
                  (~₹{Math.round(quoteMin / Math.max(passengerCount, 1))} per person)
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto py-3 px-6 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>Connect with Verified Bus Agents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
