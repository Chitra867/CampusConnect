import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  useNavigation,
} from "@react-navigation/native";

import {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { SafeAreaView } from "react-native-safe-area-context";
import EventFilters from "../../components/events/EventFilters";

import { useEventStore } from "../../store/eventStore";
import { useAuthStore } from "../../store/authStore";
import { useRegistrationStore } from "../../store/registrationStore";
import { getTotalRegistrationCount } from "../../utils/eventRules";
import { useEventFilters } from "../../hooks/useEventFilters";

import { colors } from "../../theme/colors";

import {
  CampusEvent,
  OrganizerRootStackParamList,
} from "../../types";

type NavigationProp =
  NativeStackNavigationProp<OrganizerRootStackParamList>;

export default function ManageEventsScreen() {
  const navigation =
    useNavigation<NavigationProp>();

  const user = useAuthStore((state) => state.user);
  const allEvents = useEventStore(
    (state) => state.events
  );
  const events = allEvents.filter((event) => event.createdBy === user?.id);

  const setEventStatus =
    useEventStore(
      (state) => state.setEventStatus
    );

  const registrationRecords = useRegistrationStore((state) => state.registrations);

  const {
    filter,
    filteredEvents,
    search,
    setFilter,
    setSearch,
    statusCounts,
  } = useEventFilters(events);

  const handleStatusChange = (
    event: CampusEvent
  ) => {
    const isCancelled =
      event.status === "cancelled";
    const isDraft = event.status === "draft";

    Alert.alert(
      isCancelled || isDraft
        ? "Publish Event"
        : "Cancel Event",
      isCancelled || isDraft
        ? `Publish ${event.title} again?`
        : `Cancel ${event.title}? Students will no longer be able to register.`,
      [
        {
          text: "Keep Current Status",
          style: "cancel",
        },
        {
          text: isCancelled || isDraft
            ? "Publish"
            : "Cancel Event",
          style: isCancelled || isDraft
            ? "default"
            : "destructive",
          onPress: () =>
            setEventStatus(
              event.id,
              isCancelled || isDraft
                ? "published"
                : "cancelled"
            ),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.title}>
                  Manage Events
                </Text>

                <Text style={styles.subtitle}>
                  Create, edit and monitor your
                  events.
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  navigation.navigate(
                    "OrganizerEventForm"
                  )
                }
                style={({ pressed }) => [
                  styles.addButton,
                  pressed && styles.pressed,
                ]}
              >
                <Ionicons
                  name="add"
                  size={29}
                  color={colors.white}
                />
              </Pressable>
            </View>

            <EventFilters
              search={search}
              selected={filter}
              counts={statusCounts}
              onSearchChange={setSearch}
              onFilterChange={setFilter}
            />

            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>
                Event List
              </Text>

              <Text style={styles.resultCount}>
                {filteredEvents.length} results
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => {
          const registrations = getTotalRegistrationCount(item, registrationRecords);

          return (
            <OrganizerEventCard
              event={item}
              registrations={registrations}
              onView={() =>
                navigation.navigate(
                  "OrganizerEventDetails",
                  {
                    eventId: item.id,
                  }
                )
              }
              onEdit={() =>
                navigation.navigate(
                  "OrganizerEventForm",
                  {
                    eventId: item.id,
                  }
                )
              }
              onStatusChange={() =>
                handleStatusChange(item)
              }
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="calendar-outline"
                size={53}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No matching events
            </Text>

            <Text style={styles.emptyDescription}>
              Change the search or filter, or create
              a new campus event.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

interface OrganizerEventCardProps {
  event: CampusEvent;
  registrations: number;
  onView: () => void;
  onEdit: () => void;
  onStatusChange: () => void;
}

function OrganizerEventCard({
  event,
  registrations,
  onView,
  onEdit,
  onStatusChange,
}: OrganizerEventCardProps) {
  const cancelled =
    event.status === "cancelled";
  const draft = event.status === "draft";
  const completed = event.status === "completed";

  const percentage = Math.min(
    100,
    Math.round(
      (registrations /
        Math.max(event.capacity, 1)) *
        100
    )
  );

  return (
    <View style={styles.eventCard}>
      <Pressable
        onPress={onView}
        style={({ pressed }) => [
          styles.eventMain,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.eventIcon}>
            <Ionicons
              name="calendar"
              size={29}
              color={colors.primary}
            />
          </View>

          <View style={styles.eventHeading}>
            <Text
              style={styles.eventTitle}
              numberOfLines={2}
            >
              {event.title}
            </Text>

            <Text style={styles.eventCategory}>
              {event.category}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              cancelled &&
                styles.cancelledBadge,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                cancelled &&
                  styles.cancelledDot,
              ]}
            />

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

        <View style={styles.informationGrid}>
          <InformationItem
            icon="calendar-outline"
            label={event.date}
          />

          <InformationItem
            icon="time-outline"
            label={event.time}
          />

          <InformationItem
            icon="location-outline"
            label={event.venue}
          />
        </View>

        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>
            Registration progress
          </Text>

          <Text style={styles.progressValue}>
            {registrations}/{event.capacity}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width:
                  `${percentage}%` as `${number}%`,
              },
            ]}
          />
        </View>
      </Pressable>

      <View style={styles.actions}>
        <ActionButton
          label="View"
          icon="eye-outline"
          onPress={onView}
        />

        {!completed ? (
          <ActionButton
            label="Edit"
            icon="create-outline"
            onPress={onEdit}
          />
        ) : null}

        {!completed ? (
          <ActionButton
            label={cancelled || draft ? "Publish" : "Cancel"}
            icon={cancelled || draft ? "refresh-outline" : "close-circle-outline"}
            danger={!cancelled && !draft}
            onPress={onStatusChange}
          />
        ) : null}
      </View>
    </View>
  );
}

function InformationItem({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.informationItem}>
      <Ionicons
        name={icon}
        size={16}
        color={colors.primary}
      />

      <Text
        style={styles.informationText}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

function ActionButton({
  label,
  icon,
  danger = false,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  danger?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={18}
        color={
          danger
            ? colors.danger
            : colors.primary
        }
      />

      <Text
        style={[
          styles.actionText,
          danger && styles.dangerText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 20,
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 5,
    color: colors.textSecondary,
    fontSize: 14,
  },

  addButton: {
    width: 51,
    height: 51,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: colors.primary,
  },

  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  resultTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },

  resultCount: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  eventCard: {
    marginBottom: 15,
    overflow: "hidden",
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  eventMain: {
    padding: 16,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  eventIcon: {
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
  },

  eventHeading: {
    flex: 1,
    marginLeft: 12,
  },

  eventTitle: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
  },

  eventCategory: {
    marginTop: 5,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 5,
    borderRadius: 11,
    backgroundColor: "#EAF8F2",
  },

  cancelledBadge: {
    backgroundColor: "#FFF1F1",
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },

  cancelledDot: {
    backgroundColor: colors.danger,
  },

  statusText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "capitalize",
  },

  cancelledText: {
    color: colors.danger,
  },

  informationGrid: {
    marginTop: 16,
    gap: 9,
  },

  informationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  informationText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },

  progressTitle: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },

  progressValue: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },

  progressTrack: {
    height: 7,
    marginTop: 8,
    overflow: "hidden",
    borderRadius: 5,
    backgroundColor: colors.primarySoft,
  },

  progressFill: {
    height: "100%",
    borderRadius: 5,
    backgroundColor: colors.primary,
  },

  actions: {
    flexDirection: "row",
    minHeight: 55,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  actionText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },

  dangerText: {
    color: colors.danger,
  },

  emptyContainer: {
    alignItems: "center",
    paddingTop: 65,
    paddingHorizontal: 28,
  },

  emptyIcon: {
    width: 94,
    height: 94,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 31,
    backgroundColor: colors.primarySoft,
  },

  emptyTitle: {
    marginTop: 18,
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },

  emptyDescription: {
    marginTop: 8,
    color: colors.textSecondary,
    lineHeight: 21,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.78,
  },
});
