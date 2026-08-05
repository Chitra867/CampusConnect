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

  /*
   * These fields are preserved so your current
   * screens continue working.
   */
  date: string;
  time: string;

  /*
   * Optional fields prepare the project for
   * date/time pickers and Supabase.
   */
  endDate?: string;
  endTime?: string;
  registrationDeadline?: string;

  description: string;

  capacity: number;

  /*
   * Existing sample/base registration count.
   * Real local registrations are stored separately.
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

  status?: "draft" | "published";
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

export type StudentRootStackParamList = {
  MainTabs: undefined;

  EventDetails: {
    eventId: string;
  };
};

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