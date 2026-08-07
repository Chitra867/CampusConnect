import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useMemo, useState } from "react";

import { Ionicons } from "@expo/vector-icons";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { SafeAreaView } from "react-native-safe-area-context";

import { useEventStore } from "../../store/eventStore";
import { useRegistrationStore } from "../../store/registrationStore";

import {
  AttendanceStatus,
  EventRegistration,
  OrganizerRootStackParamList,
} from "../../types";

type Props = NativeStackScreenProps<
  OrganizerRootStackParamList,
  "OrganizerParticipants"
>;

type ParticipantFilter =
  | "all"
  | "registered"
  | "pending"
  | "attended"
  | "absent"
  | "cancelled";

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
  blue: "#3478C9",
  blueSoft: "#EAF4FF",
  white: "#FFFFFF",
};

export default function EventParticipantsScreen({
  route,
}: Props) {
  const { eventId } = route.params;

  const event = useEventStore((state) =>
    state.events.find((item) => item.id === eventId)
  );

  const registrations = useRegistrationStore(
    (state) => state.registrations
  );

  const markAttendance = useRegistrationStore(
    (state) => state.markAttendance
  );

  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<ParticipantFilter>("all");

  const eventRegistrations = useMemo(() => {
    return registrations
      .filter(
        (registration) =>
          registration.eventId === eventId
      )
      .sort((first, second) => {
        if (
          first.status !== second.status
        ) {
          return first.status === "registered"
            ? -1
            : 1;
        }

        return (
          new Date(second.registeredAt).getTime() -
          new Date(first.registeredAt).getTime()
        );
      });
  }, [eventId, registrations]);

  const counts = useMemo(() => {
    const active = eventRegistrations.filter(
      (registration) =>
        registration.status === "registered"
    );

    return {
      all: eventRegistrations.length,

      registered: active.length,

      pending: active.filter(
        (registration) =>
          registration.attendanceStatus === "pending"
      ).length,

      attended: active.filter(
        (registration) =>
          registration.attendanceStatus === "attended"
      ).length,

      absent: active.filter(
        (registration) =>
          registration.attendanceStatus === "absent"
      ).length,

      cancelled: eventRegistrations.filter(
        (registration) =>
          registration.status === "cancelled"
      ).length,
    };
  }, [eventRegistrations]);

  const filteredParticipants = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return eventRegistrations.filter(
      (registration) => {
        const matchesSearch =
          !query ||
          registration.studentName
            .toLowerCase()
            .includes(query) ||
          registration.studentEmail
            .toLowerCase()
            .includes(query) ||
          registration.collegeId
            .toLowerCase()
            .includes(query) ||
          registration.program
            .toLowerCase()
            .includes(query);

        let matchesFilter = true;

        switch (filter) {
          case "registered":
            matchesFilter =
              registration.status === "registered";
            break;

          case "cancelled":
            matchesFilter =
              registration.status === "cancelled";
            break;

          case "pending":
          case "attended":
          case "absent":
            matchesFilter =
              registration.status === "registered" &&
              registration.attendanceStatus === filter;
            break;

          case "all":
          default:
            matchesFilter = true;
        }

        return matchesSearch && matchesFilter;
      }
    );
  }, [eventRegistrations, filter, search]);

  const handleAttendance = (
    registrationId: string,
    attendanceStatus: AttendanceStatus
  ) => {
    const updated = markAttendance(
      registrationId,
      attendanceStatus
    );

    if (!updated) {
      Alert.alert(
        "Unable to Update",
        "The participant attendance could not be updated."
      );
    }
  };

  if (!event) {
    return (
      <SafeAreaView style={styles.center}>
        <Ionicons
          name="alert-circle-outline"
          size={55}
          color={palette.danger}
        />

        <Text style={styles.errorTitle}>
          Event not found
        </Text>

        <Text style={styles.errorText}>
          The selected event may have been deleted.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["bottom"]}
    >
      <FlatList
        data={filteredParticipants}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.eventHeader}>
              <View style={styles.eventIcon}>
                <Ionicons
                  name="people"
                  size={31}
                  color={palette.purpleDark}
                />
              </View>

              <View style={styles.eventHeaderContent}>
                <Text
                  style={styles.eventTitle}
                  numberOfLines={2}
                >
                  {event.title}
                </Text>

                <Text
                  style={styles.eventMeta}
                  numberOfLines={1}
                >
                  {event.date} • {event.venue}
                </Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <SummaryCard
                label="Active"
                value={counts.registered}
                icon="people-outline"
                tone="purple"
              />

              <SummaryCard
                label="Attended"
                value={counts.attended}
                icon="checkmark-circle-outline"
                tone="green"
              />

              <SummaryCard
                label="Absent"
                value={counts.absent}
                icon="close-circle-outline"
                tone="red"
              />

              <SummaryCard
                label="Pending"
                value={counts.pending}
                icon="time-outline"
                tone="orange"
              />
            </View>

            <View style={styles.searchBox}>
              <Ionicons
                name="search-outline"
                size={21}
                color={palette.secondary}
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search name, ID, email or program..."
                placeholderTextColor={palette.secondary}
                autoCorrect={false}
                style={styles.searchInput}
              />

              {search.length > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear participant search"
                  onPress={() => setSearch("")}
                  hitSlop={10}
                >
                  <Ionicons
                    name="close-circle"
                    size={21}
                    color={palette.secondary}
                  />
                </Pressable>
              ) : null}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              <FilterButton
                label="All"
                count={counts.all}
                selected={filter === "all"}
                onPress={() => setFilter("all")}
              />

              <FilterButton
                label="Active"
                count={counts.registered}
                selected={filter === "registered"}
                onPress={() =>
                  setFilter("registered")
                }
              />

              <FilterButton
                label="Pending"
                count={counts.pending}
                selected={filter === "pending"}
                onPress={() => setFilter("pending")}
              />

              <FilterButton
                label="Attended"
                count={counts.attended}
                selected={filter === "attended"}
                onPress={() => setFilter("attended")}
              />

              <FilterButton
                label="Absent"
                count={counts.absent}
                selected={filter === "absent"}
                onPress={() => setFilter("absent")}
              />

              <FilterButton
                label="Cancelled"
                count={counts.cancelled}
                selected={filter === "cancelled"}
                onPress={() =>
                  setFilter("cancelled")
                }
              />
            </ScrollView>

            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>
                Participants
              </Text>

              <Text style={styles.resultCount}>
                {filteredParticipants.length}{" "}
                {filteredParticipants.length === 1
                  ? "result"
                  : "results"}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <ParticipantCard
            participant={item}
            onMarkPending={() =>
              handleAttendance(item.id, "pending")
            }
            onMarkAttended={() =>
              handleAttendance(item.id, "attended")
            }
            onMarkAbsent={() =>
              handleAttendance(item.id, "absent")
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="people-outline"
                size={54}
                color={palette.purpleDark}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No participants found
            </Text>

            <Text style={styles.emptyDescription}>
              {eventRegistrations.length === 0
                ? "Students who register for this event will appear here."
                : "Change the search text or attendance filter."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  tone: "purple" | "green" | "red" | "orange";
}

function SummaryCard({
  label,
  value,
  icon,
  tone,
}: SummaryCardProps) {
  const tones = {
    purple: {
      background: palette.purpleSoft,
      foreground: palette.purpleDark,
    },

    green: {
      background: palette.successSoft,
      foreground: palette.success,
    },

    red: {
      background: palette.dangerSoft,
      foreground: palette.danger,
    },

    orange: {
      background: palette.warningSoft,
      foreground: palette.warning,
    },
  };

  const selectedTone = tones[tone];

  return (
    <View style={styles.summaryCard}>
      <View
        style={[
          styles.summaryIcon,
          {
            backgroundColor: selectedTone.background,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={selectedTone.foreground}
        />
      </View>

      <Text style={styles.summaryValue}>
        {value}
      </Text>

      <Text style={styles.summaryLabel}>
        {label}
      </Text>
    </View>
  );
}

interface FilterButtonProps {
  label: string;
  count: number;
  selected: boolean;
  onPress: () => void;
}

function FilterButton({
  label,
  count,
  selected,
  onPress,
}: FilterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterButton,
        selected && styles.selectedFilter,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          selected && styles.selectedFilterText,
        ]}
      >
        {label}
      </Text>

      <View
        style={[
          styles.filterCount,
          selected && styles.selectedFilterCount,
        ]}
      >
        <Text
          style={[
            styles.filterCountText,
            selected &&
              styles.selectedFilterCountText,
          ]}
        >
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

interface ParticipantCardProps {
  participant: EventRegistration;
  onMarkPending: () => void;
  onMarkAttended: () => void;
  onMarkAbsent: () => void;
}

function ParticipantCard({
  participant,
  onMarkPending,
  onMarkAttended,
  onMarkAbsent,
}: ParticipantCardProps) {
  const cancelled =
    participant.status === "cancelled";

  const initials = participant.studentName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const registrationDate = formatDateTime(
    participant.registeredAt
  );

  return (
    <View style={styles.participantCard}>
      <View style={styles.participantHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initials || "ST"}
          </Text>
        </View>

        <View style={styles.participantMain}>
          <Text
            style={styles.participantName}
            numberOfLines={1}
          >
            {participant.studentName}
          </Text>

          <Text
            style={styles.participantId}
            numberOfLines={1}
          >
            {participant.collegeId || "No college ID"}
          </Text>
        </View>

        <StatusBadge participant={participant} />
      </View>

      <View style={styles.participantInformation}>
        <InformationRow
          icon="mail-outline"
          value={participant.studentEmail}
        />

        <InformationRow
          icon="school-outline"
          value={formatAcademicDetails(participant)}
        />

        <InformationRow
          icon="calendar-outline"
          value={`Registered ${registrationDate}`}
        />
      </View>

      {cancelled ? (
        <View style={styles.cancelledMessage}>
          <Ionicons
            name="information-circle-outline"
            size={19}
            color={palette.danger}
          />

          <Text style={styles.cancelledMessageText}>
            This student cancelled the registration.
          </Text>
        </View>
      ) : (
        <View style={styles.attendanceActions}>
          <AttendanceButton
            label="Pending"
            icon="time-outline"
            selected={
              participant.attendanceStatus === "pending"
            }
            tone="pending"
            onPress={onMarkPending}
          />

          <AttendanceButton
            label="Attended"
            icon="checkmark-circle-outline"
            selected={
              participant.attendanceStatus ===
              "attended"
            }
            tone="attended"
            onPress={onMarkAttended}
          />

          <AttendanceButton
            label="Absent"
            icon="close-circle-outline"
            selected={
              participant.attendanceStatus === "absent"
            }
            tone="absent"
            onPress={onMarkAbsent}
          />
        </View>
      )}
    </View>
  );
}

function StatusBadge({
  participant,
}: {
  participant: EventRegistration;
}) {
  if (participant.status === "cancelled") {
    return (
      <View
        style={[
          styles.statusBadge,
          styles.cancelledBadge,
        ]}
      >
        <Ionicons
          name="close-circle"
          size={14}
          color={palette.danger}
        />

        <Text
          style={[
            styles.statusText,
            styles.cancelledStatusText,
          ]}
        >
          Cancelled
        </Text>
      </View>
    );
  }

  const attendanceStyles = {
    pending: {
      label: "Pending",
      icon: "time" as const,
      foreground: palette.warning,
      background: palette.warningSoft,
    },

    attended: {
      label: "Attended",
      icon: "checkmark-circle" as const,
      foreground: palette.success,
      background: palette.successSoft,
    },

    absent: {
      label: "Absent",
      icon: "close-circle" as const,
      foreground: palette.danger,
      background: palette.dangerSoft,
    },
  };

  const selected =
    attendanceStyles[
      participant.attendanceStatus
    ];

  return (
    <View
      style={[
        styles.statusBadge,
        {
          backgroundColor: selected.background,
        },
      ]}
    >
      <Ionicons
        name={selected.icon}
        size={14}
        color={selected.foreground}
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
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
}) {
  return (
    <View style={styles.informationRow}>
      <Ionicons
        name={icon}
        size={17}
        color={palette.purpleDark}
      />

      <Text
        style={styles.informationText}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

interface AttendanceButtonProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  tone: "pending" | "attended" | "absent";
  onPress: () => void;
}

function AttendanceButton({
  label,
  icon,
  selected,
  tone,
  onPress,
}: AttendanceButtonProps) {
  const tones = {
    pending: {
      foreground: palette.warning,
      background: palette.warningSoft,
      border: "#ECD39B",
    },

    attended: {
      foreground: palette.success,
      background: palette.successSoft,
      border: "#A9DDC8",
    },

    absent: {
      foreground: palette.danger,
      background: palette.dangerSoft,
      border: "#F1BCC1",
    },
  };

  const selectedTone = tones[tone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.attendanceButton,

        selected && {
          borderColor: selectedTone.border,
          backgroundColor: selectedTone.background,
        },

        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={17}
        color={
          selected
            ? selectedTone.foreground
            : palette.secondary
        }
      />

      <Text
        style={[
          styles.attendanceButtonText,

          selected && {
            color: selectedTone.foreground,
          },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function formatAcademicDetails(
  participant: EventRegistration
): string {
  const parts = [];

  if (participant.program) {
    parts.push(participant.program);
  }

  if (participant.semester !== null) {
    parts.push(
      `Semester ${participant.semester}`
    );
  }

  return parts.length > 0
    ? parts.join(" • ")
    : "Academic details unavailable";
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "date unavailable";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
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
    paddingHorizontal: 30,
    backgroundColor: palette.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 35,
  },

  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 18,
    borderRadius: 21,
    backgroundColor: palette.navy,
  },

  eventIcon: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: palette.white,
  },

  eventHeaderContent: {
    flex: 1,
    marginLeft: 14,
  },

  eventTitle: {
    color: palette.white,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: "900",
  },

  eventMeta: {
    marginTop: 6,
    color: "#D8D9F6",
    fontSize: 12,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },

  summaryCard: {
    width: "48%",
    marginBottom: 13,
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },

  summaryIcon: {
    width: 41,
    height: 41,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },

  summaryValue: {
    marginTop: 11,
    color: palette.text,
    fontSize: 23,
    fontWeight: "900",
  },

  summaryLabel: {
    marginTop: 2,
    color: palette.secondary,
    fontSize: 12,
    fontWeight: "700",
  },

  searchBox: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    paddingHorizontal: 15,
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },

  searchInput: {
    flex: 1,
    color: palette.text,
    fontSize: 14,
  },

  filters: {
    paddingTop: 15,
    paddingBottom: 20,
    gap: 9,
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    paddingVertical: 10,
    gap: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },

  selectedFilter: {
    borderColor: palette.purpleDark,
    backgroundColor: palette.purpleDark,
  },

  filterText: {
    color: palette.secondary,
    fontSize: 12,
    fontWeight: "800",
  },

  selectedFilterText: {
    color: palette.white,
  },

  filterCount: {
    minWidth: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: palette.purpleSoft,
  },

  selectedFilterCount: {
    backgroundColor: "rgba(255,255,255,0.20)",
  },

  filterCountText: {
    color: palette.purpleDark,
    fontSize: 10,
    fontWeight: "900",
  },

  selectedFilterCountText: {
    color: palette.white,
  },

  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  resultTitle: {
    color: palette.text,
    fontSize: 20,
    fontWeight: "900",
  },

  resultCount: {
    color: palette.secondary,
    fontSize: 12,
  },

  participantCard: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },

  participantHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: palette.purpleSoft,
  },

  avatarText: {
    color: palette.purpleDark,
    fontSize: 16,
    fontWeight: "900",
  },

  participantMain: {
    flex: 1,
    marginHorizontal: 11,
  },

  participantName: {
    color: palette.text,
    fontSize: 16,
    fontWeight: "900",
  },

  participantId: {
    marginTop: 4,
    color: palette.secondary,
    fontSize: 12,
    fontWeight: "700",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 6,
    gap: 4,
    borderRadius: 11,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "900",
  },

  cancelledBadge: {
    backgroundColor: palette.dangerSoft,
  },

  cancelledStatusText: {
    color: palette.danger,
  },

  participantInformation: {
    marginTop: 15,
    paddingTop: 13,
    gap: 9,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },

  informationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  informationText: {
    flex: 1,
    color: palette.secondary,
    fontSize: 12,
  },

  attendanceActions: {
    flexDirection: "row",
    marginTop: 16,
    gap: 7,
  },

  attendanceButton: {
    flex: 1,
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    gap: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: palette.surface,
  },

  attendanceButtonText: {
    color: palette.secondary,
    fontSize: 10,
    fontWeight: "900",
  },

  cancelledMessage: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    padding: 12,
    gap: 7,
    borderRadius: 12,
    backgroundColor: palette.dangerSoft,
  },

  cancelledMessageText: {
    flex: 1,
    color: palette.danger,
    fontSize: 11,
    fontWeight: "700",
  },

  emptyContainer: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 28,
  },

  emptyIcon: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 31,
    backgroundColor: palette.purpleSoft,
  },

  emptyTitle: {
    marginTop: 18,
    color: palette.text,
    fontSize: 20,
    fontWeight: "900",
  },

  emptyDescription: {
    marginTop: 8,
    color: palette.secondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  errorTitle: {
    marginTop: 16,
    color: palette.text,
    fontSize: 20,
    fontWeight: "900",
  },

  errorText: {
    marginTop: 7,
    color: palette.secondary,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.78,
  },
});