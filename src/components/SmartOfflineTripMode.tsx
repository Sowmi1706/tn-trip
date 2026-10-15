import React, { useState, useEffect } from 'react';
import { Booking, Destination, Language } from '../types/tourism';
import { StorageService } from '../services/storageService';
import { 
  Wifi, WifiOff, Download, Trash2, QrCode, PhoneCall, AlertTriangle, 
  Map, Calendar, ShieldCheck, CheckCircle2, HardDrive, Compass, Navigation
} from 'lucide-react';

interface SmartOfflineTripModeProps {
  language: Language;
  onClose?: () => void;
}

export const SmartOfflineTripMode: React.FC<SmartOfflineTripModeProps> = ({ language, onClose }) => {
  // Real network state + simulator toggle
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  // Offline trips list
  const [offlineTrips, setOfflineTrips] = useState<any[]>(StorageService.getOfflineTrips());
  const [activeTab, setActiveTab] = useState<'trips' | 'sos' | 'maps' | 'storage'>('trips');
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const effectiveNetworkOnline = isOnline && !simulatedOffline;

  // Total offline storage calculation
  const totalStorageMB = (offlineTrips.length * 14.8).toFixed(1);

  const handleDownloadSampleTrip = () => {
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 90) {
          clearInterval(interval);
          // Finish saving trip offline
          const bookings = StorageService.getBookings();
          if (bookings.length > 0) {
            const dest = StorageService.getBookings()[0];
            // Get destination
            const sampleDest = StorageService.saveTripOffline(
              dest,
              {
                id: dest.destinationId,
                name: dest.destinationName,
                district: dest.district,
                category: 'temple',
                shortDescription: 'Offline cached destination details',
                fullDescription: 'Comprehensive offline package including monument guidelines, darshan timings, emergency helpline routing, and offline map layers.',
                images: ['https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80'],
                popularAttractions: ['Iconic Shrine', 'Corridor Walk', 'Heritage Museum'],
                estimatedCostPerDay: 2200,
                packages: [],
                averageRating: 4.9,
                reviewCount: 310,
                location: `${dest.district}, Tamil Nadu`,
                coordinates: { lat: 9.9195, lng: 78.1193 },
                suitableGroupTypes: ['family'],
                suitableCategories: ['temple_spiritual'],
                weather: {
                  tempC: 30,
                  condition: 'Sunny (Cached)',
                  rainfallMm: 0,
                  windSpeedKmh: 10,
                  alertLevel: 'green',
                  alertTitle: 'Clear Weather Cached',
                  alertDetails: 'Last synced before going offline.',
                  bookingRestricted: false
                }
              }
            );
          }
          setOfflineTrips(StorageService.getOfflineTrips());
          return 100;
        }
        return prev + 25;
      });
    }, 300);

    setTimeout(() => {
      setDownloadProgress(null);
    }, 2000);
  };

  const handleDeleteTrip = (bookingId: string) => {
    StorageService.deleteOfflineTrip(bookingId);
    setOfflineTrips(StorageService.getOfflineTrips());
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all downloaded offline trips and cached maps?')) {
      StorageService.clearAllOfflineData();
      setOfflineTrips([]);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Top Banner with Network State & Offline Simulator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>SMART OFFLINE TRIP MODE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Travel Without Internet Across Tamil Nadu
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Access your bookings, QR entry codes, day-by-day itineraries, tourist maps, and emergency SOS even in remote hill stations or ghat areas with zero network connectivity.
          </p>
        </div>

        {/* Network Status & Simulator Toggle */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            {effectiveNetworkOnline ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Online Mode</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <WifiOff className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300">Offline Active</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSimulatedOffline(!simulatedOffline)}
            className="py-1 px-2.5 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {simulatedOffline ? 'Disable Simulator' : 'Test Offline Mode'}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 gap-2 pb-2">
        {[
          { id: 'trips', label: `Downloaded Trips (${offlineTrips.length})`, icon: Download },
          { id: 'sos', label: 'Emergency SOS & Hospitals', icon: PhoneCall },
          { id: 'maps', label: 'Offline GPS & Maps', icon: Map },
          { id: 'storage', label: `Storage (${totalStorageMB} MB)`, icon: HardDrive }
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2 px-3 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
                isSelected ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: DOWNLOADED TRIPS */}
      {activeTab === 'trips' && (
        <div className="space-y-5">
          {downloadProgress !== null && (
            <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold">
                <span>Downloading Trip Package, High-Res Maps & SOS Directory...</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}

          {offlineTrips.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-950/60 border border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-white text-base">No Trips Downloaded Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Download your active Tamil Nadu trips to access hotel tickets, bus passes, day-wise itineraries, and maps with zero internet.
                </p>
              </div>
              <button
                onClick={handleDownloadSampleTrip}
                className="py-2.5 px-5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all cursor-pointer"
              >
                Download Active Journey Offline (14.8 MB)
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Available offline without data connection:</span>
                <button
                  onClick={handleDownloadSampleTrip}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Update & Re-sync Package</span>
                </button>
              </div>

              {offlineTrips.map((trip) => (
                <div
                  key={trip.bookingId}
                  className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                          {trip.booking.referenceNumber}
                        </span>
                        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Offline Verified</span>
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-white mt-1">
                        {trip.destination.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Dates: {trip.booking.travelDates.start} to {trip.booking.travelDates.end} ({trip.booking.travelerCount} Travelers)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteTrip(trip.bookingId)}
                        className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                        title="Delete offline file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Offline Tickets & QR section */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md">
                        <QrCode className="w-full h-full text-slate-950" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-white">Boarding Pass & Hotel Entry QR</div>
                        <div className="text-[11px] text-slate-400">Scannable by hotel desk and transport agents without mobile data.</div>
                        <div className="text-[10px] text-cyan-400 font-mono">TOKEN: {trip.booking.qrCodeData}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-emerald-400">STATUS: CONFIRMED</div>
                      <div className="text-[11px] text-slate-400">Amount: ₹{trip.booking.finalPrice.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  {/* Day-Wise Offline Itinerary */}
                  <div className="space-y-2">
                    <h5 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
                      Day-Wise Offline Itinerary & Timings
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      {trip.offlineItinerary.map((item: any, idx: number) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
                          <div className="font-bold text-cyan-400 text-[11px]">Day {item.day} • {item.timing}</div>
                          <div className="font-semibold text-white">{item.title}</div>
                          <div className="text-[11px] text-slate-400">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: EMERGENCY SOS */}
      {activeTab === 'sos' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 space-y-1">
            <div className="font-bold text-sm text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Offline Statutory Helplines & Emergency Support</span>
            </div>
            <p>
              These numbers are stored directly on your device memory and can be dialed even when you have no data packet connection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'All-India Police Emergency Helpline', number: '112', desc: 'Immediate police distress routing' },
              { label: 'Ambulance & Medical Emergency', number: '108', desc: 'Free emergency medical dispatch' },
              { label: 'Tamil Nadu Tourist Police Helpline', number: '1363', desc: 'Dedicated tourist assistance across TN' },
              { label: 'Women Safety & Support Helpline', number: '1091', desc: '24/7 round-the-clock protection' },
              { label: 'Disaster Management & Flood Control', number: '1077', desc: 'District emergency operations center' },
              { label: 'Madurai Government Rajaji Hospital', number: '+91 452 253 2535', desc: 'Premier regional trauma & care center' }
            ].map((sos) => (
              <div
                key={sos.number}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-xs text-white">{sos.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{sos.desc}</div>
                  <div className="text-base font-black text-amber-400 font-mono mt-1">{sos.number}</div>
                </div>
                <a
                  href={`tel:${sos.number}`}
                  className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shrink-0 shadow-md font-bold"
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OFFLINE MAPS & GPS */}
      {activeTab === 'maps' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
              <Navigation className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="font-bold text-white text-base">Offline Navigation Layer & GPS Tracker</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Vector tile data for Tamil Nadu tourist circuits is cached. Device GPS continues functioning without mobile internet to guide you between landmarks.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
              <span>GPS Satellites Locked: 8/12</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STORAGE MANAGEMENT */}
      {activeTab === 'storage' && (
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-sm">Offline Storage Allocation</div>
                <div className="text-slate-400">Total used: {totalStorageMB} MB of local device quota</div>
              </div>
              <button
                onClick={handleClearAll}
                className="py-1.5 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-colors"
              >
                Clear All Offline Files
              </button>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-400 h-full"
                style={{ width: `${Math.min(Number(totalStorageMB) * 2, 100)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400">
              Cached items: 1 Trip Package, 3 QR passes, 12 vector map tiles, emergency SOS directory.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
