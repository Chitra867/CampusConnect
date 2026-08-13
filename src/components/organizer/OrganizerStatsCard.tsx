import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";

interface Props {
  title: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone: "purple" | "blue" | "green" | "red";
}

export default function OrganizerStatsCard({ title, value, icon, tone }: Props) {
  const tones = {
    purple: { backgroundColor: "#EFEDFF", color: colors.primary },
    blue: { backgroundColor: "#EAF4FF", color: "#3478C9" },
    green: { backgroundColor: "#EAF8F2", color: colors.success },
    red: { backgroundColor: "#FFF1F1", color: colors.danger },
  };
  const selected = tones[tone];

  return (
    <View style={styles.card}>
      <View style={[styles.icon, { backgroundColor: selected.backgroundColor }]}>
        <Ionicons name={icon} size={23} color={selected.color} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: "48%", marginBottom: 14, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  icon: { width: 44, height: 44, alignItems: "center", justifyContent: "center", marginBottom: 13, borderRadius: 14 },
  value: { color: colors.text, fontSize: 26, fontWeight: "900" },
  title: { marginTop: 3, color: colors.textSecondary, fontSize: 13, fontWeight: "600" },
});
