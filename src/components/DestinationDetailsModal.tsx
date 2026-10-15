import React, { useState } from 'react';
import { Destination, Language, Review, UserAccount } from '../types/tourism';
import { StorageService } from '../services/storageService';
import { 
  X, Star, MapPin, Clock, Calendar, ShieldAlert, Sparkles, BookOpen, 
  LandPlot, Utensils, CheckCircle, ArrowRight, MessageSquare, Trash2, Edit3, Image as ImageIcon, AlertTriangle
} from 'lucide-react';

interface DestinationDetailsModalProps {
  destination: Destination;
  language: Language;
  currentUser: UserAccount | null;
  onClose: () => void;
  onBookNow: (destination: Destination) => void;
}

export const DestinationDetailsModal: React.FC<DestinationDetailsModalProps> = ({
  destination,
  language,
  currentUser,
  onClose,
  onBookNow
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'heritage_temple' | 'reviews'>('overview');
  const [selectedPhoto, setSelectedPhoto] = useState(destination.images[0] || '');

  // Reviews state
  const [allReviews, setAllReviews] = useState<Review[]>(StorageService.getReviews());
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [tripDate, setTripDate] = useState('2026-10-01');
  const [companion, setCompanion] = useState('Family');
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  const destReviews = allReviews.filter(r => r.destinationId === destination.id);
  const isRedAlert = destination.weather.alertLevel === 'red' || destination.weather.bookingRestricted;

  // Check if current user has an existing review for this destination
  const userExistingReview = currentUser
    ? destReviews.find(r => r.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
    : null;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');

    if (!currentUser) {
      setReviewError('Please sign in to submit a verified trip review.');
      return;
    }

    if (!reviewText.trim()) {
      setReviewError('Please write your travel experience.');
      return;
    }

    try {
      if (editingReviewId) {
        StorageService.updateReview(editingReviewId, reviewText, rating);
        setReviewSuccess('Your review has been successfully updated.');
        setEditingReviewId(null);
      } else {
        StorageService.addReview({
          destinationId: destination.id,
          destinationName: destination.name,
          customerName: currentUser.fullName,
          customerEmail: currentUser.email,
          bookingReference: `TN-${destination.id.toUpperCase().slice(0, 3)}-VERIFIED`,
          rating,
          writtenReview: reviewText.trim(),
          tripDate,
          travelCompanion: companion,
          photoUrl: photoUrlInput.trim() || undefined
        });
        setReviewSuccess('Thank you! Your verified trip review has been posted.');
      }
      setAllReviews(StorageService.getReviews());
      setShowReviewForm(false);
      setReviewText('');
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review.');
    }
  };

  const handleEditClick = (rev: Review) => {
    setEditingReviewId(rev.id);
    setRating(rev.rating);
    setReviewText(rev.writtenReview);
    setTripDate(rev.tripDate);
    setCompanion(rev.travelCompanion);
    setShowReviewForm(true);
  };

  const handleDeleteClick = (reviewId: string) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      StorageService.deleteReview(reviewId);
      setAllReviews(StorageService.getReviews());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {destination.district}
              </span>
              <span className="text-xs text-slate-400 capitalize">{destination.category.replace('_', ' ')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              {destination.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Photo Gallery */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={selectedPhoto || destination.images[0]}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-700 backdrop-blur-md">
                  📍 {destination.location}
                </span>
                <span className="bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-xl shadow-md">
                  ₹{destination.estimatedCostPerDay.toLocaleString('en-IN')} / day
                </span>
              </div>
            </div>

            {/* Thumbnail row */}
            {destination.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {destination.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedPhoto(img)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedPhoto === img ? 'border-amber-400 scale-95' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone Notice if applicable */}
          {isRedAlert && (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/50 text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-300">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>{destination.weather.alertTitle}</span>
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                {destination.weather.alertDetails}
              </p>
              {destination.weather.safeAlternativeDestinations && (
                <div className="text-xs text-amber-300 pt-1">
                  Safe alternatives outside warning zone: <span className="font-semibold">{destination.weather.safeAlternativeDestinations.join(', ').toUpperCase()}</span>
                </div>
              )}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-2">
            {[
              { id: 'overview', label: 'Overview & Highlights' },
              { id: 'packages', label: `Tour Packages (${destination.packages.length})` },
              ...(destination.templeInfo || destination.heritageInfo
                ? [{ id: 'heritage_temple', label: destination.templeInfo ? 'Temple Guidelines & Pooja' : 'Heritage & History' }]
                : []),
              { id: 'reviews', label: `Reviews (${destReviews.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all relative ${
                  activeTab === tab.id
                    ? 'text-amber-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-5 text-sm text-slate-300 leading-relaxed">
              <p>{destination.fullDescription}</p>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2.5 text-amber-400">
                  Key Attractions & Sightseeing
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {destination.popularAttractions.map((att) => (
                    <div key={att} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
                      <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{att}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather info banner */}
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">Live Climate Conditions</div>
                  <div className="text-slate-400">{destination.weather.condition} • Rainfall: {destination.weather.rainfallMm} mm • Winds: {destination.weather.windSpeedKmh} km/h</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-amber-400">{destination.weather.tempC}°C</div>
                  <div className="text-[10px] text-slate-400">Updated today</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Tour Packages */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              {destination.packages.map((pkg) => (
                <div key={pkg.id} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                        {pkg.duration}
                      </span>
                      <span className="text-xs text-slate-400">Vehicle: {pkg.vehicleIncluded}</span>
                    </div>
                    <h4 className="font-bold text-base text-white">{pkg.title}</h4>
                    <div className="space-y-1">
                      {pkg.inclusions.map((inc, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="sm:text-right flex flex-col justify-between shrink-0 sm:min-w-44 border-t sm:border-t-0 sm:border-l border-slate-700 pt-3 sm:pt-0 sm:pl-4">
                    <div>
                      <div className="text-xs text-slate-400">Starting from</div>
                      <div className="text-xl font-black text-amber-400">₹{pkg.pricePerPerson.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-slate-400">per person</div>
                    </div>
                    <button
                      onClick={() => onBookNow(destination)}
                      disabled={isRedAlert}
                      className="mt-3 py-2 px-4 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all cursor-pointer"
                    >
                      Select Package
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Temple or Heritage specifics */}
          {activeTab === 'heritage_temple' && (
            <div className="space-y-4 text-xs text-slate-300">
              {destination.templeInfo && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <div className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      <LandPlot className="w-4 h-4 text-amber-400" />
                      <span>Presiding Deity: {destination.templeInfo.deity}</span>
                    </div>
                    <div><span className="font-semibold text-white">Opening & Darshan Hours:</span> {destination.templeInfo.openingHours}</div>
                    <div><span className="font-semibold text-white">Pooja Timings:</span> {destination.templeInfo.poojaTimings}</div>
                    <div><span className="font-semibold text-white">Strict Dress Code:</span> {destination.templeInfo.dressCode}</div>
                    <div><span className="font-semibold text-white">Guidelines:</span> {destination.templeInfo.visitorGuidelines}</div>
                  </div>

                  <div>
                    <h5 className="font-bold text-white text-xs mb-2">Recommended Nearby Pure Vegetarian Eateries:</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {destination.templeInfo.nearbyVegEateries.map((eat) => (
                        <div key={eat} className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center gap-2">
                          <Utensils className="w-3.5 h-3.5 text-amber-400" />
                          <span>{eat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {destination.heritageInfo && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-2">
                    <div className="font-bold text-amber-300 text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>Historical Timeline & Archaeology</span>
                    </div>
                    <div><span className="font-semibold text-white">Era:</span> {destination.heritageInfo.timeline}</div>
                    <div><span className="font-semibold text-white">Significance:</span> {destination.heritageInfo.archaeologicalSignificance}</div>
                    {destination.heritageInfo.museumInfo && (
                      <div><span className="font-semibold text-white">Museum & Exhibits:</span> {destination.heritageInfo.museumInfo}</div>
                    )}
                    <div><span className="font-semibold text-white">Photography Clearance:</span> {destination.heritageInfo.photographyPermit}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Customer Trip Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>Verified Customer Reviews</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400">
                      ★ {destination.averageRating.toFixed(1)} / 5.0
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">Based on authentic traveler journeys</p>
                </div>

                {!showReviewForm && (
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        alert('Please sign in to write a review.');
                        return;
                      }
                      setShowReviewForm(true);
                    }}
                    className="py-2 px-3.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{userExistingReview ? 'Edit Your Review' : 'Write a Review'}</span>
                  </button>
                )}
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                    <span className="font-bold text-xs text-white">
                      {editingReviewId ? 'Edit Your Review' : `Write Review for ${destination.name}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  {reviewError && (
                    <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs">
                      {reviewError}
                    </div>
                  )}

                  {reviewSuccess && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs">
                      {reviewSuccess}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-300 font-semibold">Your Rating:</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-slate-600 hover:text-amber-400"
                        >
                          <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">
                      Travel Experience / Feedback
                    </label>
                    <textarea
                      rows={3}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share tips about attractions, timings, transport, and memorable moments..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Trip Date</label>
                      <input
                        type="date"
                        value={tripDate}
                        onChange={(e) => setTripDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Companion Type</label>
                      <select
                        value={companion}
                        onChange={(e) => setCompanion(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      >
                        <option>Family</option>
                        <option>Friends</option>
                        <option>Solo</option>
                        <option>Couple</option>
                        <option>Group Trip</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">
                      Optional Trip Photo URL
                    </label>
                    <input
                      type="url"
                      value={photoUrlInput}
                      onChange={(e) => setPhotoUrlInput(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950"
                  >
                    Submit Verified Review
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3">
                {destReviews.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-800/30 rounded-2xl border border-slate-800">
                    No reviews yet for this destination. Be the first to share your experience!
                  </div>
                ) : (
                  destReviews.map((rev) => {
                    const isOwnReview = currentUser && rev.customerEmail.toLowerCase() === currentUser.email.toLowerCase();

                    return (
                      <div key={rev.id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white">{rev.customerName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                              Verified Traveler
                            </span>
                            <span className="text-[10px] text-slate-400">• {rev.travelCompanion}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-amber-400">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                              ))}
                            </div>

                            {isOwnReview && (
                              <div className="flex items-center gap-1 ml-2">
                                <button
                                  onClick={() => handleEditClick(rev)}
                                  className="text-slate-400 hover:text-amber-400 p-1"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(rev.id)}
                                  className="text-slate-400 hover:text-rose-400 p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {rev.writtenReview}
                        </p>

                        {rev.photoUrl && (
                          <div className="pt-1">
                            <img
                              src={rev.photoUrl}
                              alt="Trip snap"
                              className="w-32 h-20 rounded-xl object-cover border border-slate-700"
                            />
                          </div>
                        )}

                        <div className="text-[10px] text-slate-500 pt-1">
                          Traveled on {rev.tripDate} • Posted on {rev.createdAt.split('T')[0]}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400">Estimated budget</div>
            <div className="text-lg font-black text-white">
              ₹{destination.estimatedCostPerDay.toLocaleString('en-IN')} <span className="text-xs font-normal text-slate-400">/ day</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 border border-slate-700"
            >
              Close
            </button>
            <button
              onClick={() => onBookNow(destination)}
              disabled={isRedAlert}
              className={`py-2.5 px-6 rounded-xl text-xs font-bold flex items-center gap-2 ${
                isRedAlert
                  ? 'bg-rose-900/60 text-rose-300 cursor-not-allowed border border-rose-800'
                  : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-[0.98] cursor-pointer'
              }`}
            >
              {isRedAlert ? (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Booking Restricted</span>
                </>
              ) : (
                <>
                  <span>Book This Destination</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
