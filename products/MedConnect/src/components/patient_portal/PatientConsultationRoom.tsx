import React, { useState, useEffect, useRef } from 'react';
import { Appointment } from '../../types';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Share2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  Sparkles,
  ChevronRight,
  Send,
  X,
  Volume2,
  Wifi
} from 'lucide-react';

interface PatientConsultationRoomProps {
  appointment?: Appointment;
  onExitConsultation: () => void;
  onSubmitFeedback?: (rating: number, comment: string) => void;
}

export const PatientConsultationRoom: React.FC<PatientConsultationRoomProps> = ({
  appointment,
  onExitConsultation,
  onSubmitFeedback
}) => {
  // Consultation Stage: 'device_check' | 'waiting_room' | 'active_call' | 'feedback'
  const [stage, setStage] = useState<'device_check' | 'waiting_room' | 'active_call' | 'feedback'>('device_check');

  // Device Controls
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // In-call Chat
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string; isSelf: boolean }>>([
    {
      sender: 'Dr. Sarah Jenkins',
      text: 'Good morning! I have your medical history and recent inhaler notes open in front of me.',
      time: '10:31',
      isSelf: false
    }
  ]);
  const [newMsg, setNewMsg] = useState('');

  // Post-call feedback
  const [rating, setRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Call timer simulation
  const [callDurationSec, setCallDurationSec] = useState<number>(0);

  useEffect(() => {
    let timer: any;
    if (stage === 'active_call') {
      timer = setInterval(() => {
        setCallDurationSec((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stage]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'You',
        text: newMsg.trim(),
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        isSelf: true
      }
    ]);
    setNewMsg('');
  };

  const doctorName = appointment?.doctorName || 'Dr. Sarah Jenkins';
  const doctorSpecialty = appointment?.doctorSpecialty || 'General Practitioner';
  const apptTime = appointment ? new Date(appointment.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '10:30 AM';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── STAGE 1: PRE-CALL DEVICE CHECK ── */}
      {stage === 'device_check' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 max-w-2xl mx-auto">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Telehealth Pre-Call Check
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Video Consultation with {doctorName}
            </h2>
            <p className="text-xs text-slate-500">
              Please check your camera, microphone, and internet connection before entering.
            </p>
          </div>

          {/* Camera Preview Box */}
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-800">
            {!isVideoOff ? (
              <div className="relative w-full h-full flex items-center justify-center bg-slate-800">
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center shadow-lg">
                  You
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Camera Preview Active
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-xs flex flex-col items-center gap-2">
                <VideoOff className="w-8 h-8" />
                <span>Camera is currently turned off</span>
              </div>
            )}

            {/* Quick toggle controls */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={() => setIsMicMuted(!isMicMuted)}
                className={`p-2.5 rounded-xl backdrop-blur-xs text-white transition-all cursor-pointer ${
                  isMicMuted ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'
                }`}
                title={isMicMuted ? 'Unmute' : 'Mute'}
              >
                {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`p-2.5 rounded-xl backdrop-blur-xs text-white transition-all cursor-pointer ${
                  isVideoOff ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'
                }`}
                title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
              >
                {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Device Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">Camera</p>
                <p className="text-[10px] text-slate-500">Ready</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">Microphone</p>
                <p className="text-[10px] text-slate-500">Audio detected</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
              <Wifi className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">Connection</p>
                <p className="text-[10px] text-emerald-600 font-semibold">Strong & stable</p>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onExitConsultation}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
            >
              Back to Dashboard
            </button>

            <button
              onClick={() => setStage('waiting_room')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              Enter Waiting Room <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STAGE 2: WAITING ROOM ── */}
      {stage === 'waiting_room' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-pulse">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Secure Waiting Room
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              You're in the waiting room
            </h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your doctor ({doctorName}) will admit you shortly for your appointment at {apptTime}.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2 text-left">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Doctor</span>
              <strong className="text-slate-900">{doctorName}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Specialty</span>
              <span className="text-slate-700">{doctorSpecialty}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Appointment Time</span>
              <span className="font-semibold text-blue-700">{apptTime} (Confirmed)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Security</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" /> Protected & Private
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Your clinician has been notified that you are waiting. Please keep this screen open.
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onExitConsultation}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
            >
              Leave Waiting Room
            </button>
            <button
              onClick={() => setStage('active_call')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Video className="w-4 h-4" /> Doctor Ready — Start Consultation
            </button>
          </div>
        </div>
      )}

      {/* ── STAGE 3: ACTIVE VIDEO CONSULTATION SCREEN ── */}
      {stage === 'active_call' && (
        <div className="relative bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-[640px]">
          {/* Top Bar: Doctor info, call timer, secure connection */}
          <div className="p-4 bg-gradient-to-b from-slate-950/90 to-transparent flex items-center justify-between z-20 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm">
                SJ
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{doctorName}</h3>
                <p className="text-[11px] text-slate-300">{doctorSpecialty}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-semibold bg-white/10 px-3 py-1 rounded-full text-white">
                {formatTimer(callDurationSec)}
              </span>
              <span className="text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Connected securely
              </span>
            </div>
          </div>

          {/* Main Stage: Doctor video feed simulation & Patient PIP */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            {/* Doctor Video Feed */}
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950 relative">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"
                alt="Doctor Video"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-xs px-3 py-1 rounded-xl text-white text-xs font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                {doctorName}
              </div>
            </div>

            {/* Patient PIP Self-View (Bottom Right) */}
            <div className="absolute bottom-4 right-4 w-44 sm:w-52 aspect-video bg-slate-900 border-2 border-white/20 rounded-2xl overflow-hidden shadow-2xl z-20">
              {!isVideoOff ? (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
                    You
                  </div>
                  <span className="absolute bottom-1.5 left-2 text-[10px] text-white/90 bg-slate-950/60 px-1.5 py-0.5 rounded">
                    You {isMicMuted && '(Muted)'}
                  </span>
                </div>
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500 text-[10px]">
                  Camera off
                </div>
              )}
            </div>

            {/* Slide-out Text Chat Drawer */}
            {isChatOpen && (
              <div className="absolute top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-30 flex flex-col border-l border-slate-200">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Consultation Chat</h4>
                  <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 p-3 space-y-3 overflow-y-auto text-xs">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-400 mb-0.5">{msg.sender} · {msg.time}</span>
                      <div
                        className={`p-2.5 rounded-2xl max-w-[85%] ${
                          msg.isSelf ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    placeholder="Type a message to your doctor..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="p-4 bg-slate-950/95 border-t border-slate-800/80 flex items-center justify-center gap-3 z-20">
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`p-3 rounded-2xl text-white transition-all cursor-pointer ${
                isMicMuted ? 'bg-red-500' : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-2xl text-white transition-all cursor-pointer ${
                isVideoOff ? 'bg-red-500' : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-3 rounded-2xl text-white transition-all cursor-pointer ${
                isChatOpen ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title="Open Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button
              onClick={() => setStage('feedback')}
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg shadow-red-600/30"
            >
              <PhoneOff className="w-4 h-4" /> End Call
            </button>
          </div>
        </div>
      )}

      {/* ── STAGE 4: POST-CALL FEEDBACK MODAL ── */}
      {stage === 'feedback' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-lg mx-auto text-center space-y-5">
          {!feedbackSubmitted ? (
            <>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Consultation Completed</h3>
                <p className="text-xs text-slate-500 mt-1">
                  How was your appointment with {doctorName}?
                </p>
              </div>

              {/* 5-Star Interactive Rating */}
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${s <= rating ? 'fill-amber-400' : 'text-slate-300'}`}
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Tell us about your experience (optional)..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
              />

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onExitConsultation}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
                >
                  Skip Feedback
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onSubmitFeedback) onSubmitFeedback(rating, feedbackComment);
                    setFeedbackSubmitted(true);
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Submit Feedback
                </button>
              </div>
            </>
          ) : (
            <div className="py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Thank you for your feedback!</h4>
              <p className="text-xs text-slate-500">
                Your feedback helps St. James Health Centre maintain the highest standard of patient care.
              </p>
              <button
                onClick={onExitConsultation}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
