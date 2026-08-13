import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";

interface Props {
  title: string;
  description: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function EmptyState({ title, description, icon = "calendar-outline" }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}><Ionicons name={icon} size={53} color={colors.primary} /></View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", paddingTop: 55, paddingHorizontal: 35 },
  icon: { width: 96, height: 96, alignItems: "center", justifyContent: "center", borderRadius: 31, backgroundColor: colors.primarySoft },
  title: { marginTop: 19, color: colors.text, fontSize: 21, fontWeight: "900" },
  description: { marginTop: 8, color: colors.textSecondary, fontSize: 14, lineHeight: 22, textAlign: "center" },
});
