import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { useAuthStore } from "./authStore";

export interface UserPreferences {
  bookmarkedEventIds: string[];
  reminderEventIds: string[];
}

interface PreferenceState {
  preferencesByUser: Record<string, UserPreferences>;
  toggleBookmark: (eventId: string) => void;
  toggleReminder: (eventId: string) => void;
  removeEventPreferences: (eventId: string) => void;
}

const EMPTY_PREFERENCES: UserPreferences = { bookmarkedEventIds: [], reminderEventIds: [] };

function currentStudentId(): string | null {
  const user = useAuthStore.getState().user;
  return user?.role === "student" ? user.id : null;
}

function toggleId(ids: string[], eventId: string): string[] {
  return ids.includes(eventId) ? ids.filter((id) => id !== eventId) : [...ids, eventId];
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      preferencesByUser: {},
      toggleBookmark: (eventId) => {
        const studentId = currentStudentId();
        if (!studentId) return;
        set((state) => {
          const current = state.preferencesByUser[studentId] ?? EMPTY_PREFERENCES;
          return { preferencesByUser: { ...state.preferencesByUser, [studentId]: { ...current, bookmarkedEventIds: toggleId(current.bookmarkedEventIds, eventId) } } };
        });
      },
      toggleReminder: (eventId) => {
        const studentId = currentStudentId();
        if (!studentId) return;
        set((state) => {
          const current = state.preferencesByUser[studentId] ?? EMPTY_PREFERENCES;
          return { preferencesByUser: { ...state.preferencesByUser, [studentId]: { ...current, reminderEventIds: toggleId(current.reminderEventIds, eventId) } } };
        });
      },
      removeEventPreferences: (eventId) => set((state) => ({
        preferencesByUser: Object.fromEntries(Object.entries(state.preferencesByUser).map(([userId, preferences]) => [userId, {
          bookmarkedEventIds: preferences.bookmarkedEventIds.filter((id) => id !== eventId),
          reminderEventIds: preferences.reminderEventIds.filter((id) => id !== eventId),
        }]))
      })),
    }),
    {
      name: "campusconnect-preferences",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      partialize: (state) => ({ preferencesByUser: state.preferencesByUser }),
      migrate: (persistedState: unknown) => {
        const saved = persistedState as { preferencesByUser?: Record<string, UserPreferences>; bookmarkedEventIds?: string[]; reminderEventIds?: string[] };
        if (saved?.preferencesByUser) return saved;
        const studentId = currentStudentId();
        if (!studentId) return { preferencesByUser: {} };
        return { preferencesByUser: { [studentId]: {
          bookmarkedEventIds: Array.isArray(saved?.bookmarkedEventIds) ? saved.bookmarkedEventIds : [],
          reminderEventIds: Array.isArray(saved?.reminderEventIds) ? saved.reminderEventIds : [],
        } } };
      },
    }
  )
);
