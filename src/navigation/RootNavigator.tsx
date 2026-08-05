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
import ManageEventsScreen from "../screens/organizer/ManageEventsScreen";
import HomeScreen from "../screens/student/HomeScreen";
import MyEventsScreen from "../screens/student/MyEventsScreen";

import { useAuthStore } from "../store/authStore";
import { colors } from "../theme/colors";

const StudentTab = createBottomTabNavigator();
const OrganizerTab = createBottomTabNavigator();

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
            Home: focused
              ? "home"
              : "home-outline",

            MyEvents: focused
              ? "calendar"
              : "calendar-outline",

            Profile: focused
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
        name="Home"
        component={HomeScreen}
      />

      <StudentTab.Screen
        name="MyEvents"
        component={MyEventsScreen}
        options={{
          tabBarLabel: "My Events",
        }}
      />

      <StudentTab.Screen
        name="Profile"
        component={ProfileScreen}
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
            Dashboard: focused
              ? "grid"
              : "grid-outline",

            Events: focused
              ? "calendar"
              : "calendar-outline",

            Profile: focused
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
        name="Dashboard"
        component={OrganizerDashboardScreen}
      />

      <OrganizerTab.Screen
        name="Events"
        component={ManageEventsScreen}
      />

      <OrganizerTab.Screen
        name="Profile"
        component={ProfileScreen}
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