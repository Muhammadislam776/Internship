import React from 'react';
import { 
  FileText, 
  FileSpreadsheet, 
  FileArchive, 
  Image as ImageIcon, 
  Film, 
  Music, 
  FileCode, 
  File 
} from 'lucide-react';

export function getFileIcon(fileType, mimeType, fileName) {
  const ext = (fileName || '').split('.').pop().toLowerCase();
  if (fileType === 'image' || (mimeType && mimeType.startsWith('image/'))) {
    return <ImageIcon size={24} color="#22D3EE" />;
  }
  if (['pdf'].includes(ext)) {
    return <FileText size={24} color="#EF4444" />;
  }
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) {
    return <FileText size={24} color="#2563EB" />;
  }
  if (['xls', 'xlsx', 'csv'].includes(ext)) {
    return <FileSpreadsheet size={24} color="#22C55E" />;
  }
  if (['ppt', 'pptx'].includes(ext)) {
    return <FileText size={24} color="#FF7A18" />;
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext) || fileType === 'archive') {
    return <FileArchive size={24} color="#A855F7" />;
  }
  if (fileType === 'video' || ['mp4', 'mov', 'avi', 'mkv'].includes(ext)) {
    return <Film size={24} color="#EC4899" />;
  }
  if (fileType === 'code' || ['js', 'html', 'css', 'json', 'py'].includes(ext)) {
    return <FileCode size={24} color="#3B82F6" />;
  }
  return <File size={24} color="#64748B" />;
}
