import React, { useState } from 'react';
import { Destination, Language, UserAccount } from '../types/tourism';
import { TN_DESTINATIONS } from '../data/tamilNaduData';
import { 
  PiggyBank, Calendar, IndianRupee, TrendingUp, CheckCircle2, 
  MapPin, Bus, Check, ArrowRight, ShieldCheck, Sparkles, AlertCircle
} from 'lucide-react';

interface MonthlySavingsCalculatorProps {
  currentUser: UserAccount | null;
  language: Language;
  onExploreDestinations?: () => void;
}

export const MonthlySavingsCalculator: React.FC<MonthlySavingsCalculatorProps> = ({
  currentUser,
  language,
  onExploreDestinations
}) => {
  // Input states
  const [monthlyContribution, setMonthlyContribution] = useState<number>(2000);
  const [targetMonthsCount, setTargetMonthsCount] = useState<number>(12);
  const [travelersCount, setTravelersCount] = useState<number>(2);
  const [transportMode, setTransportMode] = useState<'shared_bus' | 'private_tempo' | 'public_rail'>('shared_bus');
  
  // Tracked completed months for visual progress simulation
  const [completedMonths, setCompletedMonths] = useState<number>(4);

  // Calculations
  const totalSavedAccumulated = monthlyContribution * targetMonthsCount;
  const currentSavedToDate = monthlyContribution * completedMonths;
  const progressPercent = Math.min(Math.round((currentSavedToDate / totalSavedAccumulated) * 100), 100);
  const perPersonBudget = Math.round(totalSavedAccumulated / Math.max(travelersCount, 1));

  // Transport estimates
  let estTransportCost = 0;
  if (transportMode === 'shared_bus') estTransportCost = travelersCount * 1200;
  if (transportMode === 'private_tempo') estTransportCost = 7500;
  if (transportMode === 'public_rail') estTransportCost = travelersCount * 450;

  const budgetForStaysAndVisits = Math.max(totalSavedAccumulated - estTransportCost, 0);

  // Filter suitable destinations within accumulated budget
  const suitableDestinations = TN_DESTINATIONS.filter(
    d => (d.estimatedCostPerDay * 3 * travelersCount) <= totalSavedAccumulated
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
          <PiggyBank className="w-4 h-4 text-emerald-400" />
          <span>SMART FINANCIAL PLANNING</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Monthly Savings Trip Plans
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-xl">
          Save disciplined small amounts each month to fund memorable vacations across Tamil Nadu without credit burden or debt.
        </p>
      </div>

      {/* Interactive Controls & Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (Col 5) */}
        <div className="lg:col-span-5 bg-slate-950 p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-5 text-xs">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Customize Your Monthly Goal</span>
          </h4>

          <div>
            <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
              <span>Monthly Deposit (INR)</span>
              <span className="text-emerald-400 font-bold font-mono">₹{monthlyContribution.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={500}
              max={15000}
              step={500}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>₹500</span>
              <span>₹5,000</span>
              <span>₹15,000</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
              <span>Duration to Journey</span>
              <span className="text-amber-400 font-bold">{targetMonthsCount} Months</span>
            </div>
            <input
              type="range"
              min={3}
              max={24}
              step={1}
              value={targetMonthsCount}
              onChange={(e) => setTargetMonthsCount(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
              <span>3 Months</span>
              <span>12 Months</span>
              <span>24 Months</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Travelers Count</label>
              <input
                type="number"
                min={1}
                max={20}
                value={travelersCount}
                onChange={(e) => setTravelersCount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Transport Style</label>
              <select
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="shared_bus">Shared Tourist Bus</option>
                <option value="private_tempo">Private Tempo Traveller</option>
                <option value="public_rail">State Express / Rail</option>
              </select>
            </div>
          </div>

          {/* Savings Milestone Simulation */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">Goal Progress Simulator:</span>
              <span className="text-emerald-400 font-bold font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Paid: {completedMonths} Months (₹{currentSavedToDate.toLocaleString('en-IN')})</span>
              <button
                type="button"
                onClick={() => setCompletedMonths(prev => Math.min(prev + 1, targetMonthsCount))}
                className="text-amber-400 font-bold hover:underline"
              >
                + Mark Month Paid
              </button>
            </div>
          </div>
        </div>

        {/* Projection Results & Recommended Circuits (Col 7) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Calculation Projection */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 to-slate-950 border border-emerald-500/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs text-slate-400">Target Accumulated Travel Fund</div>
                <div className="text-3xl font-black text-emerald-400 font-mono mt-0.5">
                  ₹{totalSavedAccumulated.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs text-slate-400">Per Person Budget</div>
                <div className="text-lg font-bold text-amber-300 font-mono">
                  ₹{perPersonBudget.toLocaleString('en-IN')} / person
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400">Est. Transport</div>
                <div className="font-bold text-white mt-0.5">₹{estTransportCost.toLocaleString('en-IN')}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400">Stays & Sightseeing</div>
                <div className="font-bold text-white mt-0.5">₹{budgetForStaysAndVisits.toLocaleString('en-IN')}</div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400">Destinations Feasible</div>
                <div className="font-bold text-emerald-400 mt-0.5">{suitableDestinations.length} Places</div>
              </div>
            </div>
          </div>

          {/* Suitable Destinations within Accumulated Fund */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-slate-400 tracking-wider">
              Recommended Circuits Fully Covered by Your ₹{totalSavedAccumulated.toLocaleString('en-IN')} Fund
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suitableDestinations.slice(0, 4).map((dest) => (
                <div
                  key={dest.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={dest.images[0]}
                      alt={dest.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <div className="font-bold text-xs text-white truncate max-w-36">{dest.name}</div>
                      <div className="text-[11px] text-slate-400">{dest.district}</div>
                      <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                        3-Day Stay: ~₹{(dest.estimatedCostPerDay * 3 * travelersCount).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Affordable
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Savings Planning Disclaimer: This calculator helps design disciplined travel goals. Real transactions are processed through authorized payment gateways upon trip booking.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
