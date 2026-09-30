import { Doctor, Appointment } from '../types';

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees: { email: string; displayName?: string }[];
  conferenceData?: {
    entryPoints: { entryPointType: string; uri: string }[];
  };
  status: 'confirmed' | 'tentative' | 'cancelled';
}

export class GoogleCalendarService {
  /**
   * Simulates fetching live busy/free slots from doctor's connected Google Calendar
   */
  public static async getDoctorBusySlots(doctor: Doctor, targetDate: string): Promise<{ start: string; end: string; summary: string }[]> {
    // Artificial latency for API call
    await new Promise(r => setTimeout(r, 200));

    // Simulated Google Calendar busy blocks (e.g., Clinical Handover, Surgery, Personal)
    return [
      {
        start: `${targetDate}T08:00:00`,
        end: `${targetDate}T08:30:00`,
        summary: 'Practice Team Morning Briefing'
      },
      {
        start: `${targetDate}T13:00:00`,
        end: `${targetDate}T13:45:00`,
        summary: 'Lunch & EPS Prescription Signing'
      },
      {
        start: `${targetDate}T17:30:00`,
        end: `${targetDate}T18:00:00`,
        summary: 'NHS Clinical Governance Audit'
      }
    ];
  }

  /**
   * Checks if requested slot is available across both MedConnect appointments and Google Calendar
   */
  public static isSlotAvailable(
    requestedStartIso: string,
    durationMinutes: number,
    existingAppointments: Appointment[],
    doctorId: string
  ): { available: boolean; conflictReason?: string } {
    const reqStart = new Date(requestedStartIso).getTime();
    const reqEnd = reqStart + durationMinutes * 60 * 1000;

    // Check MedConnect appointments
    const doctorApps = existingAppointments.filter(
      a => a.doctorId === doctorId && a.status !== 'cancelled'
    );

    for (const app of doctorApps) {
      const appStart = new Date(app.dateTime).getTime();
      const appEnd = appStart + app.durationMinutes * 60 * 1000;

      if ((reqStart >= appStart && reqStart < appEnd) || (reqEnd > appStart && reqEnd <= appEnd) || (reqStart <= appStart && reqEnd >= appEnd)) {
        return {
          available: false,
          conflictReason: `Conflict with existing appointment (${app.reasonForVisit})`
        };
      }
    }

    // Check Google Calendar lunch/admin block
    const reqHour = new Date(requestedStartIso).getHours();
    const reqMin = new Date(requestedStartIso).getMinutes();
    if (reqHour === 13 && reqMin < 45) {
      return {
        available: false,
        conflictReason: 'Doctor Google Calendar: Reserved for Practice Prescription Signing & Lunch'
      };
    }

    return { available: true };
  }

  /**
   * Creates 2-way Google Calendar synchronized event
   */
  public static async createCalendarEvent(
    appointment: Appointment,
    doctor: Doctor
  ): Promise<GoogleCalendarEvent> {
    await new Promise(r => setTimeout(r, 250));

    const startDate = new Date(appointment.dateTime);
    const endDate = new Date(startDate.getTime() + appointment.durationMinutes * 60 * 1000);

    return {
      id: `gcal_${Math.random().toString(36).substring(2, 10)}`,
      summary: `[MedConnect] ${appointment.reasonForVisit} - ${appointment.patientName}`,
      description: `MedConnect Automated Booking.\nPatient NHS: ${appointment.patientNhsNumber}\nClinic: ${doctor.clinicType}\nDoctor: ${doctor.name}\nTelehealth Link: https://medconnect.uk/telehealth/${appointment.id}`,
      start: { dateTime: startDate.toISOString(), timeZone: 'Europe/London' },
      end: { dateTime: endDate.toISOString(), timeZone: 'Europe/London' },
      attendees: [
        { email: appointment.patientEmail, displayName: appointment.patientName },
        { email: doctor.googleCalendarEmail || 'doctor@medconnect.nhs.uk', displayName: doctor.name }
      ],
      conferenceData: appointment.mode === 'video_consultation' ? {
        entryPoints: [{ entryPointType: 'video', uri: `https://medconnect.uk/telehealth/${appointment.id}` }]
      } : undefined,
      status: 'confirmed'
    };
  }
}
