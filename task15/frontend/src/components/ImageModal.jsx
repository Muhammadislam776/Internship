import React from 'react';
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react';

export const ImageModal = ({ imageUrl, userName, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative glass-panel rounded-3xl p-6 border border-[#22D3EE]/40 shadow-2xl max-w-lg w-full flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-4 h-4 text-[#22D3EE]" />
            <h3 className="font-bold text-sm text-white">{userName} - Avatar Preview</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 text-[#9FB0C2] hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Image Container with Glow */}
        <div className="relative group p-2 rounded-full bg-gradient-to-tr from-[#2563EB] via-[#22D3EE] to-[#FF7A18] shadow-2xl shadow-[#22D3EE]/30">
          <img
            src={imageUrl}
            alt={userName}
            className="w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover shadow-inner transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Caption & Actions */}
        <div className="mt-6 flex items-center gap-4">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#22D3EE]/20 text-xs font-semibold text-white border border-[#22D3EE]/30 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Open High-Res</span>
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0B253A] text-xs font-bold text-white border border-[#22D3EE]/40 hover:scale-105 transition-transform"
          >
            Close Lightbox
          </button>
        </div>
      </div>
    </div>
  );
};
