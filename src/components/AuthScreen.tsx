import React, { useState } from 'react';
import { UserAccount, Language } from '../types/tourism';
import { StorageService } from '../services/storageService';
import { TRANSLATIONS } from '../data/translations';
import { Lock, Mail, User, Eye, EyeOff, ShieldCheck, ArrowRight, Compass, KeyRound } from 'lucide-react';

interface AuthScreenProps {
  language: Language;
  onLoginSuccess: (user: UserAccount) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ language, onLoginSuccess }) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const t = TRANSLATIONS[language];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!emailOrUsername.trim() || !password.trim()) {
      setErrorMessage('Please enter your email/username and password.');
      return;
    }

    const users = StorageService.getUsersList();
    const cleanInput = emailOrUsername.trim().toLowerCase();
    const found = users.find(
      u => u.email.toLowerCase() === cleanInput || u.username.toLowerCase() === cleanInput
    );

    if (found) {
      StorageService.setCurrentUser(found);
      onLoginSuccess(found);
    } else {
      // Allow dynamic creation if not found for seamless trial, or create new user
      const newUser: UserAccount = {
        id: `usr-${Date.now()}`,
        fullName: cleanInput.includes('@') ? cleanInput.split('@')[0] : cleanInput,
        email: cleanInput.includes('@') ? cleanInput : `${cleanInput}@tntraveler.com`,
        username: cleanInput.includes('@') ? cleanInput.split('@')[0] : cleanInput,
        role: 'customer',
        hasAcceptedTerms: false,
        bookingsCount: 0,
        totalSavedINR: 0,
        walletCoupons: [
          {
            id: 'c-new',
            code: 'TN-WELCOME-10',
            amount: 500,
            description: '10% Welcome Discount for first booking',
            expiresAt: '2026-12-31',
            isUsed: false
          }
        ]
      };
      StorageService.setCurrentUser(newUser);
      onLoginSuccess(newUser);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !username.trim() || !password) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const users = StorageService.getUsersList();
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      setErrorMessage('An account with this email already exists.');
      return;
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim().toLowerCase(),
      role: 'customer',
      hasAcceptedTerms: false, // will trigger mandatory terms modal
      bookingsCount: 0,
      totalSavedINR: 0,
      walletCoupons: [
        {
          id: 'c-welcome-new',
          code: 'TN-WELCOME-10',
          amount: 500,
          description: '10% Welcome Voucher for your first booking',
          expiresAt: '2026-12-31',
          isUsed: false
        }
      ]
    };

    StorageService.setCurrentUser(newUser);
    onLoginSuccess(newUser);
  };

  const quickDemoLogin = (role: 'customer' | 'admin') => {
    const users = StorageService.getUsersList();
    const target = role === 'admin'
      ? users.find(u => u.role === 'admin')
      : users.find(u => u.role === 'customer');

    if (target) {
      StorageService.setCurrentUser(target);
      onLoginSuccess(target);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-slate-950 overflow-hidden">
      {/* Background with Madurai Meenakshi & Tamil Nadu Heritage aesthetics */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-xs"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1920&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/90" />

      <div className="relative z-10 w-full max-w-md mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>TN STORIES AI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isRegisterMode ? 'Join TN Stories Tourism' : 'Welcome Back, Traveler'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegisterMode
              ? 'Create your account to unlock personalized Tamil Nadu trips & 10% first booking offer.'
              : 'Sign in to access your itineraries, bookings, and daily spin rewards.'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {!isRegisterMode ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email or Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="e.g. dsowmiyasowmiya72@gmail.com"
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.99] cursor-pointer"
              >
                <span>{t.login}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sowmiya D"
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sowmiya@example.com"
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Choose Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. sowmiya72"
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.99] cursor-pointer"
              >
                <span>{t.register}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Toggle Login / Register */}
          <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800">
            {isRegisterMode ? (
              <span>
                Already have an account?{' '}
                <button
                  onClick={() => setIsRegisterMode(false)}
                  className="font-bold text-amber-400 hover:underline"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New to TN Stories?{' '}
                <button
                  onClick={() => setIsRegisterMode(true)}
                  className="font-bold text-amber-400 hover:underline"
                >
                  Create New Account
                </button>
              </span>
            )}
          </div>

          {/* Quick Demo Credentials helper */}
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span>Quick Test Access:</span>
              <span className="text-[10px] text-amber-400/80">Click to auto-login</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => quickDemoLogin('customer')}
                className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/80 hover:bg-slate-800 text-slate-300 text-left transition-colors"
              >
                <div className="font-semibold text-white">Sowmiya D</div>
                <div className="text-[10px] text-slate-400 truncate">Customer • 1st Booking</div>
              </button>
              <button
                type="button"
                onClick={() => quickDemoLogin('admin')}
                className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-left transition-colors"
              >
                <div className="font-semibold text-white">Admin Officer</div>
                <div className="text-[10px] text-amber-400">Full Portal Access</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Reset Password</h3>
                <p className="text-xs text-slate-400">Enter your email to receive recovery instructions.</p>
              </div>
            </div>
            <input
              type="email"
              placeholder="Enter your registered email"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Password reset link sent to your email.');
                  setShowForgotModal(false);
                }}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-400 text-slate-950 hover:bg-amber-300"
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
