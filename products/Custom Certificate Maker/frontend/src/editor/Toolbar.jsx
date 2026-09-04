import React from 'react';
import {
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Trash2,
  Eye,
  Download,
  Save,
  Send,
  ArrowLeft,
  Sparkles,
  Monitor,
  Smartphone,
  Ruler
} from 'lucide-react';

export const Toolbar = ({
  templateName,
  onBack,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  zoomLevel,
  gridActive,
  onToggleGrid,
  onClear,
  onPreview,
  onSaveDraft,
  onIssue,
  onExportPNG,
  onExportPDF,
  isSaving,
  orientation,
  onChangeOrientation
}) => {
  return (
    <div className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 text-slate-200">
      {/* Left: Navigation & Canvas Metadata */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex items-center space-x-1 text-xs font-semibold"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="h-6 w-px bg-slate-800" />

        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-xs font-bold text-white truncate max-w-[160px] sm:max-w-[240px]">
              {templateName || 'Custom Certificate Preset'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 uppercase tracking-wider">
              Canva Studio Engine 2.0
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            {orientation === 'portrait' ? '1080 × 1920 Portrait' : '1920 × 1080 Landscape Canvas'}
          </p>
        </div>
      </div>

      {/* Center: Canvas Controls (Undo/Redo, Zoom, Grid, Orientation) */}
      <div className="hidden md:flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1 space-x-1 shadow-inner">
        {/* Undo / Redo */}
        <button
          onClick={onUndo}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onRedo}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-800 my-auto" />

        {/* Zoom Controls */}
        <button
          onClick={onZoomOut}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onResetZoom}
          className="px-2 py-1 rounded-xl text-[10px] font-mono font-bold text-sky-400 hover:bg-slate-900 transition-colors"
          title="Reset Zoom / Fit to Screen"
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        <button
          onClick={onZoomIn}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-800 my-auto" />

        {/* Grid & Clear */}
        <button
          onClick={onToggleGrid}
          className={`p-2 rounded-xl transition-colors ${
            gridActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
          title="Toggle Alignment Grid"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onClear}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Clear All Canvas Elements"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-800 my-auto" />

        {/* Orientation Selector */}
        <select
          value={orientation || 'landscape'}
          onChange={(e) => onChangeOrientation && onChangeOrientation(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-[10px] font-bold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="landscape">Landscape (16:9)</option>
          <option value="portrait">Portrait (9:16)</option>
        </select>
      </div>

      {/* Right: Actions (Preview, Export, Save Draft, Issue) */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={onPreview}
          className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs transition-colors flex items-center space-x-1.5"
        >
          <Eye className="w-4 h-4 text-amber-400" />
          <span className="hidden sm:inline">Live Preview</span>
        </button>

        {/* Export Options */}
        <div className="relative group">
          <button className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs transition-colors flex items-center space-x-1.5">
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <div className="absolute right-0 mt-1 w-40 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50 space-y-1">
            <button
              onClick={onExportPNG}
              className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Export High-Res PNG
            </button>
            <button
              onClick={onExportPDF}
              className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Export Vector Print PDF
            </button>
          </div>
        </div>

        <button
          onClick={onSaveDraft}
          disabled={isSaving}
          className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-amber-400 font-bold text-xs transition-colors flex items-center space-x-1.5"
        >
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Save Draft</span>
        </button>

        <button
          onClick={onIssue}
          disabled={isSaving}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:brightness-110 text-white font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center space-x-1.5"
        >
          <Send className="w-4 h-4" />
          <span>{isSaving ? 'Issuing...' : 'Issue Certificate'}</span>
        </button>
      </div>
    </div>
  );
};
