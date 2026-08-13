import { useMemo } from "react";

import { CampusEvent, EventRegistration } from "../types";
import { getTotalRegistrationCount } from "../utils/eventRules";

export function useOrganizerStats(
  allEvents: readonly CampusEvent[],
  registrations: readonly EventRegistration[],
  organizerId?: string
) {
  return useMemo(() => {
    const events = allEvents.filter((event) => event.createdBy === organizerId);
    const registrationCountByEvent = Object.fromEntries(
      events.map((event) => [
        event.id,
        getTotalRegistrationCount(event, registrations),
      ])
    ) as Record<string, number>;

    return {
      events,
      totalRegistrations: Object.values(registrationCountByEvent).reduce(
        (total, count) => total + count,
        0
      ),
      publishedCount: events.filter((event) => event.status === "published").length,
      cancelledCount: events.filter((event) => event.status === "cancelled").length,
      completedCount: events.filter((event) => event.status === "completed").length,
      recentEvents: [...events]
        .sort(
          (first, second) =>
            new Date(second.updatedAt).getTime() -
            new Date(first.updatedAt).getTime()
        )
        .slice(0, 4),
      getRegistrationCount: (eventId: string) =>
        registrationCountByEvent[eventId] ?? 0,
    };
  }, [allEvents, organizerId, registrations]);
}
