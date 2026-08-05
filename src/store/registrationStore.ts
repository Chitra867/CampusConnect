import AsyncStorage from "@react-native-async-storage/async-storage";

import { create } from "zustand";

import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import { EVENTS } from "../data/events";

export type RegistrationResult =
  | "registered"
  | "already_registered"
  | "event_full"
  | "event_not_found";

interface RegistrationState {
  registeredEventIds: string[];

  registerEvent: (
    eventId: string
  ) => RegistrationResult;

  cancelRegistration: (
    eventId: string
  ) => void;

  isRegistered: (
    eventId: string
  ) => boolean;
}

export const useRegistrationStore =
  create<RegistrationState>()(
    persist(
      (set, get) => ({
        registeredEventIds: [],

        registerEvent: (eventId) => {
          const event = EVENTS.find(
            (item) => item.id === eventId
          );

          if (!event) {
            return "event_not_found";
          }

          const alreadyRegistered =
            get().registeredEventIds.includes(
              eventId
            );

          if (alreadyRegistered) {
            return "already_registered";
          }

          if (
            event.registered >=
            event.capacity
          ) {
            return "event_full";
          }

          set((state) => ({
            registeredEventIds: [
              ...state.registeredEventIds,
              eventId,
            ],
          }));

          return "registered";
        },

        cancelRegistration: (
          eventId
        ) => {
          set((state) => ({
            registeredEventIds:
              state.registeredEventIds.filter(
                (id) => id !== eventId
              ),
          }));
        },

        isRegistered: (eventId) => {
          return get().registeredEventIds.includes(
            eventId
          );
        },
      }),
      {
        name: "campusconnect-registrations",

        storage: createJSONStorage(
          () => AsyncStorage
        ),

        partialize: (state) => ({
          registeredEventIds:
            state.registeredEventIds,
        }),
      }
    )
  );