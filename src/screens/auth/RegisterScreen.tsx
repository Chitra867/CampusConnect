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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../store/authStore";
import { AuthStackParamList, UserRole } from "../../types";

type Props = NativeStackScreenProps<AuthStackParamList, "Register">;

const GREEN = "#078451";
const INK = "#121514";
const MUTED = "#858C88";
const FIELD = "#F5F7F6";
const BORDER = "#E3E8E5";

export default function RegisterScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const wide = width >= 820;
  const register = useAuthStore((state) => state.register);

  const [role, setRole] = useState<UserRole>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!fullName.trim() || !email.trim() || !collegeId.trim()) {
      setError("Full name, email, and college ID are required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (role === "student" && !program.trim()) {
      setError("Please enter your academic program.");
      return;
    }
    const semesterNumber = semester ? Number(semester) : null;
    if (role === "student" && (!semesterNumber || !Number.isInteger(semesterNumber) || semesterNumber < 1 || semesterNumber > 12)) {
      setError("Semester must be a whole number between 1 and 12.");
      return;
    }
    if (phone.trim() && !/^\+?[0-9\s-]{7,15}$/.test(phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    register({
      fullName,
      email,
      role,
      collegeId,
      program: role === "student" ? program : "",
      semester: role === "student" ? semesterNumber : null,
      phone,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={[styles.page, wide && styles.widePage]}>
            {wide ? (
              <View style={styles.sidePanel}>
                <View style={styles.sidePattern} />
                <Pressable onPress={() => navigation.goBack()} style={styles.sideBack}>
                  <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                  <Text style={styles.sideBackText}>Back to sign in</Text>
                </Pressable>
                <View>
                  <Text style={styles.sideKicker}>JOIN THE COMMUNITY</Text>
                  <Text style={styles.sideTitle}>One account.{"\n"}Every campus{ "\n"}<Text style={styles.sideAccent}>opportunity.</Text></Text>
                  <Text style={styles.sideDescription}>Create your profile to discover events, meet new people, and take part in campus life.</Text>
                </View>
              </View>
            ) : null}

            <View style={styles.formPanel}>
              {!wide ? (
                <Pressable onPress={() => navigation.goBack()} style={styles.mobileBack}>
                  <Ionicons name="arrow-back" size={21} color={INK} />
                </Pressable>
              ) : null}

              <View style={styles.formContent}>
                <Text style={styles.title}>Create account</Text>
                <Text style={styles.subtitle}>Tell us a little about yourself to get started.</Text>

                <Text style={styles.sectionLabel}>I am joining as</Text>
                <View style={styles.roleRow}>
                  <RoleOption label="Student" icon="person-outline" selected={role === "student"} onPress={() => { setRole("student"); setError(""); }} />
                  <RoleOption label="Organizer" icon="people-outline" selected={role === "organizer"} onPress={() => { setRole("organizer"); setError(""); }} />
                </View>

                <Field icon="person-outline" placeholder="Full name" value={fullName} onChangeText={setFullName} />
                <Field icon="mail-outline" placeholder="College email address" value={email} onChangeText={setEmail} keyboardType="email-address" />

                <View style={styles.fieldPair}>
                  <View style={styles.pairItem}><Field icon="id-card-outline" placeholder="College ID" value={collegeId} onChangeText={setCollegeId} /></View>
                  {role === "student" ? <View style={styles.pairItem}><Field icon="school-outline" placeholder="Program" value={program} onChangeText={setProgram} /></View> : null}
                </View>

                {role === "student" ? (
                  <View style={styles.fieldPair}>
                    <View style={styles.pairItem}><Field icon="layers-outline" placeholder="Semester" value={semester} onChangeText={setSemester} keyboardType="number-pad" /></View>
                    <View style={styles.pairItem}><Field icon="call-outline" placeholder="Phone (optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" /></View>
                  </View>
                ) : (
                  <Field icon="call-outline" placeholder="Phone (optional)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                )}

                <Field icon="lock-closed-outline" placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} trailingIcon={showPassword ? "eye-off-outline" : "eye-outline"} onTrailingPress={() => setShowPassword((current) => !current)} />
                <Field icon="shield-checkmark-outline" placeholder="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} />

                {error ? (
                  <View style={styles.errorRow}>
                    <Ionicons name="alert-circle-outline" size={17} color="#C84646" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <Pressable onPress={handleRegister} style={({ pressed }) => [styles.createButton, pressed && styles.pressed]}>
                  <Text style={styles.createText}>Create account</Text>
                  <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
                </Pressable>

                <View style={styles.loginRow}>
                  <Text style={styles.loginPrompt}>Already have an account?</Text>
                  <Pressable onPress={() => navigation.goBack()}><Text style={styles.loginLink}>Sign in</Text></Pressable>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ icon, placeholder, value, onChangeText, keyboardType = "default", secureTextEntry = false, trailingIcon, onTrailingPress }: { icon: keyof typeof Ionicons.glyphMap; placeholder: string; value: string; onChangeText: (value: string) => void; keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad"; secureTextEntry?: boolean; trailingIcon?: keyof typeof Ionicons.glyphMap; onTrailingPress?: () => void }) {
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={18} color={MUTED} />
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#9DA39F" keyboardType={keyboardType} secureTextEntry={secureTextEntry} autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"} style={styles.input} />
      {trailingIcon ? <Pressable onPress={onTrailingPress} hitSlop={10}><Ionicons name={trailingIcon} size={20} color={MUTED} /></Pressable> : null}
    </View>
  );
}

function RoleOption({ label, icon, selected, onPress }: { label: string; icon: keyof typeof Ionicons.glyphMap; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.roleOption, selected && styles.selectedRole]}>
      <Ionicons name={icon} size={18} color={selected ? GREEN : MUTED} />
      <Text style={[styles.roleText, selected && styles.selectedRoleText]}>{label}</Text>
      {selected ? <Ionicons name="checkmark-circle" size={17} color={GREEN} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { flexGrow: 1 },
  page: { flex: 1, minHeight: "100%", backgroundColor: "#FFFFFF" },
  widePage: { flexDirection: "row", minHeight: 760 },
  sidePanel: { position: "relative", width: "40%", minHeight: 760, justifyContent: "space-between", padding: 55, overflow: "hidden", backgroundColor: "#087748" },
  sidePattern: { position: "absolute", width: 330, height: 330, top: -115, right: -120, borderRadius: 165, borderWidth: 55, borderColor: "rgba(255,255,255,0.08)" },
  sideBack: { flexDirection: "row", alignItems: "center", gap: 8 },
  sideBackText: { color: "#FFFFFF", fontSize: 13, fontWeight: "700" },
  sideKicker: { color: "#BDEBD2", fontSize: 11, fontWeight: "900", letterSpacing: 1.7 },
  sideTitle: { marginTop: 14, color: "#FFFFFF", fontSize: 43, lineHeight: 49, fontWeight: "800", letterSpacing: -1 },
  sideAccent: { color: "#C8F0D9", fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia" }), fontStyle: "italic" },
  sideDescription: { maxWidth: 360, marginTop: 20, color: "#D8F2E4", fontSize: 14, lineHeight: 23 },
  formPanel: { flex: 1, padding: 25, backgroundColor: "#FFFFFF" },
  mobileBack: { width: 42, height: 42, alignItems: "center", justifyContent: "center", marginBottom: 12, borderWidth: 1, borderColor: BORDER, borderRadius: 21 },
  formContent: { width: "100%", maxWidth: 530, alignSelf: "center", justifyContent: "center", flex: 1, paddingVertical: 30 },
  title: { color: INK, fontSize: 29, fontWeight: "800" },
  subtitle: { marginTop: 7, marginBottom: 24, color: MUTED, fontSize: 13, lineHeight: 20 },
  sectionLabel: { marginBottom: 9, color: INK, fontSize: 12, fontWeight: "800" },
  roleRow: { flexDirection: "row", marginBottom: 15, gap: 9 },
  roleOption: { flex: 1, minHeight: 49, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 10, gap: 7, borderWidth: 1, borderColor: BORDER, borderRadius: 25, backgroundColor: FIELD },
  selectedRole: { borderColor: "#8BC7AA", backgroundColor: "#ECF8F1" },
  roleText: { color: MUTED, fontSize: 12, fontWeight: "700" },
  selectedRoleText: { color: INK },
  fieldPair: { flexDirection: "row", gap: 10 },
  pairItem: { flex: 1 },
  field: { minHeight: 52, flexDirection: "row", alignItems: "center", marginBottom: 11, paddingHorizontal: 17, gap: 9, borderWidth: 1, borderColor: BORDER, borderRadius: 26, backgroundColor: FIELD },
  input: { flex: 1, color: INK, fontSize: 13, fontWeight: "500" },
  errorRow: { flexDirection: "row", alignItems: "center", marginBottom: 11, paddingHorizontal: 8, gap: 6 },
  errorText: { flex: 1, color: "#C84646", fontSize: 11, fontWeight: "600" },
  createButton: { minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 3, gap: 9, borderRadius: 27, backgroundColor: GREEN, shadowColor: "#075B39", shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.18, shadowRadius: 14, elevation: 4 },
  createText: { color: "#FFFFFF", fontSize: 14, fontWeight: "800" },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 19, gap: 5 },
  loginPrompt: { color: MUTED, fontSize: 12 },
  loginLink: { color: INK, fontSize: 12, fontWeight: "800", textDecorationLine: "underline" },
  pressed: { opacity: 0.83 },
});
