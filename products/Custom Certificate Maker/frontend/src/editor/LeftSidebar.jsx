import React, { useState } from 'react';
import {
  LayoutTemplate,
  Type,
  Shapes,
  Image as ImageIcon,
  PenTool,
  QrCode,
  Palette,
  Sparkles,
  Upload,
  Square,
  Circle,
  Star,
  Award,
  Frame,
  Layers
} from 'lucide-react';
import { TEMPLATE_PRESETS } from './templatePresets';
import { DECORATIVE_ELEMENTS } from './elementLibrary';

export const LeftSidebar = ({
  onSelectTemplate,
  onAddText,
  onAddVariable,
  onAddElement,
  onUploadLogo,
  onAddSignature,
  onAddQRCode,
  onSetBackground,
  onAddShape,
  onAddFrame
}) => {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const tabs = [
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'elements', label: 'Elements', icon: Shapes },
    { id: 'shapes', label: 'Shapes', icon: Square },
    { id: 'frames', label: 'Frames', icon: Frame },
    { id: 'logos', label: 'Logos', icon: ImageIcon },
    { id: 'signatures', label: 'Signatures', icon: PenTool },
    { id: 'qrcode', label: 'QR Code', icon: QrCode },
    { id: 'background', label: 'Background', icon: Palette }
  ];

  const categories = ['All', 'Academic', 'Corporate', 'Technology', 'Luxury', 'Achievement', 'Appreciation', 'Participation'];

  const filteredTemplates = selectedCategory === 'All'
    ? TEMPLATE_PRESETS
    : TEMPLATE_PRESETS.filter(t => t.category === selectedCategory);

  const variables = [
    { label: 'Recipient Name', tag: '{{recipientName}}' },
    { label: 'Course / Program', tag: '{{courseName}}' },
    { label: 'Organization Name', tag: '{{organizationName}}' },
    { label: 'Issue Date', tag: '{{issueDate}}' },
    { label: 'Certificate ID', tag: '{{certificateId}}' },
    { label: 'Description', tag: '{{description}}' }
  ];

  const bgPresets = [
    { name: 'Ivory Classic', color: '#FDFBF7' },
    { name: 'Pure White', color: '#FFFFFF' },
    { name: 'Obsidian Gold', color: '#0F172A' },
    { name: 'Parchment Cream', color: '#FFFDF5' },
    { name: 'Emerald Mint', color: '#F0FDF4' },
    { name: 'Soft Linen', color: '#FFFDF9' },
    { name: 'Royal Blue Offwhite', color: '#FAFAFA' },
    { name: 'Cyber Dark', color: '#020617' }
  ];

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-800 flex h-[calc(100vh-4rem)] shrink-0 z-20">
      {/* Icon Navigation Column */}
      <div className="w-16 bg-slate-950 border-r border-slate-800 py-3 flex flex-col items-center space-y-2 shrink-0 overflow-y-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[8px] mt-0.5 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panel Drawer */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Canva Certificate Presets</h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredTemplates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => onSelectTemplate(t)}
                  className="group cursor-pointer rounded-2xl border border-slate-800 overflow-hidden bg-slate-950/60 hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/10 transition-all p-2.5"
                >
                  <div
                    className="h-28 rounded-xl mb-2 relative overflow-hidden flex flex-col justify-center items-center p-3 border shadow-inner"
                    style={{ backgroundColor: t.bg, borderColor: t.borderColor }}
                  >
                    <p className="text-[11px] font-bold text-center uppercase tracking-wide truncate max-w-[90%]" style={{ color: t.borderColor }}>
                      {t.name}
                    </p>
                    <p className="text-[9px] mt-1 text-slate-400 font-mono">1920 × 1080 Landscape</p>
                    <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-xs font-bold rounded-lg shadow-lg">Load Template</span>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-white truncate">{t.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEXT TAB */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Typography & Headings</h3>
              <div className="space-y-2">
                <button
                  onClick={() => onAddText('CERTIFICATE OF ACHIEVEMENT', { fontSize: 40, fontWeight: 'bold', fontFamily: 'Cinzel', color: '#D4AF37' })}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-amber-400 font-bold text-base font-cinzel border border-slate-700/50 transition-colors"
                >
                  + Add Classic Title Heading
                </button>
                <button
                  onClick={() => onAddText('THIS DIPLOMA IS PROUDLY PRESENTED TO', { fontSize: 13, fontFamily: 'Montserrat', color: '#64748B' })}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700/50 transition-colors"
                >
                  + Add Subtitle Text
                </button>
                <button
                  onClick={() => onAddText('In recognition of mastering professional web engineering skills.', { fontSize: 16, fontFamily: 'Inter', color: '#334155' })}
                  className="w-full text-left p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-400 text-xs border border-slate-700/50 transition-colors"
                >
                  + Add Description Body
                </button>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Smart Variables</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <p className="text-[10px] text-slate-400 mb-3">Click to insert auto-populating field placeholders:</p>
              <div className="grid grid-cols-2 gap-2">
                {variables.map((v) => (
                  <button
                    key={v.tag}
                    onClick={() => onAddVariable(v.tag)}
                    className="p-2 rounded-xl bg-slate-800/60 hover:bg-indigo-600/20 hover:border-indigo-500/40 text-left border border-slate-700/50 transition-colors group"
                  >
                    <p className="text-[10px] font-bold text-slate-300 group-hover:text-indigo-400">{v.label}</p>
                    <p className="text-[9px] font-mono text-slate-500 truncate">{v.tag}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ELEMENTS TAB */}
        {activeTab === 'elements' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Decorative Seals & Badges</h3>
            <div className="grid grid-cols-2 gap-3">
              {DECORATIVE_ELEMENTS.map((elem) => (
                <div
                  key={elem.id}
                  onClick={() => onAddElement(elem)}
                  className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 hover:border-amber-500/50 cursor-pointer flex flex-col items-center justify-center transition-all hover:scale-105"
                >
                  <div dangerouslySetInnerHTML={{ __html: elem.svg }} className="w-16 h-16 flex items-center justify-center mb-2" />
                  <p className="text-[10px] font-semibold text-slate-300 text-center">{elem.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHAPES TAB */}
        {activeTab === 'shapes' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Geometric Shapes & Dividers</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onAddShape && onAddShape('rect')}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex flex-col items-center space-y-2"
              >
                <Square className="w-6 h-6 text-amber-400" />
                <span className="text-[10px] font-bold">Rectangle Box</span>
              </button>
              <button
                onClick={() => onAddShape && onAddShape('circle')}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex flex-col items-center space-y-2"
              >
                <Circle className="w-6 h-6 text-sky-400" />
                <span className="text-[10px] font-bold">Circle Medallion</span>
              </button>
              <button
                onClick={() => onAddShape && onAddShape('line')}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex flex-col items-center space-y-2 col-span-2"
              >
                <div className="w-full h-1 bg-amber-400 rounded my-2" />
                <span className="text-[10px] font-bold">Divider Line</span>
              </button>
            </div>
          </div>
        )}

        {/* FRAMES TAB */}
        {activeTab === 'frames' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Borders & Ornate Frames</h3>
            <div className="space-y-2">
              <button
                onClick={() => onAddFrame && onAddFrame('double-gold')}
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/50 text-left"
              >
                <p className="text-xs font-bold text-amber-400">Double Gold Academic Frame</p>
                <p className="text-[10px] text-slate-400">Outer 6px gold line + inner 1.5px dashed border.</p>
              </button>
              <button
                onClick={() => onAddFrame && onAddFrame('emerald-swoosh')}
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/50 text-left"
              >
                <p className="text-xs font-bold text-emerald-400">Emerald Curved Frame</p>
                <p className="text-[10px] text-slate-400">Curved corner flourishes & emerald stroke.</p>
              </button>
            </div>
          </div>
        )}

        {/* LOGOS TAB */}
        {activeTab === 'logos' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Institute Logo</h3>
            <label className="block p-5 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl text-center cursor-pointer transition-colors bg-slate-950/40">
              <ImageIcon className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <span className="text-xs font-bold text-white">Upload Custom Logo</span>
              <span className="block text-[10px] text-slate-400 mt-1">PNG, JPG, SVG supported</span>
              <input type="file" accept="image/*" onChange={onUploadLogo} className="hidden" />
            </label>
          </div>
        )}

        {/* SIGNATURES TAB */}
        {activeTab === 'signatures' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Authorized Signatures</h3>
            <div className="space-y-3">
              <button
                onClick={() => onAddSignature('Left Signature Block', 'Academic Director')}
                className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-left border border-slate-700/50 transition-colors flex items-center space-x-3"
              >
                <PenTool className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-xs font-bold text-white">Add Left Signature</p>
                  <p className="text-[10px] text-slate-400">Default Label: Academic Director</p>
                </div>
              </button>
              <button
                onClick={() => onAddSignature('Right Signature Block', 'Vice Chancellor')}
                className="w-full p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-left border border-slate-700/50 transition-colors flex items-center space-x-3"
              >
                <PenTool className="w-4 h-4 text-sky-400" />
                <div>
                  <p className="text-xs font-bold text-white">Add Right Signature</p>
                  <p className="text-[10px] text-slate-400">Default Label: Vice Chancellor</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* QR CODE TAB */}
        {activeTab === 'qrcode' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Verification QR Code</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The QR code links dynamically to the public verification endpoint <code className="text-sky-400 font-mono">/verify/:id</code>.
            </p>
            <button
              onClick={onAddQRCode}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>Insert Live Verification QR Code</span>
            </button>
          </div>
        )}

        {/* BACKGROUND TAB */}
        {activeTab === 'background' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Background Palette</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {bgPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onSetBackground(preset.color)}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-xl flex items-center space-x-2 text-left transition-colors"
                >
                  <span className="w-6 h-6 rounded-lg border border-slate-700 shrink-0 shadow-inner" style={{ backgroundColor: preset.color }} />
                  <span className="text-[11px] font-semibold text-slate-300 truncate">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
