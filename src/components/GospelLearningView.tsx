import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Heart,
  BookOpen,
  HelpCircle,
  HeartHandshake,
  Users,
  ChevronDown,
  ChevronUp,
  Church as ChurchIcon,
  Download,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const GospelLearningView: React.FC = () => {
  const { language, setActiveTab, setIsZipModalOpen, showToast } = useApp();

  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [connectForm, setConnectForm] = useState({
    name: '',
    contact: '',
    city: 'Kathmandu',
    message: '',
    consent: false,
  });

  const parables = [
    {
      id: 'prodigal-son',
      titleEn: 'The Prodigal Son: The Welcoming Father',
      titleNe: 'हराएको छोरा: स्वागत गर्ने पिताको प्रेम',
      reference: 'Luke 15:11-32',
      summaryEn: 'A rebellious son squanders his inheritance and returns home in shame. Rather than condemning him, the father runs with open arms, kisses him, and restores his sonship.',
      summaryNe: 'एउटा छोराले आफ्नो सम्पत्ति उडाएर लज्जित भई घर फर्किन्छ। बाबुले उसलाई दण्ड दिनुको सट्टा दौडेर गएर अँगालो हाल्छन् र छोराको रूपमा पुनः अधिकार दिन्छन्।',
      lessonEn: 'Illustrates God’s boundless grace and eager forgiveness for anyone who turns back to Him, regardless of past brokenness.',
      lessonNe: 'विगतको जुनसुकै कमजोरी वा गल्ती भए तापनि पश्चात्ताप गरेर आउने सबैलाई परमेश्वरले क्षमा र असीम प्रेम दिनुहुन्छ भन्ने दर्शाउँछ।',
    },
    {
      id: 'good-samaritan',
      titleEn: 'The Good Samaritan: Love Crossing Boundaries',
      titleNe: 'असल सामरी: सीमा नाघ्ने छिमेकी प्रेम',
      reference: 'Luke 10:25-37',
      summaryEn: 'When religious travelers pass by a beaten man, an outsider Samaritan stops, bandages his wounds, pays for his recovery, and cares for him.',
      summaryNe: 'कुटपिटमा परेका घाइते मानिसलाई देखेर अरू तर्किन्छन्, तर एक जना सामरीले रोकेर मलमपट्टी गरिदिन्छ, खर्च बेहोर्छ र स्याहार गर्छ।',
      lessonEn: 'Jesus teaches that our "neighbor" is anyone in need, demanding compassionate love across racial, religious, and social divisions.',
      lessonNe: 'येशूले सिकाउनुहुन्छ कि खाँचोमा परेका जो कोही हाम्रो छिमेकी हुन्। जाति, धर्म वा वर्गभन्दा माथि उठेर दया देखाउनु नै साँचो विश्वास हो।',
    },
    {
      id: 'samaritan-woman',
      titleEn: 'Living Water: The Woman at the Well',
      titleNe: 'जीवित पानी: इनारको किनारमा सामरी स्त्री',
      reference: 'John 4:1-42',
      summaryEn: 'Jesus engages a socially isolated Samaritan woman in public conversation, addressing her deepest spiritual thirst with the promise of "Living Water."',
      summaryNe: 'येशूले समाजले हेला गरेको सामरी स्त्रीसँग इनारमा आदरपूर्वक कुरा गर्नुहुन्छ र उनको तृप्त नभएको हृदयलाई "जीवित पानी" को प्रतिज्ञा दिनुहुन्छ।',
      lessonEn: 'Christ breaks cultural taboos to offer truth, dignity, and eternal life directly to seekers.',
      lessonNe: 'ख्रीष्टले सामाजिक भेदभावहरू तोडेर सत्य, मर्यादा र अनन्त जीवनको वरदान दिनुहुन्छ।',
    },
  ];

  const faqs = [
    {
      id: 'faq-1',
      qEn: 'Who is Jesus Christ according to the Bible?',
      qNe: 'बाइबल अनुसार येशू ख्रीष्ट को हुनुहुन्छ?',
      aEn: 'The Bible presents Jesus Christ as the eternal Word who became flesh (John 1:1, 14), fully God and fully human. He taught radical love and humility, healed the sick, died on the cross for human sins, and rose bodily from the dead on the third day, conquering sin and death.',
      aNe: 'बाइबलले येशू ख्रीष्टलाई देहधारी हुनुभएको अनन्त वचन (यूहन्ना १:१, १४), पूर्ण परमेश्वर र पूर्ण मानिसको रूपमा प्रस्तुत गर्दछ। उहाँले असीम प्रेम र नम्रता सिकाउनुभयो, रोगीहरूलाई निको पार्नुभयो, मानव पापको निम्ति क्रूसमा प्राण दिनुभयो र तेस्रो दिनमा पुनरुत्थान हुनुभयो।',
    },
    {
      id: 'faq-2',
      qEn: 'What is the Christian Gospel ("Good News")?',
      qNe: 'ख्रीष्टियन "सुसमाचार" के हो?',
      aEn: 'The Gospel is that salvation is a free gift from God received through faith in Jesus Christ, not something earned through rituals, wealth, or self-effort (Ephesians 2:8-9, John 3:16). God entered human history in Christ to reconcile us to Himself in love.',
      aNe: 'सुसमाचार यो हो कि मुक्ति कुनै कर्म, पूजाआजा वा धनले कमाएको होइन, तर येशू ख्रीष्टमाथि विश्वासद्वारा प्राप्त हुने परमेश्वरको सित्तैँको अनुग्रहको वरदान हो (एफिसी २:८-९, यूहन्ना ३:१६)।',
    },
    {
      id: 'faq-3',
      qEn: 'How does Christianity view Hinduism, Buddhism, Islam, and other faiths?',
      qNe: 'ख्रीष्टियन विश्वासले हिन्दू, बौद्ध, किराँत र अन्य धर्महरूलाई कसरी हेर्छ?',
      aEn: 'The Bible commands Christians to love all neighbors (Matthew 22:39), give an answer for their hope with "gentleness and respect" (1 Peter 3:15), and live peaceably with everyone (Romans 12:18). Christians respect the moral wisdom, deep cultural heritage, and religious freedom of all people without coercion or condescension.',
      aNe: 'बाइबलले सबै छिमेकीलाई आफूलाई झैं प्रेम गर्न (मत्ती २२:३९), आफ्नो आशाको कारण "नम्रता र आदरसाथ" व्यक्त गर्न (१ पत्रुस ३:१५) र सबैसँग मेलमिलापमा बस्न आज्ञा गर्दछ। ख्रीष्टियनहरूले अन्य सबै आस्थाका मानिसहरूको स्वतन्त्रता र मर्यादाको उच्च सम्मान गर्दछन्।',
    },
    {
      id: 'faq-4',
      qEn: 'Do I have to convert or leave my family to learn about the Bible?',
      qNe: 'बाइबल सिक्न के मैले धर्म परिवर्तन गर्नुपर्छ वा परिवार छोड्नुपर्छ?',
      aEn: 'Absolutely not. Good News AI is an open educational platform. The Bible strongly emphasizes honoring parents and loving family (Exodus 20:12, 1 Timothy 5:8). You are free to read, learn, and explore Scripture at your own pace without pressure.',
      aNe: 'बिल्कुलै पर्दैन! बाइबलले आमाबाबुलाई आदर गर्न र परिवारलाई प्रेम गर्न उच्च स्थान दिएको छ। तपाईं कुनै दबाब बिना स्वतन्त्र रूपमा बाइबलका शिक्षाहरू पढ्न र अध्ययन गर्न सक्नुहुन्छ।',
    },
    {
      id: 'faq-5',
      qEn: 'What is Christian prayer? Does it guarantee instant wealth or miracles?',
      qNe: 'ख्रीष्टियन प्रार्थना के हो? के यसले तुरुन्तै धन वा चमत्कारको ग्यारेन्टी दिन्छ?',
      aEn: 'Christian prayer is an honest, personal conversation with God as our loving Father, modeled by Jesus in Matthew 6:9-13. It is not a magic chant for selfish gain or guaranteed wealth. It brings deep peace, guidance, forgiveness, and comfort in suffering.',
      aNe: 'प्रार्थना परमेश्वरसँगको इमानदार र मायालु कुराकानी हो। यो कुनै जादुई मन्त्र वा धनसम्पत्ति पाउने माध्यम होइन। यसले कष्टहरूमा शान्ति, क्षमा र ईश्वरीय अगुवाइ प्रदान गर्दछ।',
    },
  ];

  const handleConnectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectForm.consent) {
      showToast('Please check the voluntary consent box');
      return;
    }
    setConnectModalOpen(false);
    showToast(
      language === 'ne'
        ? 'तपाईंको अनुरोध सुरक्षित रूपमा स्थानीय पास्टरकहाँ पठाइयो'
        : 'Your voluntary inquiry was forwarded to a verified pastor'
    );
    setConnectForm({ name: '', contact: '', city: 'Kathmandu', message: '', consent: false });
  };

  return (
    <div className="space-y-12">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-amber-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
          <Compass className="w-4 h-4" />
          <span>{language === 'ne' ? 'सुसमाचार र विश्वासको खोजी' : 'Gospel Learning & Peaceful Dialogue'}</span>
        </div>
        <h2 className="font-serif-sacred text-2xl sm:text-4xl font-bold tracking-tight">
          {language === 'ne' ? 'येशू ख्रीष्टको जीवन, शिक्षाहरू र अनुग्रह' : 'The Life of Jesus & The Gospel of Grace'}
        </h2>
        <p className="text-slate-300 text-xs sm:text-sm font-light max-w-3xl leading-relaxed">
          {language === 'ne'
            ? 'ख्रीष्टियन विश्वास कुनै भारी नियमहरूको समूह होइन, तर टुटेको सम्बन्धलाई पुनः जोड्ने परमेश्वरको निःशर्त प्रेमको सन्देश हो।'
            : 'Christianity at its heart is not about burdensome legalism, but a restored relationship with God through Jesus Christ, who offered His life for humanity and calls us to love God and love our neighbors.'}
        </p>
      </div>

      {/* Biblical Stories & Parables of Compassion */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              {language === 'ne' ? 'येशूका दृष्टान्तहरू' : 'Parables of Compassion & Grace'}
            </span>
            <h3 className="font-serif-sacred font-bold text-xl sm:text-2xl text-slate-900">
              {language === 'ne' ? 'दया र क्षमाका बाइबलीय कथाहरू' : 'Stories that Reveal the Heart of God'}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {parables.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full">
                  {p.reference}
                </span>
                <h4 className="font-serif-sacred font-bold text-lg text-slate-900">
                  {language === 'ne' ? p.titleNe : p.titleEn}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'ne' ? p.summaryNe : p.summaryEn}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs text-amber-950 bg-amber-50/50 p-3 rounded-xl">
                <strong>{language === 'ne' ? 'मूल सन्देश:' : 'Key Message:'}</strong>{' '}
                {language === 'ne' ? p.lessonNe : p.lessonEn}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Respectful Faith Dialogue FAQ Accordion */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>{language === 'ne' ? 'जिज्ञासा र संवाद' : 'Respectful Faith Dialogue & Answers'}</span>
          </div>
          <h3 className="font-serif-sacred font-bold text-xl sm:text-2xl text-slate-900">
            {language === 'ne' ? 'ख्रीष्टियन विश्वास बारे बारम्बार सोधिने प्रश्नहरू' : 'Frequently Asked Questions with Biblical References'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {language === 'ne'
              ? 'बाइबलीय आधारमा सरल, सत्य र आदरपूर्वक दिइएका जवाफहरू।'
              : 'Clear, compassionate answers rooted directly in Scripture, distinguishing biblical text and historical reality.'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                  className="w-full text-left p-4 sm:p-5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between gap-4 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900">
                    {language === 'ne' ? faq.qNe : faq.qEn}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-amber-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-6 bg-white text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 animate-in fade-in">
                    <p>{language === 'ne' ? faq.aNe : faq.aEn}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Voluntary Church or Pastor Connection Invitation */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500" />
            {language === 'ne' ? 'स्वेच्छिक सहयोग र संगति' : 'Voluntary Fellowship & Pastoral Connection'}
          </span>
          <h3 className="font-serif-sacred font-bold text-xl sm:text-2xl text-slate-900">
            {language === 'ne'
              ? 'के तपाईं स्थानीय पास्टर वा संगतिसँग कुरा गर्न चाहनुहुन्छ?'
              : 'Interested in connecting with a trusted local pastor or Bible study group?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-light">
            {language === 'ne'
              ? 'यो पूर्ण रूपमा तपाईंको स्वेच्छामा आधारित छ। कुनै पनि व्यक्तिगत विवरण तपाईंको अनुमति बिना कसैसँग बाँडिँदैन।'
              : 'Completely voluntary. You are welcome to ask questions in private, request prayer, or connect with a verified local church in Nepal or your region.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setConnectModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <ChurchIcon className="w-4 h-4" />
            <span>{language === 'ne' ? 'स्वेच्छिक सम्पर्क अनुरोध' : 'Request Voluntary Contact'}</span>
          </button>

          <button
            onClick={() => setIsZipModalOpen(true)}
            className="px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ne' ? 'अध्ययन ZIP डाउनलोड' : 'Download Study ZIP'}</span>
          </button>
        </div>
      </div>

      {/* VOLUNTARY CONNECT MODAL */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-serif-sacred font-bold text-base text-slate-900">
                {language === 'ne' ? 'स्थानीय पास्टरसँग स्वेच्छिक सम्पर्क' : 'Voluntary Pastoral Connection'}
              </h3>
              <button
                onClick={() => setConnectModalOpen(false)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'ne'
                ? 'हामी तपाईंको गोपनीयतालाई सम्मान गर्छौं। तपाईंको अनुमति बिना कुनै पनि जानकारी कसैसँग साझा गरिने छैन।'
                : 'Good News AI guarantees zero spam, zero automated church registration, and zero data sharing without your explicit instruction.'}
            </p>

            <form onSubmit={handleConnectSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ne' ? 'तपाईंको नाम (वैकल्पिक / उपनाम पनि चल्छ)' : 'Name (Optional / Alias welcome)'}
                </label>
                <input
                  type="text"
                  value={connectForm.name}
                  onChange={(e) => setConnectForm({ ...connectForm, name: e.target.value })}
                  placeholder="e.g. Seeker / मित्र"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ne' ? 'सम्पर्क माध्यम (इमेल वा फोन)' : 'Contact (Email or Phone)'}
                </label>
                <input
                  type="text"
                  value={connectForm.contact}
                  onChange={(e) => setConnectForm({ ...connectForm, contact: e.target.value })}
                  placeholder="e.g. email@example.com or WhatsApp"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ne' ? 'शहर / जिल्ला' : 'City / Region'}
                </label>
                <select
                  value={connectForm.city}
                  onChange={(e) => setConnectForm({ ...connectForm, city: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="Kathmandu">Kathmandu (काठमाडौं)</option>
                  <option value="Lalitpur">Lalitpur (ललितपुर)</option>
                  <option value="Pokhara">Pokhara (पोखरा)</option>
                  <option value="Dharan">Dharan (धरान)</option>
                  <option value="Chitwan">Chitwan (चितवन)</option>
                  <option value="Butwal">Butwal (बुटवल)</option>
                  <option value="Biratnagar">Biratnagar (विराटनगर)</option>
                  <option value="International">Outside Nepal (अन्तर्राष्ट्रिय)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ne' ? 'तपाईंको प्रश्न वा प्रार्थना अनुरोध' : 'Your Question or Prayer Request'}
                </label>
                <textarea
                  rows={3}
                  value={connectForm.message}
                  onChange={(e) => setConnectForm({ ...connectForm, message: e.target.value })}
                  placeholder="What would you like to discuss or pray about?"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={connectForm.consent}
                  onChange={(e) => setConnectForm({ ...connectForm, consent: e.target.checked })}
                  className="mt-0.5 rounded-sm text-amber-600 focus:ring-amber-500"
                />
                <span className="text-[11px] text-slate-600 leading-tight">
                  {language === 'ne'
                    ? 'म स्वेच्छाले यो सम्पर्क अनुरोध पठाउन सहमत छु र मेरो गोपनीयता सुरक्षित रहनेछ।'
                    : 'I voluntarily request connection with a pastor for respectful conversation or prayer.'}
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConnectModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                >
                  Send Voluntary Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
