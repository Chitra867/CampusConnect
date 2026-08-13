import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../store/authStore";
import { useEventStore } from "../../store/eventStore";
import { useRegistrationStore } from "../../store/registrationStore";
import { getTotalRegistrationCount } from "../../utils/eventRules";

import { colors } from "../../theme/colors";

export default function OrganizerProfileScreen() {
  const user = useAuthStore(
    (state) => state.user
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const allEvents = useEventStore(
    (state) => state.events
  );
  const events = allEvents.filter((event) => event.createdBy === user?.id);

  const registrations = useRegistrationStore((state) => state.registrations);

  const totalRegistrations = events.reduce(
    (total, event) => total + getTotalRegistrationCount(event, registrations),
    0
  );

  const publishedCount = events.filter(
    (event) => event.status === "published"
  ).length;

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Stay Logged In",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.pageTitle}>
          Organizer Profile
        </Text>

        <Text style={styles.pageSubtitle}>
          Your event organizer account
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="megaphone"
              size={44}
              color={colors.primary}
            />
          </View>

          <Text style={styles.name}>
            {user?.fullName}
          </Text>

          <Text style={styles.email}>
            {user?.email}
          </Text>

          <View style={styles.verifiedBadge}>
            <Ionicons
              name="shield-checkmark"
              size={16}
              color={colors.success}
            />

            <Text style={styles.verifiedText}>
              Verified Organizer
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <ProfileStat
            value={events.length.toString()}
            label="Events"
          />

          <View style={styles.statDivider} />

          <ProfileStat
            value={publishedCount.toString()}
            label="Published"
          />

          <View style={styles.statDivider} />

          <ProfileStat
            value={totalRegistrations.toString()}
            label="Registrations"
          />
        </View>

        <Text style={styles.sectionTitle}>
          Account Information
        </Text>

        <View style={styles.informationCard}>
          <InformationRow
            icon="person-outline"
            label="Account role"
            value="Event Organizer"
          />

          <InformationRow
            icon="mail-outline"
            label="Email address"
            value={user?.email ?? "Not available"}
          />

          <InformationRow
            icon="checkmark-circle-outline"
            label="Account status"
            value="Active"
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>
          Organizer Tools
        </Text>

        <View style={styles.toolsCard}>
          <ToolRow
            icon="calendar-outline"
            title="Event Management"
            subtitle={`${events.length} events created`}
          />

          <ToolRow
            icon="people-outline"
            title="Registration Management"
            subtitle={`${totalRegistrations} total registrations`}
          />

          <ToolRow
            icon="analytics-outline"
            title="Event Analytics"
            subtitle="Registration and capacity reports"
            isLast
          />
        </View>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color={colors.danger}
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <View style={styles.profileStat}>
      <Text style={styles.profileStatValue}>
        {value}
      </Text>

      <Text style={styles.profileStatLabel}>
        {label}
      </Text>
    </View>
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

interface ToolRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  isLast?: boolean;
}

function ToolRow({
  icon,
  title,
  subtitle,
  isLast = false,
}: ToolRowProps) {
  return (
    <View
      style={[
        styles.toolRow,
        isLast && styles.lastRow,
      ]}
    >
      <View style={styles.toolIcon}>
        <Ionicons
          name={icon}
          size={22}
          color={colors.primary}
        />
      </View>

      <View style={styles.toolContent}>
        <Text style={styles.toolTitle}>
          {title}
        </Text>

        <Text style={styles.toolSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color={colors.textSecondary}
      />
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

  pageTitle: {
    marginTop: 10,
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },

  pageSubtitle: {
    marginTop: 5,
    color: colors.textSecondary,
    fontSize: 14,
  },

  profileCard: {
    alignItems: "center",
    marginTop: 23,
    padding: 25,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  avatar: {
    width: 93,
    height: 93,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 31,
    backgroundColor: colors.primarySoft,
  },

  name: {
    marginTop: 16,
    color: colors.text,
    fontSize: 23,
    fontWeight: "900",
  },

  email: {
    marginTop: 5,
    color: colors.textSecondary,
    fontSize: 14,
  },

  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    paddingHorizontal: 13,
    paddingVertical: 7,
    gap: 6,
    borderRadius: 20,
    backgroundColor: "#EAF8F2",
  },

  verifiedText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "900",
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  profileStat: {
    flex: 1,
    alignItems: "center",
  },

  profileStatValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "900",
  },

  profileStatLabel: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
  },

  statDivider: {
    width: 1,
    height: 35,
    backgroundColor: colors.border,
  },

  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
  },

  informationCard: {
    paddingHorizontal: 16,
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
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: colors.primarySoft,
  },

  informationContent: {
    flex: 1,
    marginLeft: 12,
  },

  informationLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },

  informationValue: {
    marginTop: 3,
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },

  toolsCard: {
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  toolRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  toolIcon: {
    width: 43,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },

  toolContent: {
    flex: 1,
    marginLeft: 12,
  },

  toolTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },

  toolSubtitle: {
    marginTop: 3,
    color: colors.textSecondary,
    fontSize: 11,
  },

  logoutButton: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F2CACA",
    backgroundColor: "#FFF4F4",
  },

  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: "900",
  },

  pressed: {
    opacity: 0.8,
  },
});
