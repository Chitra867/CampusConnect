import { useMemo, useState } from "react";

import { EventRegistration } from "../types";

export type ParticipantFilter =
  | "all"
  | "registered"
  | "pending"
  | "attended"
  | "absent"
  | "cancelled";

export function useParticipantFilters(
  registrations: readonly EventRegistration[],
  eventId: string
) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ParticipantFilter>("all");

  const eventRegistrations = useMemo(
    () =>
      registrations
        .filter((registration) => registration.eventId === eventId)
        .sort((first, second) => {
          if (first.status !== second.status) {
            return first.status === "registered" ? -1 : 1;
          }
          return new Date(second.registeredAt).getTime() - new Date(first.registeredAt).getTime();
        }),
    [eventId, registrations]
  );

  const counts = useMemo(() => {
    const active = eventRegistrations.filter((item) => item.status === "registered");
    return {
      all: eventRegistrations.length,
      registered: active.length,
      pending: active.filter((item) => item.attendanceStatus === "pending").length,
      attended: active.filter((item) => item.attendanceStatus === "attended").length,
      absent: active.filter((item) => item.attendanceStatus === "absent").length,
      cancelled: eventRegistrations.filter((item) => item.status === "cancelled").length,
    };
  }, [eventRegistrations]);

  const filteredParticipants = useMemo(() => {
    const query = search.trim().toLowerCase();
    return eventRegistrations.filter((registration) => {
      const matchesSearch =
        !query ||
        registration.studentName.toLowerCase().includes(query) ||
        registration.studentEmail.toLowerCase().includes(query) ||
        registration.collegeId.toLowerCase().includes(query) ||
        registration.program.toLowerCase().includes(query);

      const matchesFilter =
        filter === "all" ||
        (filter === "registered" && registration.status === "registered") ||
        (filter === "cancelled" && registration.status === "cancelled") ||
        (["pending", "attended", "absent"] as const).some(
          (status) =>
            filter === status &&
            registration.status === "registered" &&
            registration.attendanceStatus === status
        );

      return matchesSearch && matchesFilter;
    });
  }, [eventRegistrations, filter, search]);

  return {
    counts,
    eventRegistrations,
    filter,
    filteredParticipants,
    search,
    setFilter,
    setSearch,
  };
}
