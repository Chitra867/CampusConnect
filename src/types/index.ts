export type UserRole = "student" | "organizer";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: string;
  venue: string;
  date: string;
  time: string;
  description: string;
  capacity: number;
  registered: number;
}