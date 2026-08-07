import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../store/authStore";
import { useEventStore } from "../../store/eventStore";
import { usePreferenceStore } from "../../store/preferenceStore";
import { useRegistrationStore } from "../../store/registrationStore";
import { colors } from "../../theme/colors";
import { CampusEvent, StudentRootStackParamList } from "../../types";

type Props = NativeStackScreenProps<StudentRootStackParamList, "Notifications">;

interface Notice {
  id: string;
  title: string;
  message: string;
  icon: keyof typeof Ionicons.glyphMap;
  event: CampusEvent;
}

export default function NotificationsScreen({ navigation }: Props) {
  const user = useAuthStore((state) => state.user);
  const events = useEventStore((state) => state.events);
  const registrations = useRegistrationStore((state) => state.registrations);
  const reminderIds = usePreferenceStore((state) => state.reminderEventIds);

  const registeredIds = new Set(
    registrations
      .filter(
        (registration) =>
          registration.studentId === user?.id &&
          registration.status === "registered"
      )
      .map((registration) => registration.eventId)
  );

  const notices: Notice[] = events
    .filter(
      (event) => registeredIds.has(event.id) || reminderIds.includes(event.id)
    )
    .map((event) => {
      if (event.status === "cancelled") {
        return {
          id: `cancelled-${event.id}`,
          title: "Event cancelled",
          message: `${event.title} is no longer taking place.`,
          icon: "alert-circle" as const,
          event,
        };
      }

      return {
        id: `upcoming-${event.id}`,
        title: reminderIds.includes(event.id) ? "Reminder enabled" : "Registration confirmed",
        message: `${event.title} • ${event.date} at ${event.time}`,
        icon: reminderIds.includes(event.id) ? "notifications" as const : "checkmark-circle" as const,
        event,
      };
    });

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {notices.length ? (
          notices.map((notice) => (
            <Pressable
              key={notice.id}
              onPress={() =>
                navigation.navigate("EventDetails", { eventId: notice.event.id })
              }
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <View style={styles.iconBox}>
                <Ionicons name={notice.icon} size={24} color={colors.primary} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{notice.title}</Text>
                <Text style={styles.cardMessage}>{notice.message}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </Pressable>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-outline" size={45} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>You are all caught up</Text>
            <Text style={styles.emptyText}>
              Registration updates and event reminders will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, padding: 20, paddingBottom: 36 },
  card: { flexDirection: "row", alignItems: "center", marginBottom: 12, padding: 16, gap: 13, borderWidth: 1, borderColor: colors.border, borderRadius: 18, backgroundColor: colors.surface },
  iconBox: { width: 48, height: 48, alignItems: "center", justifyContent: "center", borderRadius: 15, backgroundColor: colors.primarySoft },
  cardContent: { flex: 1 },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: "900" },
  cardMessage: { marginTop: 4, color: colors.textSecondary, fontSize: 13, lineHeight: 19 },
  pressed: { opacity: 0.78 },
  emptyState: { alignItems: "center", paddingTop: 100, paddingHorizontal: 26 },
  emptyIcon: { width: 96, height: 96, alignItems: "center", justifyContent: "center", borderRadius: 32, backgroundColor: colors.primarySoft },
  emptyTitle: { marginTop: 21, color: colors.text, fontSize: 21, fontWeight: "900" },
  emptyText: { marginTop: 8, color: colors.textSecondary, fontSize: 15, lineHeight: 22, textAlign: "center" },
});
