import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChristianResource } from '../types';
import {
  FileText,
  Book,
  Headphones,
  Video,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Download,
  BookOpen,
  Share2,
} from 'lucide-react';

export const ResourceLibraryView: React.FC = () => {
  const {
    language,
    resources,
    toggleResourceApproval,
    user,
    setIsZipModalOpen,
    showToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLang, setSelectedLang] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResource, setActiveResource] = useState<ChristianResource | null>(null);

  const categories = [
    { id: 'ALL', labelEn: 'All Resources', labelNe: 'सबै स्रोतहरू' },
    { id: 'Article', labelEn: 'Articles', labelNe: 'लेखहरू' },
    { id: 'Ebook', labelEn: 'Ebooks & Guides', labelNe: 'ई-पुस्तकहरू' },
    { id: 'Sermon', labelEn: 'Sermons & Transcripts', labelNe: 'प्रवचनहरू' },
    { id: 'Discipleship', labelEn: 'Discipleship', labelNe: 'चेलापन' },
    { id: 'Apologetics', labelEn: 'Apologetics & History', labelNe: 'इतिहास र संवाद' },
  ];

  const filteredResources = resources.filter((res) => {
    const matchesCat = selectedCategory === 'ALL' || res.category === selectedCategory;
    const matchesLang =
      selectedLang === 'ALL' ||
      res.language === selectedLang ||
      (selectedLang === 'ne' && res.language === 'bilingual');
    const matchesSearch =
      res.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.titleNe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesLang && matchesSearch;
  });

  const canManageContent =
    user.role === 'Super Admin' || user.role === 'Content Admin';

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Article':
        return FileText;
      case 'Ebook':
        return Book;
      case 'Sermon':
      case 'Podcast':
        return Headphones;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>{language === 'ne' ? 'प्रमाणित ख्रीष्टियन पुस्तकालय' : 'Verified Christian Resource Library'}</span>
            </div>
            <h2 className="font-serif-sacred text-2xl font-bold text-slate-900 mt-1">
              {language === 'ne' ? 'आत्मिक अध्ययन स्रोतहरू' : 'Theological Articles, Ebooks & Audio Teachings'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              {language === 'ne'
                ? 'प्रतिलिपि अधिकार अनुमति र आधिकारिक धार्मिक स्वीकृति प्राप्त शैक्षिक सामग्रीहरू।'
                : 'Curated Christian educational materials with author attribution, copyright disclosures, and board approval status.'}
            </p>
          </div>

          <button
            onClick={() => setIsZipModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>{language === 'ne' ? 'सम्पूर्ण पुस्तकालय सूची ZIP' : 'Export Catalog ZIP'}</span>
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="pt-2 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'ne'
                  ? 'शीर्षक, लेखक वा विषय अनुसार खोज्नुहोस्...'
                  : 'Search by title, author, or keyword...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700"
            >
              <option value="ALL">All Languages</option>
              <option value="ne">Nepali (नेपाली)</option>
              <option value="en">English</option>
              <option value="bilingual">Bilingual</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {language === 'ne' ? c.labelNe : c.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => {
          const Icon = getCategoryIcon(res.category);
          const isApproved = res.approvalStatus === 'Approved';

          return (
            <div
              key={res.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Icon className="w-3 h-3 text-amber-600" />
                    <span>{res.category}</span>
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isApproved
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isApproved ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                    <span>{res.approvalStatus}</span>
                  </span>
                </div>

                <h3 className="font-serif-sacred font-bold text-base text-slate-900 leading-snug">
                  {language === 'ne' ? res.titleNe : res.titleEn}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {language === 'ne' ? res.descriptionNe : res.descriptionEn}
                </p>

                <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-slate-100">
                  <p><strong>Author:</strong> {res.author}</p>
                  <p><strong>Published:</strong> {res.publishDate} • {res.language.toUpperCase()}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveResource(res)}
                  className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'ne' ? 'अध्ययन गर्नुहोस्' : 'Read & Explore'}</span>
                  <span>→</span>
                </button>

                {canManageContent && (
                  <button
                    onClick={() => toggleResourceApproval(res.id)}
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-900 underline"
                  >
                    {isApproved ? 'Unapprove' : 'Approve'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* RESOURCE PREVIEW MODAL */}
      {activeResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                  {activeResource.category} • {activeResource.language.toUpperCase()}
                </span>
                <h3 className="font-serif-sacred font-bold text-xl text-slate-900 mt-1">
                  {language === 'ne' ? activeResource.titleNe : activeResource.titleEn}
                </h3>
                <p className="text-xs text-slate-500">By {activeResource.author} • Published {activeResource.publishDate}</p>
              </div>
              <button
                onClick={() => setActiveResource(null)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 font-serif-sacred text-amber-950">
                "{language === 'ne' ? activeResource.descriptionNe : activeResource.descriptionEn}"
              </div>

              {activeResource.contentSnippet && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {activeResource.contentSnippet}
                </div>
              )}

              {/* Copyright & License Information */}
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 space-y-1 border border-slate-200">
                <p className="font-bold text-slate-700">Copyright & Usage Information:</p>
                <p>{activeResource.copyright}</p>
                <p>Status: <span className="text-emerald-700 font-semibold">{activeResource.approvalStatus}</span></p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${activeResource.titleEn}\n${activeResource.descriptionEn}\nAuthor: ${activeResource.author}`
                  );
                  showToast('Resource info copied to clipboard');
                }}
                className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Reference</span>
              </button>

              <button
                onClick={() => setActiveResource(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
