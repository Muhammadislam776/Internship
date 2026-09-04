import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { StatsCard } from '../../components/common/StatsCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Award, CheckCircle2, XCircle, Download, ExternalLink, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecipientDashboard = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyCerts();
  }, []);

  const fetchMyCerts = async () => {
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

  if (loading) return <LoadingSpinner label="Loading your certificate collection..." />;

  const validCount = certificates.filter(c => c.status === 'Issued' || c.status === 'Valid').length;
  const revokedCount = certificates.filter(c => c.status === 'Revoked').length;
  const latestCert = certificates.length > 0 ? certificates[0] : null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">My Certificates Collection</h1>
        <p className="text-xs text-slate-400">View, download, verify, and share your earned professional credentials.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard title="Total Certificates" value={certificates.length} icon={Award} color="amber" />
        <StatsCard title="Valid Credentials" value={validCount} icon={CheckCircle2} color="emerald" />
        <StatsCard title="Revoked Credentials" value={revokedCount} icon={XCircle} color="rose" />
      </div>

      {/* Featured / Latest Certificate Showcase */}
      {latestCert && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">Latest Certificate Received</h2>
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-amber-400">{latestCert.certificateId}</span>
                <h3 className="text-xl font-bold text-white mt-1">{latestCert.courseName}</h3>
                <p className="text-xs text-slate-400">Issued by: <strong className="text-slate-300">{latestCert.organization?.name || 'Tech Academy'}</strong> on {new Date(latestCert.issueDate).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center space-x-3">
                <Link
                  to={`/verify/${latestCert.certificateId}`}
                  target="_blank"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 flex items-center space-x-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Public Verification Link</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {certificates.length === 0 && (
        <EmptyState title="No certificates found" description="You have not been issued any certificates yet." />
      )}
    </div>
  );
};
