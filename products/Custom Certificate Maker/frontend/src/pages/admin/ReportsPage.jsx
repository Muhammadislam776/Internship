import React, { useState } from 'react';
import { FileText, Download, Printer, BarChart3, Building2, Award, Users, ShieldCheck } from 'lucide-react';

export const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState('certificates');

  const handleExportCSV = (reportName) => {
    alert(`Downloading ${reportName} report in CSV format...`);
  };

  const handleExportPDF = (reportName) => {
    alert(`Generating ${reportName} printable PDF summary...`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Reports & Analytics Export</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Generate, preview and export comprehensive executive reports across certificates, organizations, recipients and verifications.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExportCSV(selectedReport)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleExportPDF(selectedReport)}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Export Printable PDF</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: 'certificates', title: 'Certificates Report', desc: 'Issuance trends & validity stats', icon: Award },
          { id: 'organizations', title: 'Organizations Report', desc: 'Issuer growth & quota utilization', icon: Building2 },
          { id: 'recipients', title: 'Recipients Report', desc: 'Student registration & activity', icon: Users },
          { id: 'verifications', title: 'Verifications Report', desc: 'Scan volume & authenticity rates', icon: ShieldCheck }
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = selectedReport === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedReport(item.id)}
              className={`p-5 rounded-3xl border text-left transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-blue-400'
              }`}
            >
              <Icon className={`w-6 h-6 mb-3 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
              <h4 className="text-sm font-extrabold">{item.title}</h4>
              <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>{item.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Report Preview Box */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 capitalize">{selectedReport} Summary Report</h3>
            <p className="text-xs text-slate-500">Generated on {new Date().toLocaleDateString()}</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-100">
            Ready for Export
          </span>
        </div>

        <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
          <BarChart3 className="w-12 h-12 text-blue-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-900 capitalize">{selectedReport} Dataset Preview</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Includes complete database query results, date filters, metadata headers, and verification hashes.
          </p>
        </div>
      </div>
    </div>
  );
};
