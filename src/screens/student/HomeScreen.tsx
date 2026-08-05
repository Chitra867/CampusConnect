import {
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";

export default function HomeScreen() {
  const user = useAuthStore(
    (state) => state.user
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>
              Welcome back
            </Text>

            <Text style={styles.name}>
              {user?.fullName}
            </Text>
          </View>

          <View style={styles.iconContainer}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.primary}
            />
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Explore Campus Events
            </Text>

            <Text style={styles.heroDescription}>
              Discover workshops, seminars,
              competitions and club activities.
            </Text>
          </View>

          <Ionicons
            name="calendar"
            size={58}
            color={colors.white}
          />
        </View>

        <Text style={styles.sectionTitle}>
          Upcoming Events
        </Text>

        <View style={styles.emptyCard}>
          <Ionicons
            name="calendar-outline"
            size={48}
            color={colors.primary}
          />

          <Text style={styles.emptyTitle}>
            Event module is ready next
          </Text>

          <Text style={styles.emptyDescription}>
            Events will be displayed here after
            the event feature is added.
          </Text>
        </View>
      </View>
    </SafeAreaView>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 22,
  },

  welcome: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  name: {
    marginTop: 3,
    color: colors.text,
    fontSize: 23,
    fontWeight: "900",
  },

  iconContainer: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primarySoft,
  },

  hero: {
    minHeight: 160,
    flexDirection: "row",
    alignItems: "center",
    padding: 22,
    borderRadius: 24,
    backgroundColor: colors.primary,
  },

  heroContent: {
    flex: 1,
    paddingRight: 12,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 23,
    fontWeight: "900",
  },

  heroDescription: {
    marginTop: 9,
    color: "#EAE7FF",
    fontSize: 14,
    lineHeight: 21,
  },

  sectionTitle: {
    marginTop: 26,
    marginBottom: 14,
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },

  emptyCard: {
    alignItems: "center",
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  emptyTitle: {
    marginTop: 14,
    color: colors.text,
    fontSize: 17,
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