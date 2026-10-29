import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  MessageSquare,
  Compass,
  FileText,
  Church as ChurchIcon,
  Heart,
  Shield,
  Download,
  Menu,
  X,
  Globe,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { AdminRole } from '../types';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    user,
    switchRole,
    setIsZipModalOpen,
    notes,
    prayerJournal,
    bookmarks,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const totalUserItems = notes.length + prayerJournal.length + bookmarks.length;

  const navItems = [
    { id: 'home', labelEn: 'Home', labelNe: 'गृहपृष्ठ', icon: Sparkles },
    { id: 'ai-assistant', labelEn: 'Gospel AI', labelNe: 'सुसमाचार AI', icon: MessageSquare },
    { id: 'bible-study', labelEn: 'Bible Study', labelNe: 'बाइबल अध्ययन', icon: BookOpen },
    { id: 'gospel-learning', labelEn: 'Faith Dialogue', labelNe: 'विश्वास र संवाद', icon: Compass },
    { id: 'resources', labelEn: 'Library', labelNe: 'पुस्तकालय', icon: FileText },
    { id: 'churches', labelEn: 'Churches', labelNe: 'मण्डलीहरू', icon: ChurchIcon },
    { id: 'devotional', labelEn: 'Prayer & Devotional', labelNe: 'प्रार्थना र मनन', icon: Heart },
    { id: 'admin', labelEn: 'Admin Panel', labelNe: 'व्यवस्थापक', icon: Shield },
  ];

  const adminRoles: Array<AdminRole | 'Learner' | 'Guest'> = [
    'Learner',
    'Guest',
    'Super Admin',
    'Content Admin',
    'Bible Study Admin',
    'Church Admin',
    'Moderator',
    'Support Admin',
    'Analytics Admin',
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <span className="font-serif-sacred font-bold text-xl">✞</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-sacred font-bold text-lg text-slate-900 tracking-tight">
                  Good News AI
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-800">
                  सुसमाचार AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {language === 'ne' ? 'बाइबल सिकाइ र प्रेमपूर्ण संवाद' : 'Bible Learning & Faith Dialogue'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 shadow-xs border border-amber-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                  <span>{language === 'ne' ? item.labelNe : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions: ZIP Download & Language & Role Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Download Archive ZIP Management Button */}
            <button
              onClick={() => setIsZipModalOpen(true)}
              title={language === 'ne' ? 'डाटा संग्रह ZIP डाउनलोड गर्नुहोस्' : 'Download Data Archive ZIP'}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/70 text-xs sm:text-sm font-medium shadow-xs transition-all hover:scale-102 active:scale-98"
            >
              <Download className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="hidden sm:inline font-semibold">
                {language === 'ne' ? 'ZIP संग्रह' : 'ZIP Archive'}
              </span>
              <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                {totalUserItems}
              </span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium transition-all"
              title="Toggle English / Nepali"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
            </button>

            {/* Role Switcher (Simulates RBAC Multi-Admin) */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium shadow-xs"
                title="Switch Role to test Multi-Admin permissions"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline max-w-[100px] truncate">{user.role}</span>
              </button>

              {roleDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {language === 'ne' ? 'भूमिका चयन (RBAC)' : 'Select RBAC Role'}
                  </div>
                  {adminRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => switchRole(role)}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-amber-50 flex items-center justify-between ${
                        user.role === role ? 'font-bold text-amber-900 bg-amber-50/70' : 'text-slate-700'
                      }`}
                    >
                      <span>{role}</span>
                      {user.role === role && <span className="text-amber-600 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 animate-in slide-in-from-top-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-50 text-amber-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                <span>{language === 'ne' ? item.labelNe : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
