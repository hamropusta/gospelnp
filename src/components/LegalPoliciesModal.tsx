import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Shield,
  FileText,
  Lock,
  HeartHandshake,
  Trash2,
  Mail,
  AlertTriangle,
  Scale,
  Sparkles,
} from 'lucide-react';

export const LegalPoliciesModal: React.FC = () => {
  const {
    isLegalModalOpen,
    setIsLegalModalOpen,
    activeLegalPolicy,
    language,
    showToast,
  } = useApp();

  const [currentTab, setCurrentTab] = useState<string>(activeLegalPolicy || 'respect');

  if (!isLegalModalOpen) return null;

  const handleWipeData = () => {
    if (
      window.confirm(
        language === 'ne'
          ? 'के तपाईं आफ्नो सबै व्यक्तिगत नोट, प्रार्थना र बुकमार्कहरू स्थायी रूपमा मेटाउन चाहनुहुन्छ?'
          : 'Are you sure you want to permanently delete all your study notes, prayers, and bookmarks?'
      )
    ) {
      localStorage.removeItem('goodnews_notes');
      localStorage.removeItem('goodnews_bookmarks');
      localStorage.removeItem('goodnews_prayers');
      localStorage.removeItem('goodnews_plan_progress');
      localStorage.removeItem('goodnews_quiz_scores');
      showToast(language === 'ne' ? 'सबै व्यक्तिगत डाटा मेटाइयो' : 'All personal records permanently deleted');
      setIsLegalModalOpen(false);
      window.location.reload();
    }
  };

  const policies = [
    {
      id: 'respect',
      titleEn: 'Religious Respect & Non-Discrimination',
      titleNe: 'धार्मिक आदर र गैर-भेदभाव नीति',
      icon: HeartHandshake,
      contentEn: `Good News AI / सुसमाचार AI is committed to peace, love, and mutual dignity.
1. Universal Respect: We respect people of all religions, cultures, languages, and backgrounds, including Hindu, Buddhist, Muslim, Kirat, indigenous, secular, and agnostic traditions.
2. Zero Coercion: Faith in Jesus Christ is a voluntary gift of grace received freely through conscience. We strictly prohibit coercive conversion, emotional manipulation, or threats.
3. No Disparagement: Our AI and contributors must never mock, insult, or misrepresent the sacred texts, deities, or practices of any religious community.
4. Scriptural Foundation: As taught in 1 Peter 3:15, all Christian testimonies must be presented with "gentleness and respect."`,
      contentNe: `सुसमाचार AI शान्ति, प्रेम र आपसी मर्यादाको निम्ति पूर्ण रूपमा प्रतिबद्ध छ।
१. सार्वभौमिक आदर: हामी हिन्दू, बौद्ध, किराँत, इस्लाम, आदिवासी र गैर-धार्मिक लगायत सबै धार्मिक परम्पराका मानिसहरूको आस्थाको सम्मान गर्दछौं।
२. दबाबमुक्त स्वतन्त्रता: ख्रीष्टियन विश्वास स्वेच्छिक अनुग्रहको वरदान हो। हामी कुनै पनि प्रकारको दबाब, प्रलोभन वा जबर्जस्ती धर्म परिवर्तनको कडा विरोध गर्दछौं।
३. कुनै निन्दा वा घृणा छैन: हाम्रो AI ले कुनै पनि धर्म वा आस्थाको बारेमा घृणास्पद अभिव्यक्ति वा अपमान गर्दैन।
४. बाइबलीय आदर्श: १ पत्रुस ३:१५ ले सिकाएझैं, सुसमाचारको आशा सधैं "नम्रता र आदरसाथ" प्रस्तुत गरिन्छ।`,
    },
    {
      id: 'privacy',
      titleEn: 'Privacy Policy & Data Sovereignty',
      titleNe: 'गोपनीयता तथा डाटा नीति',
      icon: Lock,
      contentEn: `Your spiritual reflections are sacred and private.
1. Minimum Collection: Basic Bible learning does not require account creation.
2. Zero Selling: We never sell personal data or share private faith questions with commercial advertisers.
3. Confidentiality: Your prayer journals, Bible study notes, and AI questions are strictly private. They are never automatically shared with churches or pastors.
4. Direct ZIP Export: You have the right to download your complete data archive at any time in ZIP format.
5. Right to Erasure: You may permanently delete your data with one click.`,
      contentNe: `तपाईंको आत्मिक मनन र प्रार्थनाहरू पूर्ण रूपमा गोप्य छन्।
१. न्यूनतम डाटा सङ्कलन: आधारभूत बाइबल अध्ययनका लागि कुनै खाता खोल्नु पर्दैन।
२. डाटा बिक्री निषेध: हामी कहिल्यै पनि प्रयोगकर्ताको डाटा विज्ञापनदाता वा तेस्रो पक्षलाई बेच्दैनौं।
३. पूर्ण गोपनीयता: तपाईंका प्रार्थनाहरू र नोटहरू मण्डलीहरूसँग स्वतः साझा गरिँदैनन्।
४. प्रत्यक्ष ZIP डाउनलोड: तपाईं कुनै पनि बेला आफ्नो डाटा ZIP संग्रहको रूपमा डाउनलोड गर्न सक्नुहुन्छ।
५. मेटाउने अधिकार: तपाईं एक क्लिकमा आफ्ना सबै रेकर्डहरू स्थायी रूपमा मेटाउन सक्नुहुन्छ।`,
    },
    {
      id: 'ai-usage',
      titleEn: 'AI Safety & Theological Grounding',
      titleNe: 'AI सुरक्षा र धर्मशास्त्रीय मापदण्ड',
      icon: Sparkles,
      contentEn: `Good News AI is an educational tool powered by Gemini 3.8 Flash.
1. Primary Source: Teachings are grounded strictly in the Holy Bible (Old and New Testaments).
2. Human Counsel: The AI does not replace pastors, spiritual elders, medical doctors, or licensed counselors.
3. No False Guarantees: The AI does not promise guaranteed financial prosperity, magical miracles, or instant cures.
4. Attribution: Clearly distinguishes direct Scripture text from historical context and denominational interpretations.`,
      contentNe: `सुसमाचार AI जेमिनाई ३.८ फ्ल्यास प्रविधिद्वारा सञ्चालित एक शैक्षिक सहायक हो।
१. मुख्य स्रोत: सबै शिक्षाहरू पवित्र बाइबलका ६६ पुस्तकहरूमा आधारित छन्।
२. मानवीय परामर्शको विकल्प होइन: यसले वास्तविक पास्टर वा योग्य चिकित्सकको विकल्प प्रदान गर्दैन।
३. कुनै झुटो आश्वासन छैन: AI ले कुनै चमत्कार वा तुरुन्तै धनसम्पत्ति पाउने जादुई दाबी गर्दैन।`,
    },
    {
      id: 'child-safety',
      titleEn: 'Child & Vulnerable Seeker Protection',
      titleNe: 'बालबालिका तथा संवेदनशील व्यक्ति संरक्षण',
      icon: Shield,
      contentEn: `We maintain strict guardrails to protect children, youth, and vulnerable individuals experiencing grief or trauma.
1. Safe Environment: Zero exposure to graphic violence, exploitation, or harmful content.
2. Gentle Comfort: In times of sorrow, scripture provides gentle peace (Psalm 23, Matthew 11:28) and directs users to trusted human community support.`,
      contentNe: `बालबालिका तथा मानसिक वा भावनात्मक तनावमा रहेका व्यक्तिहरूका लागि सुरक्षित वातावरण सुनिश्चित गरिन्छ।
१. सुरक्षित सामग्री: कुनै पनि हिंसात्मक वा अनुचित सामग्रीलाई पूर्ण प्रतिबन्ध गरिएको छ।
२. सान्त्वना र आशा: दुःखको समयमा धर्मशास्त्रका शान्तिका वचनहरू प्रदान गरिन्छ।`,
    },
    {
      id: 'terms',
      titleEn: 'Terms of Service & Copyright',
      titleNe: 'सेवाका सर्तहरू र प्रतिलिपि अधिकार',
      icon: Scale,
      contentEn: `1. Lawful Use: Users agree to engage in peaceful and respectful dialogue.
2. Copyright Compliance: Bible texts and Christian educational articles are used under legal licenses, fair dealing, or public domain permissions.
3. Jurisdiction: Aligned with standard freedom of religion and expression provisions under the Constitution of Nepal and applicable international human rights declarations.`,
      contentNe: `१. कानुनी प्रयोग: शान्तिपूर्ण र मर्यादित सिकाइको निम्ति मात्र प्रयोग गर्न पाइनेछ।
२. प्रतिलिपि अधिकार: सबै धर्मशास्त्र र शैक्षिक सामग्रीहरू कानुनी अनुमति र खुला इजाजतपत्र अन्तर्गत प्रदान गरिएका छन्।`,
    },
    {
      id: 'deletion',
      titleEn: 'Account Deletion & Data Wipe',
      titleNe: 'डाटा स्थायी रूपमा मेटाउने',
      icon: Trash2,
      contentEn: `You have full sovereignty over your faith journey. If you wish to delete all notes, bookmarks, prayer journals, and progress:`,
      contentNe: `आफ्नो आस्था यात्रामा तपाईंको पूर्ण अधिकार छ। यदि तपाईं आफ्ना सबै व्यक्तिगत विवरणहरू सदाका लागि मेटाउन चाहनुहुन्छ भने:`,
    },
  ];

  const currentPolicy = policies.find((p) => p.id === currentTab) || policies[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif-sacred font-bold text-base sm:text-lg">
              {language === 'ne' ? 'कानुनी, गोपनीयता तथा आदर नीतिहरू' : 'Legal, Privacy & Religious Respect Policies'}
            </h3>
          </div>
          <button
            onClick={() => setIsLegalModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Policy Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 gap-1 overflow-x-auto text-xs py-2">
          {policies.map((p) => (
            <button
              key={p.id}
              onClick={() => setCurrentTab(p.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                currentTab === p.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {language === 'ne' ? p.titleNe : p.titleEn}
            </button>
          ))}
        </div>

        {/* Policy Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <h4 className="font-serif-sacred font-bold text-lg text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <span>{language === 'ne' ? currentPolicy.titleNe : currentPolicy.titleEn}</span>
          </h4>

          <div className="whitespace-pre-wrap font-sans bg-slate-50/60 p-5 rounded-2xl border border-slate-200/70 text-slate-800 leading-relaxed">
            {language === 'ne' ? currentPolicy.contentNe : currentPolicy.contentEn}
          </div>

          {currentTab === 'deletion' && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
              <p className="text-xs text-rose-900 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Permanent Data Removal (स्थायी डाटा मेटाउने)
              </p>
              <p className="text-xs text-slate-600">
                This will instantly wipe your prayer entries, Bible study notes, reading plan checkboxes, and bookmarks from this device.
              </p>
              <button
                onClick={handleWipeData}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete All My Study & Prayer Records Now</span>
              </button>
            </div>
          )}

          <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100">
            <span>Official Policy Document • Last Reviewed: 2025/2026</span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" /> support@goodnewsai.org
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setIsLegalModalOpen(false)}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            {language === 'ne' ? 'स्वीकार गर्नुहोस् र बन्द गर्नुहोस्' : 'Acknowledge & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
