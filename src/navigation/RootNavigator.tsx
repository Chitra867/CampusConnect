import { Ionicons } from "@expo/vector-icons";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import AuthNavigator from "./AuthNavigator";

import ProfileScreen from "../screens/common/ProfileScreen";
import OrganizerDashboardScreen from "../screens/organizer/OrganizerDashboardScreen";
import HomeScreen from "../screens/student/HomeScreen";

import { useAuthStore } from "../store/authStore";
import { colors } from "../theme/colors";

const StudentTab = createBottomTabNavigator();
const OrganizerTab =
  createBottomTabNavigator();

function StudentNavigator() {
  return (
    <StudentTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor:
          colors.primary,

        tabBarInactiveTintColor:
          colors.textSecondary,

        tabBarStyle: {
          height: 68,
          paddingTop: 7,
          paddingBottom: 8,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },

        tabBarIcon: ({
          color,
          size,
          focused,
        }) => {
          const icons: Record<
            string,
            keyof typeof Ionicons.glyphMap
          > = {
            StudentHome: focused
              ? "home"
              : "home-outline",

            StudentProfile: focused
              ? "person"
              : "person-outline",
          };

          return (
            <Ionicons
              name={
                icons[route.name] ??
                "ellipse-outline"
              }
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <StudentTab.Screen
        name="StudentHome"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />

      <StudentTab.Screen
        name="StudentProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </StudentTab.Navigator>
  );
}

function OrganizerNavigator() {
  return (
    <OrganizerTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor:
          colors.primary,

        tabBarInactiveTintColor:
          colors.textSecondary,

        tabBarStyle: {
          height: 68,
          paddingTop: 7,
          paddingBottom: 8,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },

        tabBarIcon: ({
          color,
          size,
          focused,
        }) => {
          const icons: Record<
            string,
            keyof typeof Ionicons.glyphMap
          > = {
            OrganizerDashboard: focused
              ? "grid"
              : "grid-outline",

            OrganizerProfile: focused
              ? "person"
              : "person-outline",
          };

          return (
            <Ionicons
              name={
                icons[route.name] ??
                "ellipse-outline"
              }
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <OrganizerTab.Screen
        name="OrganizerDashboard"
        component={
          OrganizerDashboardScreen
        }
        options={{
          tabBarLabel: "Dashboard",
        }}
      />

      <OrganizerTab.Screen
        name="OrganizerProfile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </OrganizerTab.Navigator>
  );
}

export default function RootNavigator() {
  const user = useAuthStore(
    (state) => state.user
  );

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : user.role === "organizer" ? (
        <OrganizerNavigator />
      ) : (
        <StudentNavigator />
      )}
    </NavigationContainer>
  );
}