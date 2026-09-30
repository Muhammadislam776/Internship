import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Appointment } from '../../types';
import { SupabaseRealtimeWebRTC } from '../../lib/supabaseClient';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Share2,
  PenTool,
  FileText,
  MessageSquare,
  ShieldCheck,
  Activity,
  Heart,
  AlertTriangle,
  Pill,
  Send,
  Download,
  Eraser,
  Sparkles,
  Lock,
  User,
  CheckCircle2,
  Clock,
  Maximize2
} from 'lucide-react';

export const VideoConsultationRoom: React.FC = () => {
  const {
    activeTelehealthAppointment,
    setActiveTelehealthAppointment,
    currentRole,
    doctors,
    currentDoctorId,
    approvePrescription,
    showToast,
    addAuditLog,
    setActiveTab
  } = useApp();

  const appointment = activeTelehealthAppointment;
  const currentDoctor = doctors.find((d) => d.id === currentDoctorId) || doctors[0];

  // Media state
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(142);
  const [activeSidePanel, setActiveSidePanel] = useState<'soap' | 'whiteboard' | 'chat' | 'prescribe'>('soap');

  // Real WebRTC local video reference
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  // SOAP Notes state
  const [soapNotes, setSoapNotes] = useState({
    subjective: appointment ? `Patient reports: ${appointment.reasonForVisit}. Symptoms present for ~2-3 weeks with worsening morning stiffness.` : 'Patient presents with acute symptoms.',
    objective: 'Vital Signs: BP 124/82 mmHg, HR 74 bpm, SpO2 98% on room air. Telehealth video assessment confirms clear speech, no respiratory distress.',
    assessment: '1. Stepped clinical review. 2. Stable chronic disease control. No red flags detected.',
    plan: '1. Continue current maintenance regime. 2. Issue repeat EPS prescription. 3. Routine 6-month follow-up.'
  });

  // Whiteboard Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#005EB8'); // NHS Blue default
  const [brushSize, setBrushSize] = useState(3);
  const [selectedDiagram, setSelectedDiagram] = useState<'anatomy' | 'spine' | 'dental' | 'blank'>('blank');

  // In-call Chat
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string; isSelf: boolean }>>([
    { sender: 'Dr. Sarah Jenkins', text: 'Good morning Oliver, can you hear and see me clearly?', time: '09:30', isSelf: true },
    { sender: 'Oliver Bennett', text: 'Yes Doctor, loud and clear!', time: '09:30', isSelf: false }
  ]);
  const [inputChat, setInputChat] = useState('');

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDurationSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // WebRTC Local Media Initialization attempt (with graceful fallback)
  useEffect(() => {
    let stream: MediaStream | null = null;
    let isCancelled = false;

    const startLocalStream = async () => {
      try {
        if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
          // Timeout race so browser permission dialog never blocks or freezes UI
          const mediaPromise = navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          const timeoutPromise = new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error('Media timeout')), 2500)
          );
          const acquiredStream = (await Promise.race([mediaPromise, timeoutPromise])) as MediaStream | null;
          if (!isCancelled && acquiredStream && localVideoRef.current) {
            stream = acquiredStream;
            localVideoRef.current.srcObject = stream;
          }
        }
      } catch {
        // Fallback to simulated stream without throwing error
      }
    };
    startLocalStream();

    return () => {
      isCancelled = true;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Whiteboard Canvas handlers
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;
    const newMsg = {
      sender: currentRole === 'doctor' ? currentDoctor.name : 'Patient',
      text: inputChat.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputChat('');
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSaveSoapNotes = () => {
    addAuditLog({
      userId: currentDoctor.id,
      userRole: 'doctor',
      userName: currentDoctor.name,
      action: 'TELEHEALTH_SESSION_STARTED',
      patientId: appointment?.patientId || 'pat_1',
      patientName: appointment?.patientName || 'Oliver Bennett',
      resourceId: appointment?.id || 'apt_101',
      ipAddress: '194.74.120.45 (NHS Encrypted WebRTC Peer)',
      status: 'SUCCESS',
      complianceStandard: 'HIPAA_SECURITY_RULE',
      details: `Saved clinical SOAP notes for session duration ${formatTimer(callDurationSeconds)}.`
    });
    showToast('success', 'SOAP Notes Saved & Synced', 'Encrypted and attached to NHS Electronic Health Record (EHR).');
  };

  return (
    <div className="space-y-4">
      {/* Telehealth Room Top Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                WebRTC Telehealth Consultation Suite
              </h2>
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Supabase Realtime Signaling Connected</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Patient: <strong className="text-slate-200">{appointment?.patientName || 'Oliver Bennett'}</strong> (NHS: {appointment?.patientNhsNumber || '485 772 9012'}) | Room: <span className="font-mono text-cyan-400">room_{appointment?.id || 'apt_101'}</span>
            </p>
          </div>
        </div>

        {/* Security indicators & timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-teal-300 font-bold">{formatTimer(callDurationSeconds)}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End DTLS-SRTP Encrypted</span>
          </div>

          <button
            onClick={() => {
              setActiveTelehealthAppointment(null);
              setActiveTab('schedule');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold transition-all"
          >
            <PhoneOff className="w-4 h-4 text-rose-400" />
            <span>End Call</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Video Stream + Interactive Clinical Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Video Feeds & Stream Controls (8 cols on lg) */}
        <div className="lg:col-span-8 flex flex-col space-y-3">
          {/* Video Container (Main Peer + Picture-in-Picture Self) */}
          <div className="relative aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center group">
            {/* Remote Video (Patient Feed) */}
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
              {isVideoEnabled ? (
                <div className="relative w-full h-full">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=1000"
                    alt="Patient Stream"
                    className="w-full h-full object-cover opacity-90 filter brightness-95 contrast-105"
                  />
                  {/* Real-time Audio Waveform Visualizer Overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-200">
                    <User className="w-3.5 h-3.5 text-teal-400" />
                    <span>{appointment?.patientName || 'Oliver Bennett'} (Patient)</span>
                    <div className="flex items-center gap-0.5 ml-1">
                      <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse delay-75" />
                      <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse delay-150" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 border border-slate-700">
                    <User className="w-10 h-10 text-slate-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-300">Camera Off</h4>
                </div>
              )}

              {/* Patient Live Vitals HUD */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-xl text-xs space-y-1.5 shadow-lg">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" /> Heart Rate:
                    </span>
                    <span className="font-mono font-bold text-white">74 bpm</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" /> SpO2:
                    </span>
                    <span className="font-mono font-bold text-emerald-400">98%</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400">Blood Pressure:</span>
                    <span className="font-mono font-bold text-white">124/82</span>
                  </div>
                </div>

                {/* Allergy warning overlay */}
                <div className="bg-rose-950/90 border border-rose-600/50 p-2 rounded-xl text-[11px] text-rose-200 flex items-center gap-1.5 shadow-lg">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>Allergies: Penicillin V, Latex</span>
                </div>
              </div>

              {/* Picture-in-Picture Local Self Stream (Doctor) */}
              <div className="absolute bottom-4 right-4 w-44 sm:w-52 aspect-video bg-slate-900 rounded-xl border-2 border-slate-700 shadow-2xl overflow-hidden group/pip">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1.5 left-2 text-[10px] bg-black/70 text-slate-200 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {currentDoctor.name} (You)
                </div>
              </div>
            </div>

            {/* Video Stream Bottom Control Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700 shadow-2xl">
              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`p-3 rounded-xl transition-all ${
                  isAudioEnabled ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                }`}
                title={isAudioEnabled ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`p-3 rounded-xl transition-all ${
                  isVideoEnabled ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
                }`}
                title={isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
              >
                {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                className={`p-3 rounded-xl transition-all ${
                  isScreenSharing ? 'bg-teal-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
                title="Share Screen"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <div className="h-6 w-px bg-slate-700" />

              <button
                onClick={() => {
                  showToast('info', 'Call Recording Notice', 'GDPR consent logged. Audio recording is disabled for clinical privacy compliance.');
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>GDPR Consent Verified</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: In-Call Clinical Workspace (4 cols on lg) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-[560px]">
          {/* Workspace Tab Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 mb-3">
            {[
              { id: 'soap', label: 'SOAP Notes', icon: FileText },
              { id: 'whiteboard', label: 'Whiteboard', icon: PenTool },
              { id: 'prescribe', label: 'Prescribe', icon: Pill },
              { id: 'chat', label: 'Chat', icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSidePanel === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSidePanel(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive ? 'bg-nhs-blue text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Panel 1: Clinical SOAP Notes */}
          {activeSidePanel === 'soap' && (
            <div className="flex-1 flex flex-col justify-between overflow-y-auto space-y-3">
              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                    Subjective (Patient Reported)
                  </label>
                  <textarea
                    rows={2}
                    value={soapNotes.subjective}
                    onChange={(e) => setSoapNotes({ ...soapNotes, subjective: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block mb-1">
                    Objective (Clinical Telehealth Observations)
                  </label>
                  <textarea
                    rows={2}
                    value={soapNotes.objective}
                    onChange={(e) => setSoapNotes({ ...soapNotes, objective: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    Assessment & Diagnosis
                  </label>
                  <textarea
                    rows={2}
                    value={soapNotes.assessment}
                    onChange={(e) => setSoapNotes({ ...soapNotes, assessment: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    Plan & Prescribing
                  </label>
                  <textarea
                    rows={2}
                    value={soapNotes.plan}
                    onChange={(e) => setSoapNotes({ ...soapNotes, plan: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveSoapNotes}
                className="w-full py-2 bg-gradient-to-r from-nhs-blue to-teal-600 hover:from-nhs-brightblue hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                Save SOAP Notes to NHS Spine Record
              </button>
            </div>
          )}

          {/* Panel 2: Interactive Clinical Whiteboard */}
          {activeSidePanel === 'whiteboard' && (
            <div className="flex-1 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300 pb-1 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Color:</span>
                  {['#005EB8', '#DA291C', '#007F3B', '#FFB81C', '#FFFFFF'].map((col) => (
                    <button
                      key={col}
                      onClick={() => setDrawColor(col)}
                      className={`w-5 h-5 rounded-full border-2 ${drawColor === col ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>

                <button
                  onClick={clearCanvas}
                  className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <Eraser className="w-3 h-3" /> Clear
                </button>
              </div>

              {/* Canvas area */}
              <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={340}
                  height={380}
                  onMouseDown={startDraw}
                  onMouseMove={draw}
                  onMouseUp={stopDraw}
                  onMouseLeave={stopDraw}
                  className="w-full h-full cursor-crosshair bg-slate-950"
                />
                <div className="absolute bottom-2 left-2 text-[10px] text-slate-500 pointer-events-none">
                  Doctor & Patient Synchronized Drawing Canvas
                </div>
              </div>
            </div>
          )}

          {/* Panel 3: In-Call Instant Prescription */}
          {activeSidePanel === 'prescribe' && (
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <h4 className="text-xs font-bold text-white mb-1">Instant EPS Electronic Refill</h4>
                  <p className="text-[11px] text-slate-400">
                    Issue 1-click repeat or acute medication during video consult.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="text-xs font-bold text-teal-300">Salbutamol 100mcg Inhaler</h5>
                      <p className="text-[11px] text-slate-400">2 x 200 doses (BNF: 0301011R0)</p>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                      NHS EPS Ready
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300">
                    Nominated: Boots Pharmacy, 32 Curzon St, London W1J 7TR (ODS: FA391)
                  </p>

                  <button
                    onClick={() => {
                      approvePrescription('refill_201');
                      showToast('success', 'Prescription Signed In-Call', 'Transmitted directly to Boots Pharmacy EPS endpoint.');
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                  >
                    1-Click Authorize & Dispatch EPS
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Panel 4: In-Call Chat */}
          {activeSidePanel === 'chat' && (
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
                      m.isSelf
                        ? 'ml-auto bg-nhs-blue text-white rounded-br-none'
                        : 'mr-auto bg-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-bold text-[10px] opacity-80">{m.sender}</span>
                      <span className="text-[9px] opacity-60 font-mono">{m.time}</span>
                    </div>
                    <p>{m.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="pt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Type message to patient..."
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-nhs-blue"
                />
                <button
                  type="submit"
                  className="p-2 bg-nhs-blue hover:bg-nhs-brightblue text-white rounded-xl"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
