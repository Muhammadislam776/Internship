import React from 'react';
import { Download, FileSpreadsheet, FileJson, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExportCard = ({ users, onShowToast }) => {
  const handleExportCSV = () => {
    if (!users || users.length === 0) {
      onShowToast && onShowToast({ title: 'Export Failed', message: 'No user data available to export', type: 'error' });
      return;
    }

    const headers = ['User ID', 'Full Name', 'Email', 'Role', 'Email Verified', 'Status', 'Provider', 'Created At', 'Last Login'];
    const csvRows = [headers.join(',')];

    users.forEach(u => {
      const row = [
        `"${u.id}"`,
        `"${u.full_name}"`,
        `"${u.email}"`,
        `"${u.role}"`,
        u.email_confirmed ? 'TRUE' : 'FALSE',
        `"${u.status}"`,
        `"${u.provider || 'email'}"`,
        `"${u.created_at}"`,
        `"${u.last_sign_in_at}"`
      ];
      csvRows.push(row.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AdminSphere_Users_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } }); } catch (e) {}
    onShowToast && onShowToast({ title: 'Export Successful', message: `Exported ${users.length} users to CSV`, type: 'success' });
  };

  const handleExportJSON = () => {
    if (!users || users.length === 0) {
      onShowToast && onShowToast({ title: 'Export Failed', message: 'No user data available to export', type: 'error' });
      return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
    const link = document.createElement('a');
    link.href = dataStr;
    link.setAttribute('download', `AdminSphere_Users_Export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } }); } catch (e) {}
    onShowToast && onShowToast({ title: 'Export Successful', message: `Exported ${users.length} users to JSON`, type: 'success' });
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-[#FF7A18]/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF7A18] to-[#FFB86B] flex items-center justify-center text-white shadow-lg shadow-[#FF7A18]/30">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
            Export Filtered Users <Sparkles className="w-3 h-3 text-[#FFB86B]" />
          </h4>
          <p className="text-[11px] text-[#9FB0C2] mt-0.5">
            Download active dataset ({users.length} records) for reporting and external audit
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B253A] hover:bg-[#2563EB] text-xs font-bold text-white border border-[#22D3EE]/30 transition-all hover:scale-105"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-[#22D3EE]" />
          <span>CSV Export</span>
        </button>

        <button
          onClick={handleExportJSON}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FFB86B] text-xs font-bold text-white shadow-md shadow-[#FF7A18]/30 transition-all hover:scale-105"
        >
          <FileJson className="w-3.5 h-3.5 text-white" />
          <span>JSON Export</span>
        </button>
      </div>
    </div>
  );
};
