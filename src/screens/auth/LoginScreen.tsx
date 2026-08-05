import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";
import { UserRole } from "../../types";

export default function LoginScreen() {
  const login = useAuthStore(
    (state) => state.login
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [role, setRole] =
    useState<UserRole>("student");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const cleanEmail = email.trim();

    if (!cleanEmail.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 4) {
      setError(
        "Password must contain at least 4 characters."
      );
      return;
    }

    setError("");
    login(cleanEmail, role);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.scrollContent
          }
        >
          <View style={styles.logo}>
            <Ionicons
              name="school"
              size={40}
              color={colors.white}
            />
          </View>

          <Text style={styles.appName}>
            CampusConnect
          </Text>

          <Text style={styles.subtitle}>
            Discover events and connect with your
            campus community.
          </Text>

          <View style={styles.card}>
            <Text style={styles.heading}>
              Welcome Back
            </Text>

            <Text style={styles.description}>
              Login to continue to CampusConnect.
            </Text>

            <Text style={styles.label}>
              Login as
            </Text>

            <View style={styles.roles}>
              <RoleButton
                label="Student"
                icon="person-outline"
                selected={role === "student"}
                onPress={() =>
                  setRole("student")
                }
              />

              <RoleButton
                label="Organizer"
                icon="people-outline"
                selected={role === "organizer"}
                onPress={() =>
                  setRole("organizer")
                }
              />
            </View>

            <Text style={styles.label}>
              Email address
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textSecondary}
              />

              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="student@college.edu"
                placeholderTextColor={
                  colors.textSecondary
                }
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <Text style={styles.label}>
              Password
            </Text>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.textSecondary}
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor={
                  colors.textSecondary
                }
                secureTextEntry
                style={styles.input}
              />
            </View>

            {error ? (
              <Text style={styles.error}>
                {error}
              </Text>
            ) : null}

            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.loginText}>
                Login
              </Text>

              <Ionicons
                name="arrow-forward"
                size={20}
                color={colors.white}
              />
            </Pressable>

            <Text style={styles.demoText}>
              Demo: enter any valid email and a
              password with at least 4 characters.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface RoleButtonProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}

function RoleButton({
  label,
  icon,
  selected,
  onPress,
}: RoleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.roleButton,
        selected && styles.selectedRole,
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={
          selected
            ? colors.white
            : colors.primary
        }
      />

      <Text
        style={[
          styles.roleText,
          selected &&
            styles.selectedRoleText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 30,
  },

  logo: {
    width: 76,
    height: 76,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: colors.primary,
  },

  appName: {
    marginTop: 16,
    color: colors.text,
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },

  card: {
    padding: 21,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  heading: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
  },

  description: {
    marginTop: 5,
    marginBottom: 22,
    color: colors.textSecondary,
    fontSize: 14,
  },

  label: {
    marginBottom: 8,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },

  roles: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },

  roleButton: {
    flex: 1,
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  selectedRole: {
    backgroundColor: colors.primary,
  },

  roleText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  selectedRoleText: {
    color: colors.white,
  },

  inputContainer: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 15,
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },

  error: {
    marginBottom: 12,
    color: colors.danger,
    fontSize: 13,
    fontWeight: "600",
  },

  loginButton: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    gap: 8,
    borderRadius: 15,
    backgroundColor: colors.primary,
  },

  pressed: {
    opacity: 0.82,
  },

  loginText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
  },

  demoText: {
    marginTop: 15,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});