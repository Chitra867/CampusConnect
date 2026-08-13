import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { SafeAreaView } from "react-native-safe-area-context";

import { useEventStore } from "../../store/eventStore";
import { useAuthStore } from "../../store/authStore";
import { useRegistrationStore } from "../../store/registrationStore";
import { usePreferenceStore } from "../../store/preferenceStore";
import { getTotalRegistrationCount } from "../../utils/eventRules";

import type {
  OrganizerRootStackParamList,
} from "../../types";

type Props = NativeStackScreenProps<
  OrganizerRootStackParamList,
  "OrganizerEventDetails"
>;

const palette = {
  navy: "#111378",
  purple: "#A66BFA",
  purpleDark: "#7043CE",
  purpleSoft: "#EEE7FF",
  background: "#F7F8FC",
  surface: "#FFFFFF",
  text: "#23242A",
  secondary: "#737583",
  border: "#E3E4EA",
  success: "#23875F",
  successSoft: "#E9F8F2",
  danger: "#CC3C46",
  dangerSoft: "#FFF0F1",
  warning: "#B87812",
  warningSoft: "#FFF5DF",
  white: "#FFFFFF",
};

export default function OrganizerEventDetailsScreen({
  navigation,
  route,
}: Props) {
  const user = useAuthStore((state) => state.user);
  const events = useEventStore(
    (state) => state.events
  );

  const setEventStatus = useEventStore(
    (state) => state.setEventStatus
  );

  const deleteEvent = useEventStore(
    (state) => state.deleteEvent
  );

  const registrations = useRegistrationStore(
    (state) => state.registrations
  );

  const removeEventRegistrations =
    useRegistrationStore(
      (state) =>
        state.removeEventRegistrations
    );

  const removeEventPreferences = usePreferenceStore(
    (state) => state.removeEventPreferences
  );

  const event = events.find(
    (item) =>
      item.id === route.params.eventId && item.createdBy === user?.id
  );

  if (!event) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>
          Event not found.
        </Text>
      </SafeAreaView>
    );
  }

  const participants = registrations.filter(
    (registration) =>
      registration.eventId === event.id
  );

  const activeParticipants =
    participants.filter(
      (registration) =>
        registration.status === "registered"
    );

  const attendedCount =
    activeParticipants.filter(
      (registration) =>
        registration.attendanceStatus === "attended"
    ).length;

  const absentCount =
    activeParticipants.filter(
      (registration) =>
        registration.attendanceStatus === "absent"
    ).length;

  const pendingCount =
    activeParticipants.filter(
      (registration) =>
        registration.attendanceStatus === "pending"
    ).length;

  const totalRegistrationCount = getTotalRegistrationCount(event, registrations);

  const availableSeats = Math.max(
    event.capacity - totalRegistrationCount,
    0
  );

  const cancelled =
    event.status === "cancelled";

  const completed =
    event.status === "completed";

  const handleStatusChange = () => {
    if (completed) {
      Alert.alert(
        "Event Completed",
        "A completed event cannot be cancelled or republished."
      );

      return;
    }

    const draft = event.status === "draft";

    Alert.alert(
      cancelled || draft ? "Publish Event" : "Update Event Status",

      cancelled || draft
        ? "Make this event available to students?"
        : "Cancel the event or mark it as completed.",

      [
        {
          text: "Keep Current Status",
          style: "cancel",
        },
        {
          text: cancelled || draft
            ? "Publish"
            : "Cancel Event",

          style: cancelled || draft
            ? "default"
            : "destructive",

          onPress: () =>
            setEventStatus(
              event.id,
              cancelled || draft
                ? "published"
                : "cancelled"
            ),
        },
        ...(event.status === "published"
          ? [
              {
                text: "Complete Event",
                onPress: () => setEventStatus(event.id, "completed"),
              },
            ]
          : []),
      ]
    );
  };

  const handleDelete = () => {
    if (totalRegistrationCount > 0) {
      Alert.alert(
        "Event Has Registration History",
        "This event cannot be deleted because participant records must be preserved. Cancel or complete the event instead."
      );
      return;
    }

    Alert.alert(
      "Delete Event Permanently",
      `Delete ${event.title}? This action cannot be undone.`,
      [
        {
          text: "Keep Event",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",

          onPress: () => {
            removeEventRegistrations(event.id);
            removeEventPreferences(event.id);
            deleteEvent(event.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["bottom"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.hero}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="calendar"
              size={54}
              color={palette.white}
            />
          </View>

          <StatusBadge status={event.status} />
        </View>

        <Text style={styles.title}>
          {event.title}
        </Text>

        <Text style={styles.organizer}>
          Organized by {event.organizerName}
        </Text>

        <View style={styles.informationCard}>
          <InformationRow
            icon="grid-outline"
            label="Category"
            value={event.category}
          />

          <InformationRow
            icon="calendar-outline"
            label="Date"
            value={event.date}
          />

          <InformationRow
            icon="time-outline"
            label="Time"
            value={
              event.endTime
                ? `${event.time} - ${event.endTime}`
                : event.time
            }
          />

          <InformationRow
            icon="location-outline"
            label="Venue"
            value={event.venue}
          />

          <InformationRow
            icon="people-outline"
            label="Registration"
            value={`${totalRegistrationCount} registered • ${availableSeats} seats remaining`}
            isLast
          />
        </View>

        <View style={styles.participantHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Participant Overview
            </Text>

            <Text style={styles.sectionSubtitle}>
              Attendance records created in this app
            </Text>
          </View>

          <Pressable
            onPress={() =>
              navigation.navigate(
                "OrganizerParticipants",
                {
                  eventId: event.id,
                }
              )
            }
            style={({ pressed }) => [
              styles.viewParticipantsLink,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={styles.viewParticipantsLinkText}
            >
              View All
            </Text>

            <Ionicons
              name="arrow-forward"
              size={16}
              color={palette.purpleDark}
            />
          </Pressable>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            value={activeParticipants.length}
            label="Active"
            tone="purple"
          />

          <StatCard
            value={attendedCount}
            label="Attended"
            tone="green"
          />

          <StatCard
            value={absentCount}
            label="Absent"
            tone="red"
          />

          <StatCard
            value={pendingCount}
            label="Pending"
            tone="orange"
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View event participants"
          onPress={() =>
            navigation.navigate(
              "OrganizerParticipants",
              {
                eventId: event.id,
              }
            )
          }
          style={({ pressed }) => [
            styles.participantsButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="people-outline"
            size={22}
            color={palette.white}
          />

          <Text style={styles.participantsButtonText}>
            View Participants
          </Text>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={palette.white}
          />
        </Pressable>

        <Text style={styles.sectionTitle}>
          Description
        </Text>

        <Text style={styles.description}>
          {event.description}
        </Text>

        <View style={styles.primaryActions}>
          <Pressable
            onPress={() =>
              navigation.navigate(
                "OrganizerEventForm",
                {
                  eventId: event.id,
                }
              )
            }
            disabled={completed}
            style={({ pressed }) => [
              styles.editButton,
              completed && styles.disabledButton,
              pressed && !completed && styles.pressed,
            ]}
          >
            <Ionicons
              name="create-outline"
              size={21}
              color={palette.white}
            />

            <Text style={styles.editText}>
              Edit Event
            </Text>
          </Pressable>

          <Pressable
            onPress={handleStatusChange}
            disabled={completed}
            style={({ pressed }) => [
              styles.statusButton,

              !cancelled &&
                !completed &&
                styles.cancelButton,

              completed &&
                styles.disabledButton,

              pressed &&
                !completed &&
                styles.pressed,
            ]}
          >
            <Ionicons
              name={
                completed
                  ? "checkmark-done-outline"
                  : cancelled || event.status === "draft"
                    ? "refresh-outline"
                    : "close-circle-outline"
              }
              size={21}
              color={
                completed
                  ? palette.secondary
                  : cancelled || event.status === "draft"
                    ? palette.purpleDark
                    : palette.danger
              }
            />

            <Text
              style={[
                styles.statusButtonText,

                !cancelled &&
                  !completed &&
                  styles.cancelButtonText,

                completed &&
                  styles.disabledButtonText,
              ]}
            >
              {completed
                ? "Completed"
                : cancelled
                  ? "Publish Again"
                  : event.status === "draft"
                    ? "Publish Event"
                  : "Cancel Event"}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="trash-outline"
            size={21}
            color={palette.danger}
          />

          <Text style={styles.deleteText}>
            Delete Event Permanently
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusBadge({
  status,
}: {
  status:
    | "draft"
    | "published"
    | "cancelled"
    | "completed";
}) {
  const stylesByStatus = {
    draft: {
      label: "Draft",
      foreground: palette.warning,
      background: palette.warningSoft,
    },

    published: {
      label: "Published",
      foreground: palette.success,
      background: palette.successSoft,
    },

    cancelled: {
      label: "Cancelled",
      foreground: palette.danger,
      background: palette.dangerSoft,
    },

    completed: {
      label: "Completed",
      foreground: palette.navy,
      background: "#E7E8FF",
    },
  };

  const selected = stylesByStatus[status];

  return (
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor: selected.background,
        },
      ]}
    >
      <View
        style={[
          styles.statusDot,
          {
            backgroundColor: selected.foreground,
          },
        ]}
      />

      <Text
        style={[
          styles.statusText,
          {
            color: selected.foreground,
          },
        ]}
      >
        {selected.label}
      </Text>
    </View>
  );
}

function InformationRow({
  icon,
  label,
  value,
  isLast = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        isLast && styles.lastRow,
      ]}
    >
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={21}
          color={palette.purpleDark}
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function StatCard({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "purple" | "green" | "red" | "orange";
}) {
  const tones = {
    purple: {
      foreground: palette.purpleDark,
      background: palette.purpleSoft,
    },

    green: {
      foreground: palette.success,
      background: palette.successSoft,
    },

    red: {
      foreground: palette.danger,
      background: palette.dangerSoft,
    },

    orange: {
      foreground: palette.warning,
      background: palette.warningSoft,
    },
  };

  const selected = tones[tone];

  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: selected.background,
        },
      ]}
    >
      <Text
        style={[
          styles.statValue,
          {
            color: selected.foreground,
          },
        ]}
      >
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.background,
  },

  errorText: {
    color: palette.danger,
    fontSize: 17,
    fontWeight: "800",
  },

  content: {
    padding: 18,
    paddingBottom: 35,
  },

  hero: {
    height: 205,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    backgroundColor: palette.navy,
  },

  heroIcon: {
    width: 94,
    height: 94,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 31,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  statusBadge: {
    position: "absolute",
    left: 16,
    bottom: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
    borderRadius: 20,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "900",
  },

  title: {
    marginTop: 22,
    color: palette.text,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "900",
  },

  organizer: {
    marginTop: 7,
    color: palette.secondary,
    fontSize: 14,
  },

  informationCard: {
    marginTop: 20,
    paddingHorizontal: 17,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  infoIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: palette.purpleSoft,
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoLabel: {
    color: palette.secondary,
    fontSize: 12,
    fontWeight: "600",
  },

  infoValue: {
    marginTop: 3,
    color: palette.text,
    fontSize: 14,
    fontWeight: "800",
  },

  participantHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 25,
  },

  sectionTitle: {
    marginTop: 24,
    color: palette.text,
    fontSize: 20,
    fontWeight: "900",
  },
  participantHeaderView: {
    flex: 1,
  },

  sectionSubtitle: {
    marginTop: 4,
    color: palette.secondary,
    fontSize: 12,
  },

  viewParticipantsLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 2,
    gap: 4,
  },

  viewParticipantsLinkText: {
    color: palette.purpleDark,
    fontSize: 12,
    fontWeight: "900",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 14,
  },

  statCard: {
    width: "48%",
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
  },

  statValue: {
    fontSize: 23,
    fontWeight: "900",
  },

  statLabel: {
    marginTop: 3,
    color: palette.secondary,
    fontSize: 12,
    fontWeight: "700",
  },

  participantsButton: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    paddingHorizontal: 18,
    gap: 9,
    borderRadius: 16,
    backgroundColor: palette.navy,
  },

  participantsButtonText: {
    flex: 1,
    color: palette.white,
    fontSize: 15,
    fontWeight: "900",
  },

  description: {
    marginTop: 10,
    color: palette.secondary,
    fontSize: 15,
    lineHeight: 24,
  },

  primaryActions: {
    flexDirection: "row",
    marginTop: 27,
    gap: 10,
  },

  editButton: {
    flex: 1,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 15,
    backgroundColor: palette.purpleDark,
  },

  editText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "900",
  },

  statusButton: {
    flex: 1,
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: palette.purpleDark,
    backgroundColor: palette.purpleSoft,
  },

  cancelButton: {
    borderColor: "#F2CACA",
    backgroundColor: palette.dangerSoft,
  },

  disabledButton: {
    borderColor: palette.border,
    backgroundColor: "#EFEFF3",
  },

  statusButtonText: {
    color: palette.purpleDark,
    fontSize: 13,
    fontWeight: "900",
  },

  cancelButtonText: {
    color: palette.danger,
  },

  disabledButtonText: {
    color: palette.secondary,
  },

  deleteButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 13,
    gap: 7,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#F2CACA",
    backgroundColor: "#FFF7F7",
  },

  deleteText: {
    color: palette.danger,
    fontSize: 14,
    fontWeight: "900",
  },

  pressed: {
    opacity: 0.8,
  },
});
