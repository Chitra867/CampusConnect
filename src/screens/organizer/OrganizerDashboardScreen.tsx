import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";

export default function OrganizerDashboardScreen() {
  const user = useAuthStore(
    (state) => state.user
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>
          Welcome
        </Text>

        <Text style={styles.name}>
          {user?.fullName}
        </Text>

        <Text style={styles.subtitle}>
          Manage events and student registrations.
        </Text>

        <View style={styles.statsContainer}>
          <StatCard
            icon="calendar-outline"
            value="0"
            label="Events"
          />

          <StatCard
            icon="people-outline"
            value="0"
            label="Registrations"
          />

          <StatCard
            icon="time-outline"
            value="0"
            label="Upcoming"
          />

          <StatCard
            icon="checkmark-circle-outline"
            value="0"
            label="Completed"
          />
        </View>

        <View style={styles.emptyCard}>
          <Ionicons
            name="add-circle-outline"
            size={50}
            color={colors.primary}
          />

          <Text style={styles.emptyTitle}>
            Create your first event
          </Text>

          <Text style={styles.emptyDescription}>
            Event creation and management will be
            added in the organizer feature.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}

function StatCard({
  icon,
  value,
  label,
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

      <Text style={styles.statLabel}>
        {label}
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
    flex: 1,
    padding: 18,
  },

  welcome: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
  },

  name: {
    marginTop: 3,
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 14,
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 26,
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
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },

  statValue: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "900",
  },

  statLabel: {
    marginTop: 3,
    color: colors.textSecondary,
    fontSize: 13,
  },

  emptyCard: {
    alignItems: "center",
    marginTop: 18,
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  emptyTitle: {
    marginTop: 14,
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },

  emptyDescription: {
    marginTop: 7,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});