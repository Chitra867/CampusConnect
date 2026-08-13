import { useMemo } from "react";

import { CampusEvent, EventRegistration } from "../types";

export type ScheduleTab = "upcoming" | "past";
export interface EventSection { title: string; data: CampusEvent[] }

function parseEventDate(event: CampusEvent): Date | null {
  const parsed = new Date(event.endDate ?? event.date);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function useStudentEvents(
  events: readonly CampusEvent[],
  registrations: readonly EventRegistration[],
  studentId: string | undefined,
  selectedTab: ScheduleTab
): EventSection[] {
  return useMemo(() => {
    if (!studentId) return [];

    const registeredIds = new Set(
      registrations
        .filter((item) => item.studentId === studentId && item.status === "registered")
        .map((item) => item.eventId)
    );
    const now = Date.now();
    const filtered = events.filter((event) => {
      if (!registeredIds.has(event.id)) return false;
      const eventDate = parseEventDate(event);
      const isPast = event.status === "completed" || (eventDate?.getTime() ?? now) < now;
      return selectedTab === "past" ? isPast : !isPast;
    });

    filtered.sort((first, second) => {
      const firstTime = parseEventDate(first)?.getTime() ?? 0;
      const secondTime = parseEventDate(second)?.getTime() ?? 0;
      return selectedTab === "past" ? secondTime - firstTime : firstTime - secondTime;
    });

    const groups = filtered.reduce<Record<string, CampusEvent[]>>((result, event) => {
      const date = parseEventDate(event);
      const label = date
        ? date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "Other Events";
      (result[label] ??= []).push(event);
      return result;
    }, {});

    return Object.entries(groups).map(([title, data]) => ({ title, data }));
  }, [events, registrations, selectedTab, studentId]);
}
