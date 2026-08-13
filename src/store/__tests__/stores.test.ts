import { act, renderHook } from "@testing-library/react-native";

import { useOrganizerStats } from "../../hooks/useOrganizerStats";
import { DEMO_ORGANIZER_EMAIL, DEMO_ORGANIZER_ID, useAuthStore } from "../authStore";
import { useEventStore } from "../eventStore";
import { useRegistrationStore } from "../registrationStore";
import type { EventFormValues, RegistrationFormValues } from "../../types";

const eventValues: EventFormValues = {
  title: "Test Event",
  category: "Technology",
  venue: "Lab 1",
  date: "August 20, 2026",
  time: "10:00 AM",
  registrationDeadline: "August 19, 2026",
  description: "A focused test event.",
  capacity: 2,
  organizerName: "Test Club",
  status: "published",
};

function loginOrganizer(email = DEMO_ORGANIZER_EMAIL) {
  act(() => useAuthStore.getState().login(email, "organizer"));
  const organizer = useAuthStore.getState().user;
  if (!organizer) throw new Error("Organizer login failed");
  return organizer;
}

function loginStudent(email: string) {
  act(() => useAuthStore.getState().login(email, "student"));
  const student = useAuthStore.getState().user;
  if (!student) throw new Error("Student login failed");
  return student;
}

function createEvent(overrides: Partial<EventFormValues> = {}) {
  const organizer = useAuthStore.getState().user;
  if (!organizer) throw new Error("An organizer must be logged in");
  let eventId = "";
  act(() => {
    eventId = useEventStore.getState().addEvent(
      { ...eventValues, ...overrides },
      organizer.id
    );
  });
  if (!eventId) throw new Error("Event creation failed");
  return eventId;
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-08-13T10:00:00.000Z"));
  act(() => {
    useAuthStore.setState({ user: null, hasHydrated: true });
    useEventStore.getState().resetEvents();
    useRegistrationStore.getState().clearRegistrations();
  });
});

afterEach(() => {
  jest.useRealTimers();
});

describe("authStore", () => {
  test("creates stable distinct IDs for local accounts", () => {
    const first = loginOrganizer("organizer-a@college.edu");
    const repeated = loginOrganizer("ORGANIZER-A@college.edu");
    const second = loginOrganizer("organizer-b@college.edu");

    expect(repeated.id).toBe(first.id);
    expect(second.id).not.toBe(first.id);
    expect(loginOrganizer().id).toBe(DEMO_ORGANIZER_ID);
  });

  test("registers a typed student profile", () => {
    const values: RegistrationFormValues = {
      fullName: "Student One",
      email: "student.one@college.edu",
      role: "student",
      collegeId: "ST-100",
      program: "BIT",
      semester: 3,
      phone: "9800000000",
    };

    act(() => useAuthStore.getState().register(values));

    expect(useAuthStore.getState().user).toMatchObject({
      fullName: "Student One",
      email: "student.one@college.edu",
      role: "student",
      collegeId: "ST-100",
    });
  });
});

describe("eventStore", () => {
  test("preserves seed registration counts and enforces ownership", () => {
    expect(useEventStore.getState().events.find((event) => event.id === "1")?.registered).toBe(42);

    const owner = loginOrganizer("owner@college.edu");
    const eventId = createEvent();
    loginOrganizer("other@college.edu");

    expect(useEventStore.getState().updateEvent(eventId, { ...eventValues, title: "Changed" })).toBe(false);
    expect(useEventStore.getState().deleteEvent(eventId)).toBe(false);

    loginOrganizer(owner.email);
    expect(useEventStore.getState().updateEvent(eventId, { ...eventValues, title: "Owner Changed" })).toBe(true);
  });

  test("supports valid status changes and keeps completion terminal", () => {
    loginOrganizer("owner@college.edu");
    const eventId = createEvent();

    expect(useEventStore.getState().setEventStatus(eventId, "completed")).toBe(true);
    expect(useEventStore.getState().setEventStatus(eventId, "published")).toBe(false);
  });
});

describe("registrationStore", () => {
  test("prevents duplicate registrations and supports cancellation", () => {
    loginOrganizer("owner@college.edu");
    const eventId = createEvent();
    loginStudent("student@college.edu");

    expect(useRegistrationStore.getState().registerEvent(eventId)).toBe("registered");
    expect(useRegistrationStore.getState().registerEvent(eventId)).toBe("already_registered");
    expect(useRegistrationStore.getState().cancelRegistration(eventId)).toBe(true);
    expect(useRegistrationStore.getState().isRegistered(eventId)).toBe(false);
  });

  test("enforces event capacity across students", () => {
    loginOrganizer("owner@college.edu");
    const eventId = createEvent({ capacity: 1 });
    loginStudent("first@college.edu");
    expect(useRegistrationStore.getState().registerEvent(eventId)).toBe("registered");

    loginStudent("second@college.edu");
    expect(useRegistrationStore.getState().registerEvent(eventId)).toBe("event_full");
  });

  test("rejects registration after the deadline", () => {
    loginOrganizer("owner@college.edu");
    const eventId = createEvent({ registrationDeadline: "August 12, 2026" });
    loginStudent("student@college.edu");

    expect(useRegistrationStore.getState().registerEvent(eventId)).toBe("registration_closed");
  });

  test("allows only the owning organizer to update attendance", () => {
    const owner = loginOrganizer("owner@college.edu");
    const eventId = createEvent();
    loginStudent("student@college.edu");
    useRegistrationStore.getState().registerEvent(eventId);
    const registration = useRegistrationStore.getState().registrations[0];

    loginOrganizer("other@college.edu");
    expect(useRegistrationStore.getState().markAttendance(registration.id, "attended")).toBe(false);

    loginOrganizer(owner.email);
    expect(useRegistrationStore.getState().markAttendance(registration.id, "attended")).toBe(true);
    expect(useRegistrationStore.getState().registrations[0]).toMatchObject({
      attendanceStatus: "attended",
      checkedInBy: owner.id,
    });
  });
});

describe("organizer statistics", () => {
  test("includes seed and local registrations only for owned events", () => {
    const organizer = loginOrganizer();
    const eventId = createEvent({ capacity: 5 });
    loginStudent("student@college.edu");
    useRegistrationStore.getState().registerEvent(eventId);

    const { result } = renderHook(() =>
      useOrganizerStats(
        useEventStore.getState().events,
        useRegistrationStore.getState().registrations,
        organizer.id
      )
    );

    expect(result.current.events.every((event) => event.createdBy === organizer.id)).toBe(true);
    expect(result.current.getRegistrationCount(eventId)).toBe(1);
    expect(result.current.totalRegistrations).toBe(363);
  });
});
