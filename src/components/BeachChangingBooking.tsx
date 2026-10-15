import React, { useState } from 'react';
import { BeachChangingFacility, Language, UserAccount } from '../types/tourism';
import { StorageService } from '../services/storageService';
import { BEACH_FACILITIES } from '../data/tamilNaduData';
import { 
  Waves, QrCode, ShieldCheck, Check, Clock, MapPin, 
  Sparkles, CheckCircle2, User, Users, Lock, Coffee, PlusCircle, X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BeachChangingBookingProps {
  currentUser: UserAccount | null;
  language: Language;
}

export const BeachChangingBooking: React.FC<BeachChangingBookingProps> = ({ currentUser, language }) => {
  const [facilities, setFacilities] = useState<BeachChangingFacility[]>(BEACH_FACILITIES);
  const [selectedFacility, setSelectedFacility] = useState<BeachChangingFacility>(facilities[0]);
  
  // Booking parameters
  const [bookingDate, setBookingDate] = useState('2026-11-16');
  const [timeSlot, setTimeSlot] = useState('06:00 AM – 08:00 AM (Morning Dip)');
  const [roomType, setRoomType] = useState<'men' | 'women' | 'family'>('family');
  const [peopleCount, setPeopleCount] = useState(2);
  
  // Optional add-ons (explicitly approved by customer)
  const [includeLocker, setIncludeLocker] = useState(false);
  const [includeTowel, setIncludeTowel] = useState(false);

  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);

  // Partner form state
  const [partnerBeach, setPartnerBeach] = useState('Marina Beach, Chennai');
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');

  // Cost calculation
  // Base Booking Fee is strictly ₹0 as required by the Free Booking Policy
  const baseFee = 0;
  const lockerFee = includeLocker ? selectedFacility.slotPricing.lockerCharge : 0;
  const towelFee = includeTowel ? selectedFacility.slotPricing.towelRental * peopleCount : 0;
  const totalPayable = baseFee + lockerFee + towelFee;

  const handleBookFacility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert('Please sign in to confirm your changing room reservation.');
      return;
    }

    const bookingRecord = {
      id: `bch-${Date.now()}`,
      referenceNumber: `TN-BEACH-${Math.floor(10000 + Math.random() * 90000)}`,
      facilityId: selectedFacility.id,
      facilityName: selectedFacility.facilityName,
      beachName: selectedFacility.beachName,
      customerName: currentUser.fullName,
      customerEmail: currentUser.email,
      date: bookingDate,
      timeSlot,
      roomType,
      peopleCount,
      includeLocker,
      includeTowel,
      baseFee: 0,
      totalPayable,
      status: 'confirmed',
      qrCodeData: `TN-BCH-VERIFIED-${selectedFacility.id}-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    StorageService.saveBeachBooking(bookingRecord);
    setConfirmedBooking(bookingRecord);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>BEACH TRIP SERVICES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Beach Changing Room & Refreshment Booking
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Book private changing rooms for men, women, and families, along with hot showers, secure lockers, baby-changing amenities, and beachside refreshments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowPartnerModal(true)}
          className="py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register as Facility Partner</span>
        </button>
      </div>

      {/* Mandatory Free Booking Policy Banner */}
      <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-white">
              Official Free Booking Policy — No Convenience Fee
            </div>
            <div className="text-emerald-300/90 text-xs">
              We never charge any booking fee, convenience markup, or mandatory surcharge.
            </div>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shrink-0 shadow-md">
          No Booking Fee – Customer Payable: ₹0
        </div>
      </div>

      {confirmedBooking ? (
        <div className="p-6 rounded-3xl bg-slate-950 border border-emerald-500/40 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              RESERVATION CONFIRMED
            </span>
            <h4 className="text-xl font-black text-white mt-2">
              {confirmedBooking.facilityName}
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Ref ID: <span className="font-mono text-amber-400 font-bold">{confirmedBooking.referenceNumber}</span> • {confirmedBooking.beachName}
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-left text-xs">
            <div className="space-y-1">
              <div><span className="text-slate-400">Date:</span> <span className="font-semibold text-white">{confirmedBooking.date}</span></div>
              <div><span className="text-slate-400">Slot:</span> <span className="font-semibold text-white">{confirmedBooking.timeSlot}</span></div>
              <div><span className="text-slate-400">Room:</span> <span className="font-semibold text-white capitalize">{confirmedBooking.roomType} Changing Room</span></div>
              <div><span className="text-slate-400">Total Payable at Counter:</span> <span className="font-bold text-amber-400">₹{confirmedBooking.totalPayable}</span></div>
            </div>
            <div className="w-20 h-20 bg-white p-1.5 rounded-xl flex items-center justify-center shadow-md">
              <QrCode className="w-full h-full text-slate-950" />
            </div>
          </div>

          <button
            onClick={() => setConfirmedBooking(null)}
            className="py-2.5 px-6 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all"
          >
            Book Another Slot
          </button>
        </div>
      ) : (
        /* Facilities Listing & Booking Form Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Facilities List (Col 5) */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
              Verified Coastal Changing Facilities
            </h4>

            {facilities.map((fac) => {
              const isSelected = selectedFacility.id === fac.id;

              return (
                <div
                  key={fac.id}
                  onClick={() => setSelectedFacility(fac)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/30 border-cyan-400 ring-1 ring-cyan-400 shadow-lg'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-white">{fac.facilityName}</div>
                      <div className="text-xs text-cyan-300 font-medium flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{fac.beachName} ({fac.distanceFromShoreMeters}m from water)</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">
                      ★ {fac.rating}
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Men & Women Rooms</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Hot Showers</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Lockers</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">Baby Care</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking Form (Col 7) */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
            <div>
              <div className="text-xs text-amber-400 font-semibold">{selectedFacility.beachName}</div>
              <h3 className="text-lg font-black text-white mt-0.5">
                Reserve Slot at {selectedFacility.facilityName}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Open: {selectedFacility.openHours}</p>
            </div>

            <form onSubmit={handleBookFacility} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Visit Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option>05:30 AM – 07:30 AM (Sunrise & Dip)</option>
                    <option>07:30 AM – 09:30 AM (Morning Sea Bath)</option>
                    <option>03:30 PM – 05:30 PM (Afternoon Refreshment)</option>
                    <option>05:30 PM – 07:30 PM (Sunset Walk)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Room Preference</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="family">Private Family Changing Room</option>
                    <option value="women">Private Women Changing Cabin</option>
                    <option value="men">Private Men Changing Cabin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Number of People</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Optional Add-ons */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <div className="font-semibold text-slate-300 text-xs">
                  Optional Services (Requires Customer Approval):
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeLocker}
                      onChange={(e) => setIncludeLocker(e.target.checked)}
                      className="w-4 h-4 text-cyan-500 rounded border-slate-700 bg-slate-950"
                    />
                    <span className="text-slate-300">Electronic Secure Locker</span>
                  </label>
                  <span className="font-bold text-amber-400">+₹{selectedFacility.slotPricing.lockerCharge}</span>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeTowel}
                      onChange={(e) => setIncludeTowel(e.target.checked)}
                      className="w-4 h-4 text-cyan-500 rounded border-slate-700 bg-slate-950"
                    />
                    <span className="text-slate-300">Sanitized Fresh Cotton Towel Rental ({peopleCount} towels)</span>
                  </label>
                  <span className="font-bold text-amber-400">+₹{selectedFacility.slotPricing.towelRental * peopleCount}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Free Booking Reservation Fee: ₹0</div>
                  <div className="text-sm font-black text-white">
                    Total Payable: ₹{totalPayable} {totalPayable === 0 && '(100% Free Service)'}
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all shadow-md cursor-pointer"
                >
                  Confirm Free Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partner Registration Modal */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Register Coastal Changing Facility</h3>
              <button onClick={() => setShowPartnerModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Submit facility credentials to get listed on the Tamil Nadu Tourism Smart Beach Directory. Verified by admin within 24 hours.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Facility application submitted! Admin will audit and approve within 24 hours.');
                setShowPartnerModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-300 mb-1">Beach Location</label>
                <select
                  value={partnerBeach}
                  onChange={(e) => setPartnerBeach(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option>Marina Beach, Chennai</option>
                  <option>Besant Nagar Elliot's Beach</option>
                  <option>Mahabalipuram Beach</option>
                  <option>Kovalam Surf Beach</option>
                  <option>Kanyakumari Triveni Beach</option>
                  <option>Silver Beach, Cuddalore</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Facility / Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Marina Sunrise Comfort Lounge"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98400 00000"
                  value={partnerPhone}
                  onChange={(e) => setPartnerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl font-bold bg-amber-400 text-slate-950 hover:bg-amber-300"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
