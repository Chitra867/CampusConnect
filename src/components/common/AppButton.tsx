import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "../../theme/colors";

interface Props {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  onPress: () => void;
}

export default function AppButton({ label, icon, disabled = false, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, disabled && styles.disabled, pressed && !disabled && styles.pressed]}
    >
      {icon ? <Ionicons name={icon} size={21} color={colors.white} /> : null}
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 56, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 5, gap: 8, borderRadius: 16, backgroundColor: colors.primary },
  text: { color: colors.white, fontSize: 16, fontWeight: "900" },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.82 },
});
