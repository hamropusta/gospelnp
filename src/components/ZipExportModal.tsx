import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { downloadUserDataZip, downloadAdminSystemBackupZip } from '../utils/zipExporter';
import {
  X,
  Download,
  FileArchive,
  CheckCircle,
  FileText,
  Heart,
  BookMarked,
  ShieldCheck,
  Server,
  FolderArchive,
  Sparkles,
} from 'lucide-react';

export const ZipExportModal: React.FC = () => {
  const {
    isZipModalOpen,
    setIsZipModalOpen,
    language,
    notes,
    bookmarks,
    prayerJournal,
    readingProgress,
    auditLogs,
    resources,
    churches,
    user,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'user' | 'admin' | 'server'>('user');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // User Export Selection Options
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includePrayers, setIncludePrayers] = useState(true);
  const [includeBookmarks, setIncludeBookmarks] = useState(true);
  const [includeProgress, setIncludeProgress] = useState(true);
  const [includeMarkdownSummary, setIncludeMarkdownSummary] = useState(true);

  if (!isZipModalOpen) return null;

  const handleDownloadUserZip = async () => {
    try {
      setIsGenerating(true);
      setDownloadSuccess(null);

      const result = await downloadUserDataZip({
        notes: includeNotes ? notes : [],
        bookmarks: includeBookmarks ? bookmarks : [],
        prayerJournal: includePrayers ? prayerJournal : [],
        studyProgress: includeProgress ? readingProgress : {},
        language,
        archiveName: 'good-news-ai-personal-archive',
      });

      const sizeKb = (result.sizeBytes / 1024).toFixed(1);
      setDownloadSuccess(`${result.filename} (${sizeKb} KB)`);
      showToast(language === 'ne' ? 'ZIP संग्रह सफलतापूर्वक डाउनलोड भयो' : 'ZIP archive downloaded successfully');
    } catch (err: any) {
      console.error(err);
      showToast('Error generating archive');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAdminZip = async () => {
    try {
      setIsGenerating(true);
      setDownloadSuccess(null);

      const result = await downloadAdminSystemBackupZip({
        auditLogs,
        resources,
        churches,
      });

      const sizeKb = (result.sizeBytes / 1024).toFixed(1);
      setDownloadSuccess(`${result.filename} (${sizeKb} KB)`);
      showToast('Admin backup archive downloaded');
    } catch (err: any) {
      console.error(err);
      showToast('Error generating admin backup');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleServerStreamZip = async () => {
    try {
      setIsGenerating(true);
      setDownloadSuccess(null);

      const response = await fetch('/api/export/archive-zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exportType: user.role.includes('Admin') ? 'admin_backup' : 'user_data',
          notes,
          bookmarks,
          prayerJournal,
          studyProgress: readingProgress,
        }),
      });

      if (!response.ok) throw new Error('Server archive generation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `good-news-ai-server-archive-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(`good-news-ai-server-archive.zip (${(blob.size / 1024).toFixed(1)} KB)`);
      showToast('Server ZIP archive streamed successfully');
    } catch (err: any) {
      console.error(err);
      showToast('Server archive error, generating via client backup...');
      handleDownloadUserZip();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-300">
              <FolderArchive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif-sacred font-bold text-lg text-white">
                {language === 'ne' ? 'डाटा संग्रह ZIP व्यवस्थापन' : 'Download File ZIP Management'}
              </h3>
              <p className="text-xs text-slate-300">
                {language === 'ne'
                  ? 'तपाईंका नोटहरू, प्रार्थनाहरू र प्रगति सुरक्षित ZIP ढाँचामा निर्यात गर्नुहोस्'
                  : 'Export your private notes, prayer journal & system archives in secure .zip format'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsZipModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('user')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'user'
                ? 'border-amber-600 text-amber-900 bg-white/70 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileArchive className="w-4 h-4 text-amber-600" />
            <span>{language === 'ne' ? 'व्यक्तिगत अध्ययन संग्रह' : 'Personal Study ZIP'}</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'admin'
                ? 'border-amber-600 text-amber-900 bg-white/70 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ne' ? 'प्रणाली ब्याकअप (Admin)' : 'Admin System Backup'}</span>
          </button>

          <button
            onClick={() => setActiveTab('server')}
            className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'server'
                ? 'border-amber-600 text-amber-900 bg-white/70 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="w-4 h-4 text-blue-600" />
            <span>{language === 'ne' ? 'सर्भर प्रत्यक्ष स्ट्रिम' : 'Server Live Stream'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {activeTab === 'user' && (
            <div className="space-y-4">
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 text-xs sm:text-sm text-slate-700">
                <p className="font-semibold text-amber-900 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  {language === 'ne'
                    ? 'तपाईंको निजी आस्था डाटा तपाईंको नियन्त्रणमा छ'
                    : 'Your faith study records belong entirely to you'}
                </p>
                <p className="text-slate-600 text-xs">
                  {language === 'ne'
                    ? 'कुनै पनि सर्भरमा डाटा नराखी सिधै तपाईंको कम्प्युटर वा फोनमा ZIP फाइल डाउनलोड हुन्छ।'
                    : 'All records are packaged with clean JSON and beautifully formatted Markdown summaries for easy offline reading and long-term keeping.'}
                </p>
              </div>

              {/* Package contents checklist */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 space-y-3">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {language === 'ne' ? 'संग्रहमा समावेश हुने फाइलहरू' : 'Select Files to Include in ZIP'}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2.5 text-xs sm:text-sm cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={includeNotes}
                      onChange={(e) => setIncludeNotes(e.target.checked)}
                      className="rounded-sm text-amber-600 focus:ring-amber-500"
                    />
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-slate-800">
                      Bible Study Notes ({notes.length})
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs sm:text-sm cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={includePrayers}
                      onChange={(e) => setIncludePrayers(e.target.checked)}
                      className="rounded-sm text-amber-600 focus:ring-amber-500"
                    />
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span className="font-medium text-slate-800">
                      Prayer Journal ({prayerJournal.length})
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs sm:text-sm cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={includeBookmarks}
                      onChange={(e) => setIncludeBookmarks(e.target.checked)}
                      className="rounded-sm text-amber-600 focus:ring-amber-500"
                    />
                    <BookMarked className="w-4 h-4 text-amber-600" />
                    <span className="font-medium text-slate-800">
                      Verse Bookmarks ({bookmarks.length})
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 text-xs sm:text-sm cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-400">
                    <input
                      type="checkbox"
                      checked={includeMarkdownSummary}
                      onChange={(e) => setIncludeMarkdownSummary(e.target.checked)}
                      className="rounded-sm text-amber-600 focus:ring-amber-500"
                    />
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="font-medium text-slate-800">
                      Markdown Study Summary (.md)
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleDownloadUserZip}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Download className={`w-4 h-4 ${isGenerating ? 'animate-bounce' : ''}`} />
                <span>
                  {isGenerating
                    ? language === 'ne' ? 'ZIP तयार हुँदैछ...' : 'Packing ZIP Archive...'
                    : language === 'ne' ? 'व्यक्तिगत अध्ययन ZIP डाउनलोड गर्नुहोस्' : 'Download Personal Study ZIP (.zip)'}
                </span>
              </button>
            </div>
          )}

          {activeTab === 'admin' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs sm:text-sm text-slate-700">
                <p className="font-semibold text-emerald-900 mb-1">
                  {language === 'ne' ? 'व्यवस्थापकीय प्रणाली ब्याकअप (Full System Archive)' : 'Administrator Full System Archive'}
                </p>
                <p className="text-slate-600 text-xs">
                  Packages system audit logs (CSV & JSON), approved Christian resources catalog, verified church listings, and RAG knowledge grounding documents.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-medium">System Audit Logs:</span>
                  <span className="font-semibold text-slate-900">{auditLogs.length} Events (JSON + CSV)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-medium">Approved Christian Resources:</span>
                  <span className="font-semibold text-slate-900">{resources.length} Verified Items</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="font-medium">Verified Churches Directory:</span>
                  <span className="font-semibold text-slate-900">{churches.length} Congregations</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium">Compression Algorithm:</span>
                  <span className="font-semibold text-emerald-700">DEFLATE Level 9 (High Ratio)</span>
                </div>
              </div>

              <button
                onClick={handleDownloadAdminZip}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Download className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating ? 'Compressing Admin Archive...' : 'Download Complete System Backup ZIP'}
                </span>
              </button>
            </div>
          )}

          {activeTab === 'server' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs sm:text-sm text-slate-700">
                <p className="font-semibold text-blue-900 mb-1">
                  {language === 'ne' ? 'सर्भर-साइड प्रत्यक्ष आर्काइभ स्ट्रिम' : 'Server-Side Streamed Archive'}
                </p>
                <p className="text-slate-600 text-xs">
                  Calls the backend route <code className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded-sm">/api/export/archive-zip</code> to build and stream binary ZIP buffer using Node.js stream.
                </p>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-xs space-y-1.5 text-slate-600">
                <p>• <strong>Endpoint:</strong> POST /api/export/archive-zip</p>
                <p>• <strong>Encoding:</strong> application/zip</p>
                <p>• <strong>Integrity Check:</strong> MD5 & CRC-32 header verification</p>
              </div>

              <button
                onClick={handleServerStreamZip}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Server className={`w-4 h-4 ${isGenerating ? 'animate-bounce' : ''}`} />
                <span>
                  {isGenerating ? 'Streaming from Server...' : 'Request & Stream ZIP from Server'}
                </span>
              </button>
            </div>
          )}

          {/* Success Banner */}
          {downloadSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3 text-emerald-800 text-xs sm:text-sm animate-in fade-in">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Download Ready!</p>
                <p className="text-xs text-emerald-700">Saved: {downloadSuccess}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Good News AI / सुसमाचार AI Data Management</span>
          <button
            onClick={() => setIsZipModalOpen(false)}
            className="text-slate-700 hover:text-slate-900 font-medium cursor-pointer"
          >
            {language === 'ne' ? 'बन्द गर्नुहोस्' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
