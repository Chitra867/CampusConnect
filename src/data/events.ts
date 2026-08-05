import { CampusEvent } from "../types";

export const EVENTS: CampusEvent[] = [
  {
    id: "1",
    title: "React Native Workshop",
    category: "Technology",
    venue: "Computer Lab 3",
    date: "August 12, 2026",
    time: "10:00 AM",
    description:
      "A practical React Native workshop covering components, navigation, state management and mobile development.",
    capacity: 60,
    registered: 42,
  },
  {
    id: "2",
    title: "College Sports Meet",
    category: "Sports",
    venue: "College Ground",
    date: "August 15, 2026",
    time: "8:00 AM",
    description:
      "A campus sports program featuring football, basketball, running and other activities.",
    capacity: 150,
    registered: 98,
  },
  {
    id: "3",
    title: "UI/UX Design Competition",
    category: "Competition",
    venue: "Seminar Hall",
    date: "August 18, 2026",
    time: "11:30 AM",
    description:
      "Design a modern mobile application interface and present your design process.",
    capacity: 80,
    registered: 55,
  },
  {
    id: "4",
    title: "Career Development Seminar",
    category: "Career",
    venue: "Main Auditorium",
    date: "August 22, 2026",
    time: "1:00 PM",
    description:
      "Learn about internships, CV preparation, interviews and professional networking.",
    capacity: 120,
    registered: 75,
  },
];