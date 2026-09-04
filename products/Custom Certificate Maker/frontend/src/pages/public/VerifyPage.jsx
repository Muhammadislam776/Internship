import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  ShieldCheck,
  XCircle,
  Award,
  Building2,
  Calendar,
  User,
  CheckCircle2,
  Search,
  ExternalLink,
  QrCode,
  Share2,
  Printer
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const VerifyPage = () => {
  const { certificateId } = useParams();
  const [searchId, setSearchId] = useState(certificateId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (certificateId) {
      performVerification(certificateId);
    }
  }, [certificateId]);

  const performVerification = async (idToVerify) => {
    setLoading(true);
    setErrorMsg('');
    setResult(null);
    try {
      const res = await api.verifyCertificate(idToVerify);
      if (res.success) {
        setResult(res);
      } else {
        setErrorMsg(res.message || 'Certificate not found');
      }
    } catch (err) {
      setErrorMsg('Certificate not found. Please check the Certificate ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      performVerification(searchId.trim());
    }
  };

  const currentVerifyUrl = window.location.href;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-2">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Public Certificate Verification</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Scan the QR code on a certificate or enter the unique Certificate ID below to verify authenticity in real-time.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex items-center space-x-2 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. CERT-2026-DD8294"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            Verify
          </button>
        </form>
      </div>

      {loading && <LoadingSpinner label="Verifying certificate authenticity against MongoDB records..." />}

      {errorMsg && (
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
          <XCircle className="w-12 h-12 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Verification Failed</h3>
          <p className="text-xs text-rose-300">{errorMsg}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Prominent Verification Status Banner */}
          {result.verified ? (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-2 border-emerald-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">AUTHENTIC RECORD</span>
                  <h2 className="text-xl font-extrabold text-white">VALID CERTIFICATE</h2>
                  <p className="text-xs text-slate-300">This credential has been officially verified on the blockchain audit register.</p>
                </div>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                {result.certificate.certificateId}
              </span>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border-2 border-rose-500/40 shadow-2xl flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <XCircle className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-400">WARNING</span>
                <h2 className="text-xl font-extrabold text-white">CERTIFICATE REVOKED</h2>
                <p className="text-xs text-rose-300">
                  Reason: {result.revocationReason || 'This certificate has been revoked by the issuing authority.'}
                </p>
              </div>
            </div>
          )}

          {/* Certificate Detail Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recipient & Course */}
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recipient Name</p>
                  <p className="text-2xl font-bold text-white mt-0.5">{result.certificate.recipientName}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course / Program Awarded</p>
                  <p className="text-base font-bold text-sky-400 mt-0.5">{result.certificate.courseName}</p>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Issue Date</p>
                  <p className="text-xs font-mono text-slate-300 mt-0.5">{new Date(result.certificate.issueDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Organization & QR Code */}
              <div className="space-y-4 md:border-l md:border-slate-800 md:pl-6 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Issuing Organization</p>
                  <p className="text-base font-bold text-amber-400 mt-0.5">{result.certificate.organization?.name || 'Tech Academy Institute'}</p>
                  <p className="text-xs text-slate-400">{result.certificate.organization?.address}</p>
                </div>

                <div className="flex items-center space-x-4 pt-2">
                  <div className="p-2 bg-white rounded-xl shadow-md">
                    <QRCodeSVG value={currentVerifyUrl} size={80} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Dynamic Verification QR</p>
                    <p className="text-[10px] text-slate-400">Scan to open live verification payload.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-xs text-slate-300 italic">
              "{result.certificate.description}"
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
