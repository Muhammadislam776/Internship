import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { FileClock, Plus, Trash2, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DraftCertsPage = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await api.getCertificates({ status: 'Draft' });
      if (res.success) setDrafts(res.certificates);
    } catch (err) {
      console.error('[Fetch Drafts Error]', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading saved certificate drafts..." />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Certificate Drafts ({drafts.length})</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Incomplete certificate designs saved to resume editing and issue later.
          </p>
        </div>

        <button
          onClick={() => navigate('/org/designer')}
          className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Certificate Draft</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {drafts.length > 0 ? (
          drafts.map((d) => (
            <div key={d._id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-[10px] font-bold font-mono text-blue-600">{d.certificateId}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">Draft</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{d.title || 'Untitled Certificate'}</h3>
                <p className="text-xs text-slate-600 mt-0.5">Recipient: {d.recipientName || 'Unassigned'}</p>
                <p className="text-[10px] text-slate-400 mt-1">Course: {d.courseName || 'N/A'}</p>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => navigate('/org/designer')}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20"
                >
                  Continue Editing
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white border border-slate-200 rounded-3xl p-8 space-y-3">
            <FileClock className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No Draft Certificates Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Any certificate design you work on in the Canva studio can be saved as a draft to finish later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
