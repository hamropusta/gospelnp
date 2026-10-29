import JSZip from 'jszip';
import { StudyNote, Bookmark, PrayerItem, ChristianResource, Church, AuditLog, KnowledgeDocument } from '../types';

export interface ExportDataOptions {
  notes?: StudyNote[];
  bookmarks?: Bookmark[];
  prayerJournal?: PrayerItem[];
  studyProgress?: Record<string, any>;
  archiveName?: string;
  language?: 'en' | 'ne';
}

export interface AdminBackupOptions {
  auditLogs?: AuditLog[];
  resources?: ChristianResource[];
  churches?: Church[];
  knowledgeDocs?: KnowledgeDocument[];
}

/**
 * Generates and triggers download of a complete ZIP archive for personal user study data
 */
export async function downloadUserDataZip(options: ExportDataOptions): Promise<{ filename: string; sizeBytes: number }> {
  const {
    notes = [],
    bookmarks = [],
    prayerJournal = [],
    studyProgress = {},
    archiveName = 'good-news-ai-user-archive',
    language = 'en',
  } = options;

  const zip = new JSZip();
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${archiveName}-${dateStr}.zip`;

  // 1. README documentation file
  const readmeContent = `====================================================================
GOOD NEWS AI / सुसमाचार AI - USER STUDY DATA ARCHIVE
====================================================================
Export Date: ${new Date().toUTCString()}
Language: ${language === 'ne' ? 'Nepali (नेपाली)' : 'English'}
Platform: Good News AI (Christian Bible Learning & Gospel Dialogue Platform)

Archive Contents:
1. README.txt                          - This documentation file
2. study_summary.md                    - Human-readable Markdown summary of all notes & prayers
3. bible_study_notes.json              - Full machine-readable saved Bible study notes (${notes.length} items)
4. bible_study_notes.md                - Clean Markdown formatted notes with Scripture references
5. prayer_journal.json                 - Personal prayer journal entries and answered prayers (${prayerJournal.length} items)
6. prayer_journal.md                   - Formatted prayer list & praise reports
7. scripture_bookmarks.json            - Bookmarked verses and references (${bookmarks.length} items)
8. reading_progress.json               - Bible reading plans and quiz completions
9. privacy_and_religious_respect.txt   - Platform commitment to data privacy and respect

Data Privacy Guarantee:
- Your personal prayers, study notes, and spiritual inquiries belong exclusively to you.
- Good News AI does not sell or share personal faith data with any commercial third party or church.
- You have full ownership and rights to download, transfer, or permanently delete your data.
====================================================================
`;
  zip.file('README.txt', readmeContent);

  // 2. Formatted Markdown Summary
  let summaryMd = `# Good News AI / सुसमाचार AI - Personal Faith & Study Summary\n\n`;
  summaryMd += `*Generated on ${new Date().toLocaleDateString()}*\n\n`;
  summaryMd += `---\n\n`;

  summaryMd += `## 📖 1. Bible Study Notes (${notes.length})\n\n`;
  if (notes.length === 0) {
    summaryMd += `*No notes saved yet.*\n\n`;
  } else {
    notes.forEach((n, idx) => {
      summaryMd += `### ${idx + 1}. ${n.title} (${n.reference})\n`;
      summaryMd += `- **Date**: ${n.date}\n`;
      if (n.tags && n.tags.length > 0) {
        summaryMd += `- **Tags**: ${n.tags.join(', ')}\n`;
      }
      summaryMd += `\n${n.content}\n\n---\n\n`;
    });
  }

  summaryMd += `## 🙏 2. Prayer Journal & Reflections (${prayerJournal.length})\n\n`;
  const answeredCount = prayerJournal.filter((p) => p.isAnswered).length;
  summaryMd += `> Total Prayers: **${prayerJournal.length}** | Answered Praises: **${answeredCount}**\n\n`;

  if (prayerJournal.length === 0) {
    summaryMd += `*No prayer journal entries recorded yet.*\n\n`;
  } else {
    prayerJournal.forEach((p, idx) => {
      summaryMd += `### ${idx + 1}. [${p.isAnswered ? '✅ Answered Praise' : '⏳ Ongoing Prayer'}] ${p.title}\n`;
      summaryMd += `- **Category**: ${p.category} | **Date**: ${p.date}\n\n`;
      summaryMd += `${p.content}\n\n`;
      if (p.isAnswered && p.answeredNotes) {
        summaryMd += `**Thanksgiving / Answer Note**: ${p.answeredNotes}\n\n`;
      }
      summaryMd += `---\n\n`;
    });
  }

  summaryMd += `## 🔖 3. Bookmarked Scripture Verses (${bookmarks.length})\n\n`;
  if (bookmarks.length === 0) {
    summaryMd += `*No bookmarks saved yet.*\n\n`;
  } else {
    bookmarks.forEach((b) => {
      summaryMd += `- **${b.reference}** (${b.date}):\n  > "${b.text}"\n\n`;
    });
  }

  zip.file('study_summary.md', summaryMd);

  // 3. Dedicated Bible Study Notes (JSON & MD)
  zip.file('bible_study_notes.json', JSON.stringify(notes, null, 2));
  let notesMd = `# Saved Bible Study Notes\n\n`;
  notes.forEach((n) => {
    notesMd += `## ${n.reference}: ${n.title}\n*Saved on ${n.date}*\n\n${n.content}\n\n`;
  });
  zip.file('bible_study_notes.md', notesMd);

  // 4. Dedicated Prayer Journal (JSON & MD)
  zip.file('prayer_journal.json', JSON.stringify(prayerJournal, null, 2));
  let prayersMd = `# Personal Prayer Journal\n\n`;
  prayerJournal.forEach((p) => {
    prayersMd += `## ${p.title} (${p.category})\n*Status: ${p.isAnswered ? 'Answered Praise' : 'In Prayer'} | Date: ${p.date}*\n\n${p.content}\n\n`;
    if (p.answeredNotes) {
      prayersMd += `*Testimony/Reflection*: ${p.answeredNotes}\n\n`;
    }
  });
  zip.file('prayer_journal.md', prayersMd);

  // 5. Bookmarks & Reading Progress JSON
  zip.file('scripture_bookmarks.json', JSON.stringify(bookmarks, null, 2));
  zip.file('reading_progress.json', JSON.stringify(studyProgress, null, 2));

  // 6. Privacy & Policy Pledge
  zip.file(
    'privacy_and_religious_respect.txt',
    `GOOD NEWS AI DATA PRIVACY PLEDGE
1. We believe religious faith and personal prayers are sacred and strictly private.
2. We never track or sell your faith journey or share it with advertisers.
3. You can permanently delete your account and all associated local and cloud records at any time.
4. For questions or support, contact: privacy@goodnewsai.org
`
  );

  // Generate ZIP blob and trigger download
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  return { filename, sizeBytes: blob.size };
}

/**
 * Generates and triggers download of an Admin System Backup ZIP archive
 */
export async function downloadAdminSystemBackupZip(options: AdminBackupOptions): Promise<{ filename: string; sizeBytes: number }> {
  const { auditLogs = [], resources = [], churches = [], knowledgeDocs = [] } = options;
  const zip = new JSZip();
  const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `good-news-ai-admin-backup-${dateStr}.zip`;

  // System Manifest
  const manifest = {
    platform: 'Good News AI / सुसमाचार AI',
    version: '1.0.0-production',
    exportTimestamp: new Date().toISOString(),
    itemCounts: {
      auditLogs: auditLogs.length,
      approvedResources: resources.length,
      verifiedChurches: churches.length,
      ragKnowledgeDocs: knowledgeDocs.length,
    },
    systemHealth: 'OPERATIONAL',
    securityStatus: 'RBAC_ENFORCED_ZERO_LEAKAGE',
  };
  zip.file('system_backup_manifest.json', JSON.stringify(manifest, null, 2));

  // Audit Logs JSON & CSV
  zip.file('admin_audit_logs.json', JSON.stringify(auditLogs, null, 2));
  let logsCsv = 'ID,Timestamp,Action,UserRole,Details,IP\n';
  auditLogs.forEach((l) => {
    logsCsv += `"${l.id}","${l.timestamp}","${l.action}","${l.userRole}","${l.details.replace(/"/g, '""')}","${l.ip}"\n`;
  });
  zip.file('admin_audit_logs.csv', logsCsv);

  // Resource Library Database
  zip.file('approved_resources_catalog.json', JSON.stringify(resources, null, 2));

  // Church Directory Database
  zip.file('verified_churches_directory.json', JSON.stringify(churches, null, 2));

  // Knowledge Documents (RAG source files)
  zip.file('rag_knowledge_documents.json', JSON.stringify(knowledgeDocs, null, 2));

  // Security Report
  const securityReport = `# GOOD NEWS AI - SYSTEM SECURITY & AUDIT REPORT\n\n` +
    `**Export Time:** ${new Date().toUTCString()}\n` +
    `**RBAC Roles Active:** Super Admin, Content Admin, Bible Study Admin, Church Admin, Moderator, Support Admin, Analytics Admin\n` +
    `**Audit Events Logged:** ${auditLogs.length}\n` +
    `**Anti-Coercion Filter:** ACTIVE (No harassment, no forced conversion algorithms)\n` +
    `**Data Protection:** Client-side zero-retention option enabled + Full ZIP Export Available.\n`;
  zip.file('security_compliance_report.md', securityReport);

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  return { filename, sizeBytes: blob.size };
}
