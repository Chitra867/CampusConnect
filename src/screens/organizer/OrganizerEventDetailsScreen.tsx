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

import { useEventStore } from "../../store/eventStore";

import {
  useRegistrationStore,
} from "../../store/registrationStore";

import { colors } from "../../theme/colors";

import {
  OrganizerRootStackParamList,
} from "../../types";

type Props = NativeStackScreenProps<
  OrganizerRootStackParamList,
  "OrganizerEventDetails"
>;

export default function OrganizerEventDetailsScreen({
  navigation,
  route,
}: Props) {
  const events = useEventStore(
    (state) => state.events
  );

  const setEventStatus =
    useEventStore(
      (state) => state.setEventStatus
    );

  const deleteEvent = useEventStore(
    (state) => state.deleteEvent
  );

  const cancelRegistration =
    useRegistrationStore(
      (state) =>
        state.cancelRegistration
    );

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

  const cancelled =
    event.status === "cancelled";

  const handleStatusChange = () => {
    Alert.alert(
      cancelled
        ? "Publish Event"
        : "Cancel Event",
      cancelled
        ? "Make this event available to students again?"
        : "Students will no longer be able to register for this event.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: cancelled
            ? "Publish"
            : "Cancel Event",
          style: cancelled
            ? "default"
            : "destructive",
          onPress: () =>
            setEventStatus(
              event.id,
              cancelled
                ? "published"
                : "cancelled"
            ),
        },
      ]
    );
  };

  const handleDelete = () => {
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
            cancelRegistration(event.id);
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
        <View style={styles.poster}>
          <Ionicons
            name="calendar"
            size={78}
            color={colors.primary}
          />

          <View
            style={[
              styles.statusBadge,
              cancelled &&
                styles.cancelledBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                cancelled &&
                  styles.cancelledText,
              ]}
            >
              {event.status}
            </Text>
          </View>
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
            value={event.time}
          />

          <InformationRow
            icon="location-outline"
            label="Venue"
            value={event.venue}
          />

          <InformationRow
            icon="people-outline"
            label="Registration"
            value={`${event.registered} registered · ${event.capacity} capacity`}
            isLast
          />
        </View>

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
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name="create-outline"
              size={21}
              color={colors.white}
            />

            <Text style={styles.editText}>
              Edit Event
            </Text>
          </Pressable>

          <Pressable
            onPress={handleStatusChange}
            style={({ pressed }) => [
              styles.statusButton,
              !cancelled &&
                styles.cancelButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={
                cancelled
                  ? "refresh-outline"
                  : "close-circle-outline"
              }
              size={21}
              color={
                cancelled
                  ? colors.primary
                  : colors.danger
              }
            />

            <Text
              style={[
                styles.statusButtonText,
                !cancelled &&
                  styles.cancelButtonText,
              ]}
            >
              {cancelled
                ? "Publish Again"
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
            color={colors.danger}
          />

          <Text style={styles.deleteText}>
            Delete Event Permanently
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
        styles.infoRow,
        isLast && styles.lastRow,
      ]}
    >
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={21}
          color={colors.primary}
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
    fontWeight: "800",
  },

  content: {
    padding: 18,
    paddingBottom: 35,
  },

  poster: {
    height: 215,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    backgroundColor: colors.primarySoft,
  },

  statusBadge: {
    position: "absolute",
    left: 16,
    bottom: 16,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#EAF8F2",
  },

  cancelledBadge: {
    backgroundColor: "#FFF1F1",
  },

  statusText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "capitalize",
  },

  cancelledText: {
    color: colors.danger,
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

  informationCard: {
    marginTop: 20,
    paddingHorizontal: 17,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    backgroundColor: colors.primarySoft,
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },

  infoValue: {
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
    backgroundColor: colors.primary,
  },

  editText: {
    color: colors.white,
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
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },

  cancelButton: {
    borderColor: "#F2CACA",
    backgroundColor: "#FFF1F1",
  },

  statusButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
  },

  cancelButtonText: {
    color: colors.danger,
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
    color: colors.danger,
    fontSize: 14,
    fontWeight: "900",
  },

  pressed: {
    opacity: 0.8,
  },
});