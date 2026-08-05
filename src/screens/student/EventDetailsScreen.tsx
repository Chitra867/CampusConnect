import {
  Alert,
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

import { EVENTS } from "../../data/events";

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
  const registeredEventIds =
    useRegistrationStore(
      (state) =>
        state.registeredEventIds
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

  const event = EVENTS.find(
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
    registeredEventIds.includes(event.id);

  const registeredCount =
    event.registered +
    (registered ? 1 : 0);

  const availableSeats = Math.max(
    event.capacity - registeredCount,
    0
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
              cancelRegistration(event.id);

              Alert.alert(
                "Registration Cancelled",
                "The event has been removed from My Events."
              );
            },
          },
        ]
      );

      return;
    }

    const result = registerEvent(event.id);

    if (result === "registered") {
      Alert.alert(
        "Registration Successful",
        `${event.title} has been added to My Events.`
      );

      return;
    }

    if (
      result === "already_registered"
    ) {
      Alert.alert(
        "Already Registered",
        "This event is already in My Events."
      );

      return;
    }

    if (result === "event_full") {
      Alert.alert(
        "Event Full",
        "No seats are currently available."
      );

      return;
    }

    Alert.alert(
      "Unable to Register",
      "The selected event could not be found."
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
        <View style={styles.poster}>
          <Ionicons
            name="calendar"
            size={78}
            color={colors.primary}
          />

          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {event.category}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>
          {event.title}
        </Text>

        <Text style={styles.organizer}>
          Organized by {event.organizerName}
        </Text>

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
                : "No seats available"
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
          onPress={handleRegistration}
          disabled={eventFull}
          style={({ pressed }) => [
            styles.registerButton,

            registered &&
              styles.cancelButton,

            eventFull &&
              styles.disabledButton,

            pressed &&
              !eventFull &&
              styles.pressed,
          ]}
        >
          <Ionicons
            name={
              registered
                ? "close-circle-outline"
                : eventFull
                  ? "ban-outline"
                  : "ticket-outline"
            }
            size={21}
            color={colors.white}
          />

          <Text style={styles.registerText}>
            {registered
              ? "Cancel Registration"
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
    height: 215,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 25,
    backgroundColor: colors.primarySoft,
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