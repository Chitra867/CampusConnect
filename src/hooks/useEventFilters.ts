import { useMemo, useState } from "react";

import { CampusEvent, EventStatus } from "../types";

export type EventFilter = "all" | EventStatus;

export function useEventFilters(events: readonly CampusEvent[]) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EventFilter>("all");

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...events]
      .filter((event) => {
        const matchesFilter = filter === "all" || event.status === filter;
        const matchesSearch =
          !query ||
          event.title.toLowerCase().includes(query) ||
          event.category.toLowerCase().includes(query) ||
          event.venue.toLowerCase().includes(query);

        return matchesFilter && matchesSearch;
      })
      .sort(
        (first, second) =>
          new Date(second.updatedAt).getTime() -
          new Date(first.updatedAt).getTime()
      );
  }, [events, filter, search]);

  const statusCounts = useMemo(
    () => ({
      all: events.length,
      draft: events.filter((event) => event.status === "draft").length,
      published: events.filter((event) => event.status === "published").length,
      cancelled: events.filter((event) => event.status === "cancelled").length,
      completed: events.filter((event) => event.status === "completed").length,
    }),
    [events]
  );

  return {
    filter,
    filteredEvents,
    search,
    setFilter,
    setSearch,
    statusCounts,
  };
}
