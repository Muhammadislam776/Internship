import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Award, Download, Share2, Copy, CheckCircle, ExternalLink, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyCertificatesPage = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState('');

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const res = await api.getCertificates();
      if (res.success) {
        setCertificates(res.certificates);
      }
    } catch (err) {
      console.error('[Fetch Recipient Certs Error]', err);
    } finally {
      setLoading(false);
    }
  };

  const copyVerificationLink = (certId) => {
    const url = `${window.location.origin}/verify/${certId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(certId);
    setTimeout(() => setCopiedId(''), 2500);
  };

  if (loading) return <LoadingSpinner label="Loading your certificate collection..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">All Earned Credentials</h1>
        <p className="text-xs text-slate-400">Download high-res PNG or PDF, share, or copy your public verification link.</p>
      </div>

      {certificates.length === 0 ? (
        <EmptyState title="No certificates found" description="You have not been issued any certificates yet." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <div key={cert._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">{cert.certificateId}</span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle className="w-3 h-3" />
                  <span>VALID</span>
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">{cert.courseName}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Issued by: <strong className="text-slate-300">{cert.organization?.name || 'Tech Academy'}</strong> on {new Date(cert.issueDate).toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
                <p className="text-[11px] text-slate-300 italic">"{cert.description || 'For successfully completing the program.'}"</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => copyVerificationLink(cert.certificateId)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{copiedId === cert.certificateId ? 'Copied Link!' : 'Copy Link'}</span>
                </button>

                <Link
                  to={`/verify/${cert.certificateId}`}
                  target="_blank"
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Verification Page</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
