import React from 'react';
import { useApp } from '../../context/AppContext';
import { AppointmentScheduler } from '../scheduler/AppointmentScheduler';
import { StaffRotaTracker } from '../rota/StaffRotaTracker';
import { AiTriageAssistant } from '../triage/AiTriageAssistant';
import { GmbBookingWidget } from '../gmb/GmbBookingWidget';
import { HelpSupportView } from '../help/HelpSupportView';
import { AccountSettingsView } from '../settings/AccountSettingsView';

// Dedicated Front Desk components
import { FrontDeskHome } from '../reception/FrontDeskHome';
import { FrontDeskAppointmentsView } from '../reception/FrontDeskAppointmentsView';
import { PatientCheckInView } from '../reception/PatientCheckInView';
import { PatientDirectoryView } from '../reception/PatientDirectoryView';
import { FrontDeskWaitingRoom } from '../reception/FrontDeskWaitingRoom';
import { FrontDeskMessaging } from '../reception/FrontDeskMessaging';
import { DoctorAvailabilityView } from '../reception/DoctorAvailabilityView';
import { NoShowInsightsView } from '../reception/NoShowInsightsView';
import { AppointmentAnalyticsView } from '../reception/AppointmentAnalyticsView';
import { ReceptionistProfileView } from '../reception/ReceptionistProfileView';

export const ReceptionistDashboard: React.FC = () => {
  const { activeTab } = useApp();

  // Route Front Desk Views
  switch (activeTab) {
    case 'reception_dashboard':
      return <FrontDeskHome />;

    case 'reception_today':
      return <FrontDeskAppointmentsView />;

    case 'reception_checkin':
      return <PatientCheckInView />;

    case 'reception_patients':
      return <PatientDirectoryView />;

    case 'reception_scheduler':
    case 'scheduler':
      return <AppointmentScheduler />;

    case 'reception_waiting':
      return <FrontDeskWaitingRoom />;

    case 'reception_messaging':
    case 'reception_reminders':
    case 'twilio':
      return <FrontDeskMessaging />;

    case 'reception_availability':
    case 'availability':
      return <DoctorAvailabilityView />;

    case 'reception_rota':
    case 'rota':
      return <StaffRotaTracker />;

    case 'reception_online_booking':
    case 'gmb_saas':
      return <GmbBookingWidget />;

    case 'reception_analytics':
      return <AppointmentAnalyticsView />;

    case 'reception_noshow':
      return <NoShowInsightsView />;

    case 'reception_profile':
    case 'profile':
      return <ReceptionistProfileView />;

    case 'reception_help':
    case 'help':
      return <HelpSupportView />;

    case 'settings':
      return <AccountSettingsView />;

    case 'triage':
      return <AiTriageAssistant />;

    default:
      return <FrontDeskHome />;
  }
};
