import { StyleSheet, Text, View } from "react-native";

import type { CampusEvent } from "../../types";
import { colors } from "../../theme/colors";

export default function EventStatusBadge({ status }: { status: CampusEvent["status"] }) {
  const cancelled = status === "cancelled";
  const completed = status === "completed";

  return (
    <View style={[styles.badge, cancelled && styles.cancelledBadge, completed && styles.completedBadge]}>
      <View style={[styles.dot, cancelled && styles.cancelledDot, completed && styles.completedDot]} />
      <Text style={[styles.text, cancelled && styles.cancelledText, completed && styles.completedText]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 9, paddingVertical: 6, gap: 5, borderRadius: 12, backgroundColor: "#EAF8F2" },
  cancelledBadge: { backgroundColor: "#FFF1F1" },
  completedBadge: { backgroundColor: "#EAF4FF" },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success },
  cancelledDot: { backgroundColor: colors.danger },
  completedDot: { backgroundColor: "#3478C9" },
  text: { color: colors.success, fontSize: 10, fontWeight: "900", textTransform: "capitalize" },
  cancelledText: { color: colors.danger },
  completedText: { color: "#3478C9" },
});
