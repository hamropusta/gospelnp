import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DAILY_DEVOTIONALS } from '../data/bibleData';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sun,
  PlusCircle,
  CheckCircle,
  Clock,
  Trash2,
  Download,
  Sparkles,
  Shield,
  Volume2,
  Calendar,
} from 'lucide-react';

export const DevotionalPrayerJournalView: React.FC = () => {
  const {
    language,
    prayerJournal,
    addPrayer,
    toggleAnsweredPrayer,
    deletePrayer,
    setIsZipModalOpen,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'journal' | 'devotional'>('journal');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // New Prayer Form
  const [newPrayerModal, setNewPrayerModal] = useState(false);
  const [prayerForm, setPrayerForm] = useState({
    title: '',
    content: '',
    category: 'Personal' as any,
  });

  const devotional = DAILY_DEVOTIONALS[0];

  const categories = [
    'ALL',
    'Personal',
    'Family',
    'Church',
    'Nation',
    'Comfort & Healing',
    'Spiritual Growth',
  ];

  const answeredCount = prayerJournal.filter((p) => p.isAnswered).length;
  const filteredPrayers = prayerJournal.filter((p) => {
    return filterCategory === 'ALL' || p.category === filterCategory;
  });

  const handleCreatePrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prayerForm.title.trim()) return;

    addPrayer({
      title: prayerForm.title,
      content: prayerForm.content,
      category: prayerForm.category,
    });

    setNewPrayerModal(false);
    setPrayerForm({ title: '', content: '', category: 'Personal' });
  };

  const handleToggleAnswer = (id: string, currentlyAnswered: boolean) => {
    if (!currentlyAnswered) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });
      showToast(language === 'ne' ? 'प्रभुको उत्तरको निम्ति धन्यवाद र प्रशंसा!' : 'Praising God for answered prayer!');
    }
    toggleAnsweredPrayer(id);
  };

  return (
    <div className="space-y-8">
      {/* Top Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs gap-2">
        <button
          onClick={() => setActiveTab('journal')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'journal'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>{language === 'ne' ? 'निजी प्रार्थना डायरी' : 'Private Prayer Journal'}</span>
        </button>

        <button
          onClick={() => setActiveTab('devotional')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'devotional'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sun className="w-4 h-4" />
          <span>{language === 'ne' ? 'दैनिक भक्ति र मनन' : 'Daily Devotional'}</span>
        </button>
      </div>

      {activeTab === 'journal' && (
        <div className="space-y-6">
          {/* Header & Stats Banner */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
                  <Heart className="w-4 h-4" />
                  <span>{language === 'ne' ? 'व्यक्तिगत प्रार्थना र उत्तरहरू' : 'Personal Prayer Requests & Praise'}</span>
                </div>
                <h2 className="font-serif-sacred text-2xl font-bold text-slate-900 mt-1">
                  {language === 'ne' ? 'तपाईंको गोप्य प्रार्थना कक्ष' : 'Your Quiet Place of Prayer'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                  {language === 'ne'
                    ? 'सबै प्रविष्टिहरू पूर्ण रूपमा निजी छन्। उत्तर प्राप्त हुँदा धन्यवादको चिन्ह लगाउनुहोस्।'
                    : 'All entries are strictly confidential. Track your ongoing petitions and celebrate answered prayers.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNewPrayerModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{language === 'ne' ? 'नयाँ प्रार्थना थप्नुहोस्' : 'Add Prayer'}</span>
                </button>

                <button
                  onClick={() => setIsZipModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                  title="Export Prayer Journal to ZIP"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span className="hidden sm:inline">ZIP Export</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 text-xs">
              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200/50">
                <span className="text-slate-500 block">Total Prayers:</span>
                <span className="text-lg font-bold text-rose-900">{prayerJournal.length}</span>
              </div>
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/50">
                <span className="text-slate-500 block">Answered Praises:</span>
                <span className="text-lg font-bold text-emerald-900">{answeredCount}</span>
              </div>
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/50 col-span-2 sm:col-span-1">
                <span className="text-slate-500 block">Confidentiality:</span>
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1 mt-1">
                  <Shield className="w-3.5 h-3.5 text-amber-600" /> 100% Private Data
                </span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 pt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    filterCategory === cat
                      ? 'bg-rose-900 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Disclaimer Banner */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-500 flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              {language === 'ne'
                ? 'हाम्रो AI ले कुनै पनि प्रार्थनाको फल, चमत्कार वा आर्थिक लाभको ग्यारेन्टी गर्दैन। प्रार्थना परमेश्वरसँगको हृदयको सम्बन्ध हो।'
                : 'Good News AI does not guarantee miraculous cures or material prosperity. Prayer is trusting God’s loving will with an honest heart.'}
            </span>
          </div>

          {/* Prayers List */}
          <div className="space-y-4">
            {filteredPrayers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700">No prayer items in this category</h4>
                <p className="text-xs text-slate-400">Record a prayer request to keep your faith journey close to your heart.</p>
              </div>
            ) : (
              filteredPrayers.map((prayer) => (
                <div
                  key={prayer.id}
                  className={`bg-white rounded-2xl p-6 border transition-all space-y-3 ${
                    prayer.isAnswered
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full">
                          {prayer.category}
                        </span>
                        <span className="text-xs text-slate-400">{prayer.date}</span>
                      </div>
                      <h3 className="font-serif-sacred font-bold text-base sm:text-lg text-slate-900">
                        {prayer.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAnswer(prayer.id, prayer.isAnswered)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                          prayer.isAnswered
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-emerald-50 hover:text-emerald-800'
                        }`}
                      >
                        <CheckCircle className={`w-3.5 h-3.5 ${prayer.isAnswered ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span>{prayer.isAnswered ? 'Answered Praise (धन्यवाद)' : 'Mark Answered'}</span>
                      </button>

                      <button
                        onClick={() => deletePrayer(prayer.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                        title="Delete prayer entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {prayer.content}
                  </p>

                  {prayer.answeredNotes && (
                    <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                      <span className="font-bold">Testimony / Thanksgiving Note:</span>
                      <p className="italic">{prayer.answeredNotes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'devotional' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                {language === 'ne' ? 'आजको धर्मशास्त्र ध्यान' : "Today's Scripture Devotion"}
              </span>
              <h2 className="font-serif-sacred text-2xl font-bold text-slate-900 mt-1">
                {language === 'ne' ? devotional.titleNe : devotional.titleEn}
              </h2>
            </div>
            <span className="text-xs bg-amber-50 text-amber-900 px-3 py-1 rounded-full font-semibold">
              {devotional.verseRef}
            </span>
          </div>

          <blockquote className="text-lg sm:text-xl font-serif-sacred text-slate-800 italic leading-relaxed border-l-4 border-amber-500 pl-4 py-1">
            "{language === 'ne' ? devotional.verseNe : devotional.verseEn}"
          </blockquote>

          <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200/80 space-y-3 text-xs sm:text-sm text-slate-700">
            <h4 className="font-bold text-amber-900 text-sm">
              {language === 'ne' ? 'आत्मिक मनन:' : 'Spiritual Reflection:'}
            </h4>
            <p className="leading-relaxed">
              {language === 'ne' ? devotional.reflectionNe : devotional.reflectionEn}
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-800">
            <h4 className="font-bold text-slate-900 text-sm">
              {language === 'ne' ? 'आजको प्रार्थना:' : 'Guided Daily Prayer:'}
            </h4>
            <p className="italic leading-relaxed">
              "{language === 'ne' ? devotional.prayerNe : devotional.prayerEn}"
            </p>
          </div>
        </div>
      )}

      {/* NEW PRAYER MODAL */}
      {newPrayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-serif-sacred font-bold text-base text-slate-900">
                {language === 'ne' ? 'नयाँ प्रार्थना निवेदन थप्नुहोस्' : 'New Prayer Journal Entry'}
              </h3>
              <button
                onClick={() => setNewPrayerModal(false)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePrayer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ne' ? 'प्रार्थनाको विषय / शीर्षक' : 'Prayer Title'}
                </label>
                <input
                  type="text"
                  value={prayerForm.title}
                  onChange={(e) => setPrayerForm({ ...prayerForm, title: e.target.value })}
                  placeholder="e.g. Peace for family, Guidance in decision"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ne' ? 'श्रेणी' : 'Category'}
                </label>
                <select
                  value={prayerForm.category}
                  onChange={(e) => setPrayerForm({ ...prayerForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                >
                  <option value="Personal">Personal (व्यक्तिगत)</option>
                  <option value="Family">Family (परिवार)</option>
                  <option value="Church">Church & Fellowship (मण्डली)</option>
                  <option value="Nation">Nation & Community (देश र समाज)</option>
                  <option value="Comfort & Healing">Comfort & Healing (सान्त्वना र चंगाई)</option>
                  <option value="Spiritual Growth">Spiritual Growth (आत्मिक वृद्धि)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ne' ? 'प्रार्थना विवरण र भावनाहरू' : 'Prayer Details'}
                </label>
                <textarea
                  rows={4}
                  value={prayerForm.content}
                  onChange={(e) => setPrayerForm({ ...prayerForm, content: e.target.value })}
                  placeholder="Speak your heart honestly to God..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewPrayerModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                >
                  Record Prayer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
