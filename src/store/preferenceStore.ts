import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PreferenceState {
  bookmarkedEventIds: string[];
  reminderEventIds: string[];
  toggleBookmark: (eventId: string) => void;
  toggleReminder: (eventId: string) => void;
  removeEventPreferences: (eventId: string) => void;
}

function toggleId(ids: string[], eventId: string): string[] {
  return ids.includes(eventId)
    ? ids.filter((id) => id !== eventId)
    : [...ids, eventId];
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      bookmarkedEventIds: [],
      reminderEventIds: [],
      toggleBookmark: (eventId) =>
        set((state) => ({
          bookmarkedEventIds: toggleId(state.bookmarkedEventIds, eventId),
        })),
      toggleReminder: (eventId) =>
        set((state) => ({
          reminderEventIds: toggleId(state.reminderEventIds, eventId),
        })),
      removeEventPreferences: (eventId) =>
        set((state) => ({
          bookmarkedEventIds: state.bookmarkedEventIds.filter(
            (id) => id !== eventId
          ),
          reminderEventIds: state.reminderEventIds.filter(
            (id) => id !== eventId
          ),
        })),
    }),
    {
      name: "campusconnect-preferences",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);
