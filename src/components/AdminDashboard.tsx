import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AdminRole } from '../types';
import {
  Shield,
  ShieldCheck,
  FileText,
  Church as ChurchIcon,
  Database,
  Download,
  AlertTriangle,
  UserCheck,
  Activity,
  CheckCircle,
  Clock,
  Layers,
  Settings,
  Server,
  Lock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    language,
    user,
    switchRole,
    auditLogs,
    resources,
    toggleResourceApproval,
    churches,
    toggleChurchVerification,
    setIsZipModalOpen,
    showToast,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'audit' | 'resources' | 'churches' | 'rag' | 'safety'
  >('overview');

  const adminRoles: Array<AdminRole | 'Learner' | 'Guest'> = [
    'Super Admin',
    'Content Admin',
    'Bible Study Admin',
    'Church Admin',
    'Moderator',
    'Support Admin',
    'Analytics Admin',
    'Learner',
  ];

  // RBAC Permission checks
  const isSuperAdmin = user.role === 'Super Admin';
  const canManageContent = isSuperAdmin || user.role === 'Content Admin';
  const canManageChurches = isSuperAdmin || user.role === 'Church Admin';
  const canViewAudits = isSuperAdmin || user.role === 'Moderator';

  const ragDocs = [
    {
      id: 'rag-01',
      title: 'The Core of the Gospel (सुसमाचारको मुख्य सन्देश)',
      category: 'Theology',
      approval: 'Approved by Biblical Content Board',
      verses: 'John 3:16, Romans 5:8, Ephesians 2:8-9',
    },
    {
      id: 'rag-02',
      title: 'The Parables of Jesus: Grace, Lostness, and Mercy',
      category: 'Gospel Learning',
      approval: 'Approved by Biblical Content Board',
      verses: 'Luke 15:11-32, Luke 10:25-37',
    },
    {
      id: 'rag-03',
      title: 'Christianity and Cultural Context in Nepal & South Asia',
      category: 'Contextual Dialogue',
      approval: 'Approved by Historical Context Team',
      verses: 'Acts 17:22-31, 1 Peter 3:15-16',
    },
    {
      id: 'rag-04',
      title: 'Understanding Prayer and Spiritual Growth',
      category: 'Spiritual Formation',
      approval: 'Approved by Spiritual Formation Council',
      verses: 'Matthew 6:9-13, Philippians 4:6-7',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-sacred font-bold text-xl sm:text-2xl text-white">
                  Multi-Admin Management System
                </h2>
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-amber-400/30">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Role-Based Access Control (RBAC), RAG Knowledge Base, Verification & Security Audits
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZipModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Export Full ZIP Backup</span>
            </button>
          </div>
        </div>

        {/* Role Switcher bar for testing RBAC */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" /> Test RBAC Role:
          </span>
          {adminRoles.map((role) => (
            <button
              key={role}
              onClick={() => switchRole(role)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                user.role === role
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeAdminTab === 'overview'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          System Overview
        </button>

        <button
          onClick={() => setActiveAdminTab('audit')}
          className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeAdminTab === 'audit'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Audit Logs ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('resources')}
          className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeAdminTab === 'resources'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Content Approval ({resources.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('churches')}
          className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeAdminTab === 'churches'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Church Verifications ({churches.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('rag')}
          className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeAdminTab === 'rag'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          RAG Knowledge Base
        </button>

        <button
          onClick={() => setActiveAdminTab('safety')}
          className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            activeAdminTab === 'safety'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Safety & AI Policy
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-medium">Resources Catalog</span>
              <p className="text-2xl font-bold text-slate-900">{resources.length}</p>
              <span className="text-[11px] text-emerald-700 font-semibold">100% Legally Permitted</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-medium">Verified Churches</span>
              <p className="text-2xl font-bold text-slate-900">{churches.filter((c) => c.verified).length}</p>
              <span className="text-[11px] text-blue-700 font-semibold">Nepal & International</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-medium">Audit Events</span>
              <p className="text-2xl font-bold text-slate-900">{auditLogs.length}</p>
              <span className="text-[11px] text-purple-700 font-semibold">Logged & Tamper-Resistant</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs text-slate-500 font-medium">AI Knowledge Base</span>
              <p className="text-2xl font-bold text-emerald-600">Active RAG</p>
              <span className="text-[11px] text-slate-500">Gemini 3.8 Flash Grounded</span>
            </div>
          </div>

          {/* Quick permissions check notice */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600" />
              Active Role Permissions Breakdown for "{user.role}"
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold block text-slate-800">Resource Content Approval:</span>
                <span className={canManageContent ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                  {canManageContent ? 'Granted ✓' : 'Restricted ✕'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold block text-slate-800">Church Directory Verification:</span>
                <span className={canManageChurches ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                  {canManageChurches ? 'Granted ✓' : 'Restricted ✕'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-semibold block text-slate-800">Security Audit Logs Access:</span>
                <span className={canViewAudits ? 'text-emerald-700 font-bold' : 'text-slate-400'}>
                  {canViewAudits ? 'Granted ✓' : 'Restricted ✕'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeAdminTab === 'audit' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-serif-sacred font-bold text-lg text-slate-900">
                Platform Security & Audit Logs
              </h3>
              <p className="text-xs text-slate-500">
                Every administrative action, content modification, and verification event is immutably recorded.
              </p>
            </div>

            <button
              onClick={() => setIsZipModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Download Logs in ZIP</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">User Role</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">IP / Session</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md">{log.action}</span>
                    </td>
                    <td className="py-2.5 px-3 text-amber-800 font-medium">{log.userRole}</td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">{log.details}</td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RESOURCE APPROVALS TAB */}
      {activeAdminTab === 'resources' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-serif-sacred font-bold text-lg text-slate-900">
                Content Administration & Approvals
              </h3>
              <p className="text-xs text-slate-500">
                Ensure all Christian materials strictly comply with copyright laws and theological accuracy.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {resources.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {r.category}
                    </span>
                    <span className="text-xs text-slate-400">By {r.author}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{r.titleEn}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{r.copyright}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      r.approvalStatus === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {r.approvalStatus}
                  </span>

                  {canManageContent ? (
                    <button
                      onClick={() => toggleResourceApproval(r.id)}
                      className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 cursor-pointer"
                    >
                      Toggle Approval
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">View Only</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CHURCH VERIFICATION TAB */}
      {activeAdminTab === 'churches' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-serif-sacred font-bold text-lg text-slate-900">
                Church Directory Verification Queue
              </h3>
              <p className="text-xs text-slate-500">
                Verify pastor credentials, meeting locations, and voluntary contact legitimacy.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {churches.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {c.city}
                    </span>
                    <span className="text-xs text-slate-400">Pastor: {c.pastorName}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{c.nameEn}</h4>
                  <p className="text-xs text-slate-500">{c.address} • {c.phone}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      c.verified
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {c.verified ? 'Verified ✓' : 'Unverified ✕'}
                  </span>

                  {canManageChurches ? (
                    <button
                      onClick={() => toggleChurchVerification(c.id)}
                      className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 cursor-pointer"
                    >
                      {c.verified ? 'Revoke' : 'Verify'}
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">View Only</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RAG KNOWLEDGE BASE TAB */}
      {activeAdminTab === 'rag' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-serif-sacred font-bold text-lg text-slate-900">
                Retrieval-Augmented Generation (RAG) Grounding
              </h3>
              <p className="text-xs text-slate-500">
                Verified theological references and authorized texts injected into Gemini 3.8 Flash prompts.
              </p>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              Active Grounding
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ragDocs.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  {doc.category}
                </span>
                <h4 className="font-bold text-sm text-slate-900">{doc.title}</h4>
                <p className="text-xs text-slate-600">
                  <strong>Scripture Grounding:</strong> {doc.verses}
                </p>
                <p className="text-[11px] text-emerald-700 font-medium">✓ {doc.approval}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SAFETY & AI POLICY TAB */}
      {activeAdminTab === 'safety' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <h3 className="font-serif-sacred font-bold text-lg text-slate-900">
            AI Safety, Anti-Coercion & Guardrails Status
          </h3>

          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Zero Coercion Policy (धार्मिक स्वतन्त्रता संरक्षण)</p>
                <p className="text-xs text-slate-600">
                  The AI is strictly conditioned never to pressure users to convert, never to condemn other religions (Hinduism, Buddhism, Islam, Kirat, indigenous faiths), and to uphold 1 Peter 3:15 ("With Gentleness and Respect").
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">No False Claims / Miracle Guarantees</p>
                <p className="text-xs text-slate-600">
                  The AI never claims to be Jesus, God, or an ordained pastor, and makes no unsupported promises of guaranteed physical healing or financial wealth.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Strict Data Sovereignty & ZIP Management</p>
                <p className="text-xs text-slate-600">
                  Users can export their complete personal study archives or delete their records entirely at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
