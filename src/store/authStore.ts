import AsyncStorage from "@react-native-async-storage/async-storage";

import { create } from "zustand";

import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import {
  AuthUser,
  UserRole,
} from "../types";

interface AuthState {
  user: AuthUser | null;

  login: (
    email: string,
    role: UserRole
  ) => void;

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
      id: createStableUserId(
        cleanEmail,
        role
      ),

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

        login: (email, role) => {
          const user = createLocalUser(
            email,
            role
          );

          set({ user });
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
      }
    )
  );