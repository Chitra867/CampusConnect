import {
  Pressable,
  ScrollView,
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

import { useAuthStore } from "../../store/authStore";
import { useEventStore } from "../../store/eventStore";
import { useRegistrationStore } from "../../store/registrationStore";
import { getTotalRegistrationCount } from "../../utils/eventRules";

import { colors } from "../../theme/colors";

import {
  CampusEvent,
  OrganizerRootStackParamList,
} from "../../types";

type NavigationProp =
  NativeStackNavigationProp<OrganizerRootStackParamList>;

export default function OrganizerDashboardScreen() {
  const navigation =
    useNavigation<NavigationProp>();

  const user = useAuthStore(
    (state) => state.user
  );

  const allEvents = useEventStore(
    (state) => state.events
  );
  const events = allEvents.filter((event) => event.createdBy === user?.id);

  const registrations =
    useRegistrationStore(
      (state) => state.registrations
    );

  const totalRegistrations = events.reduce(
    (total, event) => total + getTotalRegistrationCount(event, registrations),
    0
  );

  const publishedEvents = events.filter(
    (event) => event.status === "published"
  );

  const cancelledEvents = events.filter(
    (event) => event.status === "cancelled"
  );

  const recentEvents = [...events]
    .sort(
      (first, second) =>
        new Date(second.updatedAt).getTime() -
        new Date(first.updatedAt).getTime()
    )
    .slice(0, 4);

  const getRegistrationCount = (
    event: CampusEvent
  ) => {
    return getTotalRegistrationCount(event, registrations);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
              Welcome back
            </Text>

            <Text style={styles.organizerName}>
              {user?.fullName}
            </Text>

            <View style={styles.roleRow}>
              <Ionicons
                name="shield-checkmark"
                size={15}
                color={colors.primary}
              />

              <Text style={styles.roleText}>
                Event Organizer
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() =>
              navigation.navigate(
                "OrganizerEventForm"
              )
            }
            style={({ pressed }) => [
              styles.createIconButton,
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

        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>
              CAMPUSCONNECT ORGANIZER
            </Text>

            <Text style={styles.heroTitle}>
              Create memorable campus events
            </Text>

            <Text style={styles.heroDescription}>
              Plan events, track registrations and
              manage attendance from one place.
            </Text>

            <Pressable
              onPress={() =>
                navigation.navigate(
                  "OrganizerEventForm"
                )
              }
              style={({ pressed }) => [
                styles.heroButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color={colors.primary}
              />

              <Text style={styles.heroButtonText}>
                Create New Event
              </Text>
            </Pressable>
          </View>

          <View style={styles.heroIcon}>
            <Ionicons
              name="megaphone"
              size={52}
              color={colors.white}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Overview
        </Text>

        <View style={styles.statsGrid}>
          <StatCard
            title="Total Events"
            value={events.length.toString()}
            icon="calendar-outline"
            tone="purple"
          />

          <StatCard
            title="Registrations"
            value={totalRegistrations.toString()}
            icon="people-outline"
            tone="blue"
          />

          <StatCard
            title="Published"
            value={publishedEvents.length.toString()}
            icon="checkmark-circle-outline"
            tone="green"
          />

          <StatCard
            title="Cancelled"
            value={cancelledEvents.length.toString()}
            icon="close-circle-outline"
            tone="red"
          />
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Recent Events
            </Text>

            <Text style={styles.sectionSubtitle}>
              Latest event activity
            </Text>
          </View>
        </View>

        {recentEvents.length > 0 ? (
          recentEvents.map((event) => {
            const registrations =
              getRegistrationCount(event);

            const percentage = Math.min(
              100,
              Math.round(
                (registrations /
                  Math.max(event.capacity, 1)) *
                  100
              )
            );

            return (
              <Pressable
                key={event.id}
                onPress={() =>
                  navigation.navigate(
                    "OrganizerEventDetails",
                    {
                      eventId: event.id,
                    }
                  )
                }
                style={({ pressed }) => [
                  styles.eventCard,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.eventTopRow}>
                  <View style={styles.eventIcon}>
                    <Ionicons
                      name="calendar"
                      size={27}
                      color={colors.primary}
                    />
                  </View>

                  <View style={styles.eventMain}>
                    <Text
                      style={styles.eventTitle}
                      numberOfLines={1}
                    >
                      {event.title}
                    </Text>

                    <View style={styles.eventMetaRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color={
                          colors.textSecondary
                        }
                      />

                      <Text style={styles.eventMeta}>
                        {event.date}
                      </Text>
                    </View>
                  </View>

                  <StatusBadge
                    status={event.status}
                  />
                </View>

                <View style={styles.locationRow}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={colors.primary}
                  />

                  <Text
                    style={styles.locationText}
                    numberOfLines={1}
                  >
                    {event.venue}
                  </Text>
                </View>

                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>
                    {registrations} registrations
                  </Text>

                  <Text style={styles.progressValue}>
                    {percentage}%
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

                <View style={styles.cardFooter}>
                  <Text style={styles.capacityText}>
                    {event.capacity - registrations >
                    0
                      ? `${
                          event.capacity -
                          registrations
                        } seats remaining`
                      : "Event capacity reached"}
                  </Text>

                  <View style={styles.viewButton}>
                    <Text style={styles.viewText}>
                      View
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color={colors.primary}
                    />
                  </View>
                </View>
              </Pressable>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons
              name="calendar-outline"
              size={50}
              color={colors.primary}
            />

            <Text style={styles.emptyTitle}>
              No events yet
            </Text>

            <Text style={styles.emptyDescription}>
              Create your first campus event to
              begin.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone: "purple" | "blue" | "green" | "red";
}

function StatCard({
  title,
  value,
  icon,
  tone,
}: StatCardProps) {
  const toneStyles = {
    purple: {
      backgroundColor: "#EFEDFF",
      color: colors.primary,
    },
    blue: {
      backgroundColor: "#EAF4FF",
      color: "#3478C9",
    },
    green: {
      backgroundColor: "#EAF8F2",
      color: colors.success,
    },
    red: {
      backgroundColor: "#FFF1F1",
      color: colors.danger,
    },
  };

  const selectedTone = toneStyles[tone];

  return (
    <View style={styles.statCard}>
      <View
        style={[
          styles.statIcon,
          {
            backgroundColor:
              selectedTone.backgroundColor,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={23}
          color={selectedTone.color}
        />
      </View>

      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statTitle}>
        {title}
      </Text>
    </View>
  );
}

function StatusBadge({
  status,
}: {
  status: CampusEvent["status"];
}) {
  const cancelled = status === "cancelled";
  const completed = status === "completed";

  return (
    <View
      style={[
        styles.statusBadge,
        cancelled && styles.cancelledBadge,
        completed && styles.completedBadge,
      ]}
    >
      <View
        style={[
          styles.statusDot,
          cancelled && styles.cancelledDot,
          completed && styles.completedDot,
        ]}
      />

      <Text
        style={[
          styles.statusText,
          cancelled && styles.cancelledText,
          completed && styles.completedText,
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 18,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },

  headerText: {
    flex: 1,
  },

  greeting: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  organizerName: {
    marginTop: 2,
    color: colors.text,
    fontSize: 25,
    fontWeight: "900",
  },

  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 5,
  },

  roleText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  createIconButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: colors.primary,
  },

  heroCard: {
    minHeight: 205,
    flexDirection: "row",
    alignItems: "center",
    padding: 22,
    borderRadius: 26,
    backgroundColor: colors.primary,
  },

  heroContent: {
    flex: 1,
    paddingRight: 12,
  },

  heroLabel: {
    color: "#D9D4FF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  heroTitle: {
    marginTop: 8,
    color: colors.white,
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "900",
  },

  heroDescription: {
    marginTop: 8,
    color: "#EAE7FF",
    fontSize: 13,
    lineHeight: 19,
  },

  heroButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 17,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 6,
    borderRadius: 13,
    backgroundColor: colors.white,
  },

  heroButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
  },

  heroIcon: {
    width: 83,
    height: 83,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.16)",
  },

  sectionTitle: {
    marginTop: 25,
    color: colors.text,
    fontSize: 21,
    fontWeight: "900",
  },

  sectionSubtitle: {
    marginTop: 3,
    color: colors.textSecondary,
    fontSize: 13,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 14,
  },

  statCard: {
    width: "48%",
    marginBottom: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  statIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
    borderRadius: 14,
  },

  statValue: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
  },

  statTitle: {
    marginTop: 3,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },

  eventCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  eventTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  eventIcon: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: colors.primarySoft,
  },

  eventMain: {
    flex: 1,
    marginLeft: 12,
  },

  eventTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },

  eventMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 5,
  },

  eventMeta: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 6,
    gap: 5,
    borderRadius: 12,
    backgroundColor: "#EAF8F2",
  },

  cancelledBadge: {
    backgroundColor: "#FFF1F1",
  },

  completedBadge: {
    backgroundColor: "#EAF4FF",
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

  completedDot: {
    backgroundColor: "#3478C9",
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

  completedText: {
    color: "#3478C9",
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    gap: 6,
  },

  locationText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  progressLabel: {
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

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },

  capacityText: {
    color: colors.textSecondary,
    fontSize: 12,
  },

  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  viewText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
  },

  emptyCard: {
    alignItems: "center",
    marginTop: 14,
    padding: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  emptyTitle: {
    marginTop: 14,
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },

  emptyDescription: {
    marginTop: 6,
    color: colors.textSecondary,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.8,
  },
});
