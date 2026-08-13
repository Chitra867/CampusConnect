import { Ionicons } from "@expo/vector-icons";
import {
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { colors } from "../../theme/colors";

interface Props extends Pick<TextInputProps, "multiline" | "textAlignVertical"> {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  onChangeText: (value: string) => void;
}

export default function AppInput({
  label,
  icon,
  value,
  placeholder,
  keyboardType = "default",
  multiline = false,
  textAlignVertical,
  onChangeText,
}: Props) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.container, multiline && styles.multilineContainer]}>
        <Ionicons
          name={icon}
          size={20}
          color={colors.textSecondary}
          style={multiline ? styles.multilineIcon : undefined}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          keyboardType={keyboardType}
          multiline={multiline}
          textAlignVertical={textAlignVertical}
          style={[styles.input, multiline && styles.multilineInput]}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 8, color: colors.text, fontSize: 14, fontWeight: "800" },
  container: { minHeight: 53, flexDirection: "row", alignItems: "center", marginBottom: 17, paddingHorizontal: 15, gap: 10, borderRadius: 15, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, color: colors.text, fontSize: 15 },
  multilineContainer: { minHeight: 130, alignItems: "flex-start", paddingTop: 15 },
  multilineIcon: { marginTop: 2 },
  multilineInput: { minHeight: 100, paddingTop: 0 },
});
