import AsyncStorage from "@react-native-async-storage/async-storage";

import { create } from "zustand";

import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import {
  AuthUser,
  RegistrationFormValues,
  UserRole,
} from "../types";

interface AuthState {
  user: AuthUser | null;
  hasHydrated: boolean;

  login: (
    email: string,
    role: UserRole
  ) => void;

  register: (values: RegistrationFormValues) => void;

  updateProfile: (
    values: Partial<
      Pick<
        AuthUser,
        | "fullName"
        | "collegeId"
        | "program"
        | "semester"
        | "phone"
        | "profileImageUrl"
      >
    >
  ) => void;

  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

function createStableUserId(
  email: string,
  role: UserRole
): string {
  const normalizedEmail = email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-");

  return `${role}-${normalizedEmail}`;
}

function createLocalUser(
  email: string,
  role: UserRole
): AuthUser {
  const cleanEmail =
    email.trim().toLowerCase();

  const now = new Date().toISOString();

  if (role === "organizer") {
    return {
      id: "organizer-1",

      fullName: "Campus Organizer",
      email: cleanEmail,
      role,

      collegeId: "ORG-001",
      program: "",
      semester: null,
      phone: "",

      profileImageUrl: null,

      isVerified: true,
      status: "active",
      createdAt: now,
    };
  }

  return {
    id: createStableUserId(
      cleanEmail,
      role
    ),

    fullName: "Campus Student",
    email: cleanEmail,
    role,

    collegeId: "STU-001",
    program: "BIT",
    semester: 1,
    phone: "",

    profileImageUrl: null,

    isVerified: true,
    status: "active",
    createdAt: now,
  };
}

export const useAuthStore =
  create<AuthState>()(
    persist(
      (set) => ({
        user: null,
        hasHydrated: false,

        login: (email, role) => {
          const user = createLocalUser(
            email,
            role
          );

          set({ user });
        },

        register: (values) => {
          const now = new Date().toISOString();
          const cleanEmail = values.email.trim().toLowerCase();

          set({
            user: {
              id: values.role === "organizer"
                ? "organizer-1"
                : createStableUserId(cleanEmail, values.role),
              fullName: values.fullName.trim(),
              email: cleanEmail,
              role: values.role,
              collegeId: values.collegeId.trim(),
              program: values.program.trim(),
              semester: values.semester,
              phone: values.phone.trim(),
              profileImageUrl: null,
              isVerified: false,
              status: "active",
              createdAt: now,
            },
          });
        },

        updateProfile: (values) => {
          set((state) => {
            if (!state.user) {
              return state;
            }

            return {
              user: {
                ...state.user,
                ...values,
              },
            };
          });
        },

        logout: () => {
          set({
            user: null,
          });
        },

        setHasHydrated: (value) => set({ hasHydrated: value }),
      }),
      {
        name: "campusconnect-auth",

        storage: createJSONStorage(
          () => AsyncStorage
        ),

        partialize: (state) => ({
          user: state.user,
        }),

        version: 1,
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    )
  );
