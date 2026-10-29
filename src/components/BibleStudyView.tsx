import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BIBLE_BOOKS, SAMPLE_VERSES } from '../data/bibleData';
import { READING_PLANS, BIBLE_QUIZZES } from '../data/learningData';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  BookmarkCheck,
  PlusCircle,
  Share2,
  Sparkles,
  Calendar,
  Award,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Search,
  Filter,
  Layers,
  BookMarked,
  Info,
} from 'lucide-react';

export const BibleStudyView: React.FC = () => {
  const {
    language,
    toggleBookmark,
    isBookmarked,
    addNote,
    readingProgress,
    togglePlanDay,
    quizScores,
    recordQuizScore,
    showToast,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'reader' | 'plans' | 'quizzes'>('reader');

  // Reader States
  const [selectedBookId, setSelectedBookId] = useState<string>('john');
  const [selectedChapter, setSelectedChapter] = useState<number>(3);
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | 'NT' | 'OT'>('NT');
  const [searchQuery, setSearchQuery] = useState('');

  // Verse Insight Modal State
  const [activeInsight, setActiveInsight] = useState<{
    reference: string;
    text: string;
    content: string;
    loading: boolean;
  } | null>(null);

  // Add Note Modal
  const [noteModal, setNoteModal] = useState<{
    open: boolean;
    reference: string;
    title: string;
    content: string;
  }>({
    open: false,
    reference: '',
    title: '',
    content: '',
  });

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Filtered books
  const filteredBooks = BIBLE_BOOKS.filter((b) => {
    const matchesTestament = testamentFilter === 'ALL' || b.testament === testamentFilter;
    const matchesSearch =
      b.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.nameNe.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTestament && matchesSearch;
  });

  const selectedBook = BIBLE_BOOKS.find((b) => b.id === selectedBookId) || BIBLE_BOOKS[3];

  // Retrieve verses for the selected book and chapter
  const versesKey = `${selectedBookId}-${selectedChapter}`;
  const currentVerses = SAMPLE_VERSES[versesKey] || SAMPLE_VERSES['john-3'] || [];

  const handleFetchVerseInsight = async (reference: string, text: string) => {
    setActiveInsight({
      reference,
      text,
      content: '',
      loading: true,
    });

    try {
      const res = await fetch('/api/gemini/verse-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verseReference: reference,
          verseText: text,
          language,
        }),
      });
      const data = await res.json();
      setActiveInsight({
        reference,
        text,
        content: data.insight || 'Historical context: Christ spoke to hearts seeking rebirth and grace.',
        loading: false,
      });
    } catch (e) {
      setActiveInsight({
        reference,
        text,
        content:
          language === 'ne'
            ? 'यस पदले परमेश्वरको निःस्वार्थ प्रेम, क्रूसको बलिदान र विश्वासद्वारा नयाँ जीवनको प्रतिज्ञा प्रकट गर्दछ।'
            : 'This passage emphasizes God’s unconditional love, the gift of grace, and salvation through faith in Jesus Christ.',
        loading: false,
      });
    }
  };

  const handleSaveNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteModal.title.trim()) return;
    addNote({
      title: noteModal.title,
      reference: noteModal.reference,
      content: noteModal.content,
      tags: ['Bible Study', selectedBook.nameEn],
    });
    setNoteModal({ open: false, reference: '', title: '', content: '' });
  };

  const handleQuizOptionSelect = (quizId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [quizId]: optionIdx }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    let correctCount = 0;
    BIBLE_QUIZZES.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    recordQuizScore('foundations-quiz', correctCount);

    if (correctCount >= 3) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      showToast(language === 'ne' ? 'उत्कृष्ट! बधाई छ!' : 'Well done! Great Bible knowledge!');
    }
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="space-y-8">
      {/* Sub Tabs Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs gap-2">
        <button
          onClick={() => setActiveSubTab('reader')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'reader'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>{language === 'ne' ? 'पवित्र बाइबल पाठक' : 'Scripture Reader'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('plans')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'plans'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{language === 'ne' ? 'पठन योजनाहरू' : 'Reading Plans'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quizzes')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'quizzes'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{language === 'ne' ? 'बाइबल हाजिरीजवाफ' : 'Bible Quizzes'}</span>
        </button>
      </div>

      {/* SCRIPTURE READER TAB */}
      {activeSubTab === 'reader' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Books Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-serif-sacred font-bold text-sm text-slate-900">
                {language === 'ne' ? 'बाइबलका पुस्तकहरू' : 'Books of the Bible'}
              </h3>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                66 Books
              </span>
            </div>

            {/* Testament Filter */}
            <div className="flex rounded-lg bg-slate-100 p-1 text-xs">
              <button
                onClick={() => setTestamentFilter('ALL')}
                className={`flex-1 py-1 rounded-md font-medium transition-all ${
                  testamentFilter === 'ALL' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTestamentFilter('NT')}
                className={`flex-1 py-1 rounded-md font-medium transition-all ${
                  testamentFilter === 'NT' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                {language === 'ne' ? 'नयाँ नियम' : 'New Test.'}
              </button>
              <button
                onClick={() => setTestamentFilter('OT')}
                className={`flex-1 py-1 rounded-md font-medium transition-all ${
                  testamentFilter === 'OT' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                }`}
              >
                {language === 'ne' ? 'पुरानो नियम' : 'Old Test.'}
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'ne' ? 'पुस्तक खोज्नुहोस्...' : 'Search books...'}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            {/* Books List */}
            <div className="max-h-[420px] overflow-y-auto space-y-1 pr-1">
              {filteredBooks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBookId(b.id);
                    setSelectedChapter(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all ${
                    selectedBookId === b.id
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-300/80 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="block font-medium">{language === 'ne' ? b.nameNe : b.nameEn}</span>
                    <span className="text-[10px] text-slate-400">{b.nameEn} • {b.category}</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm">
                    {b.chaptersCount} ch
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Reader Main Content */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            {/* Header with Chapter Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  {selectedBook.testament === 'NT' ? 'New Testament • नयाँ नियम' : 'Old Testament • पुरानो नियम'}
                </span>
                <h2 className="font-serif-sacred text-2xl font-bold text-slate-900">
                  {language === 'ne' ? selectedBook.nameNe : selectedBook.nameEn} {selectedChapter}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'ne' ? selectedBook.summaryNe : selectedBook.summaryEn}
                </p>
              </div>

              {/* Chapter Pill selector */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-400 mr-1">{language === 'ne' ? 'अध्याय:' : 'Chapter:'}</span>
                {Array.from({ length: Math.min(selectedBook.chaptersCount, 16) }, (_, i) => i + 1).map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setSelectedChapter(ch)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                      selectedChapter === ch
                        ? 'bg-amber-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            {/* Verses Container */}
            <div className="space-y-4">
              {currentVerses.map((v) => {
                const refKey = `${v.bookNameEn} ${v.chapter}:${v.verseNumber}`;
                const bookmarked = isBookmarked(refKey);

                return (
                  <div
                    key={v.verseNumber}
                    className="p-4 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/20 transition-all space-y-3 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0">
                          {v.verseNumber}
                        </span>
                        <span className="text-xs font-semibold text-slate-400">{refKey}</span>
                      </div>

                      {/* Verse Action Bar */}
                      <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleBookmark(refKey, language === 'ne' ? v.textNe : v.textEn)}
                          className={`p-1.5 rounded-lg text-xs border ${
                            bookmarked
                              ? 'bg-amber-100 border-amber-300 text-amber-800'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                          title="Bookmark"
                        >
                          <BookmarkCheck className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() =>
                            setNoteModal({
                              open: true,
                              reference: refKey,
                              title: `Reflection on ${refKey}`,
                              content: '',
                            })
                          }
                          className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100 text-xs"
                          title="Write Study Note"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() =>
                            handleFetchVerseInsight(
                              refKey,
                              language === 'ne' ? v.textNe : v.textEn
                            )
                          }
                          className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-semibold flex items-center gap-1 hover:bg-amber-100 cursor-pointer"
                          title="AI Theological & Historical Commentary"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>{language === 'ne' ? 'AI व्याख्या' : 'Explain'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Bilingual Text Presentation */}
                    <div className="space-y-1.5 pl-8 text-sm sm:text-base leading-relaxed">
                      <p className="text-slate-900 font-serif-sacred">{v.textNe}</p>
                      <p className="text-slate-500 text-xs sm:text-sm font-sans italic">{v.textEn}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* READING PLANS TAB */}
      {activeSubTab === 'plans' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-serif-sacred font-bold text-xl text-slate-900">
              {language === 'ne' ? 'दैनिक बाइबल पठन योजनाहरू' : 'Structured Daily Bible Reading Plans'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {language === 'ne'
                ? 'येशूको जीवन, सुसमाचार र अनुग्रहका जगहरू बुझ्नका लागि तयार गरिएका चरणबद्ध पठन मार्गहरू।'
                : 'Guided daily passages designed for steady spiritual growth, thoughtful reflection, and biblical understanding.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {READING_PLANS.map((plan) => {
              // Calculate progress
              const totalDays = plan.days.length;
              const completedDays = plan.days.filter((d) => readingProgress[`${plan.id}-${d.day}`]).length;
              const percent = Math.round((completedDays / totalDays) * 100);

              return (
                <div key={plan.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                        {plan.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {completedDays} / {totalDays} {language === 'ne' ? 'दिन पूरा' : 'Days Done'} ({percent}%)
                      </span>
                    </div>

                    <h4 className="font-serif-sacred font-bold text-lg text-slate-900">
                      {language === 'ne' ? plan.titleNe : plan.titleEn}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {language === 'ne' ? plan.descriptionNe : plan.descriptionEn}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Days List */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {plan.days.map((d) => {
                      const isDone = !!readingProgress[`${plan.id}-${d.day}`];
                      return (
                        <div
                          key={d.day}
                          onClick={() => togglePlanDay(plan.id, d.day)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isDone
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                              : 'bg-slate-50/70 border-slate-200 hover:border-amber-300 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                                isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {isDone ? '✓' : d.day}
                            </span>
                            <div>
                              <p className="text-xs font-bold">
                                {language === 'ne' ? d.themeNe : d.themeEn}
                              </p>
                              <p className="text-[11px] text-slate-500 font-medium">
                                {d.passages.join(', ')}
                              </p>
                            </div>
                          </div>

                          <span className="text-[11px] font-semibold">
                            {isDone ? (
                              <span className="text-emerald-700">Completed</span>
                            ) : (
                              <span className="text-slate-400">Mark Done</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BIBLE QUIZZES TAB */}
      {activeSubTab === 'quizzes' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Interactive Learning Check
              </span>
              <h3 className="font-serif-sacred font-bold text-xl text-slate-900">
                {language === 'ne' ? 'बाइबलीय ज्ञान र समझ हाजिरीजवाफ' : 'Bible Understanding & Theology Quiz'}
              </h3>
            </div>
            {quizSubmitted && (
              <button
                onClick={resetQuiz}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
              >
                {language === 'ne' ? 'पुनः प्रयास गर्नुहोस्' : 'Retake Quiz'}
              </button>
            )}
          </div>

          <div className="space-y-6">
            {BIBLE_QUIZZES.map((q, idx) => {
              const selectedOpt = quizAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border space-y-3 transition-all ${
                    quizSubmitted
                      ? isCorrect
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-rose-50/40 border-rose-200'
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      {idx + 1}. {language === 'ne' ? q.questionNe : q.questionEn}
                    </h4>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                      {q.bibleReference}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {(language === 'ne' ? q.optionsNe : q.optionsEn).map((opt, optIdx) => {
                      const isChosen = selectedOpt === optIdx;
                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-amber-300';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                        } else if (isChosen) {
                          btnStyle = 'bg-rose-100 border-rose-300 text-rose-900';
                        }
                      } else if (isChosen) {
                        btnStyle = 'bg-amber-100 border-amber-400 text-amber-950 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleQuizOptionSelect(q.id, optIdx)}
                          className={`p-3 rounded-xl border text-xs sm:text-sm text-left transition-all ${btnStyle}`}
                        >
                          <span className="font-semibold mr-1.5">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {quizSubmitted && (
                    <div className="pt-2 text-xs text-slate-600 bg-white/70 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                      <strong>{language === 'ne' ? 'बाइबलीय व्याख्या:' : 'Biblical Context:'}</strong>{' '}
                      {language === 'ne' ? q.explanationNe : q.explanationEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizAnswers).length === 0}
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md disabled:opacity-50 transition-all cursor-pointer"
            >
              {language === 'ne' ? 'उत्तरहरू जाँच्नुहोस्' : 'Submit & Check Answers'}
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-1">
              <p className="font-serif-sacred font-bold text-amber-950 text-base">
                {language === 'ne' ? 'तपाईंको नतिजा दर्ता गरियो!' : 'Quiz Completed!'}
              </p>
              <p className="text-xs text-amber-800">
                Score: {quizScores['foundations-quiz'] || 0} / {BIBLE_QUIZZES.length} Correct
              </p>
            </div>
          )}
        </div>
      )}

      {/* AI VERSE INSIGHT MODAL */}
      {activeInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif-sacred font-bold text-lg text-slate-900">
                  {activeInsight.reference} Insight
                </h3>
              </div>
              <button
                onClick={() => setActiveInsight(null)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                ✕
              </button>
            </div>

            <blockquote className="text-xs text-slate-600 italic bg-amber-50/50 p-3 rounded-xl border border-amber-200/50">
              "{activeInsight.text}"
            </blockquote>

            {activeInsight.loading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
                <Sparkles className="w-6 h-6 animate-spin text-amber-600" />
                <span>Generating theological & historical commentary...</span>
              </div>
            ) : (
              <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                {activeInsight.content}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => {
                  addNote({
                    title: `Commentary: ${activeInsight.reference}`,
                    reference: activeInsight.reference,
                    content: activeInsight.content,
                    tags: ['AI Insight'],
                  });
                  setActiveInsight(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
              >
                {language === 'ne' ? 'नोटको रूपमा सुरक्षित गर्नुहोस्' : 'Save to Study Notes'}
              </button>
              <button
                onClick={() => setActiveInsight(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
              >
                {language === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WRITE STUDY NOTE MODAL */}
      {noteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-serif-sacred font-bold text-base text-slate-900">
                {language === 'ne' ? 'बाइबल अध्ययन नोट थप्नुहोस्' : 'Add Bible Study Note'}
              </h3>
              <button
                onClick={() => setNoteModal({ ...noteModal, open: false })}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNoteSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'ne' ? 'शास्त्र पद सन्दर्भ' : 'Scripture Reference'}
                </label>
                <input
                  type="text"
                  value={noteModal.reference}
                  onChange={(e) => setNoteModal({ ...noteModal, reference: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'ne' ? 'शीर्षक' : 'Note Title'}
                </label>
                <input
                  type="text"
                  value={noteModal.title}
                  onChange={(e) => setNoteModal({ ...noteModal, title: e.target.value })}
                  placeholder="e.g. Grace over guilt, Loving my neighbor"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {language === 'ne' ? 'तपाईंको व्यक्तिगत मनन र बुझाइ' : 'Your Personal Study Notes'}
                </label>
                <textarea
                  rows={4}
                  value={noteModal.content}
                  onChange={(e) => setNoteModal({ ...noteModal, content: e.target.value })}
                  placeholder="What is God speaking through this Scripture? How does this apply to my daily actions?"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNoteModal({ ...noteModal, open: false })}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
