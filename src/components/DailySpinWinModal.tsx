import React, { useState, useEffect } from 'react';
import { UserAccount, Language } from '../types/tourism';
import { StorageService } from '../services/storageService';
import { 
  X, Sparkles, Gift, Clock, Award, History, AlertCircle, 
  HelpCircle, CheckCircle2, Ticket, ShieldCheck, ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailySpinWinModalProps {
  currentUser: UserAccount | null;
  language: Language;
  onClose: () => void;
  onCouponIssued?: (couponCode: string) => void;
}

export const DailySpinWinModal: React.FC<DailySpinWinModalProps> = ({
  currentUser,
  language,
  onClose,
  onCouponIssued
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [spinResult, setSpinResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'wheel' | 'wallet' | 'history' | 'rules'>('wheel');

  const config = StorageService.getSpinConfig();
  const items = config.probabilities;
  const numSegments = items.length;
  const segmentAngle = 360 / numSegments;

  // Spin history & user eligibility
  const [eligibility, setEligibility] = useState(
    currentUser ? StorageService.canUserSpinToday(currentUser.id) : { canSpin: false, nextEligibleAtIST: 'Please log in' }
  );
  const [userCoupons, setUserCoupons] = useState(currentUser?.walletCoupons || []);
  const [historyList, setHistoryList] = useState(StorageService.getSpinHistory());

  // Countdown timer calculation to next 12:00 AM IST
  const [countdownText, setCountdownText] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // IST is UTC+5.5
      const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
      const tomorrowIST = new Date(istTime);
      tomorrowIST.setUTCDate(tomorrowIST.getUTCDate() + 1);
      tomorrowIST.setUTCHours(0, 0, 0, 0);

      const diffMs = tomorrowIST.getTime() - istTime.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setCountdownText(`${hours}h ${mins}m ${secs}s until reset (12:00 AM IST)`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSpinClick = () => {
    setErrorMessage('');
    setSpinResult(null);

    if (!currentUser) {
      setErrorMessage('Please sign in to participate in the Daily Spin & Win.');
      return;
    }

    if (!eligibility.canSpin) {
      setErrorMessage('You have already used your free spin today. Reset takes place at 12:00 AM IST.');
      return;
    }

    try {
      setIsSpinning(true);
      // Execute spin on service layer
      const outcome = StorageService.executeDailySpin(currentUser.id);

      // Calculate degrees for pointer at top (270 degrees)
      const targetSegmentCenter = outcome.rewardIndex * segmentAngle + (segmentAngle / 2);
      // Extra spins (e.g. 5 full rotations = 1800 deg)
      const extraSpins = 360 * 5;
      const finalAngle = extraSpins + (360 - targetSegmentCenter);

      setWheelRotation(finalAngle);

      // Reveal result after 4s animation
      setTimeout(() => {
        setIsSpinning(false);
        setSpinResult(outcome);
        setEligibility(StorageService.canUserSpinToday(currentUser.id));
        setHistoryList(StorageService.getSpinHistory());

        const refreshedUser = StorageService.getCurrentUser();
        if (refreshedUser) {
          setUserCoupons(refreshedUser.walletCoupons);
        }

        if (outcome.reward.type === 'coupon' || outcome.reward.type === 'gift') {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 }
          });
          if (outcome.couponCode && onCouponIssued) {
            onCouponIssued(outcome.couponCode);
          }
        }
      }, 4000);
    } catch (err: any) {
      setIsSpinning(false);
      setErrorMessage(err.message || 'Spin failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-500/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-black">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>Daily Spin & Win Rewards</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold uppercase">
                  1 Free Daily Spin
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Win travel coupons, gift vouchers, and discounts for your Tamil Nadu trips.
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-5 gap-2 pt-2">
          {[
            { id: 'wheel', label: 'Spin Wheel', icon: Gift },
            { id: 'wallet', label: `My Coupons (${userCoupons.length})`, icon: Ticket },
            { id: 'history', label: 'History', icon: History },
            { id: 'rules', label: 'Probabilities & Rules', icon: HelpCircle }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-2.5 px-3 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-sm text-slate-200">
          {/* TAB 1: THE SPINNING WHEEL */}
          {activeTab === 'wheel' && (
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Status & Countdown banner */}
              <div className="w-full text-center">
                {eligibility.canSpin ? (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Your daily spin is ready! Spin the wheel below.</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Next spin unlocked: {countdownText}</span>
                  </div>
                )}
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs text-center w-full">
                  {errorMessage}
                </div>
              )}

              {/* Graphical Wheel Representation */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                {/* Fixed Pointer at Top */}
                <div className="absolute -top-3 z-30 flex flex-col items-center">
                  <div className="w-5 h-7 bg-amber-400 clip-triangle shadow-lg shadow-amber-500/50"
                    style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}
                  />
                  <div className="w-3 h-3 rounded-full bg-amber-300 border-2 border-slate-950 -mt-2" />
                </div>

                {/* Rotating SVG Wheel */}
                <div
                  className="w-full h-full rounded-full border-4 border-amber-400/80 shadow-2xl relative transition-transform duration-[4000ms] ease-out overflow-hidden"
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    transitionTimingFunction: 'cubic-bezier(0.15, 0.9, 0.25, 1)'
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {items.map((item: any, idx: number) => {
                      const startAngle = (idx * segmentAngle * Math.PI) / 180;
                      const endAngle = (((idx + 1) * segmentAngle) * Math.PI) / 180;
                      const x1 = 50 + 50 * Math.cos(startAngle);
                      const y1 = 50 + 50 * Math.sin(startAngle);
                      const x2 = 50 + 50 * Math.cos(endAngle);
                      const y2 = 50 + 50 * Math.sin(endAngle);

                      const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                      return (
                        <path
                          key={item.id}
                          d={pathData}
                          fill={item.color}
                          stroke="#0f172a"
                          strokeWidth="0.75"
                        />
                      );
                    })}
                  </svg>

                  {/* Wheel Center Button / Emblem */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-slate-950 border-4 border-amber-400 shadow-xl flex items-center justify-center text-amber-400 font-black text-xs text-center leading-tight">
                      TN<br/>SPIN
                    </div>
                  </div>
                </div>
              </div>

              {/* Spin Result Display */}
              {spinResult && (
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-center space-y-2 w-full animate-fade-in">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                    Spin Result
                  </div>
                  <div className="text-lg font-black text-white">
                    {spinResult.reward.label}
                  </div>
                  {spinResult.couponCode ? (
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/40 space-y-1">
                      <div className="text-xs text-amber-300 font-semibold">Coupon Added to Your Wallet!</div>
                      <div className="font-mono text-base font-bold text-white tracking-widest">{spinResult.couponCode}</div>
                      <div className="text-[10px] text-slate-400">Use this code at checkout to claim your discount.</div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      No coupon today, but you can try again tomorrow at 12:00 AM IST!
                    </p>
                  )}
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                disabled={isSpinning || !eligibility.canSpin}
                onClick={handleSpinClick}
                className={`w-full py-4 px-6 rounded-2xl text-sm font-extrabold uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 ${
                  isSpinning
                    ? 'bg-amber-600 text-slate-950 animate-pulse cursor-wait'
                    : eligibility.canSpin
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/30 active:scale-[0.99] cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                <span>{isSpinning ? 'SPINNING THE WHEEL...' : eligibility.canSpin ? 'SPIN NOW FOR FREE' : 'ALREADY SPUN TODAY'}</span>
              </button>
            </div>
          )}

          {/* TAB 2: MY REWARDS / COUPONS */}
          {activeTab === 'wallet' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-base">Your Active Tourism Coupons</h4>
                  <p className="text-xs text-slate-400">Automatically valid during trip booking checkout</p>
                </div>
              </div>

              {userCoupons.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-800">
                  No coupons in your wallet yet. Spin the wheel to win coupons!
                </div>
              ) : (
                <div className="space-y-3">
                  {userCoupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="p-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-amber-500/30 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 text-sm">{coupon.code}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                            ₹{coupon.amount} OFF
                          </span>
                        </div>
                        <div className="text-xs text-slate-300">{coupon.description}</div>
                        <div className="text-[10px] text-slate-500">Expires: {coupon.expiresAt}</div>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(coupon.code);
                          alert(`Coupon ${coupon.code} copied!`);
                        }}
                        className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                      >
                        Copy Code
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-base">Recent Spin History</h4>
              {historyList.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-800/30 rounded-2xl">
                  No spin attempts recorded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {historyList.map((h, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{h.reward}</div>
                        <div className="text-[10px] text-slate-400">Date: {h.date} (IST)</div>
                      </div>
                      {h.couponCode && (
                        <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded">
                          {h.couponCode}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROBABILITIES & RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5">
                <div className="font-bold text-amber-300 text-sm">Official Probability Table</div>
                <p className="text-slate-400 text-[11px]">
                  TN Stories follows full transparency rules. Rewards are chance-based and determined via cryptographically sound pseudo-random algorithms.
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-slate-300">
                    <tr>
                      <th className="p-3">Outcome</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Probability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {items.map((it: any) => (
                      <tr key={it.id} className="hover:bg-slate-800/30">
                        <td className="p-3 font-semibold text-white flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: it.color }} />
                          <span>{it.label}</span>
                        </td>
                        <td className="p-3 text-slate-400 capitalize">
                          {it.type.replace('_', ' ')}
                        </td>
                        <td className="p-3 text-right font-mono text-amber-400 font-bold">
                          {it.probability}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 space-y-1 text-[11px] text-slate-400">
                <div>• Exactly 1 spin per authenticated user per day.</div>
                <div>• Eligibility resets daily at 12:00 AM Indian Standard Time (IST).</div>
                <div>• Non-winning outcomes total 90% and rewards total 10%.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
