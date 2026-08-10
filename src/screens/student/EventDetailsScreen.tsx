import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../store/authStore";
import { useEventStore } from "../../store/eventStore";
import { usePreferenceStore } from "../../store/preferenceStore";

import {
  useRegistrationStore,
} from "../../store/registrationStore";

import { colors } from "../../theme/colors";

import {
  StudentRootStackParamList,
} from "../../types";

type Props = NativeStackScreenProps<
  StudentRootStackParamList,
  "EventDetails"
>;

export default function EventDetailsScreen({
  route,
}: Props) {
  const user = useAuthStore(
    (state) => state.user
  );

  const events = useEventStore(
    (state) => state.events
  );

  const registrations =
    useRegistrationStore(
      (state) => state.registrations
    );

  const registerEvent =
    useRegistrationStore(
      (state) => state.registerEvent
    );

  const cancelRegistration =
    useRegistrationStore(
      (state) =>
        state.cancelRegistration
    );

  const preferencesByUser = usePreferenceStore(
    (state) => state.preferencesByUser
  );
  const bookmarkedEventIds = user
    ? preferencesByUser[user.id]?.bookmarkedEventIds ?? []
    : [];
  const reminderEventIds = user
    ? preferencesByUser[user.id]?.reminderEventIds ?? []
    : [];
  const toggleBookmark = usePreferenceStore((state) => state.toggleBookmark);
  const toggleReminder = usePreferenceStore((state) => state.toggleReminder);

  const event = events.find(
    (item) =>
      item.id === route.params.eventId
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

  const registered =
    Boolean(user) &&
    registrations.some(
      (registration) =>
        registration.eventId ===
          event.id &&
        registration.studentId ===
          user?.id &&
        registration.status ===
          "registered"
    );

  const localRegistrationCount =
    registrations.filter(
      (registration) =>
        registration.eventId ===
          event.id &&
        registration.status ===
          "registered"
    ).length;

  const registeredCount =
    event.registered +
    localRegistrationCount;

  const availableSeats = Math.max(
    event.capacity - registeredCount,
    0
  );

  const eventUnavailable =
    event.status !== "published";

  const registrationClosed = Boolean(
    event.registrationDeadline &&
      (() => {
        const deadline = new Date(event.registrationDeadline);
        if (Number.isNaN(deadline.getTime())) return false;
        const includesTime = /\d{1,2}:\d{2}|\b(?:am|pm)\b|T\d{2}/i.test(event.registrationDeadline);
        if (!includesTime) deadline.setHours(23, 59, 59, 999);
        return deadline.getTime() < Date.now();
      })()
  );

  const eventFull =
    availableSeats === 0 &&
    !registered;

  const handleRegistration = () => {
    if (registered) {
      Alert.alert(
        "Cancel Registration",
        `Do you want to cancel your registration for ${event.title}?`,
        [
          {
            text: "Keep Registration",
            style: "cancel",
          },
          {
            text: "Cancel Registration",
            style: "destructive",

            onPress: () => {
              const cancelled =
                cancelRegistration(
                  event.id
                );

              if (cancelled) {
                Alert.alert(
                  "Registration Cancelled",
                  `${event.title} has been removed from My Events.`
                );

                return;
              }

              Alert.alert(
                "Unable to Cancel",
                "The registration could not be found."
              );
            },
          },
        ]
      );

      return;
    }

    const result =
      registerEvent(event.id);

    switch (result) {
      case "registered":
        Alert.alert(
          "Registration Successful",
          `${event.title} has been added to My Events.`
        );
        return;

      case "already_registered":
        Alert.alert(
          "Already Registered",
          "This event is already in My Events."
        );
        return;

      case "event_full":
        Alert.alert(
          "Event Full",
          "No seats are currently available."
        );
        return;

      case "event_unavailable":
        Alert.alert(
          "Event Unavailable",
          "This event is not currently accepting registrations."
        );
        return;

      case "registration_closed":
        Alert.alert(
          "Registration Closed",
          "The registration deadline for this event has passed."
        );
        return;

      case "not_authenticated":
        Alert.alert(
          "Login Required",
          "Please log in before registering for an event."
        );
        return;

      case "student_only":
        Alert.alert(
          "Student Account Required",
          "Only student accounts can register for events."
        );
        return;

      case "event_not_found":
      default:
        Alert.alert(
          "Unable to Register",
          "The selected event could not be found."
        );
    }
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
        <ImageBackground
          source={event.posterUrl ? { uri: event.posterUrl } : undefined}
          imageStyle={styles.posterImage}
          style={styles.poster}
        >
          {event.posterUrl ? <View style={styles.posterOverlay} /> : null}
          <View style={styles.posterOrbLarge} />
          <View style={styles.posterOrbSmall} />
          <Ionicons
            name="sparkles"
            size={68}
            color={colors.white}
          />

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {event.category}
            </Text>
          </View>
        </ImageBackground>

        <Text style={styles.title}>
          {event.title}
        </Text>

        <Text style={styles.organizer}>
          Organized by {event.organizerName}
        </Text>

        <View style={styles.quickActions}>
          <Pressable
            onPress={() => toggleBookmark(event.id)}
            style={[
              styles.quickAction,
              bookmarkedEventIds.includes(event.id) && styles.activeQuickAction,
            ]}
          >
            <Ionicons
              name={bookmarkedEventIds.includes(event.id) ? "bookmark" : "bookmark-outline"}
              size={19}
              color={colors.primary}
            />
            <Text style={styles.quickActionText}>
              {bookmarkedEventIds.includes(event.id) ? "Saved" : "Save"}
            </Text>
          </Pressable>
          {registered ? (
            <Pressable
              onPress={() => toggleReminder(event.id)}
              style={[
                styles.quickAction,
                reminderEventIds.includes(event.id) && styles.activeQuickAction,
              ]}
            >
              <Ionicons
                name={reminderEventIds.includes(event.id) ? "notifications" : "notifications-outline"}
                size={19}
                color={colors.primary}
              />
              <Text style={styles.quickActionText}>
                {reminderEventIds.includes(event.id) ? "Reminder on" : "Remind me"}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {registered ? (
          <View style={styles.registeredBanner}>
            <Ionicons
              name="checkmark-circle"
              size={21}
              color={colors.success}
            />

            <Text style={styles.registeredText}>
              You are registered for this event
            </Text>
          </View>
        ) : null}

        {eventUnavailable ? (
          <View style={styles.cancelledBanner}>
            <Ionicons
              name="alert-circle"
              size={21}
              color={colors.danger}
            />

            <Text style={styles.cancelledText}>
              This event is {event.status}
            </Text>
          </View>
        ) : null}

        <View style={styles.informationCard}>
          <InformationRow
            icon="calendar-outline"
            label="Date"
            value={event.date}
          />

          <InformationRow
            icon="time-outline"
            label="Time"
            value={event.time}
          />

          <InformationRow
            icon="location-outline"
            label="Venue"
            value={event.venue}
          />

          <InformationRow
            icon="people-outline"
            label="Availability"
            value={
              availableSeats > 0
                ? `${availableSeats} of ${event.capacity} seats available`
                : "No seats currently available"
            }
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>
          About this event
        </Text>

        <Text style={styles.description}>
          {event.description}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            registered
              ? "Cancel event registration"
              : "Register for event"
          }
          onPress={handleRegistration}
          disabled={
            !registered &&
            (eventUnavailable ||
              registrationClosed ||
              eventFull)
          }
          style={({ pressed }) => [
            styles.registerButton,

            registered &&
              styles.cancelButton,

            !registered &&
              (eventUnavailable ||
                registrationClosed ||
                eventFull) &&
              styles.disabledButton,

            pressed &&
              styles.pressed,
          ]}
        >
          <Ionicons
            name={
              registered
                ? "close-circle-outline"
                : eventUnavailable ||
                    registrationClosed ||
                    eventFull
                  ? "ban-outline"
                  : "ticket-outline"
            }
            size={21}
            color={colors.white}
          />

          <Text style={styles.registerText}>
            {registered
              ? "Cancel Registration"
              : eventUnavailable
                ? "Event Unavailable"
                : registrationClosed
                  ? "Registration Closed"
                : eventFull
                  ? "Event Full"
                  : "Register for Event"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

interface InformationRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  isLast?: boolean;
}

function InformationRow({
  icon,
  label,
  value,
  isLast = false,
}: InformationRowProps) {
  return (
    <View
      style={[
        styles.informationRow,
        isLast && styles.lastRow,
      ]}
    >
      <View style={styles.informationIcon}>
        <Ionicons
          name={icon}
          size={21}
          color={colors.primary}
        />
      </View>

      <View style={styles.informationContent}>
        <Text style={styles.informationLabel}>
          {label}
        </Text>

        <Text style={styles.informationValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  errorText: {
    color: colors.danger,
    fontSize: 17,
    fontWeight: "700",
  },

  content: {
    padding: 18,
    paddingBottom: 35,
  },

  poster: {
    position: "relative",
    height: 215,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#33268F",
  },

  posterOrbLarge: {
    position: "absolute",
    top: -70,
    right: -35,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "#6755D9",
  },

  posterImage: {
    borderRadius: 25,
  },

  posterOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(23, 17, 75, 0.42)",
  },

  posterOrbSmall: {
    position: "absolute",
    bottom: -55,
    left: -20,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#4A3BB1",
  },

  categoryBadge: {
    position: "absolute",
    left: 16,
    bottom: 16,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },

  categoryText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
  },

  title: {
    marginTop: 22,
    color: colors.text,
    fontSize: 27,
    lineHeight: 34,
    fontWeight: "900",
  },

  organizer: {
    marginTop: 7,
    color: colors.textSecondary,
    fontSize: 14,
  },

  quickActions: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },

  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 7,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },

  activeQuickAction: {
    borderColor: "#CEC8FF",
    backgroundColor: colors.primarySoft,
  },

  quickActionText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  registeredBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 17,
    padding: 14,
    gap: 9,
    borderRadius: 14,
    backgroundColor: "#EAF8F2",
  },

  registeredText: {
    flex: 1,
    color: colors.success,
    fontSize: 14,
    fontWeight: "800",
  },

  cancelledBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    padding: 14,
    gap: 9,
    borderRadius: 14,
    backgroundColor: "#FFF1F1",
  },

  cancelledText: {
    flex: 1,
    color: colors.danger,
    fontSize: 14,
    fontWeight: "800",
    textTransform: "capitalize",
  },

  informationCard: {
    marginTop: 20,
    paddingHorizontal: 17,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  informationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  informationIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },

  informationContent: {
    flex: 1,
    marginLeft: 12,
  },

  informationLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  informationValue: {
    marginTop: 3,
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },

  sectionTitle: {
    marginTop: 24,
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },

  description: {
    marginTop: 10,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },

  registerButton: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    gap: 8,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },

  cancelButton: {
    backgroundColor: colors.danger,
  },

  disabledButton: {
    backgroundColor: colors.textSecondary,
  },

  registerText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.84,
  },
});
