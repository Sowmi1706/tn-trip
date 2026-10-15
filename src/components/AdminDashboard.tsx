import React, { useState } from 'react';
import { UserAccount, Booking, Destination, Review, Language } from '../types/tourism';
import { StorageService } from '../services/storageService';
import { TN_DESTINATIONS, BEACH_FACILITIES } from '../data/tamilNaduData';
import { 
  ShieldCheck, MapPin, Package, Calendar, Users, 
  IndianRupee, Tag, Gift, MessageSquare, Waves, Check, X, Trash2, Edit3, AlertTriangle, ShieldAlert
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: UserAccount | null;
  language: Language;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, language, onClose }) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'destinations' | 'offers' | 'spin' | 'reviews' | 'ai chatbox' | 'beach_facilities'>('bookings');

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>(StorageService.getBookings());
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(StorageService.getReviews());
  // Offer Config
  const [offerConfig, setOfferConfig] = useState(StorageService.getOfferConfig());
  // Spin Config
  const [spinConfig, setSpinConfig] = useState(StorageService.getSpinConfig());

  const handleUpdateBookingStatus = (bookingId: string, status: 'confirmed' | 'pending' | 'cancelled') => {
    StorageService.updateBookingStatus(bookingId, status);
    setBookings(StorageService.getBookings());
  };

  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveOfferConfig(offerConfig);
    alert('First-Booking promotion rules updated successfully!');
  };

  const handleSaveSpinConfig = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSpinConfig(spinConfig);
    alert('Daily Spin & Win reward configuration updated successfully!');
  };

  const handleDeleteReview = (revId: string) => {
    StorageService.deleteReview(revId);
    setReviews(StorageService.getReviews());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">TN Stories Administration Hub</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                  OFFICER PORTAL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Logged in as: <span className="text-white font-semibold">{currentUser?.fullName} ({currentUser?.role})</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-5 gap-2 pt-2 overflow-x-auto">
          {[
            { id: 'bookings', label: `Bookings (${bookings.length})`, icon: Calendar },
            { id: 'destinations', label: `Destinations (${TN_DESTINATIONS.length})`, icon: MapPin },
            { id: 'offers', label: 'First-Booking Offers', icon: Tag },
            { id: 'spin', label: 'Daily Spin Config', icon: Gift },
            { id: 'reviews', label: `Moderation (${reviews.length})`, icon: MessageSquare },
            { id: 'beach_facilities', label: 'Beach Facilities', icon: Waves }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 text-xs font-bold transition-all relative flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {isSelected && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-sm text-slate-200">
          {/* TAB 1: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base">Customer Trip & Service Bookings</h4>
                <span className="text-xs text-slate-400">Total Recorded: {bookings.length}</span>
              </div>

              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                      <div>
                        <span className="font-mono font-bold text-amber-400 text-sm">{b.referenceNumber}</span>
                        <span className="text-slate-400 ml-2">• {b.customerName} ({b.customerEmail})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.bookingStatus === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {b.bookingStatus}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                          {b.bookingType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-400 text-[11px]">
                      <div>Destination: <span className="text-white font-semibold">{b.destinationName}</span></div>
                      <div>Dates: <span className="text-white font-semibold">{b.travelDates.start} to {b.travelDates.end}</span></div>
                      <div>Travelers: <span className="text-white font-semibold">{b.travelerCount} Pax ({b.companionType})</span></div>
                      <div>Assistance: <span className="text-white font-semibold">{b.caretakerService}</span></div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 text-xs gap-2">
                      <div className="text-slate-400">
                        Price: ₹{b.originalPrice} - Discount: ₹{b.discountAmount} ({b.discountPercentage}%) + Tax: ₹{b.taxesAndFees} = <span className="text-amber-400 font-bold font-mono">₹{b.finalPrice.toLocaleString('en-IN')}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                          className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                          className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DESTINATIONS */}
          {activeTab === 'destinations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base">Tamil Nadu Curated Destinations Catalog</h4>
                <span className="text-xs text-amber-400">Exclusively within Tamil Nadu State Boundaries</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TN_DESTINATIONS.map((d) => (
                  <div key={d.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex gap-3 text-xs">
                    <img src={d.images[0]} alt={d.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white truncate">{d.name}</div>
                      <div className="text-[11px] text-amber-300/80">{d.district} District</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                        <span>Est: ₹{d.estimatedCostPerDay}/day</span>
                        <span className={`font-bold ${d.weather.alertLevel === 'red' ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {d.weather.alertLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FIRST-BOOKING OFFERS */}
          {activeTab === 'offers' && (
            <form onSubmit={handleSaveOffer} className="space-y-4 max-w-xl text-xs">
              <h4 className="font-bold text-white text-base">First-Booking Offer Configuration</h4>
              <p className="text-slate-400">
                Rule engine verifies authenticated user's previous booking history to prevent repeated redemptions.
              </p>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Promotion Active Status:</span>
                  <input
                    type="checkbox"
                    checked={offerConfig.active}
                    onChange={(e) => setOfferConfig({ ...offerConfig, active: e.target.checked })}
                    className="w-4 h-4 text-amber-400 rounded"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={offerConfig.discountPercentage}
                    onChange={(e) => setOfferConfig({ ...offerConfig, discountPercentage: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Maximum Discount Cap (INR ₹)</label>
                  <input
                    type="number"
                    min={100}
                    value={offerConfig.maxDiscountAmountINR}
                    onChange={(e) => setOfferConfig({ ...offerConfig, maxDiscountAmountINR: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Minimum Booking Amount (INR ₹)</label>
                  <input
                    type="number"
                    min={500}
                    value={offerConfig.minBookingAmountINR}
                    onChange={(e) => setOfferConfig({ ...offerConfig, minBookingAmountINR: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl font-bold bg-amber-400 text-slate-950 hover:bg-amber-300"
              >
                Save Promotional Rules
              </button>
            </form>
          )}

          {/* TAB 4: DAILY SPIN CONFIG */}
          {activeTab === 'spin' && (
            <form onSubmit={handleSaveSpinConfig} className="space-y-4 max-w-xl text-xs">
              <h4 className="font-bold text-white text-base">Daily Spin & Win Budget and Weights</h4>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Daily Budget Limit (INR)</label>
                    <input
                      type="number"
                      value={spinConfig.dailyBudgetINR}
                      onChange={(e) => setSpinConfig({ ...spinConfig, dailyBudgetINR: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Monthly Budget Limit (INR)</label>
                    <input
                      type="number"
                      value={spinConfig.monthlyBudgetINR}
                      onChange={(e) => setSpinConfig({ ...spinConfig, monthlyBudgetINR: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-1">
                  Reset Time: Exactly 12:00 AM Indian Standard Time (IST). Duplicate spin attempts automatically blocked by server key hashing.
                </div>
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl font-bold bg-amber-400 text-slate-950 hover:bg-amber-300"
              >
                Save Spin Budget Limits
              </button>
            </form>
          )}

          {/* TAB 5: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-base">Trip Reviews & Customer Feedback</h4>
              {reviews.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{r.customerName}</span>
                      <span className="text-slate-400">• {r.destinationName}</span>
                      <span className="text-amber-400">★ {r.rating}</span>
                    </div>
                    <p className="text-slate-300">{r.writtenReview}</p>
                    <div className="text-[10px] text-slate-500">Trip Date: {r.tripDate} • Ref: {r.bookingReference}</div>
                  </div>

                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                    title="Remove review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: BEACH FACILITIES */}
          {activeTab === 'beach_facilities' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white text-base">Coastal Changing Facilities & Free Booking Audits</h4>
              {BEACH_FACILITIES.map((f) => (
                <div key={f.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{f.facilityName}</div>
                    <div className="text-slate-400">{f.beachName} • Customer Base Fee: ₹{f.slotPricing.baseBookingFee} (Free Booking Compliant)</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    VERIFIED PARTNER
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
