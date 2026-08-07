export type UserRole =
  | "student"
  | "organizer";

export type AccountStatus =
  | "active"
  | "inactive"
  | "suspended";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;

  collegeId: string;
  program: string;
  semester: number | null;
  phone: string;

  profileImageUrl: string | null;

  isVerified: boolean;
  status: AccountStatus;
  createdAt: string;
}

export interface RegistrationFormValues {
  fullName: string;
  email: string;
  role: UserRole;
  collegeId: string;
  program: string;
  semester: number | null;
  phone: string;
}

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type EventStatus =
  | "draft"
  | "published"
  | "cancelled"
  | "completed";

export interface CampusEvent {
  id: string;

  title: string;
  category: string;
  venue: string;

  date: string;
  time: string;

  endDate?: string;
  endTime?: string;
  registrationDeadline?: string;

  description: string;

  capacity: number;

  /**
   * Base registration count used by the initial
   * sample events. New local registrations are
   * stored separately in registrationStore.
   */
  registered: number;

  organizerName: string;
  createdBy: string;

  clubId?: string | null;
  posterUrl?: string | null;

  status: EventStatus;

  createdAt: string;
  updatedAt: string;
}

export interface EventFormValues {
  title: string;
  category: string;
  venue: string;

  date: string;
  time: string;

  endDate?: string;
  endTime?: string;
  registrationDeadline?: string;

  description: string;
  capacity: number;
  organizerName: string;

  clubId?: string | null;
  posterUrl?: string | null;

  status?: Extract<
    EventStatus,
    "draft" | "published"
  >;
}

export type RegistrationStatus =
  | "registered"
  | "cancelled";

export type AttendanceStatus =
  | "pending"
  | "attended"
  | "absent";

export interface EventRegistration {
  id: string;

  eventId: string;
  studentId: string;

  studentName: string;
  studentEmail: string;
  collegeId: string;
  program: string;
  semester: number | null;

  status: RegistrationStatus;
  attendanceStatus: AttendanceStatus;

  registeredAt: string;

  checkedInAt: string | null;
  checkedInBy: string | null;
}

/* =========================================================
   STUDENT NAVIGATION
========================================================= */

export type StudentRootStackParamList = {
  MainTabs: undefined;

  EventDetails: {
    eventId: string;
  };

  Notifications: undefined;
};

/* =========================================================
   ORGANIZER NAVIGATION
========================================================= */

export type OrganizerRootStackParamList = {
  OrganizerMainTabs: undefined;

  OrganizerEventDetails: {
    eventId: string;
  };

  OrganizerEventForm:
    | {
        eventId?: string;
      }
    | undefined;

  OrganizerParticipants: {
    eventId: string;
  };
};
