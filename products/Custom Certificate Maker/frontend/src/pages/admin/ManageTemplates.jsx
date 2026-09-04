import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { TEMPLATE_PRESETS } from '../../editor/templatePresets';
import { Star, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ManageTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

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

  const toggleFeatured = async (id, currentFeatured) => {
    try {
      const res = await api.updateTemplate(id, { isFeatured: !currentFeatured });
      if (res.success) fetchTemplates();
    } catch (err) {
      alert(`Error toggling template: ${err.message}`);
    }
  };

  if (loading) return <LoadingSpinner label="Loading certificate design templates..." />;

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Helper to determine text colors based on background brightness
  const getCardStyles = (t) => {
    const bg = t.bg || t.designData?.background || '#FDFBF7';
    const borderColor = t.borderColor || t.designData?.borderColor || '#D4AF37';

    const isDark = bg === '#0B192C' || bg === '#0F172A' || bg === '#020617' || bg === '#1E1B4B' || bg === '#0B132B';

    return {
      bg,
      borderColor,
      titleColor: isDark ? (borderColor === '#D4AF37' || borderColor === '#F59E0B' || borderColor === '#EAB308' ? '#FCD34D' : '#38BDF8') : borderColor,
      nameColor: isDark ? '#FFFFFF' : '#0F172A',
      subColor: isDark ? '#94A3B8' : '#64748B',
      isDark
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Create CTA */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manage Certificate Templates ({filteredTemplates.length})</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Each template has a unique visual design, color palette, border framing, and font composition.
          </p>
        </div>

        <Link
          to="/org/designer"
          className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Preset</span>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
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
            placeholder="Search templates..."
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Templates Grid Cards with DYNAMIC VISUAL STYLES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((t) => {
          const style = getCardStyles(t);
          return (
            <div key={t._id || t.id} className="bg-white border border-slate-200 rounded-3xl p-4 space-y-3 hover:shadow-xl transition-all group">
              {/* Dynamic Visual Diploma Card Preview */}
              <div
                className="h-44 rounded-2xl border-4 flex flex-col justify-between p-4 relative overflow-hidden shadow-md transition-transform group-hover:scale-[1.01]"
                style={{ backgroundColor: style.bg, borderColor: style.borderColor }}
              >
                {/* Inner Accent Line */}
                <div
                  className="absolute inset-1.5 border border-dashed rounded-xl pointer-events-none opacity-40"
                  style={{ borderColor: style.borderColor }}
                />

                <div className="space-y-0.5 text-center relative z-10">
                  <p className="text-[8px] font-bold tracking-[0.25em] uppercase truncate" style={{ color: style.subColor }}>
                    {t.name}
                  </p>
                  <p className="text-xs font-black uppercase tracking-wider truncate" style={{ color: style.titleColor }}>
                    CERTIFICATE OF ACHIEVEMENT
                  </p>
                </div>

                <div className="text-center relative z-10">
                  <p className="text-sm font-bold font-serif truncate" style={{ color: style.nameColor }}>
                    Muhammad Ali
                  </p>
                  <p className="text-[9px] font-medium truncate" style={{ color: style.subColor }}>
                    Full-Stack Software Engineering
                  </p>
                </div>

                <div className="flex items-center justify-between text-[8px] font-mono pt-1 border-t relative z-10" style={{ borderColor: `${style.borderColor}40`, color: style.subColor }}>
                  <span>Date: {"{{issueDate}}"}</span>
                  <span className="px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: `${style.borderColor}20`, color: style.titleColor }}>
                    OFFICIAL SEAL
                  </span>
                  <span>ID: {"{{certificateId}}"}</span>
                </div>
              </div>

              {/* Template Card Details */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{t.name}</h3>
                  <p className="text-[10px] text-slate-500 font-medium">{t.category || 'Academic'} Category</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Link
                    to="/org/designer"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    Edit Studio
                  </Link>

                  {t._id && (
                    <button
                      onClick={() => toggleFeatured(t._id, t.isFeatured)}
                      className={`p-1.5 rounded-xl border transition-colors ${
                        t.isFeatured
                          ? 'bg-amber-100 text-amber-700 border-amber-300'
                          : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                      }`}
                      title="Toggle Featured Template"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
