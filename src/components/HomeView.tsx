import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DAILY_DEVOTIONALS } from '../data/bibleData';
import {
  Sparkles,
  BookOpen,
  MessageSquare,
  Compass,
  Heart,
  Church as ChurchIcon,
  ShieldCheck,
  Download,
  Share2,
  Volume2,
  BookmarkCheck,
  ChevronRight,
  Sun,
  HeartHandshake,
  Users,
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    language,
    setActiveTab,
    setIsZipModalOpen,
    toggleBookmark,
    isBookmarked,
    addNote,
    showToast,
    openLegalPolicy,
  } = useApp();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const devotional = DAILY_DEVOTIONALS[0];

  const handleAudioPlayback = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Audio playback not supported in this browser');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const textToSpeak =
      language === 'ne'
        ? `${devotional.titleNe}. ${devotional.verseNe}`
        : `${devotional.titleEn}. ${devotional.verseEn}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'ne' ? 'ne-NP' : 'en-US';
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    showToast(language === 'ne' ? 'अडियो वाचन सुरु भयो' : 'Reciting daily Scripture');
  };

  const handleCopyVerse = () => {
    const text = `${devotional.verseRef}: "${language === 'ne' ? devotional.verseNe : devotional.verseEn}"`;
    navigator.clipboard.writeText(text);
    showToast(language === 'ne' ? 'पद प्रतिलिपि गरियो' : 'Scripture copied to clipboard');
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,119,6,0.25),rgba(255,255,255,0))]"></div>
        <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-medium tracking-wide">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>
              {language === 'ne'
                ? 'सुसमाचार AI • शान्ति, प्रेम र सत्यको खोजी'
                : 'Good News AI • Biblical Learning & Respectful Faith Dialogue'}
            </span>
          </div>

          <h1 className="font-serif-sacred text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {language === 'ne' ? (
              <>
                परमेश्वरको प्रेम र <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">
                  बाइबलीय शिक्षाहरू बुझ्नुहोस्
                </span>
              </>
            ) : (
              <>
                Discover the Love of God &amp; <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">
                  The Teachings of Jesus Christ
                </span>
              </>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {language === 'ne'
              ? 'सबै धर्म, संस्कृति र पृष्ठभूमिका मानिसहरूप्रति उच्च आदर राख्दै, कुनै पनि दबाब वा भेदभाव बिना—बाइबल अध्ययन गर्न, ख्रीष्टियन विश्वास बुझ्न र सुसमाचार सुन्न एक सुरक्षित र मायालु थलो।'
              : 'A peaceful, biblically grounded platform created with deep reverence for people of all faiths—Hindu, Buddhist, Muslim, Kirat, indigenous and secular. Explore Scripture freely, ask honest questions, and receive grace.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('ai-assistant')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-103 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-slate-950" />
              <span>{language === 'ne' ? 'सुसमाचार AI सँग सोध्नुहोस्' : 'Ask Gospel AI'}</span>
            </button>

            <button
              onClick={() => setActiveTab('bible-study')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm flex items-center gap-2 transition-all hover:scale-103 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span>{language === 'ne' ? 'पवित्र बाइबल पढ्नुहोस्' : 'Study the Bible'}</span>
            </button>

            <button
              onClick={() => setIsZipModalOpen(true)}
              className="px-4 py-3.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 font-medium text-sm border border-emerald-500/30 flex items-center gap-2 transition-all cursor-pointer"
              title="Download Data Archive ZIP"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">{language === 'ne' ? 'डाटा संग्रह ZIP' : 'Export ZIP'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Daily Scripture of Peace Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                {language === 'ne' ? 'आजको दैनिक वचन र मनन' : 'Daily Scripture Meditation'}
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-serif-sacred text-slate-900">
                {language === 'ne' ? devotional.titleNe : devotional.titleEn}
              </h2>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAudioPlayback}
              className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                isPlayingAudio
                  ? 'bg-amber-100 border-amber-300 text-amber-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Audio Reading"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isPlayingAudio
                  ? language === 'ne' ? 'रोक्नुहोस्' : 'Stop'
                  : language === 'ne' ? 'सुन्नुहोस्' : 'Listen'}
              </span>
            </button>

            <button
              onClick={() => toggleBookmark(devotional.verseRef, language === 'ne' ? devotional.verseNe : devotional.verseEn)}
              className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                isBookmarked(devotional.verseRef)
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Bookmark"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isBookmarked(devotional.verseRef)
                  ? language === 'ne' ? 'सुरक्षित' : 'Bookmarked'
                  : language === 'ne' ? 'बुकमार्क' : 'Bookmark'}
              </span>
            </button>

            <button
              onClick={handleCopyVerse}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium flex items-center gap-1"
              title="Copy"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'ne' ? 'प्रतिलिपि' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Verse text */}
        <div className="py-6 space-y-4">
          <blockquote className="text-base sm:text-xl font-serif-sacred text-slate-800 italic leading-relaxed border-l-4 border-amber-500 pl-4">
            "{language === 'ne' ? devotional.verseNe : devotional.verseEn}"
          </blockquote>
          <p className="text-sm font-bold text-amber-800 text-right pr-2">
            — {devotional.verseRef}
          </p>

          <div className="bg-amber-50/50 rounded-2xl p-4 sm:p-5 border border-amber-200/60 space-y-2 text-xs sm:text-sm text-slate-700">
            <p className="font-semibold text-amber-900">
              {language === 'ne' ? 'मनन र सान्त्वना:' : 'Reflection & Comfort:'}
            </p>
            <p className="leading-relaxed">
              {language === 'ne' ? devotional.reflectionNe : devotional.reflectionEn}
            </p>
            <div className="pt-2 text-slate-600 italic">
              <strong>{language === 'ne' ? 'दैनिक प्रार्थना:' : 'Daily Prayer:'}</strong> "
              {language === 'ne' ? devotional.prayerNe : devotional.prayerEn}"
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launch Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-serif-sacred font-bold text-slate-900">
            {language === 'ne' ? 'अध्ययन र संवादका क्षेत्रहरू' : 'Explore Learning & Faith Pathways'}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            {language === 'ne' ? '६६ पुस्तकहरू र स्रोतहरू' : '66 Books & Verified Resources'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: AI Assistant */}
          <div
            onClick={() => setActiveTab('ai-assistant')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="font-serif-sacred font-bold text-lg text-slate-900 group-hover:text-amber-800 transition-colors flex items-center justify-between">
              <span>{language === 'ne' ? 'सुसमाचार AI संवाद' : 'AI Gospel Assistant'}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ne'
                ? 'बाइबलीय सन्दर्भसहित येशूका शिक्षाहरू, अनुग्रह र मुक्तिको अर्थ बारे कुनै पनि जिज्ञासा सोध्नुहोस्।'
                : 'Ask questions about Jesus Christ, the Gospel of Grace, parables, and Christian faith with verified chapter & verse citations.'}
            </p>
          </div>

          {/* Card 2: Bible Study */}
          <div
            onClick={() => setActiveTab('bible-study')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif-sacred font-bold text-lg text-slate-900 group-hover:text-blue-800 transition-colors flex items-center justify-between">
              <span>{language === 'ne' ? 'बाइबल अध्ययन र योजना' : 'Bible Study & Plans'}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ne'
                ? 'नयाँ र पुरानो नियमका पुस्तकहरू नेपाली र अंग्रेजीमा समानान्तर पढ्नुहोस्, नोट लेख्नुहोस् र हाजिरीजवाफ खेल्नुहोस्।'
                : 'Read Old & New Testaments, track the 21-Day Gospel of John plan, take verse notes, and test your knowledge with quizzes.'}
            </p>
          </div>

          {/* Card 3: Gospel Learning & Faith Dialogue */}
          <div
            onClick={() => setActiveTab('gospel-learning')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif-sacred font-bold text-lg text-slate-900 group-hover:text-emerald-800 transition-colors flex items-center justify-between">
              <span>{language === 'ne' ? 'विश्वास र आदरपूर्ण संवाद' : 'Gospel Learning & FAQs'}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ne'
                ? 'येशूको जीवन, हराएको छोराको दृष्टान्त, र हिन्दू, बौद्ध तथा अन्य परम्पराहरूसँगको शान्तिपूर्ण सह-अस्तित्व।'
                : 'Explore core Christian beliefs, Christ’s parables of mercy, and respectful answers regarding faith in South Asian cultures.'}
            </p>
          </div>

          {/* Card 4: Resource Library */}
          <div
            onClick={() => setActiveTab('resources')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif-sacred font-bold text-lg text-slate-900 group-hover:text-purple-800 transition-colors flex items-center justify-between">
              <span>{language === 'ne' ? 'प्रमाणित स्रोत पुस्तकालय' : 'Christian Resource Library'}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ne'
                ? 'ई-पुस्तक, लेख, प्रवचन र चेलापनका स्रोतहरू—प्रतिलिपि अधिकार र प्रशासनिक स्वीकृति विवरणसहित।'
                : 'Access verified Christian ebooks, articles, sermons, and apologetics with copyright metadata and theological approval.'}
            </p>
          </div>

          {/* Card 5: Churches Directory */}
          <div
            onClick={() => setActiveTab('churches')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChurchIcon className="w-6 h-6" />
            </div>
            <h3 className="font-serif-sacred font-bold text-lg text-slate-900 group-hover:text-indigo-800 transition-colors flex items-center justify-between">
              <span>{language === 'ne' ? 'प्रमाणित मण्डली विवरण' : 'Verified Churches Directory'}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ne'
                ? 'काठमाडौं, पोखरा, ललितपुर, धरान, चितवन आदि स्थानका मण्डलीहरू र पास्टरहरूसँग स्वेच्छिक सम्पर्क।'
                : 'Find verified local congregations across Nepal and beyond. Request a voluntary connection with a pastor on your own terms.'}
            </p>
          </div>

          {/* Card 6: Prayer Journal & ZIP Archive */}
          <div
            onClick={() => setActiveTab('devotional')}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all cursor-pointer group space-y-3"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif-sacred font-bold text-lg text-slate-900 group-hover:text-rose-800 transition-colors flex items-center justify-between">
              <span>{language === 'ne' ? 'निजी प्रार्थना डायरी' : 'Private Prayer Journal'}</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {language === 'ne'
                ? 'आफ्ना व्यक्तिगत प्रार्थनाहरू सुरक्षित रूपमा राख्नुहोस्, उत्तरहरूको प्रशंसा मनाउनुहोस्, र ZIP ढाँचामा डाउनलोड गर्नुहोस्।'
                : 'Keep your private prayers confidential, mark answered praises, track spiritual growth, and export archives directly.'}
            </p>
          </div>
        </div>
      </section>

      {/* Religious Respect and Non-Discrimination Manifesto Banner */}
      <section className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-3 text-amber-400">
          <HeartHandshake className="w-7 h-7" />
          <h2 className="text-xl sm:text-2xl font-serif-sacred font-bold tracking-tight">
            {language === 'ne' ? 'धार्मिक आदर र अहिंसाको प्रतिज्ञा' : 'Our Solemn Pledge of Respect & Free Conscience'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-300 font-light">
          <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              {language === 'ne' ? 'सबै धर्म र संस्कृतिको सम्मान' : 'Honoring All Traditions'}
            </h4>
            <p>
              {language === 'ne'
                ? 'हामी हिन्दू, बौद्ध, किराँत, इस्लाम, आदिवासी र गैर-धार्मिक पृष्ठभूमिका सम्पूर्ण दाजुभाइ दिदीबहिनीहरूलाई आदर गर्दछौं।'
                : 'We treat people of Hindu, Buddhist, Muslim, Kirat, indigenous, and secular backgrounds with equal dignity and love.'}
            </p>
          </div>

          <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              {language === 'ne' ? 'कुनै दबाब वा धर्म परिवर्तनको बाध्यता छैन' : 'Zero Coercion or Pressure'}
            </h4>
            <p>
              {language === 'ne'
                ? 'हाम्रो प्लेटफर्मले कसैलाई धर्म परिवर्तन गर्न, व्यक्तिगत विवरण दिन वा विश्वास स्वीकार गर्न बाध्य पार्दैन।'
                : 'No forced conversion, manipulation, or pressure. Faith in Christ is a voluntary journey of grace and free conscience.'}
            </p>
          </div>

          <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
            <h4 className="font-semibold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-400" />
              {language === 'ne' ? 'डाटा गोपनीयता र ZIP निर्यात' : 'Data Privacy & ZIP Export'}
            </h4>
            <p>
              {language === 'ne'
                ? 'तपाईंको प्रार्थना र नोटहरू निजी रहन्छन्। कुनै पनि समय एक क्लिकमा सम्पूर्ण ZIP संग्रह डाउनलोड गर्नुहोस्।'
                : 'Your prayer entries and notes are private. Export all your data anytime directly in a ZIP archive.'}
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 text-xs text-slate-400">
          <span>Good News AI / सुसमाचार AI • Guided by 1 Peter 3:15 ("With Gentleness and Respect")</span>
          <button
            onClick={() => openLegalPolicy('respect')}
            className="text-amber-300 hover:text-amber-200 underline font-medium cursor-pointer"
          >
            {language === 'ne' ? 'आदर नीति पूर्ण रूपमा पढ्नुहोस्' : 'Read Full Respect & Safety Policy →'}
          </button>
        </div>
      </section>
    </div>
  );
};
