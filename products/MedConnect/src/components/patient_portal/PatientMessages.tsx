import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  User,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Stethoscope
} from 'lucide-react';

export const PatientMessages: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState<'reception' | 'doctor' | 'support'>('doctor');
  const [inputText, setInputText] = useState('');

  const [channelMessages, setChannelMessages] = useState<Record<string, Array<{ sender: string; text: string; time: string; isSelf: boolean }>>>({
    doctor: [
      {
        sender: 'Dr. Sarah Jenkins',
        text: 'Hello Islam, thank you for submitting your asthma review. Your medication refill has been authorized and dispatched to Boots Pharmacy.',
        time: 'Yesterday 14:15',
        isSelf: false
      },
      {
        sender: 'You',
        text: 'Thank you Dr. Jenkins, I received the SMS confirmation from the pharmacy.',
        time: 'Yesterday 14:30',
        isSelf: true
      }
    ],
    reception: [
      {
        sender: 'Practice Reception (Hannah Collins)',
        text: 'Welcome to St. James Health Centre online portal. If you need to rearrange your appointment time or update your address, please reply here.',
        time: 'Mon 09:00',
        isSelf: false
      }
    ],
    support: [
      {
        sender: 'ClinicFlow Technical Support',
        text: 'Need help accessing your video waiting room or camera permissions? Our technical support desk is available Mon-Fri 08:00 - 18:00.',
        time: '23 Sep 10:00',
        isSelf: false
      }
    ]
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setChannelMessages((prev) => ({
      ...prev,
      [activeChannel]: [
        ...(prev[activeChannel] || []),
        {
          sender: 'You',
          text: inputText.trim(),
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          isSelf: true
        }
      ]
    }));
    setInputText('');
  };

  const channels = [
    {
      id: 'doctor',
      name: 'Dr. Sarah Jenkins',
      sub: 'GP Partner & Clinical Lead',
      icon: <Stethoscope className="w-4 h-4 text-blue-600" />,
      online: true
    },
    {
      id: 'reception',
      name: 'Clinic Front Desk',
      sub: 'Appointments & Care Coordination',
      icon: <Building2 className="w-4 h-4 text-emerald-600" />,
      online: true
    },
    {
      id: 'support',
      name: 'Portal Technical Support',
      sub: 'Account & Video Assistance',
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
      online: false
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Secure Messages
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Communicate directly with your GP clinic care team and reception desk
        </p>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[520px]">
        {/* Channel Selection Sidebar */}
        <div className="border-r border-slate-100 p-4 space-y-2 bg-slate-50/50">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
            Conversations
          </p>
          {channels.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChannel(c.id as any)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all cursor-pointer ${
                activeChannel === c.id
                  ? 'bg-white shadow-xs border border-slate-200/90 text-slate-900'
                  : 'hover:bg-slate-100/70 text-slate-600'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center shrink-0">
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold truncate">{c.name}</p>
                  {c.online && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                </div>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{c.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="md:col-span-2 flex flex-col justify-between h-full bg-white">
          {/* Thread Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                {channels.find((c) => c.id === activeChannel)?.icon}
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">
                  {channels.find((c) => c.id === activeChannel)?.name}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {channels.find((c) => c.id === activeChannel)?.sub}
                </p>
              </div>
            </div>

            <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Encrypted Care Thread
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[360px]">
            {channelMessages[activeChannel]?.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-400 mb-1 px-1">{msg.sender} · {msg.time}</span>
                <div
                  className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                    msg.isSelf
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Send Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${channels.find((c) => c.id === activeChannel)?.name}...`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer flex items-center gap-1.5 text-xs font-bold transition-all shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
