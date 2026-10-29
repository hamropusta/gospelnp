import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Church } from '../types';
import {
  Church as ChurchIcon,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Search,
  Filter,
  ShieldCheck,
  Heart,
  Send,
  Sparkles,
} from 'lucide-react';

export const ChurchDirectoryView: React.FC = () => {
  const {
    language,
    churches,
    toggleChurchVerification,
    user,
    showToast,
  } = useApp();

  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inquiryModalChurch, setInquiryModalChurch] = useState<Church | null>(null);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    contact: '',
    message: '',
    isPrayerOnly: false,
  });

  const cities = ['ALL', 'Kathmandu', 'Lalitpur', 'Pokhara', 'Dharan', 'Chitwan'];

  const filteredChurches = churches.filter((c) => {
    const matchesCity = selectedCity === 'ALL' || c.city === selectedCity;
    const matchesSearch =
      c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.nameNe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.pastorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCity && matchesSearch;
  });

  const canManageChurches =
    user.role === 'Super Admin' || user.role === 'Church Admin';

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryModalChurch(null);
    showToast(
      language === 'ne'
        ? 'तपाईंको सन्देश मण्डलीका पास्टरलाई सुरक्षित रूपमा पठाइयो'
        : 'Inquiry safely forwarded to the pastor. Your privacy is guaranteed.'
    );
    setInquiryForm({ name: '', contact: '', message: '', isPrayerOnly: false });
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
          <ChurchIcon className="w-4 h-4" />
          <span>{language === 'ne' ? 'प्रमाणित मण्डली तथा संगति निर्देशिका' : 'Verified Church & Fellowship Directory'}</span>
        </div>
        <h2 className="font-serif-sacred text-2xl font-bold text-slate-900">
          {language === 'ne' ? 'स्थानीय मण्डली र संगतिसँग जोडिनुहोस्' : 'Find a Local Congregation & Fellowship'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          {language === 'ne'
            ? 'सबै मण्डलीहरू प्रमाणित छन्। इच्छुक जो कोहीले पनि स्वेच्छाले पास्टरसँग प्रार्थना वा बाइबल जिज्ञासाका लागि सम्पर्क गर्न सक्नुहुन्छ।'
            : 'All congregations listed are verified by Church Administrators. Connect voluntarily for prayer, fellowship, or Bible study on your terms. We never share your AI conversations.'}
        </p>

        {/* Filter Bar */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'ne'
                  ? 'मण्डलीको नाम, पास्टर वा ठेगाना खोज्नुहोस्...'
                  : 'Search by church name, pastor, or address...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* City Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCity === city
                    ? 'bg-amber-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Churches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredChurches.map((church) => (
          <div
            key={church.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full">
                      {church.city}
                    </span>
                    {church.verified && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif-sacred font-bold text-lg text-slate-900 leading-snug">
                    {language === 'ne' ? church.nameNe : church.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500">{church.denomination}</p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <ChurchIcon className="w-5 h-5" />
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span>{church.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{church.serviceTimes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Pastor:</span>
                  <span>{church.pastorName}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 pt-1">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {church.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {church.email}</span>
                </div>
              </div>

              {church.contactNotes && (
                <div className="text-[11px] text-amber-900 bg-amber-50/50 p-2.5 rounded-lg italic">
                  "{church.contactNotes}"
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setInquiryModalChurch(church)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{language === 'ne' ? 'स्वेच्छिक सम्पर्क वा प्रार्थना' : 'Connect / Request Prayer'}</span>
              </button>

              {canManageChurches && (
                <button
                  onClick={() => toggleChurchVerification(church.id)}
                  className="text-[11px] font-medium text-slate-500 hover:text-slate-900 underline"
                >
                  {church.verified ? 'Revoke Verification' : 'Verify Church'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PRIVATE INQUIRY MODAL */}
      {inquiryModalChurch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                  Voluntary Inquiry
                </span>
                <h3 className="font-serif-sacred font-bold text-base text-slate-900 mt-1">
                  Connect with {inquiryModalChurch.nameEn}
                </h3>
              </div>
              <button
                onClick={() => setInquiryModalChurch(null)}
                className="text-slate-400 hover:text-slate-800 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ne' ? 'तपाईंको नाम (वैकल्पिक)' : 'Your Name (Optional)'}
                </label>
                <input
                  type="text"
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  placeholder="e.g. Seeker / मित्र"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ne' ? 'सम्पर्क ठेगाना (इमेल वा फोन)' : 'Contact (Email or Phone)'}
                </label>
                <input
                  type="text"
                  value={inquiryForm.contact}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, contact: e.target.value })}
                  placeholder="How can the pastor reply?"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ne' ? 'सन्देश वा प्रार्थना निवेदन' : 'Message or Prayer Request'}
                </label>
                <textarea
                  rows={3}
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  placeholder="I would like to attend a Saturday service / learn about Jesus / request prayer..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setInquiryModalChurch(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
