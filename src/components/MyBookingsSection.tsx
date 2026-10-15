import React, { useState } from 'react';
import { Booking, Language, UserAccount } from '../types/tourism';
import { StorageService } from '../services/storageService';
import { TN_DESTINATIONS } from '../data/tamilNaduData';
import { 
  Ticket, QrCode, Calendar, MapPin, Download, CheckCircle2, 
  Clock, IndianRupee, Gift, Check, Building2, Car, Compass, Luggage
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MyBookingsSectionProps {
  currentUser: UserAccount | null;
  language: Language;
  onOpenBookingWizard: () => void;
  onOpenOfflineMode: () => void;
}

export const MyBookingsSection: React.FC<MyBookingsSectionProps> = ({
  currentUser,
  language,
  onOpenBookingWizard,
  onOpenOfflineMode
}) => {
  const [filterType, setFilterType] = useState<'all' | 'combined' | 'hotel_only' | 'travel_only'>('all');
  const [bookingsList, setBookingsList] = useState<Booking[]>(StorageService.getBookings());
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Filter bookings for current user or all verified bookings
  const userBookings = currentUser
    ? bookingsList.filter(b => b.customerId === currentUser.id || b.customerEmail === currentUser.email)
    : bookingsList;

  const filteredBookings = filterType === 'all'
    ? userBookings
    : userBookings.filter(b => b.bookingType === filterType);

  const handleSaveOffline = (booking: Booking) => {
    const dest = TN_DESTINATIONS.find(d => d.id === booking.destinationId) || TN_DESTINATIONS[0];
    StorageService.saveTripOffline(booking, dest);
    setDownloadSuccessId(booking.id);
    setTimeout(() => setDownloadSuccessId(null), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <Ticket className="w-4 h-4 text-amber-400" />
            <span>CUSTOMER TRIP RECORDS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            My Bookings & Reserved Journeys
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Access your verified QR e-tickets, hotel vouchers, chauffeur details, and offline synchronized travel packages.
          </p>
        </div>

        <button
          onClick={onOpenBookingWizard}
          className="py-2.5 px-5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all flex items-center gap-2 shrink-0 shadow-md"
        >
          <Compass className="w-4 h-4" />
          <span>New Trip Reservation</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All Bookings (${userBookings.length})` },
          { id: 'combined', label: `Packages & Combined (${userBookings.filter(b => b.bookingType === 'combined').length})` },
          { id: 'hotel_only', label: `Hotel Only (${userBookings.filter(b => b.bookingType === 'hotel_only').length})` },
          { id: 'travel_only', label: `Travel Only (${userBookings.filter(b => b.bookingType === 'travel_only').length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              filterType === tab.id
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400 bg-slate-950/60 rounded-3xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <Luggage className="w-6 h-6" />
            </div>
            <div className="font-bold text-white text-base">No reservations found in this category</div>
            <p className="max-w-xs mx-auto">
              Plan your next scenic Tamil Nadu tour or book flexible stays and vehicles.
            </p>
            <button
              onClick={onOpenBookingWizard}
              className="py-2.5 px-5 rounded-xl text-xs font-bold bg-amber-400 text-slate-950"
            >
              Start 9-Step Booking Wizard
            </button>
          </div>
        ) : (
          filteredBookings.map((b) => (
            <div
              key={b.id}
              className="p-5 sm:p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {b.referenceNumber}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 uppercase">
                      {b.bookingStatus}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                      {b.bookingType.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {b.destinationName}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{b.travelDates.start} to {b.travelDates.end} ({b.travelDates.daysCount} Days)</span>
                    <span>• {b.travelerCount} Travelers ({b.companionType})</span>
                  </div>
                </div>

                <div className="sm:text-right space-y-1">
                  <div className="text-xs text-slate-400">Total Payable Amount</div>
                  <div className="text-2xl font-black text-white font-mono">
                    ₹{b.finalPrice.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-amber-400 font-medium">
                    Payment Status: {b.paymentStatus === 'paid' ? 'Paid Online' : 'Payable at Arrival'}
                  </div>
                </div>
              </div>

              {/* Service Details & QR Code Bar */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8 space-y-2 text-xs text-slate-300">
                  {b.selectedPackage && (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="font-bold text-white">Selected Package: </span>
                      <span>{b.selectedPackage.title} ({b.selectedPackage.duration})</span>
                    </div>
                  )}

                  {b.selectedServices?.accommodation && (
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{b.selectedServices.accommodation.name} • {b.selectedServices.accommodation.roomType}</span>
                    </div>
                  )}

                  {b.selectedServices?.transportation && (
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                      <Car className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{b.selectedServices.transportation.vehicleType} from {b.selectedServices.transportation.pickupLocation}</span>
                    </div>
                  )}

                  {b.caretakerService !== 'none' && (
                    <div className="text-[11px] text-slate-400">
                      Assistance Included: <span className="text-white capitalize">{b.caretakerService}</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-4 flex items-center justify-end gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-right text-[11px] text-slate-400">
                    <div className="font-bold text-white">Verified E-Ticket</div>
                    <div>Show QR at boarding</div>
                  </div>
                  <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <QrCode className="w-full h-full text-slate-950" />
                  </div>
                </div>
              </div>

              {/* Action Buttons: Save Offline, Claim Sponsored Kit */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveOffline(b)}
                    className="py-2 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadSuccessId === b.id ? 'Saved Offline (14.8 MB) ✓' : 'Save for Offline Mode'}</span>
                  </button>

                  <button
                    onClick={onOpenOfflineMode}
                    className="text-cyan-400 hover:underline text-[11px]"
                  >
                    View in Offline Mode
                  </button>
                </div>

                {b.sponsoredKitEligible && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
                    <Gift className="w-3.5 h-3.5 text-amber-400" />
                    <span>Free Sponsored Travel Kit Unlocked!</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
