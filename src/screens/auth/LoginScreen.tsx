import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../store/authStore";
import { AuthStackParamList, UserRole } from "../../types";

const GREEN = "#078451";
const DARK_GREEN = "#086039";
const INK = "#121514";
const MUTED = "#8B918E";
const FIELD = "#F5F7F6";
const BORDER = "#E5E9E7";
const MOSAIC = [
  "#073E21", "#0A552B", "#11713A", "#168846", "#239C55",
  "#39B96B", "#62D58A", "#8CE8AA", "#B8F2C9", "#E3F9E9",
];

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { width, height } = useWindowDimensions();
  const wide = width >= 820;
  const compact = height < 720;
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    const cleanEmail = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 4) {
      setError("Password must contain at least 4 characters.");
      return;
    }
    setError("");
    login(cleanEmail, role);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.layout, wide && styles.wideLayout]}>
            <View style={[styles.storyPanel, wide && styles.wideStoryPanel, compact && !wide && styles.compactStoryPanel]}>
              <Mosaic wide={wide} />
              <BrandMark light />

              <View style={styles.storyCopy}>
                <Text style={[styles.storyTitle, !wide && styles.mobileStoryTitle]}>
                  Your campus.{"\n"}Your events.{"\n"}
                  <Text style={styles.storyAccent}>All connected.</Text>
                </Text>
                <Text style={styles.storyDescription}>
                  Discover experiences, meet your community, and never miss a moment that matters.
                </Text>
              </View>
            </View>

            <View style={[styles.formPanel, wide && styles.wideFormPanel]}>
              <View style={styles.formCard}>
                <View style={styles.centerMark}><BrandMark /></View>

                <View style={styles.headingBlock}>
                  <Text style={styles.welcome}>Welcome back</Text>
                  <Text style={styles.subtitle}>Sign in to your CampusConnect account</Text>
                </View>

                <View style={styles.roleSwitch}>
                  <RoleOption label="Student" icon="person-outline" selected={role === "student"} onPress={() => setRole("student")} />
                  <RoleOption label="Organizer" icon="people-outline" selected={role === "organizer"} onPress={() => setRole("organizer")} />
                </View>

                <View style={styles.fieldWrap}>
                  <Ionicons name="mail-outline" size={19} color={MUTED} />
                  <TextInput
                    value={email}
                    onChangeText={(value) => { setEmail(value); setError(""); }}
                    placeholder="name@college.edu"
                    placeholderTextColor="#A0A5A2"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    style={styles.input}
                  />
                </View>

                <View style={styles.fieldWrap}>
                  <Ionicons name="lock-closed-outline" size={19} color={MUTED} />
                  <TextInput
                    value={password}
                    onChangeText={(value) => { setPassword(value); setError(""); }}
                    placeholder="Password"
                    placeholderTextColor="#A0A5A2"
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    style={styles.input}
                  />
                  <Pressable onPress={() => setShowPassword((current) => !current)} hitSlop={12}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={MUTED} />
                  </Pressable>
                </View>

                {error ? (
                  <View style={styles.errorRow}>
                    <Ionicons name="alert-circle-outline" size={17} color="#C84646" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <Pressable onPress={handleLogin} style={({ pressed }) => [styles.signInButton, pressed && styles.pressed]}>
                  <Text style={styles.signInText}>Sign in</Text>
                  <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
                </Pressable>

                <Text style={styles.demoText}>
                  Demo access: use organizer@college.edu for seeded organizer events, or any valid email for a separate account. Passwords need four characters.
                </Text>

                <View style={styles.signUpRow}>
                  <Text style={styles.signUpPrompt}>New to CampusConnect?</Text>
                  <Pressable onPress={() => navigation.navigate("Register")} hitSlop={8}>
                    <Text style={styles.signUpLink}>Create account</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.legalRow}>
                <Text style={styles.legalText}>Privacy policy</Text>
                <View style={styles.legalDot} />
                <Text style={styles.legalText}>Terms & conditions</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function BrandMark({ light = false }: { light?: boolean }) {
  const color = light ? "#FFFFFF" : INK;
  return (
    <View style={styles.mark}>
      <View style={styles.markBlank} />
      <View style={[styles.markSquare, { backgroundColor: color }]} />
      <View style={[styles.markSquare, { backgroundColor: color }]} />
      <View style={[styles.markSquare, { backgroundColor: color }]} />
    </View>
  );
}

function Mosaic({ wide }: { wide: boolean }) {
  const columns = wide ? 8 : 10;
  const blocks = Array.from({ length: wide ? 88 : 40 }, (_, index) => index);
  return (
    <View style={[styles.mosaic, { width: wide ? "78%" : "100%" }]} pointerEvents="none">
      {blocks.map((index) => (
        <View
          key={index}
          style={{
            width: `${100 / columns}%`,
            aspectRatio: 1,
            backgroundColor: MOSAIC[(index * 7 + Math.floor(index / columns) * 3) % MOSAIC.length],
            opacity: Math.max(0.18, 1 - (index % columns) / (columns + 1)),
          }}
        />
      ))}
    </View>
  );
}

function RoleOption({ label, icon, selected, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.roleOption, selected && styles.selectedRole]}>
      <Ionicons name={icon} size={17} color={selected ? GREEN : MUTED} />
      <Text style={[styles.roleText, selected && styles.selectedRoleText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { flexGrow: 1 },
  layout: { flex: 1, minHeight: "100%" },
  wideLayout: { flexDirection: "row" },
  storyPanel: { position: "relative", minHeight: 330, justifyContent: "space-between", padding: 30, overflow: "hidden", backgroundColor: "#F7FBF8" },
  compactStoryPanel: { minHeight: 275 },
  wideStoryPanel: { width: "50%", minHeight: 720, padding: 58 },
  mosaic: { position: "absolute", top: 0, left: 0, flexDirection: "row", flexWrap: "wrap" },
  mark: { width: 27, height: 27, flexDirection: "row", flexWrap: "wrap", gap: 3 },
  markBlank: { width: 12, height: 12 },
  markSquare: { width: 12, height: 12, borderRadius: 2 },
  storyCopy: { zIndex: 1, marginTop: 105 },
  storyTitle: { color: INK, fontSize: 47, lineHeight: 52, fontWeight: "800", letterSpacing: -1.5 },
  mobileStoryTitle: { fontSize: 31, lineHeight: 35, letterSpacing: -0.8 },
  storyAccent: { color: GREEN, fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia" }), fontStyle: "italic", fontWeight: "600" },
  storyDescription: { maxWidth: 370, marginTop: 17, color: "#4B534F", fontSize: 14, lineHeight: 22, fontWeight: "500" },
  formPanel: { flex: 1, minHeight: 500, alignItems: "center", justifyContent: "center", paddingHorizontal: 28, paddingTop: 42, paddingBottom: 25, backgroundColor: "#FFFFFF" },
  wideFormPanel: { width: "50%", minHeight: 720, paddingHorizontal: 45 },
  formCard: { width: "100%", maxWidth: 370 },
  centerMark: { alignItems: "center", marginBottom: 24 },
  headingBlock: { alignItems: "center", marginBottom: 25 },
  welcome: { color: INK, fontSize: 23, fontWeight: "700" },
  subtitle: { marginTop: 7, color: MUTED, fontSize: 12, fontWeight: "500", letterSpacing: 0.2 },
  roleSwitch: { flexDirection: "row", marginBottom: 17, padding: 4, gap: 4, borderRadius: 25, backgroundColor: FIELD },
  roleOption: { flex: 1, minHeight: 42, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, borderRadius: 21 },
  selectedRole: { borderWidth: 1, borderColor: BORDER, backgroundColor: "#FFFFFF", shadowColor: "#1B3B2A", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  roleText: { color: MUTED, fontSize: 12, fontWeight: "700" },
  selectedRoleText: { color: INK },
  fieldWrap: { minHeight: 54, flexDirection: "row", alignItems: "center", marginBottom: 13, paddingHorizontal: 19, gap: 10, borderWidth: 1, borderColor: BORDER, borderRadius: 28, backgroundColor: FIELD },
  input: { flex: 1, color: INK, fontSize: 14, fontWeight: "500" },
  errorRow: { flexDirection: "row", alignItems: "center", marginTop: -2, marginBottom: 11, paddingHorizontal: 9, gap: 6 },
  errorText: { flex: 1, color: "#C84646", fontSize: 11, fontWeight: "600" },
  signInButton: { minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4, gap: 9, borderRadius: 28, backgroundColor: GREEN, shadowColor: DARK_GREEN, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 5 },
  signInText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  demoText: { alignSelf: "center", maxWidth: 320, marginTop: 19, color: MUTED, fontSize: 11, lineHeight: 17, textAlign: "center" },
  signUpRow: { flexDirection: "row", justifyContent: "center", marginTop: 16, gap: 5 },
  signUpPrompt: { color: MUTED, fontSize: 12, fontWeight: "500" },
  signUpLink: { color: INK, fontSize: 12, fontWeight: "800", textDecorationLine: "underline" },
  legalRow: { flexDirection: "row", alignItems: "center", marginTop: 42, gap: 10 },
  legalText: { color: "#A3A8A5", fontSize: 10, fontWeight: "600" },
  legalDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: "#C5C9C7" },
  pressed: { opacity: 0.82 },
});
