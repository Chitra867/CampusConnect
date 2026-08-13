import AsyncStorage from "@react-native-async-storage/async-storage";

import { create } from "zustand";

import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import { INITIAL_EVENTS } from "../data/events";
import { DEMO_ORGANIZER_ID, useAuthStore } from "./authStore";

import type {
  CampusEvent,
  EventFormValues,
  EventStatus,
} from "../types";

interface EventState {
  events: CampusEvent[];

  addEvent: (
    values: EventFormValues,
    createdBy: string
  ) => string;

  updateEvent: (
    eventId: string,
    values: EventFormValues
  ) => boolean;

  setEventStatus: (
    eventId: string,
    status: EventStatus
  ) => boolean;

  deleteEvent: (
    eventId: string
  ) => boolean;

  getEventById: (
    eventId: string
  ) => CampusEvent | undefined;

  resetEvents: () => void;
}

function normalizeEvent(
  event: CampusEvent
): CampusEvent {
  const now = new Date().toISOString();

  return {
    ...event,
    registered: event.registered ?? 0,
    createdBy:
      event.createdBy === "organizer-1" ? DEMO_ORGANIZER_ID : event.createdBy,

    clubId:
      event.clubId ?? null,

    posterUrl:
      event.posterUrl ?? null,

    status:
      event.status ?? "published",

    createdAt:
      event.createdAt ?? now,

    updatedAt:
      event.updatedAt ?? now,
  };
}

function canTransitionStatus(current: EventStatus, next: EventStatus): boolean {
  if (current === next) return true;

  const transitions: Record<EventStatus, readonly EventStatus[]> = {
    draft: ["published"],
    published: ["draft", "cancelled", "completed"],
    cancelled: ["published"],
    completed: [],
  };

  return transitions[current].includes(next);
}

export const useEventStore =
  create<EventState>()(
    persist(
      (set, get) => ({
        events:
          INITIAL_EVENTS.map(
            normalizeEvent
          ),

        addEvent: (
          values,
          createdBy
        ) => {
          const organizer = useAuthStore.getState().user;
          if (!organizer || organizer.role !== "organizer" || organizer.id !== createdBy) {
            return "";
          }
          const now =
            new Date().toISOString();

          const eventId =
            `event-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}`;

          const {
            status = "published",
            ...eventValues
          } = values;

          const newEvent: CampusEvent = {
            id: eventId,

            ...eventValues,

            registered: 0,

            createdBy,
            status,

            clubId:
              eventValues.clubId ?? null,

            posterUrl:
              eventValues.posterUrl ?? null,

            createdAt: now,
            updatedAt: now,
          };

          set((state) => ({
            events: [
              newEvent,
              ...state.events,
            ],
          }));

          return eventId;
        },

        updateEvent: (
          eventId,
          values
        ) => {
          const existingEvent =
            get().events.find(
              (event) =>
                event.id === eventId
            );

          if (!existingEvent) {
            return false;
          }

          if (existingEvent.status === "completed") {
            return false;
          }

          const organizer = useAuthStore.getState().user;
          if (!organizer || organizer.role !== "organizer" || existingEvent.createdBy !== organizer.id) {
            return false;
          }

          const {
            status,
            ...eventValues
          } = values;

          const nextStatus = status ?? existingEvent.status;
          if (!canTransitionStatus(existingEvent.status, nextStatus)) {
            return false;
          }

          set((state) => ({
            events: state.events.map(
              (event) => {
                if (
                  event.id !== eventId
                ) {
                  return event;
                }

                return {
                  ...event,
                  ...eventValues,

                  status: nextStatus,

                  updatedAt:
                    new Date().toISOString(),
                };
              }
            ),
          }));

          return true;
        },

        setEventStatus: (
          eventId,
          status
        ) => {
          const organizer = useAuthStore.getState().user;
          const existingEvent = get().events.find((event) => event.id === eventId);

          if (!organizer || organizer.role !== "organizer" || !existingEvent || existingEvent.createdBy !== organizer.id) {
            return false;
          }

          if (!canTransitionStatus(existingEvent.status, status)) {
            return false;
          }

          set((state) => ({
            events: state.events.map(
              (event) =>
                event.id === eventId
                  ? {
                      ...event,
                      status,

                      updatedAt:
                        new Date().toISOString(),
                    }
                  : event
            ),
          }));

          return true;
        },

        deleteEvent: (
          eventId
        ) => {
          const organizer = useAuthStore.getState().user;
          const existingEvent = get().events.find((event) => event.id === eventId);

          if (!organizer || organizer.role !== "organizer" || !existingEvent || existingEvent.createdBy !== organizer.id) {
            return false;
          }

          set((state) => ({
            events:
              state.events.filter(
                (event) =>
                  event.id !== eventId
              ),
          }));

          return true;
        },

        getEventById: (
          eventId
        ) => {
          return get().events.find(
            (event) =>
              event.id === eventId
          );
        },

        resetEvents: () => {
          set({
            events:
              INITIAL_EVENTS.map(
                normalizeEvent
              ),
          });
        },
      }),
      {
        name: "campusconnect-events",

        storage: createJSONStorage(
          () => AsyncStorage
        ),

        partialize: (state) => ({
          events: state.events,
        }),

        version: 4,

        migrate: (
          persistedState: unknown
        ) => {
          const savedState =
            persistedState as {
              events?: CampusEvent[];
            };

          return {
            ...savedState,

            events: Array.isArray(
              savedState?.events
            )
              ? savedState.events.map(
                  normalizeEvent
                )
              : INITIAL_EVENTS.map(
                  normalizeEvent
                ),
          };
        },
      }
    )
  );
