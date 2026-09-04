import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { TEMPLATE_PRESETS } from '../../editor/templatePresets';
import { LayoutTemplate, Search, Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OrgTemplatesPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const categories = ['All', 'Academic', 'Corporate', 'Technology', 'Luxury', 'Achievement', 'Appreciation', 'Participation'];

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await api.getTemplates();
      if (res.success && res.templates?.length > 0) {
        setTemplates(res.templates);
      } else {
        setTemplates(TEMPLATE_PRESETS);
      }
    } catch (err) {
      console.error('[Fetch Templates Error]', err);
      setTemplates(TEMPLATE_PRESETS);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Canva certificate template gallery..." />;

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Canva Certificate Template Gallery</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Browse 18 professionally designed certificate presets. Click "Use Template" to load into the Canva Studio.
          </p>
        </div>
      </div>

      {/* Categories & Search */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search template presets..."
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((t) => (
          <div key={t._id || t.id} className="bg-white border border-slate-200 rounded-3xl p-4 space-y-3 hover:shadow-xl transition-all group">
            <div
              className="h-44 rounded-2xl border-4 flex flex-col justify-between p-4 relative overflow-hidden shadow-sm"
              style={{ backgroundColor: t.bg || t.designData?.background || '#FDFBF7', borderColor: t.borderColor || t.designData?.borderColor || '#D4AF37' }}
            >
              <div className="space-y-0.5 text-center">
                <p className="text-[8px] font-bold tracking-[0.25em] uppercase" style={{ color: t.borderColor || '#D4AF37' }}>
                  {t.name}
                </p>
                <p className="text-xs font-black uppercase font-cinzel tracking-wider" style={{ color: t.borderColor || '#D4AF37' }}>
                  CERTIFICATE OF EXCELLENCE
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm font-bold font-serif" style={{ color: t.bg === '#0B192C' || t.bg === '#0F172A' || t.bg === '#020617' ? '#F59E0B' : '#0F172A' }}>
                  Recipient Full Name
                </p>
                <p className="text-[9px] text-slate-400">Course / Program Awarded</p>
              </div>

              <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 pt-1 border-t border-slate-400/20">
                <span>Date: {"{{issueDate}}"}</span>
                <span className="font-bold">SEAL</span>
                <span>ID: {"{{certificateId}}"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <h3 className="text-xs font-bold text-slate-900">{t.name}</h3>
                <p className="text-[10px] text-slate-500">{t.category || 'Academic'}</p>
              </div>

              <button
                onClick={() => navigate('/org/designer')}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-orange-500/20 hover:scale-[1.02] transition-all"
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
