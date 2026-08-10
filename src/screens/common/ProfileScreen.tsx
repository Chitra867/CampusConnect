import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../store/authStore";
import { usePreferenceStore } from "../../store/preferenceStore";
import { useRegistrationStore } from "../../store/registrationStore";
import { colors } from "../../theme/colors";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const logout = useAuthStore((state) => state.logout);
  const registrations = useRegistrationStore((state) => state.registrations);
  const preferencesByUser = usePreferenceStore((state) => state.preferencesByUser);
  const savedCount = user
    ? preferencesByUser[user.id]?.bookmarkedEventIds.length ?? 0
    : 0;

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [collegeId, setCollegeId] = useState(user?.collegeId ?? "");
  const [program, setProgram] = useState(user?.program ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  useEffect(() => {
    setFullName(user?.fullName ?? "");
    setCollegeId(user?.collegeId ?? "");
    setProgram(user?.program ?? "");
    setPhone(user?.phone ?? "");
  }, [user]);

  const registeredCount = registrations.filter(
    (item) => item.studentId === user?.id && item.status === "registered"
  ).length;
  const initials = (user?.fullName ?? "Campus Student")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const saveProfile = () => {
    if (!fullName.trim() || !collegeId.trim()) {
      Alert.alert("Missing information", "Name and college ID are required.");
      return;
    }
    updateProfile({
      fullName: fullName.trim(),
      collegeId: collegeId.trim(),
      program: program.trim(),
      phone: phone.trim(),
    });
    setEditing(false);
    Alert.alert("Profile updated", "Your details have been saved on this device.");
  };

  const handleLogout = () => {
    Alert.alert("Log out", "Do you want to leave CampusConnect?", [
      { text: "Stay", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.eyebrow}>MY CAMPUS</Text>
            <Text style={styles.pageTitle}>Profile</Text>
          </View>
          <Pressable
            onPress={() => (editing ? saveProfile() : setEditing(true))}
            style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
          >
            <Ionicons name={editing ? "checkmark" : "create-outline"} size={19} color={colors.white} />
            <Text style={styles.editText}>{editing ? "Save" : "Edit"}</Text>
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.decorOne} />
          <View style={styles.decorTwo} />
          <View style={styles.avatar}>
            <Text style={styles.initials}>{initials}</Text>
          </View>
          <View style={styles.identity}>
            <Text style={styles.name}>{user?.fullName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={15} color="#B8F5D8" />
              <Text style={styles.verifiedText}>Verified student</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat value={registeredCount.toString()} label="Registered" icon="ticket-outline" />
          <View style={styles.statDivider} />
          <Stat value={savedCount.toString()} label="Saved" icon="bookmark-outline" />
          <View style={styles.statDivider} />
          <Stat value={user?.semester?.toString() ?? "—"} label="Semester" icon="school-outline" />
        </View>

        <Text style={styles.sectionTitle}>Personal information</Text>
        <View style={styles.detailsCard}>
          <ProfileField icon="person-outline" label="Full name" value={fullName} editing={editing} onChangeText={setFullName} />
          <ProfileField icon="id-card-outline" label="College ID" value={collegeId} editing={editing} onChangeText={setCollegeId} />
          <ProfileField icon="book-outline" label="Program" value={program || "Not provided"} editing={editing} onChangeText={setProgram} />
          <ProfileField icon="call-outline" label="Phone" value={phone || "Not provided"} editing={editing} onChangeText={setPhone} last />
        </View>

        {editing ? (
          <Pressable onPress={() => setEditing(false)} style={styles.cancelEditButton}>
            <Text style={styles.cancelEditText}>Cancel changes</Text>
          </Pressable>
        ) : null}

        <Pressable onPress={handleLogout} style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
          <Ionicons name="log-out-outline" size={21} color={colors.danger} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ value, label, icon }: { value: string; label: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function ProfileField({ icon, label, value, editing, onChangeText, last = false }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; editing: boolean; onChangeText: (value: string) => void; last?: boolean }) {
  return (
    <View style={[styles.field, last && styles.lastField]}>
      <View style={styles.fieldIcon}><Ionicons name={icon} size={20} color={colors.primary} /></View>
      <View style={styles.fieldContent}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {editing ? (
          <TextInput value={value === "Not provided" ? "" : value} onChangeText={onChangeText} placeholder={`Enter ${label.toLowerCase()}`} placeholderTextColor={colors.textSecondary} style={styles.input} />
        ) : (
          <Text style={styles.fieldValue}>{value}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 38 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  pageTitle: { marginTop: 3, color: colors.text, fontSize: 30, fontWeight: "900" },
  editButton: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 10, gap: 6, borderRadius: 13, backgroundColor: colors.primary },
  editText: { color: colors.white, fontSize: 14, fontWeight: "800" },
  heroCard: { position: "relative", flexDirection: "row", alignItems: "center", marginTop: 22, padding: 22, overflow: "hidden", borderRadius: 26, backgroundColor: "#33268F" },
  decorOne: { position: "absolute", width: 130, height: 130, top: -65, right: -25, borderRadius: 65, backgroundColor: "#6F5CE7" },
  decorTwo: { position: "absolute", width: 80, height: 80, bottom: -45, left: 80, borderRadius: 40, backgroundColor: "#5140BD" },
  avatar: { width: 74, height: 74, alignItems: "center", justifyContent: "center", borderRadius: 24, borderWidth: 2, borderColor: "#9688F5", backgroundColor: "#FFFFFF" },
  initials: { color: colors.primary, fontSize: 25, fontWeight: "900" },
  identity: { flex: 1, marginLeft: 16 },
  name: { color: colors.white, fontSize: 20, fontWeight: "900" },
  email: { marginTop: 4, color: "#D9D4FF", fontSize: 12 },
  verifiedBadge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", marginTop: 10, paddingHorizontal: 9, paddingVertical: 5, gap: 4, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.14)" },
  verifiedText: { color: colors.white, fontSize: 11, fontWeight: "800" },
  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 16, paddingVertical: 17, borderWidth: 1, borderColor: colors.border, borderRadius: 20, backgroundColor: colors.surface },
  stat: { flex: 1, alignItems: "center" },
  statValue: { marginTop: 4, color: colors.text, fontSize: 19, fontWeight: "900" },
  statLabel: { marginTop: 2, color: colors.textSecondary, fontSize: 11, fontWeight: "700" },
  statDivider: { width: 1, height: 42, backgroundColor: colors.border },
  sectionTitle: { marginTop: 25, marginBottom: 12, color: colors.text, fontSize: 18, fontWeight: "900" },
  detailsCard: { paddingHorizontal: 16, borderWidth: 1, borderColor: colors.border, borderRadius: 20, backgroundColor: colors.surface },
  field: { flexDirection: "row", alignItems: "center", minHeight: 71, borderBottomWidth: 1, borderBottomColor: colors.border },
  lastField: { borderBottomWidth: 0 },
  fieldIcon: { width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 13, backgroundColor: colors.primarySoft },
  fieldContent: { flex: 1, marginLeft: 12 },
  fieldLabel: { color: colors.textSecondary, fontSize: 11, fontWeight: "700" },
  fieldValue: { marginTop: 4, color: colors.text, fontSize: 15, fontWeight: "700" },
  input: { marginTop: 1, paddingVertical: 4, color: colors.text, fontSize: 15, fontWeight: "700" },
  cancelEditButton: { alignItems: "center", marginTop: 14, padding: 10 },
  cancelEditText: { color: colors.textSecondary, fontSize: 14, fontWeight: "700" },
  logoutButton: { minHeight: 54, flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 18, gap: 8, borderWidth: 1, borderColor: "#F2CACA", borderRadius: 16, backgroundColor: "#FFF4F4" },
  logoutText: { color: colors.danger, fontSize: 15, fontWeight: "800" },
  pressed: { opacity: 0.8 },
});
