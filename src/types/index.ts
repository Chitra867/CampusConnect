export type UserRole = "student" | "organizer";

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
}