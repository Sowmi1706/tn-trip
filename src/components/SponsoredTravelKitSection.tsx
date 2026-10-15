import React, { useState } from 'react';
import { SponsoredTravelKit, Language, UserAccount } from '../types/tourism';
import { StorageService } from '../services/storageService';
import { 
  Gift, QrCode, ShieldCheck, Check, Sparkles, Building, 
  Package, CheckCircle2, ArrowRight, Tag, ExternalLink, PlusCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SponsoredTravelKitSectionProps {
  currentUser: UserAccount | null;
  language: Language;
}

export const SponsoredTravelKitSection: React.FC<SponsoredTravelKitSectionProps> = ({
  currentUser,
  language
}) => {
  const [kits, setKits] = useState<SponsoredTravelKit[]>(StorageService.getSponsoredKits());
  const [showSponsorModal, setShowSponsorModal] = useState(false);

  // Sponsor registration form
  const [brandName, setBrandName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [productType, setProductType] = useState('Sunscreen & Skincare');
  const [unitsPledged, setUnitsPledged] = useState(1000);
  const [sponsorSuccess, setSponsorSuccess] = useState(false);

  const handleClaim = (kitId: string) => {
    StorageService.claimSponsoredKit(kitId);
    setKits(StorageService.getSponsoredKits());
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSponsorSuccess(true);
    setTimeout(() => {
      setSponsorSuccess(false);
      setShowSponsorModal(false);
      alert('Sponsorship request submitted! TN Tourism partnership team will verify your catalog.');
    }, 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <Gift className="w-4 h-4 text-amber-400" />
            <span>EXCLUSIVE TRAVELER PERK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Free Sponsored Travel Kit & Brand Partnerships
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Complimentary premium travel kits for eligible bus and package travelers, sponsored by certified regional brands (Aavin Dairy, Khadi Kraft, Organic Tea Estates).
          </p>
        </div>

        <button
          onClick={() => setShowSponsorModal(true)}
          className="py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all flex items-center gap-2 shrink-0 shadow-md"
        >
          <Building className="w-4 h-4" />
          <span>Become a Brand Sponsor</span>
        </button>
      </div>

      {/* Traveler Kits Card List */}
      <div className="space-y-4">
        <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
          Your Eligible Sponsored Kits
        </h4>

        {kits.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/60 rounded-2xl border border-slate-800">
            No kits pending. Book a bus or tour package to unlock your complimentary travel kit!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kits.map((kit) => {
              const isClaimed = kit.status === 'claimed';

              return (
                <div
                  key={kit.id}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        BOOKING REF: {kit.bookingRef}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isClaimed
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {isClaimed ? 'CLAIMED AT COUNTER' : 'READY FOR PICKUP'}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-white">
                        Tamil Nadu Explorer Travel Kit
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Sponsored by: <span className="text-slate-300 font-semibold">{kit.sponsorName}</span>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                      <div className="font-semibold text-amber-300 text-[11px]">Included Travel Essentials:</div>
                      <div className="grid grid-cols-1 gap-1 text-[11px] text-slate-400">
                        {kit.kitItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                        <QrCode className="w-full h-full text-slate-950" />
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Show this unique QR verification code at authorized counter to collect your kit.
                        <div className="font-mono text-cyan-400 font-bold mt-0.5">{kit.qrCode}</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      disabled={isClaimed}
                      onClick={() => handleClaim(kit.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isClaimed
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md active:scale-[0.99] cursor-pointer'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{isClaimed ? 'Kit Claimed Successfully' : 'Mark Claimed at Helpdesk'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Become a Sponsor Modal */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Become a Brand Partner</h3>
              <button onClick={() => setShowSponsorModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Showcase your lifestyle, travel, or authentic regional food products to thousands of tourists traversing Tamil Nadu.
            </p>

            <form onSubmit={handleSponsorSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Nilgiri Herbals & Organic Teas"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Business Email</label>
                <input
                  type="email"
                  placeholder="partnerships@brand.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sponsorship Product Category</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option>Sunscreen & Skincare Travel Sachets</option>
                  <option>Traditional Millets & Herbal Snack Packs</option>
                  <option>Eco-Friendly Reusable Flasks</option>
                  <option>Hand Sanitizer & Wet Wipes</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Units Pledged for Distribution</label>
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={unitsPledged}
                  onChange={(e) => setUnitsPledged(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSponsorModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl font-bold bg-amber-400 text-slate-950 hover:bg-amber-300"
                >
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
