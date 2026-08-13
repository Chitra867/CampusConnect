import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { CampusEvent } from "../../types";

interface Props {
  event: CampusEvent;
  reminderEnabled: boolean;
  isPast: boolean;
  onPress: () => void;
  onToggleReminder: () => void;
}

const palette = {
  navy: "#111378",
  purpleDark: "#7043CE",
  purpleSoft: "#E9DFFF",
  surface: "#FFFFFF",
  text: "#24252B",
  border: "#E0E1E8",
  white: "#FFFFFF",
};

const categoryColors: Record<string, { foreground: string; background: string; accent: string }> = {
  technology: { foreground: "#7043CE", background: "#EBDCFF", accent: "#7043CE" },
  academic: { foreground: "#7043CE", background: "#EBDCFF", accent: "#7043CE" },
  career: { foreground: "#2F3037", background: "#E8E9ED", accent: "#A7A8B0" },
  social: { foreground: "#A52B16", background: "#FFD9D0", accent: "#6A281D" },
  sports: { foreground: "#1D6B4E", background: "#DCF4E9", accent: "#1D6B4E" },
  cultural: { foreground: "#C04B28", background: "#FFE4D8", accent: "#C04B28" },
  competition: { foreground: "#14669E", background: "#DCEFFF", accent: "#14669E" },
};

function getDateParts(event: CampusEvent) {
  const parsed = new Date(event.endDate ?? event.date);
  if (Number.isNaN(parsed.getTime())) return { month: "EVENT", day: "--" };

  return {
    month: parsed.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: parsed.getDate().toString().padStart(2, "0"),
  };
}

export default function ScheduleEventCard({
  event,
  reminderEnabled,
  isPast,
  onPress,
  onToggleReminder,
}: Props) {
  const dateParts = getDateParts(event);
  const colors = categoryColors[event.category.trim().toLowerCase()] ?? {
    foreground: palette.purpleDark,
    background: palette.purpleSoft,
    accent: palette.purpleDark,
  };

  return (
    <View style={styles.eventCard}>
      <View style={[styles.eventAccent, { backgroundColor: colors.accent }]} />
      <Pressable onPress={onPress} style={({ pressed }) => [styles.eventContent, pressed && styles.pressed]}>
        <View style={styles.eventTop}>
          <View style={styles.dateBox}>
            <Text style={[styles.dateMonth, { color: colors.foreground }]}>{dateParts.month}</Text>
            <Text style={styles.dateDay}>{dateParts.day}</Text>
          </View>
          <View style={styles.eventDetails}>
            <View style={styles.eventTitleRow}>
              <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: colors.background }]}>
                <Text style={[styles.categoryText, { color: colors.foreground }]} numberOfLines={1}>{event.category}</Text>
              </View>
            </View>
            <View style={styles.informationRow}>
              <Ionicons name="time-outline" size={22} color={palette.text} />
              <Text style={styles.informationText} numberOfLines={1}>
                {event.time}{event.endTime ? ` - ${event.endTime}` : ""}
              </Text>
            </View>
            <View style={styles.informationRow}>
              <Ionicons name="location-outline" size={22} color={palette.text} />
              <Text style={styles.informationText} numberOfLines={1}>{event.venue}</Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.cardFooter}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={reminderEnabled ? "Disable event reminder" : "Enable event reminder"}
            onPress={(pressEvent) => { pressEvent.stopPropagation(); onToggleReminder(); }}
            style={[styles.reminderButton, reminderEnabled && styles.activeReminderButton]}
          >
            <Ionicons name={reminderEnabled ? "notifications" : "notifications-outline"} size={24} color={reminderEnabled ? palette.purpleDark : palette.navy} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isPast ? "View event details" : "View event ticket"}
            onPress={(pressEvent) => { pressEvent.stopPropagation(); onPress(); }}
            style={[styles.ticketButton, isPast && styles.pastTicketButton]}
          >
            <Ionicons name={isPast ? "eye-outline" : "ticket-outline"} size={22} color={isPast ? palette.navy : palette.white} />
            <Text style={[styles.ticketText, isPast && styles.pastTicketText]}>
              {isPast ? "View Details" : reminderEnabled ? "View Ticket" : "Ticket"}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  eventCard: { position: "relative", flexDirection: "row", marginBottom: 15, marginHorizontal: 20, overflow: "hidden", borderRadius: 18, borderWidth: 1, borderColor: palette.border, backgroundColor: palette.surface, shadowColor: "#000000", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  eventAccent: { width: 7 },
  eventContent: { flex: 1, paddingHorizontal: 15, paddingTop: 16, paddingBottom: 14 },
  eventTop: { flexDirection: "row" },
  dateBox: { width: 68, height: 78, alignItems: "center", justifyContent: "center", borderRadius: 13, borderWidth: 1, borderColor: "#D7D8DF", backgroundColor: "#F4F5F8" },
  dateMonth: { fontSize: 12, fontWeight: "900" },
  dateDay: { marginTop: 4, color: palette.text, fontSize: 27, fontWeight: "900" },
  eventDetails: { flex: 1, marginLeft: 14 },
  eventTitleRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  eventTitle: { flex: 1, color: palette.text, fontSize: 17, lineHeight: 22, fontWeight: "900" },
  categoryBadge: { maxWidth: 88, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 16 },
  categoryText: { fontSize: 12, fontWeight: "800" },
  informationRow: { flexDirection: "row", alignItems: "center", marginTop: 9, gap: 7 },
  informationText: { flex: 1, color: "#454752", fontSize: 13 },
  divider: { height: 1, marginTop: 16, backgroundColor: palette.border },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 13 },
  reminderButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 18 },
  activeReminderButton: { backgroundColor: palette.purpleSoft },
  ticketButton: { minHeight: 45, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 17, gap: 10, borderRadius: 14, backgroundColor: palette.navy, shadowColor: palette.navy, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.18, shadowRadius: 8, elevation: 4 },
  pastTicketButton: { borderWidth: 2, borderColor: palette.navy, backgroundColor: palette.surface, shadowOpacity: 0, elevation: 0 },
  ticketText: { color: palette.white, fontSize: 14, fontWeight: "900" },
  pastTicketText: { color: palette.navy },
  pressed: { opacity: 0.82 },
});
