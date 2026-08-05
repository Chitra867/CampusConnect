import AsyncStorage from "@react-native-async-storage/async-storage";

import { create } from "zustand";

import {
  createJSONStorage,
  persist,
} from "zustand/middleware";

import { useAuthStore } from "./authStore";
import { useEventStore } from "./eventStore";

import {
  AttendanceStatus,
  EventRegistration,
} from "../types";

export type RegistrationResult =
  | "registered"
  | "already_registered"
  | "event_full"
  | "event_not_found"
  | "event_unavailable"
  | "not_authenticated"
  | "student_only";

interface RegistrationState {
  /*
   * Preserved for compatibility with your current
   * student and organizer screens.
   */
  registeredEventIds: string[];

  /*
   * Real registration records.
   */
  registrations: EventRegistration[];

  registerEvent: (
    eventId: string
  ) => RegistrationResult;

  cancelRegistration: (
    eventId: string
  ) => boolean;

  isRegistered: (
    eventId: string
  ) => boolean;

  getEventParticipants: (
    eventId: string
  ) => EventRegistration[];

  getRegistrationCount: (
    eventId: string
  ) => number;

  markAttendance: (
    registrationId: string,
    attendanceStatus:
      AttendanceStatus
  ) => boolean;

  removeEventRegistrations: (
    eventId: string
  ) => void;

  clearRegistrations: () => void;
}

function isActiveRegistration(
  registration: EventRegistration
): boolean {
  return (
    registration.status ===
    "registered"
  );
}

function createRegistrationId(
  eventId: string,
  studentId: string
): string {
  return `registration-${eventId}-${studentId}`;
}

export const useRegistrationStore =
  create<RegistrationState>()(
    persist(
      (set, get) => ({
        registeredEventIds: [],

        registrations: [],

        registerEvent: (
          eventId
        ) => {
          const user =
            useAuthStore.getState().user;

          if (!user) {
            return "not_authenticated";
          }

          if (
            user.role !== "student"
          ) {
            return "student_only";
          }

          const event =
            useEventStore
              .getState()
              .events.find(
                (item) =>
                  item.id === eventId
              );

          if (!event) {
            return "event_not_found";
          }

          if (
            event.status !==
            "published"
          ) {
            return "event_unavailable";
          }

          const existingRegistration =
            get().registrations.find(
              (registration) =>
                registration.eventId ===
                  eventId &&
                registration.studentId ===
                  user.id
            );

          if (
            existingRegistration &&
            isActiveRegistration(
              existingRegistration
            )
          ) {
            return "already_registered";
          }

          const localActiveCount =
            get().registrations.filter(
              (registration) =>
                registration.eventId ===
                  eventId &&
                isActiveRegistration(
                  registration
                )
            ).length;

          const totalRegistered =
            event.registered +
            localActiveCount;

          if (
            totalRegistered >=
            event.capacity
          ) {
            return "event_full";
          }

          const now =
            new Date().toISOString();

          if (
            existingRegistration
          ) {
            set((state) => ({
              registrations:
                state.registrations.map(
                  (registration) =>
                    registration.id ===
                    existingRegistration.id
                      ? {
                          ...registration,

                          studentName:
                            user.fullName,

                          studentEmail:
                            user.email,

                          collegeId:
                            user.collegeId,

                          program:
                            user.program,

                          semester:
                            user.semester,

                          status:
                            "registered",

                          attendanceStatus:
                            "pending",

                          registeredAt:
                            now,

                          checkedInAt:
                            null,

                          checkedInBy:
                            null,
                        }
                      : registration
                ),

              registeredEventIds:
                Array.from(
                  new Set([
                    ...state.registeredEventIds,
                    eventId,
                  ])
                ),
            }));

            return "registered";
          }

          const registration:
            EventRegistration = {
              id:
                createRegistrationId(
                  eventId,
                  user.id
                ),

              eventId,
              studentId: user.id,

              studentName:
                user.fullName,

              studentEmail:
                user.email,

              collegeId:
                user.collegeId,

              program:
                user.program,

              semester:
                user.semester,

              status: "registered",

              attendanceStatus:
                "pending",

              registeredAt: now,

              checkedInAt: null,
              checkedInBy: null,
            };

          set((state) => ({
            registrations: [
              registration,
              ...state.registrations,
            ],

            registeredEventIds:
              Array.from(
                new Set([
                  ...state.registeredEventIds,
                  eventId,
                ])
              ),
          }));

          return "registered";
        },

        cancelRegistration: (
          eventId
        ) => {
          const user =
            useAuthStore.getState().user;

          if (!user) {
            return false;
          }

          const registration =
            get().registrations.find(
              (item) =>
                item.eventId ===
                  eventId &&
                item.studentId ===
                  user.id &&
                isActiveRegistration(
                  item
                )
            );

          if (!registration) {
            return false;
          }

          set((state) => ({
            registrations:
              state.registrations.map(
                (item) =>
                  item.id ===
                  registration.id
                    ? {
                        ...item,

                        status:
                          "cancelled",

                        attendanceStatus:
                          "pending",

                        checkedInAt:
                          null,

                        checkedInBy:
                          null,
                      }
                    : item
              ),

            registeredEventIds:
              state.registeredEventIds.filter(
                (id) =>
                  id !== eventId
              ),
          }));

          return true;
        },

        isRegistered: (
          eventId
        ) => {
          const user =
            useAuthStore.getState().user;

          if (!user) {
            return false;
          }

          return get().registrations.some(
            (registration) =>
              registration.eventId ===
                eventId &&
              registration.studentId ===
                user.id &&
              isActiveRegistration(
                registration
              )
          );
        },

        getEventParticipants: (
          eventId
        ) => {
          return get().registrations
            .filter(
              (registration) =>
                registration.eventId ===
                eventId
            )
            .sort(
              (first, second) =>
                new Date(
                  second.registeredAt
                ).getTime() -
                new Date(
                  first.registeredAt
                ).getTime()
            );
        },

        getRegistrationCount: (
          eventId
        ) => {
          return get().registrations.filter(
            (registration) =>
              registration.eventId ===
                eventId &&
              isActiveRegistration(
                registration
              )
          ).length;
        },

        markAttendance: (
          registrationId,
          attendanceStatus
        ) => {
          const organizer =
            useAuthStore.getState().user;

          if (
            !organizer ||
            organizer.role !==
              "organizer"
          ) {
            return false;
          }

          const registration =
            get().registrations.find(
              (item) =>
                item.id ===
                registrationId
            );

          if (
            !registration ||
            registration.status ===
              "cancelled"
          ) {
            return false;
          }

          const checkedIn =
            attendanceStatus ===
            "attended";

          set((state) => ({
            registrations:
              state.registrations.map(
                (item) =>
                  item.id ===
                  registrationId
                    ? {
                        ...item,

                        attendanceStatus,

                        checkedInAt:
                          checkedIn
                            ? new Date().toISOString()
                            : null,

                        checkedInBy:
                          checkedIn
                            ? organizer.id
                            : null,
                      }
                    : item
              ),
          }));

          return true;
        },

        removeEventRegistrations: (
          eventId
        ) => {
          set((state) => ({
            registrations:
              state.registrations.filter(
                (registration) =>
                  registration.eventId !==
                  eventId
              ),

            registeredEventIds:
              state.registeredEventIds.filter(
                (id) =>
                  id !== eventId
              ),
          }));
        },

        clearRegistrations: () => {
          set({
            registrations: [],
            registeredEventIds: [],
          });
        },
      }),
      {
        name:
          "campusconnect-registrations",

        storage: createJSONStorage(
          () => AsyncStorage
        ),

        partialize: (state) => ({
          registrations:
            state.registrations,

          registeredEventIds:
            state.registeredEventIds,
        }),

        version: 2,

        migrate: (
          persistedState: unknown,
          version
        ) => {
          const savedState =
            persistedState as {
              registeredEventIds?:
                string[];

              registrations?:
                EventRegistration[];
            };

          if (
            version >= 2 &&
            Array.isArray(
              savedState.registrations
            )
          ) {
            return savedState;
          }

          const user =
            useAuthStore.getState().user;

          const studentId =
            user?.role === "student"
              ? user.id
              : "student-local";

          const studentName =
            user?.role === "student"
              ? user.fullName
              : "Campus Student";

          const studentEmail =
            user?.role === "student"
              ? user.email
              : "student@college.edu";

          const now =
            new Date().toISOString();

          const oldEventIds =
            Array.isArray(
              savedState
                ?.registeredEventIds
            )
              ? savedState.registeredEventIds
              : [];

          const migratedRegistrations:
            EventRegistration[] =
              oldEventIds.map(
                (
                  eventId,
                  index
                ) => ({
                  id:
                    `registration-${eventId}-${studentId}-${index}`,

                  eventId,
                  studentId,

                  studentName,
                  studentEmail,

                  collegeId:
                    user?.collegeId ??
                    "STU-001",

                  program:
                    user?.program ??
                    "BIT",

                  semester:
                    user?.semester ??
                    1,

                  status:
                    "registered",

                  attendanceStatus:
                    "pending",

                  registeredAt:
                    now,

                  checkedInAt:
                    null,

                  checkedInBy:
                    null,
                })
              );

          return {
            registrations:
              migratedRegistrations,

            registeredEventIds:
              oldEventIds,
          };
        },
      }
    )
  );