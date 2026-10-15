import { Language } from '../types/tourism';
import { TN_DESTINATIONS } from '../data/tamilNaduData';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: 'gemini' | 'local_expert';
}

// Comprehensive local expert engine for instant answers & offline mode
export function getLocalTourismAnswer(question: string, language: Language = 'en'): string {
  const q = question.toLowerCase();

  // Temple queries
  if (q.includes('temple') || q.includes('madurai') || q.includes('meenakshi') || q.includes('darshan') || q.includes('pooja') || q.includes('dress code')) {
    if (language === 'ta') {
      return `🙏 **தமிழ்நாடு ஆலயங்கள் & தரிசன வழிகாட்டி**:
• **மதுரை மீனாட்சி அம்மன் ஆலயம்**: காலை 5:00 - மதியம் 12:30 & மாலை 4:00 - இரவு 10:00. திருவனந்தல் மற்றும் அர்த்தஜாம பூஜை விசேஷமானது.
• **ஆடை நெறிமுறைகள்**: ஆண்கள் வேட்டி/குர்தா, பெண்கள் புடவை/சுடிதார் கட்டாயம். ஜீன்ஸ், டி-ஷர்ட் அனுமதி இல்லை. கைபேசிகள் கிழக்கு கோபுர க்ளாக்ரூமில் ஒப்படைக்க வேண்டும்.
• **இராமேஸ்வரம் ராமநாதசுவாமி**: 22 புனித தீர்த்த கிணறுகளில் நீராடல் காலை 5 மணி முதல் தொடங்குகிறது.
• **உணவு**: மதுரை அம்மன் சன்னதி அருகே முருகன் இட்லி கடை மற்றும் புகழ்பெற்ற ஜிகர்தண்டா தவறவிடாதீர்கள்!`;
    }
    return `🙏 **Tamil Nadu Temples & Darshan Guide**:
• **Madurai Meenakshi Amman Temple**: Open 5:00 AM – 12:30 PM & 4:00 PM – 10:00 PM. The Thiruvanandal (5:30 AM) and Arthajamam (9:00 PM) ceremonies are deeply sacred.
• **Strict Dress Code**: Men must wear traditional Dhoti/Kurta; Women must wear Saree/Churidar with Dupatta. Western wear and jeans are strictly prohibited inside inner corridors. Mobile phones must be deposited at East Gopuram counters.
• **Rameswaram Ramanathaswamy**: The 22 Holy Theertham bathing begins at 5:00 AM after a sea dip at Agni Theertham.
• **Nearby Vegetarian Dining**: Murugan Idli Shop (West Masi St) & famous Madurai Jigarthanda.`;
  }

  // Weather & Danger zone checks
  if (q.includes('weather') || q.includes('danger') || q.includes('safe') || q.includes('valparai') || q.includes('alert') || q.includes('rain')) {
    return `⚠️ **Tamil Nadu Weather & Safety Status (Live IMD Updates)**:
• **Valparai**: Currently marked **DANGER ZONE – RED ALERT** due to heavy Western Ghats monsoon rainfall and mud-slip hazards along Hairpin turns 28–36. Tourist bookings are temporarily restricted for traveler safety.
• **Safe Alternatives**: Yercaud (Shevaroy Hills, 21°C), Ooty (Nilgiris, 16°C), and Mahabalipuram (Sunny, 30°C) are fully safe with pleasant touring conditions.
• **Policy Guarantee**: 100% complimentary refund or free rescheduling is automatically provided if your booking is affected by official red alerts!`;
  }

  // Keezhadi / History / Heritage
  if (q.includes('keezhadi') || q.includes('history') || q.includes('archaeology') || q.includes('sangam') || q.includes('museum') || q.includes('thanjavur')) {
    return `🏛️ **Sangam History & Archaeology in Tamil Nadu**:
• **Keezhadi Archaeological Excavation & World Museum** (Sivaganga / 12 km from Madurai): Unearthed proof of a sophisticated 2,600-year-old urban civilization along the Vaigai River (dating back to 580 BCE). The museum features over 4,000 artifacts, Tamil-Brahmi pottery, ring wells, and VR displays.
• **Thanjavur Brihadisvara (Big Temple)**: Built in 1010 CE by Emperor Raja Raja Chola I. Its 216-foot vimana and 80-tonne monolithic granite cupola demonstrate Chola engineering genius.
• **Mahabalipuram (Mamallapuram)**: UNESCO World Heritage 7th century Pallava rock-cut monolithic rathas and Shore Temple by the Bay of Bengal.`;
  }

  // First booking discount & offers
  if (q.includes('discount') || q.includes('offer') || q.includes('coupon') || q.includes('10%') || q.includes('first')) {
    return `🎉 **TN Stories 10% First-Trip Promotion**:
• **Offer**: 10% OFF up to ₹1,500 on your first eligible booking (minimum booking amount: ₹3,000).
• **Eligibility**: Applied automatically during Step 7 of our 9-Step Booking Wizard for all new travelers.
• **Daily Spin & Win**: You also get 1 free spin every 24 hours (resetting at 12:00 AM IST) on our dashboard to win ₹20, ₹50, and ₹100 tourism coupons!`;
  }

  // Sponsored travel kit
  if (q.includes('kit') || q.includes('sponsor') || q.includes('free') || q.includes('essential')) {
    return `🎁 **Free Sponsored Travel Kit**:
• Whenever you book a travel package or group bus through TN Stories, an authorized **Sponsored Travel Kit** is unlocked at ₹0 cost!
• **Items Included**: Stainless steel reusable water flask, herbal SPF 50 sunscreen, traditional millet energy snacks, pocket map of TN tourist circuits, and emergency first aid.
• **Claim**: A unique verification QR code is generated in your *Sponsored Travel Kits* dashboard for pickup at destination counters or bus depots.`;
  }

  // Offline mode
  if (q.includes('offline') || q.includes('internet') || q.includes('network') || q.includes('download')) {
    return `📶 **Smart Offline Trip Mode**:
• You can download your complete trip itinerary, verified booking tickets, scannable QR passes, and GPS offline maps (approx. 14.8 MB) before heading into remote hill stations.
• Emergency SOS helplines (Police 112, Medical 108, Tourist Police 1363, Women Safety 1091) are accessible without any cellular data connection.`;
  }

  // Default helpful response
  if (language === 'ta') {
    return `வணக்கம்! நான் உங்கள் **டிஎன் ஸ்டோரீஸ் சுற்றுலா உதவியாளர்**.
தமிழ்நாட்டின் புகழ்மிக்க ஆலயங்கள், ஊட்டி/கொடைக்கானல்/ஏற்காடு மலைவாசஸ்தலங்கள், மகாபலிபுரம் கடற்கரை, கீழடி தொல்லியல் தளம், பேருந்து முன்பதிவு மற்றும் வானிலை வழிகாட்டுதல்கள் குறித்து என்னிடம் நீங்கள் கேட்கலாம்.

உங்களுக்கு எந்த இடத்தைப் பற்றி அறிய வேண்டும்?`;
  }

  return `Vanakkam & Welcome to **TN Stories Tourism Assistant**!
I'm here to help you explore the incredible beauty and heritage of Tamil Nadu:
• **Temples & Pilgrimages**: Darshan schedules, dress codes, and pooja timings (Madurai, Rameswaram, Chidambaram, Tiruvannamalai).
• **Hill Stations & Hidden Gems**: Ooty, Kodaikanal, Meghamalai, and Kolli Hills 70 hairpin bends.
• **Heritage & Research**: Keezhadi 2,600-year Sangam excavations and UNESCO Chola Big Temples.
• **Smart Features**: 10% first-booking discount, Free Sponsored Travel Kits, and Daily Spin & Win.

What would you like to plan or discover today?`;
}

export const AIChatService = {
  async sendMessage(
    message: string,
    language: Language = 'en',
    history: ChatMessage[] = []
  ): Promise<string> {
    try {
      // Call backend /api/chat endpoint
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          language,
          conversationHistory: history.slice(-6)
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          return data.reply;
        }
      }
    } catch (e) {
      // In standalone dev or offline mode, fall back seamlessly to local expert
      console.log('Using local tourism expert intelligence');
    }

    // Local resilient expert fallback
    return getLocalTourismAnswer(message, language);
  }
};
