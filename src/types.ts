export type Language = 'en' | 'ne';

export type AdminRole =
  | 'Super Admin'
  | 'Content Admin'
  | 'Bible Study Admin'
  | 'Church Admin'
  | 'Moderator'
  | 'Support Admin'
  | 'Analytics Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: AdminRole | 'Learner' | 'Guest';
  isGuest: boolean;
  language: Language;
  createdAt: string;
}

export interface BibleBook {
  id: string;
  nameEn: string;
  nameNe: string;
  testament: 'OT' | 'NT';
  chaptersCount: number;
  category: 'Law' | 'History' | 'Poetry' | 'Prophets' | 'Gospels' | 'Epistles' | 'Revelation';
  summaryEn: string;
  summaryNe: string;
}

export interface Verse {
  bookId: string;
  bookNameEn: string;
  bookNameNe: string;
  chapter: number;
  verseNumber: number;
  textEn: string;
  textNe: string;
}

export interface StudyNote {
  id: string;
  title: string;
  reference: string;
  content: string;
  date: string;
  tags?: string[];
}

export interface Bookmark {
  id: string;
  reference: string;
  text: string;
  date: string;
  category?: string;
}

export interface PrayerItem {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Personal' | 'Family' | 'Church' | 'Nation' | 'Comfort & Healing' | 'Spiritual Growth';
  isAnswered: boolean;
  answeredNotes?: string;
}

export interface QuizQuestion {
  id: string;
  questionEn: string;
  questionNe: string;
  optionsEn: string[];
  optionsNe: string[];
  correctIndex: number;
  explanationEn: string;
  explanationNe: string;
  bibleReference: string;
}

export interface ReadingPlanDay {
  day: number;
  passages: string[];
  themeEn: string;
  themeNe: string;
  isCompleted?: boolean;
}

export interface ReadingPlan {
  id: string;
  titleEn: string;
  titleNe: string;
  durationDays: number;
  category: string;
  descriptionEn: string;
  descriptionNe: string;
  days: ReadingPlanDay[];
}

export interface ChristianResource {
  id: string;
  titleEn: string;
  titleNe: string;
  descriptionEn: string;
  descriptionNe: string;
  category: 'Article' | 'Ebook' | 'Sermon' | 'Podcast' | 'Discipleship' | 'Apologetics';
  author: string;
  language: 'en' | 'ne' | 'bilingual';
  copyright: string;
  approvalStatus: 'Approved' | 'Pending Review';
  publishDate: string;
  contentSnippet?: string;
  sourceUrl?: string;
}

export interface Church {
  id: string;
  nameEn: string;
  nameNe: string;
  city: string;
  address: string;
  pastorName: string;
  phone: string;
  email: string;
  denomination: string;
  serviceTimes: string;
  verified: boolean;
  registeredDate: string;
  contactNotes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  userRole: string;
  details: string;
  ip: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: string;
  language: string;
  references: string[];
  content: string;
  approvalStatus: string;
}
