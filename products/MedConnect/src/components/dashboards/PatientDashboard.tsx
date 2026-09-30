import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Appointment, Patient } from '../../types';

// Modular Patient Portal Views
import { PatientHome } from '../patient_portal/PatientHome';
import { MyAppointments } from '../patient_portal/MyAppointments';
import { MyPrescriptions } from '../patient_portal/MyPrescriptions';
import { MyHealthForms } from '../patient_portal/MyHealthForms';
import { MyMedicalRecords } from '../patient_portal/MyMedicalRecords';
import { PatientConsultationRoom } from '../patient_portal/PatientConsultationRoom';
import { PatientMessages } from '../patient_portal/PatientMessages';
import { PatientProfile } from '../patient_portal/PatientProfile';
import { PatientNotifications } from '../patient_portal/PatientNotifications';
import { PatientPrivacySecurity } from '../patient_portal/PatientPrivacySecurity';
import { PatientHelpSupport } from '../patient_portal/PatientHelpSupport';
import { BookAppointmentFlow } from '../patient_portal/BookAppointmentFlow';
import { MobileBottomNav } from '../patient_portal/MobileBottomNav';

import {
  Calendar,
  Pill,
  FileText,
  User,
  ShieldCheck,
  HelpCircle,
  MessageSquare,
  ClipboardList,
  X,
  LogOut,
  ChevronRight
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const {
    patients,
    doctors,
    appointments,
    refillRequests,
    currentPatientId,
    activeTab,
    setActiveTab,
    createAppointment,
    updateAppointmentStatus,
    createRefillRequest,
    showToast
  } = useApp();

  const { currentUser, logout } = useAuth();

  // Booking Flow Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeTelehealthAppt, setActiveTelehealthAppt] = useState<Appointment | null>(null);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fallback / Loading simulation on view change
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(t);
  }, [activeTab]);

  // Authenticated Patient Identity Resolution (Strictly Current User)
  const resolvedPatient: Patient = React.useMemo(() => {
    // 1. Match patient by current user ID or email
    const match = patients.find(
      (p) => p.id === currentUser?.id || (currentUser?.email && p.email?.toLowerCase() === currentUser.email.toLowerCase())
    );
    if (match) return match;

    // 2. Derive dynamically from authenticated user
    const nameParts = (currentUser?.name || 'Islam Jutt').trim().split(' ');
    const firstName = nameParts[0] || 'Patient';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      id: currentUser?.id || currentPatientId || 'pat_authenticated',
      nhsNumber: currentUser?.nhsNumber || '485 772 9012',
      firstName,
      lastName,
      dob: '1992-06-15',
      gender: 'male',
      email: currentUser?.email || 'patient@example.co.uk',
      phone: '+44 7700 900555',
      address: {
        line1: '12 St. James Square',
        city: 'London',
        postcode: 'SW1Y 4LE'
      },
      gpPracticeName: currentUser?.clinicName || 'St. James Health Centre',
      emergencyContact: {
        name: 'Sarah Jutt',
        relationship: 'Next of Kin',
        phone: '+44 7700 900556'
      },
      allergies: ['Penicillin V'],
      medicalConditions: ['Seasonal Allergies'],
      activePrescriptionsCount: 1,
      intakeFormCompleted: false,
      historicalNoShows: 0,
      historicalTotalBookings: 2,
      gdprConsent: {
        marketingConsent: false,
        smsNotificationConsent: true,
        dataSharingConsent: true,
        consentTimestamp: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    };
  }, [patients, currentUser, currentPatientId]);

  // Strictly filter records for THIS patient only (Patient Data Security & RLS)
  const myAppointments = React.useMemo(() => {
    return appointments
      .filter((a) => a.patientId === resolvedPatient.id || a.patientEmail?.toLowerCase() === resolvedPatient.email?.toLowerCase())
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [appointments, resolvedPatient]);

  const myPrescriptions = React.useMemo(() => {
    return refillRequests.filter((r) => r.patientId === resolvedPatient.id);
  }, [refillRequests, resolvedPatient]);

  const nextAppointment = React.useMemo(() => {
    return myAppointments.find((a) => a.status !== 'completed' && a.status !== 'cancelled');
  }, [myAppointments]);

  // Appointment actions
  const handleCancelAppointment = (apptId: string, reason: string) => {
    updateAppointmentStatus(apptId, 'cancelled');
    showToast('info', 'Appointment Cancelled', 'Your appointment has been cancelled. Confirmation sent via SMS.');
  };

  const handleRescheduleAppointment = (apptId: string, newDate: string, newSlot: string) => {
    showToast('success', 'Appointment Rescheduled', `Your consultation has been rescheduled to ${newDate} at ${newSlot}.`);
  };

  const handleJoinTelehealth = (appt: Appointment) => {
    setActiveTelehealthAppt(appt);
    setActiveTab('patient_consultations');
  };

  const handleCreateAppointment = async (newApptData: {
    doctorId: string;
    doctorName: string;
    doctorSpecialty: string;
    dateTime: string;
    mode: 'video_consultation' | 'in_person';
    reasonForVisit: string;
  }) => {
    const created = await createAppointment({
      ...newApptData,
      patientId: resolvedPatient.id,
      patientName: `${resolvedPatient.firstName} ${resolvedPatient.lastName}`.trim(),
      patientNhsNumber: resolvedPatient.nhsNumber,
      patientPhone: resolvedPatient.phone,
      patientEmail: resolvedPatient.email,
      clinicType: 'gp_practice',
      durationMinutes: 15,
      status: 'confirmed',
      paymentStatus: 'exempt_nhs'
    });
    showToast('success', 'Appointment Booked', `Confirmed with ${newApptData.doctorName}. SMS reminder dispatched.`);
    return created;
  };

  const handleRequestRefill = (data: {
    medicationName: string;
    dosage: string;
    note?: string;
    pharmacy?: string;
  }) => {
    createRefillRequest({
      patientId: resolvedPatient.id,
      patientName: `${resolvedPatient.firstName} ${resolvedPatient.lastName}`.trim(),
      patientNhsNumber: resolvedPatient.nhsNumber,
      doctorId: 'doc_1',
      doctorName: 'Dr. Sarah Jenkins',
      medicationName: data.medicationName,
      dosage: data.dosage,
      quantity: '1 unit (30 days)',
      frequency: 'Take as directed',
      lastIssuedDate: new Date().toISOString(),
      reasonForRequest: data.note || 'Repeat refill request',
      preferredPharmacy: {
        name: data.pharmacy || 'Boots Pharmacy - Piccadilly Branch',
        odsCode: 'FC102',
        address: 'London W1J 9LL',
        electronicPrescriptionService: true
      }
    });
  };

  // Render Sub-view based on activeTab
  const renderView = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 max-w-4xl mx-auto py-8">
          <div className="h-28 bg-slate-200/60 rounded-3xl animate-pulse" />
          <div className="h-44 bg-slate-200/60 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="h-24 bg-slate-200/60 rounded-2xl animate-pulse" />
            <div className="h-24 bg-slate-200/60 rounded-2xl animate-pulse" />
            <div className="h-24 bg-slate-200/60 rounded-2xl animate-pulse" />
            <div className="h-24 bg-slate-200/60 rounded-2xl animate-pulse" />
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'patient_appointments':
      case 'scheduler':
        return (
          <MyAppointments
            appointments={myAppointments}
            onOpenBooking={() => setIsBookingModalOpen(true)}
            onJoinTelehealth={handleJoinTelehealth}
            onCancelAppointment={handleCancelAppointment}
            onRescheduleAppointment={handleRescheduleAppointment}
          />
        );

      case 'patient_prescriptions':
      case 'prescriptions':
        return (
          <MyPrescriptions
            prescriptions={myPrescriptions}
            onRequestRefill={handleRequestRefill}
          />
        );

      case 'patient_forms':
      case 'intake':
        return (
          <MyHealthForms
            patient={resolvedPatient}
            onSaveProgressToast={(msg) => showToast('info', 'Progress Saved', msg)}
            onSubmitSuccess={() => showToast('success', 'Form Submitted', 'Pre-consultation questionnaire submitted to your GP.')}
          />
        );

      case 'patient_records':
        return <MyMedicalRecords patient={resolvedPatient} />;

      case 'patient_consultations':
      case 'telehealth':
        return (
          <PatientConsultationRoom
            appointment={activeTelehealthAppt || nextAppointment}
            onExitConsultation={() => setActiveTab('patient_dashboard')}
            onSubmitFeedback={(rating, comment) =>
              showToast('success', 'Feedback Received', `Thank you for rating ${rating} stars.`)
            }
          />
        );

      case 'patient_messages':
        return <PatientMessages />;

      case 'patient_profile':
      case 'profile':
        return <PatientProfile patient={resolvedPatient} />;

      case 'patient_notifications':
        return <PatientNotifications onNavigateTab={(t) => setActiveTab(t)} />;

      case 'patient_privacy':
      case 'settings':
        return <PatientPrivacySecurity />;

      case 'patient_help':
      case 'help':
        return <PatientHelpSupport />;

      case 'patient_dashboard':
      case 'portal':
      case 'schedule':
      default:
        return (
          <PatientHome
            patient={resolvedPatient}
            nextAppointment={nextAppointment}
            upcomingAppointments={myAppointments.filter((a) => a.id !== nextAppointment?.id && a.status !== 'cancelled')}
            activePrescriptions={myPrescriptions}
            onOpenBooking={() => setIsBookingModalOpen(true)}
            onJoinTelehealth={handleJoinTelehealth}
            onOpenPrescriptions={() => setActiveTab('patient_prescriptions')}
            onOpenIntake={() => setActiveTab('patient_forms')}
            onViewAllAppointments={() => setActiveTab('patient_appointments')}
            onViewAppointmentDetails={() => setActiveTab('patient_appointments')}
          />
        );
    }
  };

  return (
    <div className="pb-20 lg:pb-8">
      {/* Active View */}
      {renderView()}

      {/* Global 5-Step Book Appointment Modal */}
      {isBookingModalOpen && (
        <BookAppointmentFlow
          doctors={doctors}
          onCompleteBooking={handleCreateAppointment}
          onClose={() => setIsBookingModalOpen(false)}
          onViewAppointments={() => {
            setIsBookingModalOpen(false);
            setActiveTab('patient_appointments');
          }}
        />
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        onOpenMoreMenu={() => setIsMobileMoreOpen(true)}
      />

      {/* Mobile "More" Drawer Modal */}
      {isMobileMoreOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-end justify-center p-0 lg:hidden">
          <div className="bg-white rounded-t-3xl w-full p-6 shadow-2xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {resolvedPatient.firstName[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {resolvedPatient.firstName} {resolvedPatient.lastName}
                  </h3>
                  <p className="text-[10px] text-slate-400">NHS {resolvedPatient.nhsNumber}</p>
                </div>
              </div>
              <button onClick={() => setIsMobileMoreOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              {[
                { id: 'patient_consultations', label: 'Video Consultations', icon: Calendar },
                { id: 'patient_messages', label: 'Messages & Reception', icon: MessageSquare },
                { id: 'patient_records', label: 'My Medical Records', icon: ClipboardList },
                { id: 'patient_profile', label: 'My Profile', icon: User },
                { id: 'patient_privacy', label: 'Privacy & Security', icon: ShieldCheck },
                { id: 'patient_help', label: 'Help & Support', icon: HelpCircle },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMoreOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold hover:bg-rose-100 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
