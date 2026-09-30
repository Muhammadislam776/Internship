import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PatientPortal } from '../patient_portal/PatientPortal';
import { DigitalIntakeForm } from '../intake/DigitalIntakeForm';
import { PrescriptionRefills } from '../prescriptions/PrescriptionRefills';
import { AiTriageAssistant } from '../triage/AiTriageAssistant';
import { AppointmentScheduler } from '../scheduler/AppointmentScheduler';
import { VideoConsultationRoom } from '../telemedicine/VideoConsultationRoom';
import { HelpSupportView } from '../help/HelpSupportView';
import { UserProfileView } from '../profile/UserProfileView';
import { ClinicianAvailabilityView } from '../availability/ClinicianAvailabilityView';
import { AccountSettingsView } from '../settings/AccountSettingsView';
import {
  Calendar, FileText, Pill, Video, User, Heart, Activity,
  Clock, CheckCircle2, AlertCircle, ChevronRight, Phone,
  MapPin, Plus, ArrowRight, Star, Shield, Bell, Stethoscope,
  TrendingUp, MessageSquare, Download, RefreshCw
} from 'lucide-react';

const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

export const PatientDashboard: React.FC = () => {
  const { patients, appointments, refillRequests, currentPatientId, activeTab, setActiveTab } = useApp();
  const { currentUser } = useAuth();

  const patient = patients.find((p) => p.id === currentPatientId) || patients[0];
  const myAppts = appointments
    .filter((a) => a.patientId === patient.id)
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  const myRx = refillRequests.filter((r) => r.patientId === patient.id);
  const pendingRx = myRx.filter((r) => r.status === 'pending_review').length;
  const nextAppt = myAppts.find((a) => a.status !== 'completed' && a.status !== 'cancelled');

  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const age = new Date().getFullYear() - parseInt(patient.dob.split('-')[0]);

  // Route sub-views
  if (activeTab === 'scheduler')     return <AppointmentScheduler />;
  if (activeTab === 'intake')        return <DigitalIntakeForm patientId={patient.id} />;
  if (activeTab === 'prescriptions') return <PrescriptionRefills />;
  if (activeTab === 'telehealth')    return <VideoConsultationRoom />;
  if (activeTab === 'triage')        return <AiTriageAssistant />;
  if (activeTab === 'portal')        return <PatientPortal />;
  if (activeTab === 'help')          return <HelpSupportView />;
  if (activeTab === 'profile')       return <UserProfileView />;
  if (activeTab === 'availability')  return <ClinicianAvailabilityView />;
  if (activeTab === 'settings')      return <AccountSettingsView />;

  // Health stats (mock enriched data)
  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', trend: 'stable' },
    { label: 'Weight', value: '74', unit: 'kg', status: 'normal', trend: 'down' },
    { label: 'BMI', value: '23.4', unit: '', status: 'normal', trend: 'stable' },
    { label: 'Cholesterol', value: '4.8', unit: 'mmol/L', status: 'normal', trend: 'up' },
  ];

  const statusColor: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-slate-100 text-slate-600',
    cancelled: 'bg-rose-100 text-rose-700',
    in_progress: 'bg-indigo-100 text-indigo-700',
    no_show: 'bg-red-100 text-red-700',
  };
  const statusLabel: Record<string, string> = {
    scheduled: 'Scheduled', confirmed: 'Confirmed', completed: 'Completed',
    cancelled: 'Cancelled', in_progress: 'In Progress', no_show: 'No-Show',
  };

  return (
    <div className="space-y-5">
      {/* ── Welcome ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
            {patient.firstName[0]}{patient.lastName[0]}
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              {getGreeting()}, {currentUser?.name || `${patient.firstName} ${patient.lastName}`}
            </h1>
            <p className="text-xs text-slate-500">
              NHS {patient.nhsNumber} · {patient.gpPracticeName || 'St. James Health Centre'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <Shield className="w-3.5 h-3.5" /> Identity Verified
          </span>
          {!patient.intakeFormCompleted && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
              <AlertCircle className="w-3.5 h-3.5" /> Form Required
            </span>
          )}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-blue-50"><Calendar className="w-4 h-4 text-blue-600" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next</span>
          </div>
          {nextAppt ? (
            <>
              <div className="text-sm font-bold text-slate-900">{formatDate(nextAppt.dateTime)}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">{formatTime(nextAppt.dateTime)} · {nextAppt.doctorName?.split(' ').slice(0,3).join(' ')}</p>
            </>
          ) : (
            <div className="text-sm text-slate-400 font-medium">No upcoming</div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-amber-50"><Pill className="w-4 h-4 text-amber-600" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rx</span>
          </div>
          <div className="text-2xl font-black text-slate-900">{patient.activePrescriptionsCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">{pendingRx > 0 ? `${pendingRx} pending refill` : 'Active prescriptions'}</p>
        </div>

        <div className={`bg-white border rounded-2xl p-4 shadow-sm ${patient.intakeFormCompleted ? 'border-slate-200' : 'border-amber-300'}`}>
          <div className="flex items-start justify-between mb-2">
            <div className={`p-2 rounded-xl ${patient.intakeFormCompleted ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              <FileText className={`w-4 h-4 ${patient.intakeFormCompleted ? 'text-emerald-600' : 'text-amber-600'}`} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Form</span>
          </div>
          <div className={`text-sm font-bold ${patient.intakeFormCompleted ? 'text-emerald-700' : 'text-amber-700'}`}>
            {patient.intakeFormCompleted ? '✓ Completed' : '⚠ Required'}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Health questionnaire</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start justify-between mb-2">
            <div className="p-2 rounded-xl bg-rose-50"><Heart className="w-4 h-4 text-rose-500" /></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Health</span>
          </div>
          <div className="text-sm font-bold text-slate-900">{patient.medicalConditions.length} Conditions</div>
          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{patient.medicalConditions[0] || 'No conditions'}</p>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setActiveTab('scheduler')} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all">
          <Plus className="w-3.5 h-3.5" /> Book Appointment
        </button>
        <button onClick={() => setActiveTab('prescriptions')} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 shadow-sm transition-all">
          <RefreshCw className="w-3.5 h-3.5 text-amber-500" /> Request Repeat Rx
        </button>
        <button onClick={() => setActiveTab('telehealth')} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 shadow-sm transition-all">
          <Video className="w-3.5 h-3.5 text-indigo-500" /> Video Waiting Room
        </button>
        {!patient.intakeFormCompleted && (
          <button onClick={() => setActiveTab('intake')} className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all">
            <FileText className="w-3.5 h-3.5" /> Complete Health Form
          </button>
        )}
        <button onClick={() => setActiveTab('triage')} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 shadow-sm transition-all">
          <Stethoscope className="w-3.5 h-3.5 text-blue-500" /> Symptom Checker
        </button>
      </div>

      {/* ── Two Column ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* LEFT */}
        <div className="xl:col-span-2 space-y-5">
          {/* Upcoming Appointments */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">My Appointments</h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">{myAppts.length}</span>
              </div>
              <button onClick={() => setActiveTab('scheduler')} className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                Book New <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myAppts.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-400">No appointments scheduled</p>
                <button onClick={() => setActiveTab('scheduler')} className="mt-3 text-xs text-blue-600 font-semibold hover:underline">Book your first appointment →</button>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {myAppts.slice(0, 6).map((appt) => (
                  <div key={appt.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                    <div className="w-12 text-center shrink-0">
                      <p className="text-xs font-bold text-slate-700">{formatTime(appt.dateTime)}</p>
                      <p className="text-[10px] text-slate-400">{new Date(appt.dateTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                    </div>
                    <div className={`p-2 rounded-xl shrink-0 ${appt.mode === 'video_consultation' ? 'bg-indigo-50' : 'bg-blue-50'}`}>
                      {appt.mode === 'video_consultation' ? <Video className="w-3.5 h-3.5 text-indigo-600" /> : <Stethoscope className="w-3.5 h-3.5 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{appt.reasonForVisit}</p>
                      <p className="text-[11px] text-slate-500">{appt.doctorName} · {appt.mode === 'video_consultation' ? 'Video Call' : appt.mode === 'phone' ? 'Phone' : 'In Person'}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${statusColor[appt.status] || 'bg-slate-100 text-slate-600'}`}>
                      {statusLabel[appt.status] || appt.status}
                    </span>
                    {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                      <button
                        onClick={() => appt.mode === 'video_consultation' ? setActiveTab('telehealth') : undefined}
                        className="shrink-0 text-[10px] px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors"
                      >
                        {appt.mode === 'video_consultation' ? 'Join' : 'View'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Health Metrics */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
              <Activity className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm font-bold text-slate-900">Health Metrics</h2>
              <span className="ml-auto text-[10px] text-slate-400">Last updated: 12 Jun 2026</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100">
              {healthMetrics.map((m) => (
                <div key={m.label} className="bg-white p-4">
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{m.label}</p>
                  <p className="text-lg font-black text-slate-900 mt-1">{m.value} <span className="text-xs font-normal text-slate-400">{m.unit}</span></p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${m.status === 'normal' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {m.status === 'normal' ? '✓ Normal' : '⚠ Review'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Conditions & Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">Medical Conditions</h3>
              </div>
              {patient.medicalConditions.length === 0 ? (
                <p className="text-xs text-slate-400">No conditions recorded</p>
              ) : (
                <div className="space-y-2">
                  {patient.medicalConditions.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-rose-50 border border-rose-100">
                      <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                      <span className="text-xs font-semibold text-rose-800">{c}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-bold text-slate-900">Allergies & Alerts</h3>
              </div>
              {patient.allergies.length === 0 || patient.allergies[0] === 'None known' ? (
                <p className="text-xs text-slate-400">No known allergies</p>
              ) : (
                <div className="space-y-2">
                  {patient.allergies.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-orange-50 border border-orange-100">
                      <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
                      <span className="text-xs font-semibold text-orange-800">{a}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5">
          {/* Patient Profile Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 text-white text-sm font-bold flex items-center justify-center">
                  {patient.firstName[0]}{patient.lastName[0]}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{patient.firstName} {patient.lastName}</h3>
                  <p className="text-blue-100 text-xs">{age} yrs · {patient.gender}</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[
                { icon: <Shield className="w-3.5 h-3.5 text-blue-500" />, label: 'NHS Number', value: patient.nhsNumber },
                { icon: <MapPin className="w-3.5 h-3.5 text-slate-400" />, label: 'GP Practice', value: patient.gpPracticeName || 'St. James Health Centre' },
                { icon: <Phone className="w-3.5 h-3.5 text-slate-400" />, label: 'Phone', value: patient.phone },
                { icon: <Calendar className="w-3.5 h-3.5 text-slate-400" />, label: 'Date of Birth', value: patient.dob },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  {item.icon}
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 font-medium">{item.label}</p>
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prescriptions */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Prescriptions</h3>
              </div>
              <button onClick={() => setActiveTab('prescriptions')} className="text-xs text-blue-600 font-semibold">Manage →</button>
            </div>
            {myRx.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-xs text-slate-400">No prescriptions on file</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {myRx.slice(0, 3).map((rx) => (
                  <div key={rx.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="p-1.5 rounded-lg bg-amber-50"><Pill className="w-3 h-3 text-amber-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{rx.medicationName}</p>
                      <p className="text-[10px] text-slate-500">{rx.dosage}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rx.status === 'approved' ? 'bg-emerald-100 text-emerald-700'
                      : rx.status === 'rejected' ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                    }`}>
                      {rx.status === 'pending_review' ? 'Pending' : rx.status === 'approved' ? 'Approved' : 'Declined'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Phone className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900">Emergency Contact</h3>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-900">{patient.emergencyContact.name}</p>
              <p className="text-[11px] text-slate-500">{patient.emergencyContact.relationship}</p>
              <p className="text-[11px] text-slate-500 font-mono">{patient.emergencyContact.phone}</p>
            </div>
          </div>

          {/* GDPR Consents */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900">Privacy Preferences</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'SMS Reminders', value: patient.gdprConsent.smsNotificationConsent },
                { label: 'Data Sharing', value: patient.gdprConsent.dataSharingConsent },
                { label: 'Marketing', value: patient.gdprConsent.marketingConsent },
              ].map((c) => (
                <div key={c.label} className="flex items-center justify-between">
                  <span className="text-xs text-slate-600">{c.label}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.value ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {c.value ? 'Enabled' : 'Opted out'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
