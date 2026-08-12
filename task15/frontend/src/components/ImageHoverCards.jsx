import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Server, 
  Database, 
  Lock, 
  Cpu, 
  Globe, 
  X, 
  Terminal, 
  CheckCircle2, 
  Wifi, 
  Play, 
  Pause, 
  RefreshCw,
  HardDrive,
  BarChart2
} from 'lucide-react';

export const ImageHoverCards = ({ onShowToast }) => {
  const [activeStreamModal, setActiveStreamModal] = useState(null);
  const [activeDetailsModal, setActiveDetailsModal] = useState(null);

  // Simulated live log stream states for stream modal
  const [streamLogs, setStreamLogs] = useState([]);
  const [isStreaming, setIsStreaming] = useState(true);

  const cards = [
    {
      id: 'auth_stream',
      title: 'Auth Log Stream',
      category: 'Security Monitoring',
      img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      icon: Server,
      accent: 'border-[#22D3EE]',
      badge: 'LIVE MONITORING',
      details: {
        ip: '10.240.0.12',
        region: 'US-East (N. Virginia)',
        uptime: '99.99%',
        memory: '14.2 GB / 32 GB',
        throughput: '1,420 rps',
        security: '256-Bit TLS Encrypted',
        status: 'Healthy'
      }
    },
    {
      id: 'db_sync',
      title: 'Database Sync Engine',
      category: 'Supabase Cluster',
      img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      icon: Database,
      accent: 'border-[#FF7A18]',
      badge: 'CLUSTER SYNC',
      details: {
        ip: '10.240.1.84',
        region: 'EU-Central (Frankfurt)',
        uptime: '100.00%',
        memory: '28.6 GB / 64 GB',
        throughput: '8,900 ops/sec',
        security: 'Supabase Service Role Mode',
        status: 'Active Syncing'
      }
    },
    {
      id: 'rbac_logs',
      title: 'Real-Time RBAC Logs',
      category: 'Permission Auditing',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      icon: Activity,
      accent: 'border-purple-400',
      badge: 'AUDIT ENFORCED',
      details: {
        ip: '10.240.4.19',
        region: 'AP-Northeast (Tokyo)',
        uptime: '99.98%',
        memory: '8.1 GB / 16 GB',
        throughput: '340 audits/sec',
        security: 'Strict Role Enforced',
        status: 'Auditing'
      }
    },
    {
      id: 'service_role',
      title: 'Service Role Gateway',
      category: 'Server Auth Layer',
      img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      icon: Lock,
      accent: 'border-[#22C55E]',
      badge: 'EXPRESS NODE',
      details: {
        ip: '127.0.0.1 (Express Port 5000)',
        region: 'Local Node Gateway',
        uptime: '100.00%',
        memory: '1.2 GB / 8 GB',
        throughput: '120 req/sec',
        security: 'Server .env Protected',
        status: 'Connected'
      }
    },
    {
      id: 'latency_mon',
      title: 'API Latency Monitor',
      category: 'Telemetry Engine',
      img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      icon: Cpu,
      accent: 'border-[#2563EB]',
      badge: '14ms LATENCY',
      details: {
        ip: '10.240.8.99',
        region: 'Global Edge Relay',
        uptime: '99.99%',
        memory: '4.0 GB / 8 GB',
        throughput: '12,400 ping/sec',
        security: 'Edge Firewall Active',
        status: 'Optimal'
      }
    },
    {
      id: 'geo_cdn',
      title: 'Global Identity CDN',
      category: 'Geo Routing',
      img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      icon: Globe,
      accent: 'border-[#FFB86B]',
      badge: '5 REGIONS',
      details: {
        ip: '10.240.12.0/24',
        region: 'Worldwide CDN Mesh',
        uptime: '99.99%',
        memory: '64 GB / 128 GB',
        throughput: '45.2 Gbps',
        security: 'DDoS Anycast Shield',
        status: 'Broadcasting'
      }
    }
  ];

  // Dynamic log generator for Stream Modal
  useEffect(() => {
    let interval;
    if (activeStreamModal && isStreaming) {
      interval = setInterval(() => {
        const sampleLogs = [
          `[${new Date().toLocaleTimeString()}] GET /admin/users 200 OK - 14ms (Supabase Admin SDK)`,
          `[${new Date().toLocaleTimeString()}] AUTH_TOKEN_VALIDATED user_id=usr_${Math.random().toString(36).substring(2, 7)}`,
          `[${new Date().toLocaleTimeString()}] SERVICE_ROLE_KEY check=VERIFIED server_env=EXPRESS`,
          `[${new Date().toLocaleTimeString()}] RLS_BYPASS executed via Server Admin Client`,
          `[${new Date().toLocaleTimeString()}] CLUSTER_SYNC ping=2ms node=${activeStreamModal.id}`
        ];
        const nextLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
        setStreamLogs(prev => [nextLog, ...prev.slice(0, 15)]);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeStreamModal, isStreaming]);

  const handleOpenStream = (item) => {
    setActiveStreamModal(item);
    setStreamLogs([
      `[${new Date().toLocaleTimeString()}] INITIALIZING STREAM: ${item.title}`,
      `[${new Date().toLocaleTimeString()}] CONNECTED TO NODE: ${item.details.ip} (${item.details.region})`,
      `[${new Date().toLocaleTimeString()}] SECURITY CHECK: ${item.details.security} - OK`
    ]);
    setIsStreaming(true);
    onShowToast && onShowToast({ title: 'Stream Connected', message: `Streaming live telemetry for ${item.title}`, type: 'info' });
  };

  const handleOpenDetails = (item) => {
    setActiveDetailsModal(item);
    onShowToast && onShowToast({ title: 'Node Details Loaded', message: `Inspecting hardware specs for ${item.title}`, type: 'success' });
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#22D3EE]" /> Platform Activity Grid
          </h2>
          <p className="text-xs text-[#9FB0C2] mt-0.5">Real-time operational streams and system state visualizers</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#0B253A] text-[#22D3EE] font-mono text-xs border border-[#22D3EE]/30 self-start sm:self-auto">
          6 Active Infrastructure Nodes
        </span>
      </div>

      {/* Grid of Image Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              className={`group relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:${item.accent} transition-all duration-300 shadow-2xl min-h-[270px] flex flex-col justify-between p-5 hover:-translate-y-1`}
            >
              {/* High-Res Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ backgroundImage: `url('${item.img}')` }}
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B] via-[#071A2B]/80 to-black/40 transition-opacity duration-300" />

              {/* Glowing Border Frame */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#22D3EE]/50 rounded-3xl transition-colors pointer-events-none" />

              {/* Top Header Badge & Icon */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#071A2B]/90 text-[#22D3EE] text-[10px] font-mono font-bold border border-[#22D3EE]/40 shadow-md">
                  {item.badge}
                </span>
                <div className="p-2.5 rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/15 shadow-md">
                  <Icon className="w-4 h-4 text-[#22D3EE]" />
                </div>
              </div>

              {/* Bottom Content & ALWAYS VISIBLE Responsive Action Buttons */}
              <div className="relative z-10 space-y-3 pt-8">
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-[#FFB86B] tracking-wider">{item.category}</span>
                  <h3 className="text-base font-extrabold text-white group-hover:text-[#22D3EE] transition-colors leading-tight mt-0.5">
                    {item.title}
                  </h3>
                </div>

                {/* ALWAYS VISIBLE & RESPONSIVE ACTION BUTTONS */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/15">
                  <button 
                    type="button"
                    onClick={() => handleOpenStream(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#22D3EE] text-white text-xs font-bold shadow-md shadow-[#2563EB]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Stream</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleOpenDetails(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FFB86B] text-white text-xs font-bold shadow-md shadow-[#FF7A18]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* STREAM INSPECTION MODAL */}
      {activeStreamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative glass-panel rounded-3xl p-6 border border-[#22D3EE]/50 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB]/20 text-[#22D3EE] flex items-center justify-center border border-[#22D3EE]/30">
                  <Terminal className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                    {activeStreamModal.title} - Live Stream
                  </h3>
                  <p className="text-xs text-[#9FB0C2] font-mono">Node IP: {activeStreamModal.details.ip}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsStreaming(!isStreaming)}
                  className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors flex items-center gap-1 text-xs font-semibold"
                >
                  {isStreaming ? <Pause className="w-4 h-4 text-[#FF7A18]" /> : <Play className="w-4 h-4 text-[#22C55E]" />}
                  <span className="hidden sm:inline">{isStreaming ? 'Pause Stream' : 'Resume'}</span>
                </button>
                <button
                  onClick={() => setActiveStreamModal(null)}
                  className="p-2 rounded-xl bg-white/10 text-[#9FB0C2] hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stream Telemetry Cards */}
            <div className="grid grid-cols-3 gap-3 mb-4 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#9FB0C2]">THROUGHPUT</span>
                <p className="font-bold text-[#22D3EE]">{activeStreamModal.details.throughput}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#9FB0C2]">UPTIME</span>
                <p className="font-bold text-[#22C55E]">{activeStreamModal.details.uptime}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#9FB0C2]">STATUS</span>
                <p className="font-bold text-[#FFB86B]">{activeStreamModal.details.status}</p>
              </div>
            </div>

            {/* Terminal Window Stream Output */}
            <div className="bg-[#071A2B] p-4 rounded-2xl border border-[#22D3EE]/30 font-mono text-xs text-[#22D3EE] overflow-y-auto max-h-64 flex-1 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[10px] text-[#9FB0C2]">
                <span>STREAM OUTPUT PACKETS</span>
                <span className="flex items-center gap-1 text-[#22C55E]">
                  <Wifi className="w-3 h-3 animate-ping" /> CONNECTED
                </span>
              </div>
              {streamLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed hover:bg-white/5 p-1 rounded transition-colors">
                  {log}
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#9FB0C2] font-mono">Real-time Node Telemetry Active</span>
              <button
                onClick={() => setActiveStreamModal(null)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#0B253A] font-bold text-xs text-white border border-[#22D3EE]/40"
              >
                Close Stream
              </button>
            </div>

          </div>
        </div>
      )}

      {/* NODE DETAILS MODAL */}
      {activeDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative glass-panel rounded-3xl p-6 border border-[#FF7A18]/50 shadow-2xl max-w-lg w-full">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF7A18]/20 text-[#FF7A18] flex items-center justify-center border border-[#FF7A18]/40">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    {activeDetailsModal.title} Specs
                  </h3>
                  <p className="text-xs text-[#FFB86B] font-mono">{activeDetailsModal.category}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveDetailsModal(null)}
                className="p-2 rounded-xl bg-white/10 text-[#9FB0C2] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Spec Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-6">
              <div className="p-3.5 rounded-2xl glass-card space-y-1">
                <span className="text-[#9FB0C2] text-[10px] uppercase">IP Address</span>
                <p className="font-bold text-white text-xs">{activeDetailsModal.details.ip}</p>
              </div>

              <div className="p-3.5 rounded-2xl glass-card space-y-1">
                <span className="text-[#9FB0C2] text-[10px] uppercase">Data Region</span>
                <p className="font-bold text-[#22D3EE] text-xs">{activeDetailsModal.details.region}</p>
              </div>

              <div className="p-3.5 rounded-2xl glass-card space-y-1">
                <span className="text-[#9FB0C2] text-[10px] uppercase">Memory Allocation</span>
                <p className="font-bold text-white text-xs">{activeDetailsModal.details.memory}</p>
              </div>

              <div className="p-3.5 rounded-2xl glass-card space-y-1">
                <span className="text-[#9FB0C2] text-[10px] uppercase">Cluster Uptime</span>
                <p className="font-bold text-[#22C55E] text-xs">{activeDetailsModal.details.uptime}</p>
              </div>

              <div className="p-3.5 rounded-2xl glass-card space-y-1 col-span-2">
                <span className="text-[#9FB0C2] text-[10px] uppercase">Security Policy</span>
                <p className="font-bold text-[#FFB86B] text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> {activeDetailsModal.details.security}
                </p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActiveDetailsModal(null)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A18] to-[#FFB86B] font-bold text-xs text-white shadow-lg shadow-[#FF7A18]/30 hover:scale-105 transition-transform"
              >
                Done Inspecting
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
