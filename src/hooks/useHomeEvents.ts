import { useMemo } from "react";

import { CampusEvent, EventRegistration } from "../types";
import { getTotalRegistrationCount } from "../utils/eventRules";

export function useHomeEvents(
  events: readonly CampusEvent[],
  registrations: readonly EventRegistration[],
  search: string,
  selectedCategory: string,
  selectedClub: string | null
) {
  return useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const categories = ["All", ...new Set(events.map((event) => event.category))];
    const clubs = [...new Set(events.map((event) => event.organizerName))];
    const filteredEvents = events
      .filter((event) => event.status === "published")
      .filter((event) => {
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
        const matchesClub = !selectedClub || event.organizerName === selectedClub;
        const matchesSearch =
          !normalizedSearch ||
          event.title.toLowerCase().includes(normalizedSearch) ||
          event.category.toLowerCase().includes(normalizedSearch) ||
          event.venue.toLowerCase().includes(normalizedSearch) ||
          event.organizerName.toLowerCase().includes(normalizedSearch);
        return matchesCategory && matchesClub && matchesSearch;
      })
      .map((event) => ({
        ...event,
        registered: getTotalRegistrationCount(event, registrations),
      }));

    return {
      categories,
      clubs,
      filteredEvents,
      featuredEvent: filteredEvents[0],
      recommendationEvents: filteredEvents.slice(1, 3),
      upcomingEvents: filteredEvents.slice(3),
    };
  }, [events, registrations, search, selectedCategory, selectedClub]);
}
