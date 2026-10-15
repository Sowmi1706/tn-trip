import { Booking, Destination, Review, UserAccount, UserPreferences, BeachChangingFacility, BusAgentQuotationRequest, SponsoredTravelKit } from '../types/tourism';
import { TN_DESTINATIONS, BEACH_FACILITIES } from '../data/tamilNaduData';

const STORAGE_KEYS = {
  CURRENT_USER: 'tn_stories_current_user',
  USERS_LIST: 'tn_stories_users_list',
  PREFERENCES: 'tn_stories_preferences',
  BOOKINGS: 'tn_stories_bookings',
  REVIEWS: 'tn_stories_reviews',
  OFFLINE_TRIPS: 'tn_stories_offline_trips',
  BEACH_BOOKINGS: 'tn_stories_beach_bookings',
  BUS_REQUESTS: 'tn_stories_bus_requests',
  SPONSORED_KITS: 'tn_stories_sponsored_kits',
  SPONSOR_PARTNERS: 'tn_stories_sponsor_partners',
  SPIN_HISTORY: 'tn_stories_spin_history',
  SPIN_CONFIG: 'tn_stories_spin_config',
  OFFER_CONFIG: 'tn_stories_offer_config',
  LANGUAGE: 'tn_stories_language'
};

export const CURRENT_TERMS_VERSION = 'v2.4-2026';

// Initial pre-seeded reviews
const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    destinationId: 'madurai',
    destinationName: 'Madurai (Meenakshi Amman City)',
    bookingReference: 'TN-MDU-8921',
    customerName: 'Karthik Subramanian',
    customerEmail: 'karthik.sub@gmail.com',
    rating: 5,
    writtenReview: 'The evening aarti at Meenakshi Amman Temple was truly transcendent. The Dravidian architecture and Thousand Pillar Hall take your breath away. Don’t miss the famous Jigarthanda!',
    tripDate: '2026-09-15',
    travelCompanion: 'Family',
    photoUrl: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-09-17T10:30:00Z',
    status: 'approved'
  },
  {
    id: 'rev-2',
    destinationId: 'ooty',
    destinationName: 'Ooty (Udhagamandalam)',
    bookingReference: 'TN-OTY-4102',
    customerName: 'Priya Ramesh',
    customerEmail: 'priya.r@outlook.com',
    rating: 5,
    writtenReview: 'Nilgiri toy train ride from Mettupalayam was an unforgettable experience. The cool weather and Pykara lake speedboating made our friends reunion fantastic.',
    tripDate: '2026-08-20',
    travelCompanion: 'Friends',
    photoUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-08-22T14:15:00Z',
    status: 'approved'
  },
  {
    id: 'rev-3',
    destinationId: 'keezhadi',
    destinationName: 'Keezhadi Archaeological Excavation & Museum',
    bookingReference: 'TN-KZD-1190',
    customerName: 'Dr. S. Anbazhagan',
    customerEmail: 'anbazhagan.hist@univ.edu',
    rating: 5,
    writtenReview: 'An eye-opening visit! Seeing Tamil-Brahmi inscriptions from 580 BCE in person along with the brick structures reveals the astonishing heritage of Tamil Nadu.',
    tripDate: '2026-07-10',
    travelCompanion: 'Solo',
    createdAt: '2026-07-12T09:00:00Z',
    status: 'approved'
  }
];

// Initial pre-seeded sample bookings
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-seed-1',
    referenceNumber: 'TN-MDU-8921',
    customerId: 'usr-demo-1',
    customerName: 'Sowmiya D',
    customerEmail: 'dsowmiyasowmiya72@gmail.com',
    bookingType: 'combined',
    destinationId: 'madurai',
    destinationName: 'Madurai (Meenakshi Amman City)',
    district: 'Madurai',
    travelDates: {
      start: '2026-11-10',
      end: '2026-11-12',
      daysCount: 3
    },
    travelerCount: 4,
    adults: 4,
    children: 0,
    companionType: 'family',
    arrangementPreference: 'package',
    selectedPackage: TN_DESTINATIONS.find(d => d.id === 'madurai')?.packages[0],
    caretakerService: 'guide',
    caretakerFee: 1500,
    originalPrice: 15900,
    discountPercentage: 10,
    discountAmount: 1500,
    taxesAndFees: 650,
    finalPrice: 15050,
    bookingStatus: 'confirmed',
    paymentStatus: 'paid',
    createdAt: '2026-10-01T11:20:00Z',
    qrCodeData: 'TN-BOOK-MDU-8921-CONFIRMED',
    isFirstBookingDiscountApplied: true,
    sponsoredKitEligible: true,
    sponsoredKitClaimed: false,
    offlineSaved: true
  }
];

export const StorageService = {
  // Current user
  getCurrentUser(): UserAccount | null {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: UserAccount | null) {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      // update in users list too
      const users = this.getUsersList();
      const idx = users.findIndex(u => u.id === user.id || u.email === user.email);
      if (idx >= 0) {
        users[idx] = user;
      } else {
        users.push(user);
      }
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
    }
  },

  getUsersList(): UserAccount[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    if (!raw) {
      const defaultUser: UserAccount = {
        id: 'usr-demo-1',
        fullName: 'Sowmiya D',
        email: 'dsowmiyasowmiya72@gmail.com',
        username: 'sowmiya72',
        phone: '+91 98401 23456',
        role: 'customer',
        hasAcceptedTerms: true,
        termsAcceptedVersion: CURRENT_TERMS_VERSION,
        termsAcceptedAt: new Date().toISOString(),
        bookingsCount: 1,
        totalSavedINR: 1500,
        walletCoupons: [
          {
            id: 'c-welcome',
            code: 'TN-WELCOME-10',
            amount: 500,
            description: 'Welcome to TN Stories first trip discount voucher',
            expiresAt: '2026-12-31',
            isUsed: false
          }
        ]
      };
      const adminUser: UserAccount = {
        id: 'usr-admin-1',
        fullName: 'Tamil Nadu Tourism Admin',
        email: 'admin@tntourism.gov.in',
        username: 'admin',
        phone: '+91 44 2530 0000',
        role: 'admin',
        hasAcceptedTerms: true,
        termsAcceptedVersion: CURRENT_TERMS_VERSION,
        termsAcceptedAt: new Date().toISOString(),
        bookingsCount: 0,
        totalSavedINR: 0,
        walletCoupons: []
      };
      const initial = [defaultUser, adminUser];
      localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  acceptTerms(userId: string): UserAccount | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;
    const updated: UserAccount = {
      ...currentUser,
      hasAcceptedTerms: true,
      termsAcceptedVersion: CURRENT_TERMS_VERSION,
      termsAcceptedAt: new Date().toISOString()
    };
    this.setCurrentUser(updated);
    return updated;
  },

  // User preferences
  getPreferences(): UserPreferences | null {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  savePreferences(prefs: UserPreferences) {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  },

  // Bookings
  getBookings(): Booking[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_BOOKINGS;
    }
  },

  saveBooking(booking: Booking): Booking {
    const list = this.getBookings();
    list.unshift(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));

    // Update user bookings count
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === booking.customerId) {
      currentUser.bookingsCount += 1;
      currentUser.totalSavedINR += booking.discountAmount;
      this.setCurrentUser(currentUser);
    }

    // Auto-create sponsored kit eligibility for package/bus/combined bookings
    if (booking.sponsoredKitEligible) {
      this.createSponsoredKit(booking);
    }

    return booking;
  },

  updateBookingStatus(bookingId: string, status: 'confirmed' | 'pending' | 'cancelled', paymentStatus?: 'paid' | 'pending_at_arrival'): boolean {
    const list = this.getBookings();
    const idx = list.findIndex(b => b.id === bookingId);
    if (idx >= 0) {
      list[idx].bookingStatus = status;
      if (paymentStatus) {
        list[idx].paymentStatus = paymentStatus;
      }
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(list));
      return true;
    }
    return false;
  },

  // Check first-booking discount eligibility
  isFirstBookingEligible(customerId: string): boolean {
    const bookings = this.getBookings();
    const customerConfirmedBookings = bookings.filter(
      b => b.customerId === customerId && (b.bookingStatus === 'confirmed' || b.isFirstBookingDiscountApplied)
    );
    return customerConfirmedBookings.length === 0;
  },

  // Daily Spin & Win
  getSpinConfig() {
    const raw = localStorage.getItem(STORAGE_KEYS.SPIN_CONFIG);
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {
      active: true,
      dailyBudgetINR: 5000,
      monthlyBudgetINR: 100000,
      probabilities: [
        { id: 'better_luck', label: 'Better Luck Next Time', type: 'better_luck', probability: 50, color: '#f59e0b', value: 'None' },
        { id: 'try_again', label: 'Try Again Tomorrow', type: 'try_again', probability: 25, color: '#6366f1', value: 'None' },
        { id: 'no_reward', label: 'No Reward Today', type: 'no_reward', probability: 15, color: '#94a3b8', value: 'None' },
        { id: 'coupon_20', label: '₹20 Tourism Coupon', type: 'coupon', amount: 20, probability: 5, color: '#10b981', value: '₹20 OFF' },
        { id: 'coupon_50', label: '₹50 Tourism Coupon', type: 'coupon', amount: 50, probability: 3, color: '#06b6d4', value: '₹50 OFF' },
        { id: 'coupon_100', label: '₹100 Tourism Coupon', type: 'coupon', amount: 100, probability: 1.5, color: '#8b5cf6', value: '₹100 OFF' },
        { id: 'special_gift', label: 'Special Tourism Gift', type: 'gift', amount: 250, probability: 0.5, color: '#ec4899', value: 'Special Kit Gift' }
      ]
    };
  },

  saveSpinConfig(config: any) {
    localStorage.setItem(STORAGE_KEYS.SPIN_CONFIG, JSON.stringify(config));
  },

  // Calculate IST date key (YYYY-MM-DD in UTC+5:30)
  getISTDateKey(): string {
    const now = new Date();
    // Offset +5.5 hours in milliseconds
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(now.getTime() + istOffsetMs);
    return istDate.toISOString().split('T')[0];
  },

  getSpinHistory(): Array<{ userId: string; date: string; reward: string; couponCode?: string }> {
    const raw = localStorage.getItem(STORAGE_KEYS.SPIN_HISTORY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  canUserSpinToday(userId: string): { canSpin: boolean; nextEligibleAtIST: string } {
    const istToday = this.getISTDateKey();
    const history = this.getSpinHistory();
    const alreadySpun = history.some(h => h.userId === userId && h.date === istToday);

    // Calculate tomorrow 12:00 AM IST
    const now = new Date();
    const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const tomorrowIST = new Date(istNow);
    tomorrowIST.setUTCDate(tomorrowIST.getUTCDate() + 1);
    tomorrowIST.setUTCHours(0, 0, 0, 0);

    return {
      canSpin: !alreadySpun,
      nextEligibleAtIST: '12:00 AM IST tomorrow'
    };
  },

  executeDailySpin(userId: string): { rewardIndex: number; reward: any; couponCode?: string } {
    const eligibility = this.canUserSpinToday(userId);
    if (!eligibility.canSpin) {
      throw new Error('You have already used your daily spin today. Please come back after 12:00 AM IST.');
    }

    const config = this.getSpinConfig();
    const items = config.probabilities;

    // Secure weighted random selection
    const rand = Math.random() * 100;
    let accumulated = 0;
    let selectedIndex = 0;

    for (let i = 0; i < items.length; i++) {
      accumulated += items[i].probability;
      if (rand <= accumulated) {
        selectedIndex = i;
        break;
      }
    }

    const selectedReward = items[selectedIndex];
    let couponCode: string | undefined = undefined;

    if (selectedReward.type === 'coupon' || selectedReward.type === 'gift') {
      couponCode = `TN-${selectedReward.type.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      // Save coupon to user's wallet
      const user = this.getCurrentUser();
      if (user) {
        user.walletCoupons.push({
          id: `spin-${Date.now()}`,
          code: couponCode,
          amount: selectedReward.amount || 50,
          description: `Daily Spin Reward: ${selectedReward.label}`,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          isUsed: false
        });
        this.setCurrentUser(user);
      }
    }

    // Record in spin history
    const history = this.getSpinHistory();
    history.unshift({
      userId,
      date: this.getISTDateKey(),
      reward: selectedReward.label,
      couponCode
    });
    localStorage.setItem(STORAGE_KEYS.SPIN_HISTORY, JSON.stringify(history));

    return {
      rewardIndex: selectedIndex,
      reward: selectedReward,
      couponCode
    };
  },

  // Offline Trip Mode
  getOfflineTrips(): any[] {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_TRIPS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveTripOffline(booking: Booking, destination: Destination): { sizeMB: number; success: boolean } {
    const offlineList = this.getOfflineTrips();
    const exists = offlineList.findIndex(t => t.bookingId === booking.id);
    const offlinePackage = {
      bookingId: booking.id,
      savedAt: new Date().toISOString(),
      booking,
      destination,
      emergencySOS: [
        { label: 'Police Emergency Assistance', number: '112' },
        { label: 'Ambulance & Medical Emergency', number: '108' },
        { label: 'Tamil Nadu Tourist Police Helpline', number: '1363' },
        { label: 'Women Safety Helpline', number: '1091' },
        { label: 'Disaster Management Helpline', number: '1077' },
        { label: `${destination.district} District Hospital`, number: '+91 44 2530 5000' }
      ],
      offlineItinerary: [
        { day: 1, title: 'Arrival & Iconic Landmark Exploration', timing: '9:00 AM - 1:00 PM', desc: `Explore prime sites around ${destination.name}` },
        { day: 1, title: 'Heritage & Local Culture Trail', timing: '3:30 PM - 7:00 PM', desc: 'Visit famous viewpoints, local markets, and cultural stalls' },
        { day: 2, title: 'Sunrise Viewpoint & Guided Activity', timing: '5:45 AM - 11:30 AM', desc: 'Scenic morning excursion and peaceful photography' }
      ],
      mockStorageSizeMB: 14.8
    };

    if (exists >= 0) {
      offlineList[exists] = offlinePackage;
    } else {
      offlineList.push(offlinePackage);
    }

    localStorage.setItem(STORAGE_KEYS.OFFLINE_TRIPS, JSON.stringify(offlineList));
    return { sizeMB: 14.8, success: true };
  },

  deleteOfflineTrip(bookingId: string) {
    const list = this.getOfflineTrips().filter(t => t.bookingId !== bookingId);
    localStorage.setItem(STORAGE_KEYS.OFFLINE_TRIPS, JSON.stringify(list));
  },

  clearAllOfflineData() {
    localStorage.removeItem(STORAGE_KEYS.OFFLINE_TRIPS);
  },

  // Reviews
  getReviews(): Review[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_REVIEWS;
    }
  },

  addReview(review: Omit<Review, 'id' | 'createdAt' | 'status'>): Review {
    const reviews = this.getReviews();
    // Prevent duplicate reviews for same booking
    if (review.bookingReference) {
      const existing = reviews.find(r => r.bookingReference === review.bookingReference);
      if (existing) {
        throw new Error('You have already submitted a review for this booking. You can edit your existing review.');
      }
    }

    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'approved' // auto-approve in demo or can be moderated
    };

    reviews.unshift(newRev);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    return newRev;
  },

  updateReview(reviewId: string, updatedText: string, rating: number): boolean {
    const reviews = this.getReviews();
    const idx = reviews.findIndex(r => r.id === reviewId);
    if (idx >= 0) {
      reviews[idx].writtenReview = updatedText;
      reviews[idx].rating = rating;
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
      return true;
    }
    return false;
  },

  deleteReview(reviewId: string): boolean {
    const reviews = this.getReviews();
    const filtered = reviews.filter(r => r.id !== reviewId);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(filtered));
    return true;
  },

  // Beach changing rooms
  getBeachFacilities(): BeachChangingFacility[] {
    return BEACH_FACILITIES;
  },

  getBeachBookings(): any[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BEACH_BOOKINGS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveBeachBooking(booking: any) {
    const list = this.getBeachBookings();
    list.unshift(booking);
    localStorage.setItem(STORAGE_KEYS.BEACH_BOOKINGS, JSON.stringify(list));
  },

  // Sponsored travel kit
  getSponsoredKits(): SponsoredTravelKit[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SPONSORED_KITS);
    if (!raw) {
      const initial: SponsoredTravelKit[] = [
        {
          id: 'kit-101',
          bookingRef: 'TN-MDU-8921',
          customerName: 'Sowmiya D',
          sponsorName: 'Tamil Nadu Tourism Development & Aavin Dairy',
          qrCode: 'TN-KIT-CLAIM-8921',
          status: 'ready_for_pickup',
          kitItems: ['Eco-friendly Water Flask', 'Herbal Sunscreen Lotion (SPF 50)', 'Dry Fruit Energy Pack', 'Tamil Nadu Heritage Travel Guide', 'Microfiber Travel Towel'],
          pickupLocations: ['Madurai Central Bus Terminal Lounge', 'Madurai Railway Junction Tourist Helpdesk'],
          issuedDate: '2026-10-01'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.SPONSORED_KITS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  createSponsoredKit(booking: Booking) {
    const kits = this.getSponsoredKits();
    const newKit: SponsoredTravelKit = {
      id: `kit-${Date.now()}`,
      bookingRef: booking.referenceNumber,
      customerName: booking.customerName,
      sponsorName: 'Tamil Nadu Tourism Board & Travel Co-Sponsors',
      qrCode: `TN-KIT-${booking.referenceNumber}`,
      status: 'ready_for_pickup',
      kitItems: [
        'Stainless Steel Reusable Water Bottle',
        'Herbal Hand Sanitizer & Sunscreen',
        'Traditional Millet Snack & Electrolytes',
        'Pocket Map of Tamil Nadu Tourist Circuits',
        'First Aid Emergency Sachet'
      ],
      pickupLocations: [
        `Tourist Assistance Counter, ${booking.destinationName}`,
        'Authorized Boarding Bus Point'
      ],
      issuedDate: new Date().toISOString().split('T')[0]
    };
    kits.unshift(newKit);
    localStorage.setItem(STORAGE_KEYS.SPONSORED_KITS, JSON.stringify(kits));
  },

  claimSponsoredKit(kitId: string) {
    const kits = this.getSponsoredKits();
    const idx = kits.findIndex(k => k.id === kitId);
    if (idx >= 0) {
      kits[idx].status = 'claimed';
      localStorage.setItem(STORAGE_KEYS.SPONSORED_KITS, JSON.stringify(kits));
      return true;
    }
    return false;
  },

  // Bus agent quotation requests
  getBusRequests(): BusAgentQuotationRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BUS_REQUESTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  submitBusRequest(req: Omit<BusAgentQuotationRequest, 'id' | 'referenceNumber' | 'createdAt' | 'status'>): BusAgentQuotationRequest {
    const list = this.getBusRequests();
    const newReq: BusAgentQuotationRequest = {
      ...req,
      id: `bus-req-${Date.now()}`,
      referenceNumber: `TN-BUS-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: 'quote_sent'
    };
    list.unshift(newReq);
    localStorage.setItem(STORAGE_KEYS.BUS_REQUESTS, JSON.stringify(list));
    return newReq;
  },

  // First Booking Offer Config
  getOfferConfig() {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFER_CONFIG);
    if (raw) {
      try { return JSON.parse(raw); } catch {}
    }
    return {
      active: true,
      discountPercentage: 10,
      minBookingAmountINR: 3000,
      maxDiscountAmountINR: 1500,
      validUntil: '2027-12-31'
    };
  },

  saveOfferConfig(config: any) {
    localStorage.setItem(STORAGE_KEYS.OFFER_CONFIG, JSON.stringify(config));
  }
};
