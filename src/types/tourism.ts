export type Language = 'en' | 'ta' | 'hi' | 'ml' | 'te';

export type AlertLevel = 'green' | 'yellow' | 'orange' | 'red';

export type TravelGroupType = 'solo' | 'family' | 'friends' | 'couple' | 'group';

export type TravelCategory =
  | 'temple_spiritual'
  | 'historical_heritage'
  | 'nature_wildlife'
  | 'photography_visual'
  | 'food_culture'
  | 'educational_research'
  | 'general_tourist';

export type TripPurpose =
  | 'devotional'
  | 'temple_tour'
  | 'nature_hills'
  | 'beaches_coastal'
  | 'adventure'
  | 'relaxation'
  | 'food_culture'
  | 'heritage_research'
  | 'photography'
  | 'shopping'
  | 'entertainment_friends'
  | 'wildlife_eco'
  | 'weekend_getaway'
  | 'educational_student'
  | 'festival_special';

export type BudgetTier = 'budget' | 'standard' | 'premium' | 'luxury' | 'not_sure';
export type PlanningStyle = 'planned' | 'unplanned' | 'flexible';

export interface UserPreferences {
  groupType: TravelGroupType;
  familyDetails?: {
    adults: number;
    children: number;
    childAgeGroups: string;
    accommodationPreference: string;
  };
  friendsDetails?: {
    count: number;
    activities: string[];
    nightlifeLevel: string;
    interests: string[];
  };
  travelerCategories: TravelCategory[];
  tripPurpose: TripPurpose;
  budgetTier: BudgetTier;
  approxBudgetINR: number;
  sharedBudgetPerPerson?: number;
  planningStyle: PlanningStyle;
  plannedDetails?: {
    startDate: string;
    returnDate: string;
    daysCount: number;
    startingLocation: string;
    vehiclePreference: string;
    requestBusQuotation: boolean;
  };
  unplannedDetails?: {
    currentLocation: string;
    availableTimeHours: number;
    currentBudgetINR: number;
    preferredDistanceKm: number;
    sameDayTrip: boolean;
    needsImmediateVehicle: boolean;
  };
}

export interface TourPackage {
  id: string;
  title: string;
  duration: string;
  pricePerPerson: number;
  inclusions: string[];
  highlights: string[];
  suitableFor: string[];
  vehicleIncluded: string;
  availableSeats?: number;
}

export interface Destination {
  id: string;
  name: string;
  tamilName?: string;
  district: string;
  category: 'hill_station' | 'temple' | 'heritage' | 'beach' | 'waterfall' | 'wildlife' | 'hidden_spot' | 'food_culture' | 'historical_site';
  shortDescription: string;
  fullDescription: string;
  images: string[];
  popularAttractions: string[];
  estimatedCostPerDay: number;
  packages: TourPackage[];
  averageRating: number;
  reviewCount: number;
  location: string;
  coordinates: { lat: number; lng: number };
  isHiddenSpot?: boolean;
  isPopular?: boolean;
  isTrending?: boolean;
  isWeekendFavorite?: boolean;
  isBudgetFriendly?: boolean;
  suitableGroupTypes: TravelGroupType[];
  suitableCategories: TravelCategory[];
  // Temple specific info
  templeInfo?: {
    deity: string;
    openingHours: string;
    poojaTimings: string;
    dressCode: string;
    visitorGuidelines: string;
    nearbyVegEateries: string[];
  };
  // Historical / Archaeological specific info
  heritageInfo?: {
    timeline: string;
    archaeologicalSignificance: string;
    excavationDetails?: string;
    museumInfo?: string;
    photographyPermit: string;
    researchContacts?: string;
  };
  // Weather & Danger zone status
  weather: {
    tempC: number;
    condition: string;
    rainfallMm: number;
    windSpeedKmh: number;
    alertLevel: AlertLevel;
    alertTitle: string;
    alertDetails: string;
    bookingRestricted: boolean;
    safeAlternativeDestinations?: string[];
  };
}

export interface Review {
  id: string;
  destinationId: string;
  destinationName: string;
  bookingReference?: string;
  customerName: string;
  customerEmail: string;
  rating: number; // 1-5
  writtenReview: string;
  tripDate: string;
  travelCompanion: string;
  photoUrl?: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'reported';
}

export interface Booking {
  id: string;
  referenceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  bookingType: 'combined' | 'hotel_only' | 'travel_only';
  destinationId: string;
  destinationName: string;
  district: string;
  travelDates: {
    start: string;
    end: string;
    daysCount: number;
  };
  travelerCount: number;
  adults: number;
  children: number;
  companionType: TravelGroupType;
  arrangementPreference: 'package' | 'custom';
  selectedPackage?: TourPackage;
  selectedServices?: {
    accommodation?: {
      name: string;
      roomType: string;
      costPerNight: number;
      nights: number;
    };
    transportation?: {
      vehicleType: string;
      pickupLocation: string;
      cost: number;
    };
    activities?: Array<{ name: string; cost: number }>;
  };
  caretakerService: 'none' | 'caretaker' | 'guide' | 'both';
  caretakerFee: number;
  originalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  taxesAndFees: number;
  finalPrice: number;
  bookingStatus: 'confirmed' | 'pending' | 'cancelled';
  paymentStatus: 'paid' | 'pending_at_arrival' | 'pending_verification';
  createdAt: string;
  qrCodeData: string;
  isFirstBookingDiscountApplied: boolean;
  sponsoredKitEligible: boolean;
  sponsoredKitClaimed: boolean;
  offlineSaved?: boolean;
}

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  username: string;
  phone?: string;
  role: 'customer' | 'admin' | 'sponsor_partner' | 'beach_partner';
  hasAcceptedTerms: boolean;
  termsAcceptedVersion?: string;
  termsAcceptedAt?: string;
  bookingsCount: number;
  totalSavedINR: number;
  walletCoupons: Array<{
    id: string;
    code: string;
    amount: number;
    description: string;
    expiresAt: string;
    isUsed: boolean;
  }>;
}

export interface BeachChangingFacility {
  id: string;
  beachName: string;
  facilityName: string;
  address: string;
  distanceFromShoreMeters: number;
  rating: number;
  reviewCount: number;
  photos: string[];
  amenities: {
    privateChangingRoomsMen: boolean;
    privateChangingRoomsWomen: boolean;
    familyChangingRooms: boolean;
    hotShowers: boolean;
    restrooms: boolean;
    secureLockers: boolean;
    luggageStorage: boolean;
    babyChangingRoom: boolean;
    freshTowelsAvailable: boolean;
    coldBeveragesAndSnacks: boolean;
  };
  slotPricing: {
    baseBookingFee: number; // Always 0 per Free Booking Policy
    lockerCharge: number;
    showerCharge: number;
    towelRental: number;
  };
  isVerified: boolean;
  openHours: string;
}

export interface BusAgentQuotationRequest {
  id: string;
  referenceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  tripType: string; // 'temple_circuit' | 'educational' | 'family_function' | 'friends_trip' | 'heritage_tour'
  startCity: string;
  routeDestinations: string[];
  startDate: string;
  endDate: string;
  passengerCount: number;
  busType: 'volvo_multi_axle' | 'deluxe_ac_bus' | 'mini_bus_21' | 'tempo_traveller_14' | 'tourist_coach_54';
  specialRequirements: string;
  status: 'submitted' | 'quote_sent' | 'booked';
  estimatedCostMin: number;
  estimatedCostMax: number;
  createdAt: string;
}

export interface SponsoredTravelKit {
  id: string;
  bookingRef: string;
  customerName: string;
  sponsorName: string;
  qrCode: string;
  status: 'ready_for_pickup' | 'claimed' | 'delivered';
  kitItems: string[];
  pickupLocations: string[];
  issuedDate: string;
}
