# CampusConnect

CampusConnect is a mobile campus event management application built with Expo and React Native. It gives students one place to discover and register for events, while organizers can create events, manage capacity, review participants, and record attendance.

## Main features

### Student

- Role-based demo login
- Search by event, category, venue, or club
- Category and organizer filters
- Event details, live seat availability, and registration
- Registration deadline and capacity validation
- Personal upcoming and past-event schedule
- Persistent saved events and reminders
- Registration and reminder notification center
- Editable student profile

### Organizer

- Organizer dashboard and event analytics
- Create, edit, publish, cancel, complete, and delete events
- Draft event support
- Capacity and registration monitoring
- Participant list with attendance states
- Registration cleanup when an event is deleted
- Editable organizer profile

## Technology

- Expo SDK 54
- React Native 0.81 and React 19
- TypeScript
- React Navigation 7
- Zustand 5
- AsyncStorage persistence
- Expo Vector Icons

## Architecture

```text
src/
  components/        Reusable buttons, inputs, cards, and navigation UI
  data/              Initial demonstration event data
  navigation/        Authentication and role-based navigation
  screens/
    auth/            Login experience
    common/          Shared profile experience
    organizer/       Dashboard, event CRUD, and participant management
    student/         Discovery, details, schedule, saved events, notifications
  store/             Auth, event, registration, and preference state
  theme/             Shared color tokens
  types/             Domain and navigation types
```

## Run locally

Requirements: Node.js 20.19 or newer and Expo Go or an Android/iOS simulator.

```powershell
npm install
npx expo start
```

On Windows systems that block PowerShell scripts, use:

```powershell
npx.cmd expo start
```

## Demo accounts

Select either **Student** or **Organizer** on the login screen. Enter any valid-looking email and a password containing at least four characters. The app creates a stable local account for that email and role.

## Data model

The application models users, events, registrations, attendance, and student preferences. Zustand stores are persisted with AsyncStorage, so data remains available after the application restarts on the same device.

This build is an offline-first demonstration suitable for development and presentation. A production deployment should replace demo authentication and local persistence with a secured backend such as Supabase, including row-level security, server-side validation, file storage for posters, and push-notification delivery.

## Validation

Run the TypeScript check before submission:

```powershell
npx.cmd tsc --noEmit
```
