import React from 'react';
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layers,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  Lock,
  Unlock,
  Move,
  AlignCenterHorizontal,
  AlignCenterVertical,
  Sliders,
  Type
} from 'lucide-react';
import { FONT_OPTIONS } from './templatePresets';

export const RightSidebar = ({
  selectedObject,
  onUpdateProperty,
  onBringToFront,
  onSendToBack,
  onDuplicate,
  onDelete,
  onAlignCenterH,
  onAlignCenterV
}) => {
  if (!selectedObject) {
    return (
      <div className="w-72 bg-slate-900 border-l border-slate-800 p-5 flex flex-col items-center justify-center text-center h-[calc(100vh-4rem)] shrink-0 z-20">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-500 mb-3">
          <Move className="w-6 h-6" />
        </div>
        <h4 className="text-xs font-semibold text-slate-300">No Object Selected</h4>
        <p className="text-[11px] text-slate-500 mt-1 max-w-[180px]">
          Click on any text, shape, seal, logo, signature, or QR code on the canvas to inspect & edit properties.
        </p>
      </div>
    );
  }

  const isText = selectedObject.type === 'text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox';

  return (
    <div className="w-72 bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto h-[calc(100vh-4rem)] shrink-0 z-20 space-y-5 text-slate-200">
      {/* Object Header & Quick Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isText ? 'Typography Inspector' : 'Object Inspector'}</span>
          </h3>
          <p className="text-[10px] text-slate-500 font-mono capitalize">{selectedObject.type}</p>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={onDuplicate}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Duplicate Object"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete Object"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QUICK ALIGNMENT TOOLS */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Canvas Alignment</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onAlignCenterH}
            className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            title="Center Horizontally (X = 960)"
          >
            <AlignCenterHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Center X</span>
          </button>
          <button
            onClick={onAlignCenterV}
            className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            title="Center Vertically (Y = 540)"
          >
            <AlignCenterVertical className="w-3.5 h-3.5 text-sky-400" />
            <span>Center Y</span>
          </button>
        </div>
      </div>

      {/* TYPOGRAPHY SECTION */}
      {isText && (
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Typography Settings</h4>

          {/* Font Family */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1">Font Family</label>
            <select
              value={selectedObject.fontFamily || 'Inter'}
              onChange={(e) => onUpdateProperty('fontFamily', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.family} value={f.family}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size & Weight */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">Size (px)</label>
              <input
                type="number"
                min="8"
                max="140"
                value={Math.round(selectedObject.fontSize || 24)}
                onChange={(e) => onUpdateProperty('fontSize', parseInt(e.target.value) || 14)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 mb-1">Formatting</label>
              <div className="flex space-x-1">
                <button
                  onClick={() => onUpdateProperty('fontWeight', selectedObject.fontWeight === 'bold' ? 'normal' : 'bold')}
                  className={`p-1.5 flex-1 rounded-lg border text-xs font-bold transition-colors ${
                    selectedObject.fontWeight === 'bold'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  B
                </button>
                <button
                  onClick={() => onUpdateProperty('fontStyle', selectedObject.fontStyle === 'italic' ? 'normal' : 'italic')}
                  className={`p-1.5 flex-1 rounded-lg border text-xs italic transition-colors ${
                    selectedObject.fontStyle === 'italic'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  I
                </button>
              </div>
            </div>
          </div>

          {/* Text Color Picker */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1">Text Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedObject.fill || '#ffffff'}
                onChange={(e) => onUpdateProperty('fill', e.target.value)}
                className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-700 cursor-pointer"
              />
              <input
                type="text"
                value={selectedObject.fill || '#ffffff'}
                onChange={(e) => onUpdateProperty('fill', e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white font-mono uppercase focus:outline-none"
              />
            </div>
          </div>

          {/* Letter Spacing (Tracking) */}
          <div>
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
              <span>Letter Spacing (Tracking)</span>
              <span>{Math.round((selectedObject.charSpacing || 0) / 20)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="10"
              value={selectedObject.charSpacing || 0}
              onChange={(e) => onUpdateProperty('charSpacing', parseInt(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* POSITION & GEOMETRY */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <h4 className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">Position & Coordinates</h4>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1">X Position</label>
            <input
              type="number"
              value={Math.round(selectedObject.left || 0)}
              onChange={(e) => onUpdateProperty('left', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1 text-xs text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1">Y Position</label>
            <input
              type="number"
              value={Math.round(selectedObject.top || 0)}
              onChange={(e) => onUpdateProperty('top', parseInt(e.target.value) || 0)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2 py-1 text-xs text-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-400 mb-1">Angle / Rotation (°)</label>
          <input
            type="number"
            min="-360"
            max="360"
            value={Math.round(selectedObject.angle || 0)}
            onChange={(e) => onUpdateProperty('angle', parseInt(e.target.value) || 0)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white font-mono focus:outline-none"
          />
        </div>
      </div>

      {/* OPACITY & APPEARANCE */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <h4 className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Appearance & Opacity</h4>

        <div>
          <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
            <span>Opacity</span>
            <span>{Math.round((selectedObject.opacity || 1) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={selectedObject.opacity || 1}
            onChange={(e) => onUpdateProperty('opacity', parseFloat(e.target.value))}
            className="w-full accent-sky-400 cursor-pointer"
          />
        </div>
      </div>

      {/* LAYER CONTROLS */}
      <div className="space-y-2 pt-3 border-t border-slate-800">
        <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Layer Ordering</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onBringToFront}
            className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bring Front</span>
          </button>
          <button
            onClick={onSendToBack}
            className="flex items-center justify-center space-x-1.5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
            <span>Send Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};
