import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";

export default function ProfileScreen() {
  const user = useAuthStore(
    (state) => state.user
  );

  const logout = useAuthStore(
    (state) => state.logout
  );

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.pageTitle}>
          Profile
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={44}
              color={colors.primary}
            />
          </View>

          <Text style={styles.name}>
            {user?.fullName}
          </Text>

          <Text style={styles.email}>
            {user?.email}
          </Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user?.role === "organizer"
                ? "Organizer"
                : "Student"}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color={colors.danger}
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
    padding: 18,
  },

  pageTitle: {
    marginTop: 8,
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },

  profileCard: {
    alignItems: "center",
    marginTop: 24,
    padding: 26,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  avatar: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: colors.primarySoft,
  },

  name: {
    marginTop: 15,
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },

  email: {
    marginTop: 5,
    color: colors.textSecondary,
    fontSize: 14,
  },

  roleBadge: {
    marginTop: 13,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
  },

  roleText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  logoutButton: {
    minHeight: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F2CACA",
    backgroundColor: "#FFF4F4",
  },

  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: "800",
  },

  pressed: {
    opacity: 0.8,
  },
});