import React, { useState } from 'react';
import { Language, UserAccount } from '../types/tourism';
import { StorageService, CURRENT_TERMS_VERSION } from '../services/storageService';
import { ShieldCheck, FileText, AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface TermsModalProps {
  user: UserAccount | null;
  language: Language;
  onAgree: (updatedUser: UserAccount) => void;
  onDecline: () => void;
  isSettingsView?: boolean;
  onCloseSettingsView?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  user,
  language,
  onAgree,
  onDecline,
  isSettingsView = false,
  onCloseSettingsView
}) => {
  const [hasCheckedBox, setHasCheckedBox] = useState(false);
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'refund'>('terms');
  const [expandedSection, setExpandedSection] = useState<number | null>(null);

  const isTamil = language === 'ta';

  const handleAgree = () => {
    if (!user) return;
    const updated = StorageService.acceptTerms(user.id);
    if (updated) {
      onAgree(updated);
    }
  };

  const sections = [
    {
      num: 1,
      title: isTamil ? "1. இயற்கை பேரிடர்கள், தீவிர வானிலை & தவிர்க்க முடியாத நிகழ்வுகள்" : "1. Natural Disasters, Extreme Weather & Force Majeure",
      content: isTamil
        ? "சூறாவளி, கடுமையான கனமழை, நிலச்சரிவு, வெள்ளம், அரசு பயண தடைகள் மற்றும் தவிர்க்க முடியாத பேரிடர் சூழல்களில் பயணிகளின் பாதுகாப்பே முதன்மையானது. அதிகாரப்பூர்வ சிவப்பு எச்சரிக்கை (Red Alert) விடுக்கப்பட்ட பகுதிகளில் முன்பதிவுகள் தானாகவே கட்டுப்படுத்தப்படும் அல்லது மாற்று பாதுகாப்பான வழிகள் பரிந்துரைக்கப்படும்."
        : "Safety of travelers is paramount during cyclones, torrential monsoons, landslides, flash floods, and statutory governmental travel restrictions. Destinations marked under official Danger Zone – Red Alert will undergo automated booking restrictions and proactive rerouting to safe alternative circuits."
    },
    {
      num: 2,
      title: isTamil ? "2. வாடிக்கையாளர் பொறுப்பு, நடத்தை மற்றும் பயண அபாயங்கள்" : "2. Customer Responsibility, Conduct & Travel Risks",
      content: isTamil
        ? "சுற்றுலா பயணிகள் தங்களது உடமைகளை பாதுகாப்பாக வைத்திருக்க வேண்டும். நீர்வீழ்ச்சிகள், மலை முகடுகள், கடற்கரை ஆபத்து பகுதிகள் மற்றும் அடர்ந்த வனப்பகுதிகளில் வழிகாட்டிகளின் பாதுகாப்பு நெறிமுறைகளை கட்டாயம் பின்பற்ற வேண்டும்."
        : "Travelers are expected to exercise due care for personal safety and belongings. Compliance with safety briefings, barricades at waterfalls, cliff edges, beach swimming bans, and forest department guidelines is strictly mandatory."
    },
    {
      num: 3,
      title: isTamil ? "3. ரத்து கட்டணங்கள் & திருப்பி செலுத்தும் தகுதி (Refund Policy)" : "3. Cancellation Fees & Refund Eligibility",
      content: isTamil
        ? "பயணத்திற்கு 48 மணி நேரத்திற்கு முன் ரத்து செய்தால் முழு கட்டணமும் (வங்கி சேவைக் கட்டணம் தவிர்த்து) திரும்ப அளிக்கப்படும். வானிலை ரெட் அலர்ட் காரணமாக அரசு அனுமதி மறுத்தால் 100% திருப்பிச் செலுத்துதல் அல்லது மறுதேதி மாற்றம் இலவசமாக வழங்கப்படும்."
        : "Cancellations initiated 48 hours prior to scheduled departure are eligible for full refund less standard payment processing fees. In the event of government-enforced Red Alert restrictions or unforeseen route blockages, travelers receive 100% refund eligibility or complimentary rescheduling."
    },
    {
      num: 4,
      title: isTamil ? "4. சொத்து சேதம் மற்றும் பொறுப்புக்கூறல்" : "4. Property Damage & Liability",
      content: isTamil
        ? "சுற்றுலா வாகனங்கள், தங்குமிடங்கள், கடற்கரை ஓய்வறைகள் அல்லது உபகரணங்களுக்கு வாடிக்கையாளரின் கவனக்குறைவால் ஏற்படும் சேதங்களுக்கு வாடிக்கையாளரே பொறுப்பாவார்."
        : "Customers are accountable for intentional or grossly negligent damage to tourism vehicles, hotel properties, beach changing lockers, or rental gear during the tour."
    },
    {
      num: 5,
      title: isTamil ? "5. அரசு பாதுகாப்பு வழிகாட்டுதல்கள், உள்ளூர் சட்டங்கள் & ஆடை நெறிமுறைகள்" : "5. Government Safety Guidelines, Local Laws & Dress Codes",
      content: isTamil
        ? "தமிழ்நாட்டின் தொன்மை வாய்ந்த ஆலயங்கள் (எ.கா. மதுரை மீனாட்சி அம்மன், இராமேஸ்வரம், தஞ்சாவூர் பெரிய கோவில்) பாரம்பரிய ஆடை நெறிமுறைகளை (வேட்டி/குர்தா, புடவை/சுடிதார்) கட்டாயமாக்கியுள்ளன. பயணிகள் இவற்றை மதித்து நடக்க வேண்டும்."
        : "Ancient Tamil Nadu temples strictly enforce traditional Indian dress codes (Dhotis/Kurtas for men; Sarees/Churidars with dupattas for women). Travelers must honor local cultural sensibilities, archaeological monument preservation laws, and eco-sensitive plastic bans."
    },
    {
      num: 6,
      title: isTamil ? "6. மூன்றாம் தரப்பு தங்குமிடம் மற்றும் போக்குவரத்து சேவை பொறுப்புகள்" : "6. Third-Party Provider Responsibilities",
      content: isTamil
        ? "எங்கள் தளத்தில் இணைக்கப்பட்டுள்ள பேருந்து இயக்குநர்கள், வழிகாட்டிகள், மற்றும் ஹோட்டல்கள் சரிபார்க்கப்பட்ட பார்ட்னர்கள் ஆவர். சேவைத் தரத்தை உறுதிப்படுத்த தொடர் தணிக்கை செய்யப்படுகிறது."
        : "Transport operators, verified bus agents, and homestays are curated tourism partners. While we inspect credentials and license validity, independent service warranties remain aligned with operational transport terms."
    },
    {
      num: 7,
      title: isTamil ? "7. அவசர உதவி எண்கள் மற்றும் கட்டுப்பாடுகள்" : "7. Emergency Contacts & Assistance Limitations",
      content: isTamil
        ? "எங்கள் செயலியின் Smart Offline Trip Mode-ல் சேமிக்கப்பட்ட காவல் (112), ஆம்புலன்ஸ் (108), சுற்றுலா காவல் உதவி (1363) எண்களை அவசர காலத்தில் உடனடியாக அணுகலாம்."
        : "Emergency helplines (Police 112, Medical 108, Tourist Police 1363, Women Safety 1091) are synchronized into your Offline Trip Mode. While our app facilitates distress routing, critical interventions are administered by statutory civic departments."
    },
    {
      num: 8,
      title: isTamil ? "8. தனிநபர் தரவு பாதுகாப்பு, உரிமைகள் & டிஜிட்டல் கொள்கை" : "8. Privacy, Data Protection & User Rights",
      content: isTamil
        ? "உங்கள் முன்பதிவு விவரங்கள், பயண விருப்பங்கள் மற்றும் தொலைபேசி எண்கள் பாதுகாப்பாக என்க்ரிப்ட் செய்யப்படுகின்றன. விளம்பரத்திற்காக மூன்றாம் தரப்பினருக்கு விற்கப்படாது. பயனர்கள் தங்கள் கணக்கு தகவல்களை எப்போது வேண்டுமானாலும் நீக்க உரிமை உண்டு."
        : "Personal identification, journey preferences, and contact details are stored securely. We do not sell or monetize personal travel records. Users retain absolute statutory rights under Indian Digital Personal Data Protection laws to access, correct, or erase their stored records."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{isTamil ? 'விதிமுறைகள் மற்றும் நிபந்தனைகள்' : 'Terms & Conditions Agreement'}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    {CURRENT_TERMS_VERSION}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  {isTamil ? 'பாதுகாப்பான மற்றும் நம்பகமான தமிழ்நாடு சுற்றுலா அனுபவம்' : 'TN Stories Tourism Safe Travel & Compliance Charter'}
                </p>
              </div>
            </div>

            {isSettingsView && (
              <button
                onClick={onCloseSettingsView}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'terms'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isTamil ? 'விதிமுறைகள் (Terms)' : 'Terms of Service'}
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'privacy'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isTamil ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy'}
            </button>
            <button
              onClick={() => setActiveTab('refund')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'refund'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isTamil ? 'திருப்பிச் செலுத்தும் கொள்கை' : 'Refund & Cancellation'}
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4 text-slate-300 text-sm leading-relaxed">
          {activeTab === 'terms' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  {isTamil
                    ? 'முக்கிய அறிவிப்பு: தமிழ்நாடு சுற்றுலா சேவைகள், தங்குமிடம், பேருந்து முன்பதிவு மற்றும் ஆஃப்லைன் பயண அம்சங்களை தொடர இந்த விதிமுறைகளை வாசித்து ஒப்புதல் அளிக்க வேண்டும்.'
                    : 'Mandatory Notice: Please review and accept these statutory terms before booking trips, accessing smart offline trip mode, or claiming travel offers.'}
                </span>
              </div>

              {sections.map((sec) => (
                <div key={sec.num} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
                  <button
                    onClick={() => setExpandedSection(expandedSection === sec.num ? null : sec.num)}
                    className="w-full flex items-center justify-between p-3.5 text-left font-semibold text-white hover:bg-slate-800/50 transition-colors"
                  >
                    <span className="text-sm text-amber-300">{sec.title}</span>
                    {expandedSection === sec.num ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {(expandedSection === sec.num || expandedSection === null) && (
                    <div className="p-3.5 pt-0 text-xs text-slate-400 border-t border-slate-800/60 bg-slate-950/40">
                      {sec.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3 text-xs text-slate-300">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>TN Stories Privacy Charter & Data Protection</span>
              </h3>
              <p>
                We value your digital trust. TN Stories exclusively gathers minimal data necessary for booking trips, generating verified tickets, syncing offline packages, and preventing promotional coupon fraud.
              </p>
              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-1.5">
                <div className="font-semibold text-amber-300">Data Stored & Protected:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Full name, email address, and optional contact phone for booking verification.</li>
                  <li>Trip dates, passenger headcounts, and travel companion preferences.</li>
                  <li>Device offline cache for emergency contacts and offline QR tickets.</li>
                  <li>We never store raw credit card numbers or banking secrets.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'refund' && (
            <div className="space-y-3 text-xs text-slate-300">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Transparent Refund Policy & Guaranteed Protection</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="font-bold text-emerald-300 text-xs">Standard Cancellation</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Cancellations made &gt;48 hours prior to journey receive a 100% refund of the booking amount.
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="font-bold text-amber-300 text-xs">Weather Red Alert Guarantee</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    If official red alerts or landslides prevent access to your chosen destination, enjoy 100% full refund with zero cancellation deduction.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/90 space-y-3">
          {!isSettingsView && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
              <input
                id="terms-checkbox"
                type="checkbox"
                checked={hasCheckedBox}
                onChange={(e) => setHasCheckedBox(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-amber-500 rounded border-slate-600 focus:ring-amber-400 bg-slate-900 cursor-pointer"
              />
              <label htmlFor="terms-checkbox" className="text-xs text-slate-200 cursor-pointer select-none">
                {isTamil
                  ? "நான் தமிழ்நாடு சுற்றுலா விதிமுறைகள் மற்றும் நிபந்தனைகளை (Terms & Conditions) முழுமையாக வாசித்து ஏற்றுக்கொள்கிறேன்."
                  : "I have read and agree to the TN Stories Terms & Conditions, Privacy Policy, and Refund Charter."}
              </label>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-1">
            {!isSettingsView ? (
              <>
                <button
                  type="button"
                  onClick={onDecline}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800 border border-slate-800 transition-colors"
                >
                  {isTamil ? 'நிராகரி (Decline)' : 'Decline & Exit'}
                </button>
                <button
                  type="button"
                  disabled={!hasCheckedBox}
                  onClick={handleAgree}
                  className={`flex-1 py-2.5 px-5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                    hasCheckedBox
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isTamil ? 'நான் ஒப்புக்கொள்கிறேன் & தொடரவும்' : 'I Agree & Continue'}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onCloseSettingsView}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400"
              >
                {isTamil ? 'மூடுக' : 'Close Charter'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
