import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { EVENTS } from "../../data/events";
import { colors } from "../../theme/colors";

export default function OrganizerDashboardScreen() {
  const registrations = EVENTS.reduce(
    (total, event) =>
      total + event.registered,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>
          Organizer Dashboard
        </Text>

        <Text style={styles.subtitle}>
          Manage your campus events.
        </Text>

        <View style={styles.grid}>
          <StatCard
            title="Events"
            value={EVENTS.length.toString()}
            icon="calendar-outline"
          />

          <StatCard
            title="Registrations"
            value={registrations.toString()}
            icon="people-outline"
          />

          <StatCard
            title="Upcoming"
            value={EVENTS.length.toString()}
            icon="time-outline"
          />

          <StatCard
            title="Completed"
            value="0"
            icon="checkmark-circle-outline"
          />
        </View>

        <Text style={styles.sectionTitle}>
          Recent Events
        </Text>

        {EVENTS.slice(0, 3).map((event) => (
          <View
            key={event.id}
            style={styles.eventRow}
          >
            <View style={styles.eventIcon}>
              <Ionicons
                name="calendar-outline"
                size={23}
                color={colors.primary}
              />
            </View>

            <View style={styles.eventContent}>
              <Text
                style={styles.eventTitle}
                numberOfLines={1}
              >
                {event.title}
              </Text>

              <Text style={styles.eventMeta}>
                {event.registered} registrations
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}

function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Ionicons
          name={icon}
          size={22}
          color={colors.primary}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 18,
    paddingBottom: 30,
  },

  title: {
    marginTop: 8,
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 14,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 24,
  },

  statCard: {
    width: "48%",
    marginBottom: 14,
    padding: 16,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  statIcon: {
    width: 43,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },

  statValue: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "900",
  },

  statTitle: {
    marginTop: 3,
    color: colors.textSecondary,
    fontSize: 13,
  },

  sectionTitle: {
    marginTop: 16,
    marginBottom: 14,
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },

  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 14,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  eventIcon: {
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },

  eventContent: {
    flex: 1,
    marginLeft: 12,
  },

  eventTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },

  eventMeta: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 12,
  },
});