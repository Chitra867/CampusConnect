import { CampusEvent, EventRegistration } from "../types";

export function getActiveRegistrationCount(
  eventId: string,
  registrations: readonly EventRegistration[]
): number {
  return registrations.filter(
    (registration) =>
      registration.eventId === eventId && registration.status === "registered"
  ).length;
}

export function getTotalRegistrationCount(
  event: CampusEvent,
  registrations: readonly EventRegistration[]
): number {
  return event.registered + getActiveRegistrationCount(event.id, registrations);
}

export function getSeatsRemaining(
  event: CampusEvent,
  registrations: readonly EventRegistration[] = []
): number {
  return Math.max(event.capacity - getTotalRegistrationCount(event, registrations), 0);
}

export function parseDateTime(date: string, time?: string): Date | null {
  const value = time?.trim() ? `${date.trim()} ${time.trim()}` : date.trim();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getRegistrationDeadlineTime(value: string): number | null {
  const deadline = parseDateTime(value);
  if (!deadline) return null;

  const includesTime = /\d{1,2}:\d{2}|\b(?:am|pm)\b|T\d{2}/i.test(value);
  if (!includesTime) deadline.setHours(23, 59, 59, 999);
  return deadline.getTime();
}

export function isRegistrationClosed(event: CampusEvent, now = Date.now()): boolean {
  if (!event.registrationDeadline) return false;
  const deadlineTime = getRegistrationDeadlineTime(event.registrationDeadline);
  return deadlineTime !== null && deadlineTime < now;
}

export function hasEventStarted(event: CampusEvent, now = Date.now()): boolean {
  const start = parseDateTime(event.date, event.time);
  return start !== null && start.getTime() <= now;
}
