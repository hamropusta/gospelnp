import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  User,
  AdminRole,
  StudyNote,
  Bookmark,
  PrayerItem,
  ChristianResource,
  Church,
  AuditLog,
  KnowledgeDocument,
} from '../types';
import { CHRISTIAN_RESOURCES, CHURCH_DIRECTORY } from '../data/learningData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  switchRole: (role: AdminRole | 'Learner' | 'Guest') => void;

  // Study Notes
  notes: StudyNote[];
  addNote: (note: Omit<StudyNote, 'id' | 'date'>) => void;
  deleteNote: (id: string) => void;

  // Bookmarks
  bookmarks: Bookmark[];
  toggleBookmark: (reference: string, text: string) => void;
  isBookmarked: (reference: string) => boolean;

  // Prayer Journal
  prayerJournal: PrayerItem[];
  addPrayer: (prayer: Omit<PrayerItem, 'id' | 'date' | 'isAnswered'>) => void;
  toggleAnsweredPrayer: (id: string, notes?: string) => void;
  deletePrayer: (id: string) => void;

  // Reading Plans & Quizzes
  readingProgress: Record<string, boolean>; // e.g. 'gospel-of-john-1': true
  togglePlanDay: (planId: string, day: number) => void;
  quizScores: Record<string, number>;
  recordQuizScore: (quizId: string, score: number) => void;

  // Admin Data & Approvals
  resources: ChristianResource[];
  toggleResourceApproval: (id: string) => void;
  addResource: (res: Omit<ChristianResource, 'id' | 'publishDate'>) => void;
  deleteResource: (id: string) => void;

  churches: Church[];
  toggleChurchVerification: (id: string) => void;
  addChurch: (church: Omit<Church, 'id' | 'registeredDate'>) => void;

  auditLogs: AuditLog[];
  logAdminAction: (action: string, details: string) => void;

  // Modals & Notifications
  isZipModalOpen: boolean;
  setIsZipModalOpen: (open: boolean) => void;
  isLegalModalOpen: boolean;
  setIsLegalModalOpen: (open: boolean) => void;
  activeLegalPolicy: string;
  openLegalPolicy: (policyKey: string) => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('goodnews_lang') as Language) || 'en';
  });

  const [activeTab, setActiveTab] = useState<string>('home');

  const [user, setUser] = useState<User>(() => ({
    id: 'user-001',
    name: 'Friend / साथी',
    email: 'learner@goodnews.org',
    role: 'Learner',
    isGuest: false,
    language: 'en',
    createdAt: new Date().toISOString(),
  }));

  // Study Notes
  const [notes, setNotes] = useState<StudyNote[]>(() => {
    const saved = localStorage.getItem('goodnews_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'note-1',
        title: 'Reflecting on John 3:16 (परमेश्वरको प्रेम)',
        reference: 'John 3:16',
        content: 'God gave His Son unconditionally. Salvation is not something we earn through religious legalism, but a gift of grace received by trust.',
        date: '2025-02-10',
        tags: ['Gospel', 'Grace', 'Love'],
      },
      {
        id: 'note-2',
        title: 'Rest for the Weary Soul',
        reference: 'Matthew 11:28-30',
        content: 'Jesus’ invitation is not to give us more burdens, but to provide gentle rest and humility. A reminder to cast daily anxieties on Him.',
        date: '2025-02-14',
        tags: ['Peace', 'Comfort'],
      },
    ];
  });

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('goodnews_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'bm-1',
        reference: 'John 3:16',
        text: 'For God so loved the world that he gave his one and only Son...',
        date: '2025-02-01',
      },
      {
        id: 'bm-2',
        reference: 'Psalm 23:1',
        text: 'The Lord is my shepherd, I lack nothing.',
        date: '2025-02-05',
      },
      {
        id: 'bm-3',
        reference: 'Ephesians 2:8',
        text: 'For it is by grace you have been saved, through faith...',
        date: '2025-02-12',
      },
    ];
  });

  // Prayer Journal
  const [prayerJournal, setPrayerJournal] = useState<PrayerItem[]>(() => {
    const saved = localStorage.getItem('goodnews_prayers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'pray-1',
        title: 'Peace for Family and Health',
        content: 'Praying for my parents’ recovery and spiritual peace in our household during difficult transitions.',
        date: '2025-02-01',
        category: 'Family',
        isAnswered: true,
        answeredNotes: 'Doctor visit went very smoothly and family feeling much more at ease. Thanking God for peace!',
      },
      {
        id: 'pray-2',
        title: 'Wisdom in Bible Understanding',
        content: 'Asking God to grant wisdom and clarity as I read the Gospels and understand Jesus’ teachings on forgiveness.',
        date: '2025-02-08',
        category: 'Spiritual Growth',
        isAnswered: false,
      },
      {
        id: 'pray-3',
        title: 'Harmonious Relations with Neighbors',
        content: 'Praying for opportunities to show kindness and gentle respect to our diverse community neighbors in Kathmandu.',
        date: '2025-02-15',
        category: 'Nation',
        isAnswered: false,
      },
    ];
  });

  // Reading Plan Progress & Quiz Scores
  const [readingProgress, setReadingProgress] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('goodnews_plan_progress');
    return saved ? JSON.parse(saved) : { 'gospel-of-john-1': true, 'gospel-of-john-2': true };
  });

  const [quizScores, setQuizScores] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('goodnews_quiz_scores');
    return saved ? JSON.parse(saved) : {};
  });

  // Resources
  const [resources, setResources] = useState<ChristianResource[]>(CHRISTIAN_RESOURCES);

  // Churches
  const [churches, setChurches] = useState<Church[]>(CHURCH_DIRECTORY);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-101',
      timestamp: new Date().toISOString(),
      action: 'INIT_SYSTEM',
      userRole: 'Super Admin',
      details: 'Good News AI platform launched with full bilingual RAG support',
      ip: '127.0.0.1',
    },
    {
      id: 'log-102',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      action: 'RESOURCE_VERIFIED',
      userRole: 'Content Admin',
      details: 'Approved educational article "Understanding the Good News" for publication',
      ip: '192.168.1.10',
    },
    {
      id: 'log-103',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      action: 'CHURCH_VERIFICATION',
      userRole: 'Church Admin',
      details: 'Verified credentials for Grace Evangelical Church Kathmandu',
      ip: '192.168.1.12',
    },
  ]);

  // Modals & Toasts
  const [isZipModalOpen, setIsZipModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [activeLegalPolicy, setActiveLegalPolicy] = useState('privacy');
  const [toast, setToast] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('goodnews_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('goodnews_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('goodnews_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('goodnews_prayers', JSON.stringify(prayerJournal));
  }, [prayerJournal]);

  useEffect(() => {
    localStorage.setItem('goodnews_plan_progress', JSON.stringify(readingProgress));
  }, [readingProgress]);

  useEffect(() => {
    localStorage.setItem('goodnews_quiz_scores', JSON.stringify(quizScores));
  }, [quizScores]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    showToast(lang === 'ne' ? 'भाषा नेपालीमा परिवर्तन गरियो' : 'Language set to English');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const switchRole = (role: AdminRole | 'Learner' | 'Guest') => {
    setUser((prev) => ({
      ...prev,
      role,
      isGuest: role === 'Guest',
      name:
        role === 'Learner'
          ? 'Friend / साथी'
          : role === 'Guest'
          ? 'Guest Seeker'
          : `${role} Officer`,
    }));
    logAdminAction('ROLE_SWITCH', `Switched active profile session to ${role}`);
    showToast(`Role active: ${role}`);
  };

  const addNote = (noteData: Omit<StudyNote, 'id' | 'date'>) => {
    const newNote: StudyNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    setNotes((prev) => [newNote, ...prev]);
    showToast(language === 'ne' ? 'नोट सफलतापूर्वक सुरक्षित गरियो' : 'Note saved successfully');
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast(language === 'ne' ? 'नोट हटाइयो' : 'Note deleted');
  };

  const toggleBookmark = (reference: string, text: string) => {
    const exists = bookmarks.some((b) => b.reference === reference);
    if (exists) {
      setBookmarks((prev) => prev.filter((b) => b.reference !== reference));
      showToast(language === 'ne' ? 'बुकमार्क हटाइयो' : 'Bookmark removed');
    } else {
      const newBm: Bookmark = {
        id: `bm-${Date.now()}`,
        reference,
        text,
        date: new Date().toISOString().split('T')[0],
      };
      setBookmarks((prev) => [newBm, ...prev]);
      showToast(language === 'ne' ? 'पद बुकमार्क गरियो' : 'Verse bookmarked');
    }
  };

  const isBookmarked = (reference: string) => {
    return bookmarks.some((b) => b.reference === reference);
  };

  const addPrayer = (prayerData: Omit<PrayerItem, 'id' | 'date' | 'isAnswered'>) => {
    const newPrayer: PrayerItem = {
      ...prayerData,
      id: `pray-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isAnswered: false,
    };
    setPrayerJournal((prev) => [newPrayer, ...prev]);
    showToast(language === 'ne' ? 'प्रार्थना थपियो' : 'Prayer recorded');
  };

  const toggleAnsweredPrayer = (id: string, notes?: string) => {
    setPrayerJournal((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isAnswered;
          return {
            ...item,
            isAnswered: nextState,
            answeredNotes: notes || (nextState ? 'Praise God for His answered peace and faithfulness.' : undefined),
          };
        }
        return item;
      })
    );
  };

  const deletePrayer = (id: string) => {
    setPrayerJournal((prev) => prev.filter((p) => p.id !== id));
    showToast(language === 'ne' ? 'प्रार्थना हटाइयो' : 'Prayer item removed');
  };

  const togglePlanDay = (planId: string, day: number) => {
    const key = `${planId}-${day}`;
    setReadingProgress((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      return updated;
    });
  };

  const recordQuizScore = (quizId: string, score: number) => {
    setQuizScores((prev) => ({ ...prev, [quizId]: score }));
  };

  const toggleResourceApproval = (id: string) => {
    setResources((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, approvalStatus: r.approvalStatus === 'Approved' ? 'Pending Review' : 'Approved' }
          : r
      )
    );
    logAdminAction('RESOURCE_STATUS_CHANGE', `Toggled approval status for resource ${id}`);
  };

  const addResource = (resData: Omit<ChristianResource, 'id' | 'publishDate'>) => {
    const newRes: ChristianResource = {
      ...resData,
      id: `res-${Date.now()}`,
      publishDate: new Date().toISOString().split('T')[0],
    };
    setResources((prev) => [newRes, ...prev]);
    logAdminAction('RESOURCE_CREATED', `Added new Christian resource: "${resData.titleEn}"`);
    showToast('Resource added to library');
  };

  const deleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
    logAdminAction('RESOURCE_DELETED', `Deleted resource ${id}`);
    showToast('Resource removed');
  };

  const toggleChurchVerification = (id: string) => {
    setChurches((prev) =>
      prev.map((c) => (c.id === id ? { ...c, verified: !c.verified } : c))
    );
    logAdminAction('CHURCH_VERIFY_TOGGLE', `Updated verification status for church ${id}`);
  };

  const addChurch = (churchData: Omit<Church, 'id' | 'registeredDate'>) => {
    const newChurch: Church = {
      ...churchData,
      id: `ch-${Date.now()}`,
      registeredDate: new Date().toISOString().split('T')[0],
    };
    setChurches((prev) => [newChurch, ...prev]);
    logAdminAction('CHURCH_REGISTERED', `Added new church profile: "${churchData.nameEn}"`);
    showToast('Church added to directory');
  };

  const logAdminAction = (action: string, details: string) => {
    const logItem: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      userRole: user.role,
      details,
      ip: '127.0.0.1 (Authenticated Session)',
    };
    setAuditLogs((prev) => [logItem, ...prev]);
    // Optionally inform backend
    fetch('/api/admin/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logItem),
    }).catch(() => {});
  };

  const openLegalPolicy = (policyKey: string) => {
    setActiveLegalPolicy(policyKey);
    setIsLegalModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        user,
        setUser,
        switchRole,
        notes,
        addNote,
        deleteNote,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        prayerJournal,
        addPrayer,
        toggleAnsweredPrayer,
        deletePrayer,
        readingProgress,
        togglePlanDay,
        quizScores,
        recordQuizScore,
        resources,
        toggleResourceApproval,
        addResource,
        deleteResource,
        churches,
        toggleChurchVerification,
        addChurch,
        auditLogs,
        logAdminAction,
        isZipModalOpen,
        setIsZipModalOpen,
        isLegalModalOpen,
        setIsLegalModalOpen,
        activeLegalPolicy,
        openLegalPolicy,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
