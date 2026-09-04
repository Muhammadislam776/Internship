import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Toolbar } from './Toolbar';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { TEMPLATE_PRESETS } from './templatePresets';
import { exportToPNG, exportToPDF, generateQRDataUrl } from './exportUtils';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, Download, ExternalLink, QrCode, Sparkles } from 'lucide-react';

export const CanvasEditor = ({ initialTemplateId }) => {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const containerRef = useRef(null);

  const [currentTemplate, setCurrentTemplate] = useState(TEMPLATE_PRESETS[0]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(0.42);
  const [gridActive, setGridActive] = useState(false);
  const [orientation, setOrientation] = useState('landscape');
  const [isSaving, setIsSaving] = useState(false);

  // Modals state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewSampleRecipient, setPreviewSampleRecipient] = useState('Muhammad Ali');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueSuccessData, setIssueSuccessData] = useState(null);

  // Form State for Issuing
  const [issueForm, setIssueForm] = useState({
    recipientName: 'Muhammad Ali',
    recipientEmail: 'student@example.com',
    courseName: 'Full-Stack Software Engineering',
    achievement: 'Certificate of Excellence',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: ''
  });

  const navigate = useNavigate();

  // Resolution dimensions based on orientation
  const baseWidth = orientation === 'portrait' ? 1080 : 1920;
  const baseHeight = orientation === 'portrait' ? 1920 : 1080;

  useEffect(() => {
    // Initialize Fabric.js Canvas with base resolution
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: baseWidth * zoomLevel,
      height: baseHeight * zoomLevel,
      backgroundColor: currentTemplate.bg || '#FDFBF7',
      preserveObjectStacking: true,
      selection: true
    });

    canvas.setZoom(zoomLevel);
    fabricCanvasRef.current = canvas;

    // Load initial template
    loadTemplate(currentTemplate);

    // Event listeners for object selection and modification
    canvas.on('selection:created', (e) => setSelectedObject(e.selected[0]));
    canvas.on('selection:updated', (e) => setSelectedObject(e.selected[0]));
    canvas.on('selection:cleared', () => setSelectedObject(null));
    canvas.on('object:modified', () => setSelectedObject(canvas.getActiveObject()));

    // Keyboard shortcuts
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.target.tagName.match(/INPUT|TEXTAREA/)) {
        const activeObj = canvas.getActiveObject();
        if (activeObj && !activeObj.isEditing) {
          canvas.remove(activeObj);
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
  }, [orientation]);

  // Update canvas zoom and dimensions whenever zoomLevel changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (canvas) {
      canvas.setZoom(zoomLevel);
      canvas.setDimensions({
        width: baseWidth * zoomLevel,
        height: baseHeight * zoomLevel
      });
      canvas.renderAll();
    }
  }, [zoomLevel, baseWidth, baseHeight]);

  // Load template preset into Fabric.js Canvas with EDITABLE TEXT & PROPER COLORS
  const loadTemplate = (template) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    setCurrentTemplate(template);
    canvas.clear();
    const bgColor = template.bg || template.designData?.background || '#FDFBF7';
    const borderColor = template.borderColor || template.designData?.borderColor || '#D4AF37';

    canvas.setBackgroundColor(bgColor, canvas.renderAll.bind(canvas));

    // Apply template border frame if defined
    if (borderColor) {
      const rect = new fabric.Rect({
        left: 40,
        top: 40,
        width: baseWidth - 80,
        height: baseHeight - 80,
        fill: 'transparent',
        stroke: borderColor,
        strokeWidth: 8,
        rx: 16,
        ry: 16,
        selectable: false,
        evented: false
      });
      canvas.add(rect);

      // Inner dashed accent line
      const innerRect = new fabric.Rect({
        left: 56,
        top: 56,
        width: baseWidth - 112,
        height: baseHeight - 112,
        fill: 'transparent',
        stroke: borderColor,
        strokeWidth: 2,
        strokeDashArray: [10, 8],
        rx: 12,
        ry: 12,
        selectable: false,
        evented: false,
        opacity: 0.6
      });
      canvas.add(innerRect);
    }

    // Load template elements - supports both designData.elements and direct elements array
    const elementsList = template.designData?.elements || template.elements || [];
    elementsList.forEach((item) => {
      if (item.type === 'text') {
        const textObj = new fabric.IText(item.text, {
          left: item.left !== undefined ? item.left : baseWidth / 2,
          top: item.top,
          originX: 'center',
          fontSize: item.fontSize || 24,
          fill: item.fill || item.color || '#FCD34D',
          fontFamily: item.fontFamily || item.font || 'Cinzel',
          fontWeight: item.fontWeight || (item.bold ? 'bold' : 'normal'),
          charSpacing: item.charSpacing || (item.tracking ? item.tracking * 20 : 0),
          opacity: item.opacity || 1,
          editable: true
        });
        canvas.add(textObj);
      }
    });

    // Add Default Real Scannable QR Code
    addQRCodePlaceholder();

    canvas.renderAll();
  };

  const addQRCodePlaceholder = async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Remove existing QR if any
    const existing = canvas.getObjects().filter(o => o.name === 'qrcode_placeholder');
    existing.forEach(o => canvas.remove(o));

    const qrDataUrl = await generateQRDataUrl(`${window.location.origin}/verify/CERT-2026-DEMO`);

    fabric.Image.fromURL(qrDataUrl, (img) => {
      img.scaleToWidth(140);
      img.set({
        left: baseWidth - 180,
        top: baseHeight - 180,
        originX: 'center',
        originY: 'center',
        name: 'qrcode_placeholder',
        cornerColor: '#2563EB',
        cornerSize: 10,
        transparentCorners: false
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  };

  // Canvas Actions
  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.05, 1.0));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.05, 0.2));
  const handleResetZoom = () => setZoomLevel(0.42);

  const handleToggleGrid = () => setGridActive(!gridActive);

  const handleClear = () => {
    if (window.confirm('Clear all canvas elements?')) {
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.setBackgroundColor('#FDFBF7', fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current));
    }
  };

  const handleAddText = (content, options = {}) => {
    const canvas = fabricCanvasRef.current;
    const text = new fabric.IText(content, {
      left: baseWidth / 2,
      top: 300,
      originX: 'center',
      fontSize: options.fontSize || 24,
      fill: options.color || '#FCD34D',
      fontFamily: options.fontFamily || 'Inter',
      fontWeight: options.fontWeight || 'normal',
      charSpacing: options.charSpacing || 0,
      editable: true
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const handleAddVariable = (tag) => {
    handleAddText(tag, { color: '#2563EB', fontFamily: 'Montserrat', fontWeight: 'bold' });
  };

  const handleAddElement = (elem) => {
    const canvas = fabricCanvasRef.current;
    fabric.loadSVGFromString(elem.svg, (objects, options) => {
      const obj = fabric.util.groupSVGElements(objects, options);
      obj.set({
        left: baseWidth / 2,
        top: baseHeight / 2,
        originX: 'center',
        originY: 'center',
        scaleX: 1.5,
        scaleY: 1.5
      });
      canvas.add(obj);
      canvas.setActiveObject(obj);
      canvas.renderAll();
    });
  };

  const handleAddShape = (type) => {
    const canvas = fabricCanvasRef.current;
    let shape;
    if (type === 'rect') {
      shape = new fabric.Rect({
        left: baseWidth / 2 - 100,
        top: baseHeight / 2 - 50,
        width: 200,
        height: 100,
        fill: '#F1F5F9',
        stroke: '#D4AF37',
        strokeWidth: 2,
        rx: 12,
        ry: 12
      });
    } else if (type === 'circle') {
      shape = new fabric.Circle({
        left: baseWidth / 2 - 60,
        top: baseHeight / 2 - 60,
        radius: 60,
        fill: '#F1F5F9',
        stroke: '#2563EB',
        strokeWidth: 3
      });
    } else if (type === 'line') {
      shape = new fabric.Rect({
        left: baseWidth / 2 - 300,
        top: baseHeight / 2,
        width: 600,
        height: 4,
        fill: '#D4AF37'
      });
    }
    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
    }
  };

  const handleUploadLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (f) => {
      fabric.Image.fromURL(f.target.result, (img) => {
        img.scaleToWidth(180);
        img.set({ left: 120, top: 120 });
        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.setActiveObject(img);
        fabricCanvasRef.current.renderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSetBackground = (color) => {
    fabricCanvasRef.current.setBackgroundColor(color, fabricCanvasRef.current.renderAll.bind(fabricCanvasRef.current));
  };

  // Alignment helpers
  const handleAlignCenterH = () => {
    const obj = fabricCanvasRef.current.getActiveObject();
    if (obj) {
      obj.set({ left: baseWidth / 2, originX: 'center' });
      fabricCanvasRef.current.renderAll();
    }
  };

  const handleAlignCenterV = () => {
    const obj = fabricCanvasRef.current.getActiveObject();
    if (obj) {
      obj.set({ top: baseHeight / 2, originY: 'center' });
      fabricCanvasRef.current.renderAll();
    }
  };

  const handleUpdateProperty = (prop, value) => {
    const obj = fabricCanvasRef.current.getActiveObject();
    if (obj) {
      obj.set(prop, value);
      fabricCanvasRef.current.renderAll();
      setSelectedObject({ ...obj });
    }
  };

  const handleBringToFront = () => {
    const obj = fabricCanvasRef.current.getActiveObject();
    if (obj) fabricCanvasRef.current.bringToFront(obj);
  };

  const handleSendToBack = () => {
    const obj = fabricCanvasRef.current.getActiveObject();
    if (obj) fabricCanvasRef.current.sendToBack(obj);
  };

  const handleDuplicate = () => {
    const obj = fabricCanvasRef.current.getActiveObject();
    if (obj) {
      obj.clone((cloned) => {
        cloned.set({ left: obj.left + 30, top: obj.top + 30 });
        fabricCanvasRef.current.add(cloned);
        fabricCanvasRef.current.setActiveObject(cloned);
        fabricCanvasRef.current.renderAll();
      });
    }
  };

  const handleDelete = () => {
    const obj = fabricCanvasRef.current.getActiveObject();
    if (obj) {
      fabricCanvasRef.current.remove(obj);
      fabricCanvasRef.current.discardActiveObject();
      fabricCanvasRef.current.renderAll();
      setSelectedObject(null);
    }
  };

  // Open Live Preview with EXACT 1-to-1 Full Canvas Snapshot
  const handleOpenPreview = (sampleName = null) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const targetName = sampleName || previewSampleRecipient;
    if (sampleName) setPreviewSampleRecipient(sampleName);

    // Swap recipient name text temporarily ONLY if {{recipientName}} placeholder is still present
    const textObjects = canvas.getObjects().filter(o => o.type === 'i-text' || o.type === 'text');
    const tagObj = textObjects.find(o => o.text.includes('{{recipientName}}'));

    let originalText = null;
    if (tagObj) {
      originalText = tagObj.text;
      tagObj.set('text', targetName);
      canvas.renderAll();
    }

    // Temporarily set zoom to 1 to take full 1920x1080 snapshot
    const currentZoom = canvas.getZoom();
    canvas.setZoom(1);
    canvas.setDimensions({ width: baseWidth, height: baseHeight });

    const snapshotUrl = canvas.toDataURL({
      format: 'png',
      quality: 1.0
    });

    // Restore viewport zoom
    canvas.setZoom(currentZoom);
    canvas.setDimensions({ width: baseWidth * currentZoom, height: baseHeight * currentZoom });
    canvas.renderAll();

    setPreviewImage(snapshotUrl);
    setShowPreviewModal(true);

    // Restore original tag/text
    if (tagObj && originalText) {
      tagObj.set('text', originalText);
      canvas.renderAll();
    }
  };

  // Export helper (resets zoom to 1 before capturing high-res file)
  const handleExportPNG = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const currentZoom = canvas.getZoom();
    canvas.setZoom(1);
    canvas.setDimensions({ width: baseWidth, height: baseHeight });
    exportToPNG(canvas, currentTemplate.name);
    canvas.setZoom(currentZoom);
    canvas.setDimensions({ width: baseWidth * currentZoom, height: baseHeight * currentZoom });
    canvas.renderAll();
  };

  const handleExportPDF = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const currentZoom = canvas.getZoom();
    canvas.setZoom(1);
    canvas.setDimensions({ width: baseWidth, height: baseHeight });
    exportToPDF(canvas, currentTemplate.name);
    canvas.setZoom(currentZoom);
    canvas.setDimensions({ width: baseWidth * currentZoom, height: baseHeight * currentZoom });
    canvas.renderAll();
  };

  // Save Draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const designJson = fabricCanvasRef.current.toJSON();
      const res = await api.createCertificate({
        title: currentTemplate.name,
        recipientName: issueForm.recipientName,
        recipientEmail: issueForm.recipientEmail,
        courseName: issueForm.courseName,
        status: 'Draft',
        designData: designJson
      });
      if (res.success) {
        alert('🎉 Draft certificate saved successfully!');
      }
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Confirm Issue Certificate
  const handleConfirmIssue = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const certId = `CERT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const qrUrl = `${window.location.origin}/verify/${certId}`;

      const canvas = fabricCanvasRef.current;
      const textObjects = canvas.getObjects().filter(o => o.type === 'i-text' || o.type === 'text');
      const recipientTextObj = textObjects.find(o => o.text.includes('{{recipientName}}'));
      if (recipientTextObj) {
        recipientTextObj.set('text', issueForm.recipientName);
        canvas.renderAll();
      }

      const designJson = canvas.toJSON();

      const res = await api.createCertificate({
        certificateId: certId,
        title: currentTemplate.name,
        recipientName: issueForm.recipientName,
        recipientEmail: issueForm.recipientEmail,
        courseName: issueForm.courseName,
        issueDate: issueForm.issueDate,
        status: 'Issued',
        qrCodeUrl: qrUrl,
        designData: designJson
      });

      if (res.success) {
        setIssueSuccessData(res.certificate || { certificateId: certId, qrCodeUrl: qrUrl, recipientName: issueForm.recipientName });
      }
    } catch (err) {
      alert(`Issuance error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden font-sans">
      {/* Top Studio Toolbar */}
      <Toolbar
        templateName={currentTemplate.name}
        onBack={() => navigate('/org')}
        onUndo={() => {}}
        onRedo={() => {}}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        zoomLevel={zoomLevel}
        gridActive={gridActive}
        onToggleGrid={handleToggleGrid}
        onClear={handleClear}
        onPreview={() => handleOpenPreview()}
        onSaveDraft={handleSaveDraft}
        onIssue={() => setShowIssueModal(true)}
        onExportPNG={handleExportPNG}
        onExportPDF={handleExportPDF}
        isSaving={isSaving}
        orientation={orientation}
        onChangeOrientation={(o) => setOrientation(o)}
      />

      {/* Main Studio Body: Left Sidebar | Canvas Workspace | Right Inspector */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Elements Sidebar */}
        <LeftSidebar
          onSelectTemplate={loadTemplate}
          onAddText={handleAddText}
          onAddVariable={handleAddVariable}
          onAddElement={handleAddElement}
          onUploadLogo={handleUploadLogo}
          onAddSignature={(title, desc) => handleAddText(`${title}\n(${desc})`, { fontSize: 14, color: '#64748B' })}
          onAddQRCode={addQRCodePlaceholder}
          onSetBackground={handleSetBackground}
          onAddShape={handleAddShape}
        />

        {/* Center Canvas Viewport */}
        <div ref={containerRef} className="flex-1 bg-slate-900/90 overflow-auto flex items-center justify-center p-6 relative shadow-inner">
          <div className="border-4 border-slate-800 rounded-2xl shadow-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
            <canvas ref={canvasRef} />
          </div>
        </div>

        {/* Right Inspector Panel */}
        <RightSidebar
          selectedObject={selectedObject}
          onUpdateProperty={handleUpdateProperty}
          onBringToFront={handleBringToFront}
          onSendToBack={handleSendToBack}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onAlignCenterH={handleAlignCenterH}
          onAlignCenterV={handleAlignCenterV}
        />
      </div>

      {/* 1. LIVE PREVIEW MODAL WITH FULL CANVAS SNAPSHOT */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Live High-Res Certificate Preview</h3>
                <p className="text-xs text-slate-400">1-to-1 exact visual snapshot rendered from your canvas studio.</p>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rendered Live Canvas Snapshot */}
            <div className="rounded-2xl border border-slate-700 overflow-hidden shadow-2xl bg-black flex items-center justify-center p-2">
              <img src={previewImage} alt="Live Certificate Snapshot" className="max-h-[440px] object-contain rounded-xl" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400 font-bold">Sample Student:</span>
                {['Muhammad Ali', 'Fatima Khan', 'Zaid Ahmed'].map((name) => (
                  <button
                    key={name}
                    onClick={() => handleOpenPreview(name)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      previewSampleRecipient === name ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>

              <div className="flex space-x-3">
                <button onClick={handleExportPNG} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md">
                  Download 4K PNG
                </button>
                <button onClick={handleExportPDF} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md">
                  Download Print PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ISSUE CERTIFICATE MODAL */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            {!issueSuccessData ? (
              <form onSubmit={handleConfirmIssue} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Issue Official Certificate</h3>
                  <button type="button" onClick={() => setShowIssueModal(false)} className="p-1 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Recipient Student Name *</label>
                    <input
                      type="text"
                      required
                      value={issueForm.recipientName}
                      onChange={(e) => setIssueForm({ ...issueForm, recipientName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Recipient Student Email *</label>
                    <input
                      type="email"
                      required
                      value={issueForm.recipientEmail}
                      onChange={(e) => setIssueForm({ ...issueForm, recipientEmail: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">Course / Program Awarded *</label>
                    <input
                      type="text"
                      required
                      value={issueForm.courseName}
                      onChange={(e) => setIssueForm({ ...issueForm, courseName: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button type="button" onClick={() => setShowIssueModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving} className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs rounded-xl shadow-lg">
                    {isSaving ? 'Issuing Certificate...' : 'Confirm & Issue Now 🎉'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                <h3 className="text-xl font-black text-white">Certificate Issued Successfully 🎉</h3>
                <p className="text-xs text-slate-400">
                  Credential ID: <span className="font-mono text-amber-400 font-bold">{issueSuccessData.certificateId}</span>
                </p>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-300 font-mono flex items-center justify-between">
                  <span className="truncate">{issueSuccessData.qrCodeUrl}</span>
                  <button onClick={() => navigator.clipboard.writeText(issueSuccessData.qrCodeUrl)} className="px-2 py-1 bg-indigo-600 text-white rounded text-[10px]">
                    Copy Link
                  </button>
                </div>

                <div className="flex justify-center space-x-3 pt-2">
                  <button onClick={handleExportPNG} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl">
                    Download PNG
                  </button>
                  <button onClick={() => { setShowIssueModal(false); setIssueSuccessData(null); navigate('/org/issued'); }} className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
                    View My Certificates
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
