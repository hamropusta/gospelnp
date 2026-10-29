import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AIBibleAssistant } from './components/AIBibleAssistant';
import { BibleStudyView } from './components/BibleStudyView';
import { GospelLearningView } from './components/GospelLearningView';
import { ResourceLibraryView } from './components/ResourceLibraryView';
import { ChurchDirectoryView } from './components/ChurchDirectoryView';
import { DevotionalPrayerJournalView } from './components/DevotionalPrayerJournalView';
import { AdminDashboard } from './components/AdminDashboard';
import { ZipExportModal } from './components/ZipExportModal';
import { LegalPoliciesModal } from './components/LegalPoliciesModal';
import {
  Heart,
  Shield,
  Download,
  Globe,
  Lock,
  HeartHandshake,
  Smartphone,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    activeTab,
    language,
    toast,
    setIsZipModalOpen,
    openLegalPolicy,
  } = useApp();

  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);

  // Register Service Worker and PWA Install Prompt
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('Good News AI ServiceWorker registered'))
        .catch((err) => console.log('SW registration error', err));
    }

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsPwaInstalled(true);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        setIsPwaInstalled(true);
      }
      setInstallPrompt(null);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navigation */}
      <Navbar />

      {/* PWA Install Banner */}
      {installPrompt && !isPwaInstalled && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-2.5 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 max-w-2xl">
            <Smartphone className="w-4 h-4 shrink-0 animate-bounce" />
            <span>
              {language === 'ne'
                ? 'सुसमाचार AI लाई आफ्नो फोन वा कम्प्युटरमा एपको रूपमा इन्स्टल गर्नुहोस् (PWA)'
                : 'Install Good News AI on your Android, iOS, or PC for fast offline Bible study'}
            </span>
          </div>
          <button
            onClick={handleInstallClick}
            className="px-3 py-1 bg-white text-amber-900 font-bold rounded-lg hover:bg-amber-50 shrink-0 shadow-xs cursor-pointer"
          >
            {language === 'ne' ? 'इन्स्टल गर्नुहोस्' : 'Install App'}
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'ai-assistant' && <AIBibleAssistant />}
        {activeTab === 'bible-study' && <BibleStudyView />}
        {activeTab === 'gospel-learning' && <GospelLearningView />}
        {activeTab === 'resources' && <ResourceLibraryView />}
        {activeTab === 'churches' && <ChurchDirectoryView />}
        {activeTab === 'devotional' && <DevotionalPrayerJournalView />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Modals */}
      <ZipExportModal />
      <LegalPoliciesModal />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-12 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Branding Column */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-serif-sacred font-bold text-base shadow-xs">
                  ✞
                </div>
                <span className="font-serif-sacred font-bold text-base text-slate-900">
                  Good News AI / सुसमाचार AI
                </span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed font-light">
                {language === 'ne'
                  ? 'पवित्र बाइबल सिकाइ, सुसमाचार संवाद र शान्तिपूर्ण धार्मिक आदरको साझा मञ्च।'
                  : 'Christian Bible Learning, Gospel AI & Faith Dialogue Platform built for mutual respect, peace, and spiritual inquiry.'}
              </p>
              <div className="pt-1">
                <button
                  onClick={() => setIsZipModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1.5 hover:bg-emerald-100"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'ne' ? 'डाटा संग्रह ZIP डाउनलोड' : 'Download Data Archive ZIP'}</span>
                </button>
              </div>
            </div>

            {/* Pathways */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                {language === 'ne' ? 'अध्ययन र स्रोतहरू' : 'Learning Pathways'}
              </h4>
              <ul className="space-y-1.5 text-slate-500">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-amber-800">Gospel of John 21-Day Plan</button></li>
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-amber-800">Parables of Jesus Christ</button></li>
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-amber-800">The Beatitudes & Sermon on the Mount</button></li>
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-amber-800">Ephesians 2:8-9 Grace Study</button></li>
              </ul>
            </div>

            {/* Religious Respect & Protection */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                {language === 'ne' ? 'आदर र सुरक्षा नीतिहरू' : 'Respect & Legal Policies'}
              </h4>
              <ul className="space-y-1.5 text-slate-500">
                <li>
                  <button onClick={() => openLegalPolicy('respect')} className="hover:text-amber-800 text-left">
                    Religious Respect & Non-Discrimination
                  </button>
                </li>
                <li>
                  <button onClick={() => openLegalPolicy('privacy')} className="hover:text-amber-800 text-left">
                    Data Privacy & Confidentiality Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => openLegalPolicy('ai-usage')} className="hover:text-amber-800 text-left">
                    AI Theological Grounding & Guardrails
                  </button>
                </li>
                <li>
                  <button onClick={() => openLegalPolicy('child-safety')} className="hover:text-amber-800 text-left">
                    Child & Vulnerable Seeker Safety
                  </button>
                </li>
                <li>
                  <button onClick={() => openLegalPolicy('deletion')} className="hover:text-rose-600 text-left">
                    Account Deletion & Data Wipe
                  </button>
                </li>
              </ul>
            </div>

            {/* Church & Fellowship */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                {language === 'ne' ? 'मण्डली र सम्पर्क' : 'Community & Churches'}
              </h4>
              <p className="text-slate-500 text-xs">
                {language === 'ne'
                  ? 'काठमाडौं, ललितपुर, पोखरा, धरान, चितवन र विश्वभरिका प्रमाणित मण्डलीहरू।'
                  : 'Verified congregations in Kathmandu, Lalitpur, Pokhara, Dharan, Chitwan, and worldwide.'}
              </p>
              <div className="pt-2 text-[11px] text-slate-400">
                <p>Support: support@goodnewsai.org</p>
                <p>Response time: Within 24 hours</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} Good News AI / सुसमाचार AI. All rights reserved. Upholding religious freedom & Christian grace.</p>
            <p>1 Peter 3:15 — "Always be prepared to give an answer... with gentleness and respect."</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
