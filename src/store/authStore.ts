import { create } from "zustand";

import { AuthUser, UserRole } from "../types";

interface AuthState {
  user: AuthUser | null;

  login: (
    email: string,
    role: UserRole
  ) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (email, role) => {
    const user: AuthUser = {
      id: Date.now().toString(),
      email,
      role,
      fullName:
        role === "organizer"
          ? "Campus Organizer"
          : "Campus Student",
    };

    set({ user });
  },

  logout: () => {
    set({ user: null });
  },
}));