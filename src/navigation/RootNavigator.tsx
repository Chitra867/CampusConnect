import { Ionicons } from "@expo/vector-icons";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import AuthNavigator from "./AuthNavigator";

import ProfileScreen from "../screens/common/ProfileScreen";

import ManageEventsScreen from "../screens/organizer/ManageEventsScreen";
import OrganizerDashboardScreen from "../screens/organizer/OrganizerDashboardScreen";
import OrganizerEventDetailsScreen from "../screens/organizer/OrganizerEventDetailsScreen";
import OrganizerEventFormScreen from "../screens/organizer/OrganizerEventFormScreen";
import OrganizerProfileScreen from "../screens/organizer/OrganizerProfileScreen";

import EventDetailsScreen from "../screens/student/EventDetailsScreen";
import HomeScreen from "../screens/student/HomeScreen";
import MyEventsScreen from "../screens/student/MyEventsScreen";

import { useAuthStore } from "../store/authStore";
import { colors } from "../theme/colors";

import {
  OrganizerRootStackParamList,
  StudentRootStackParamList,
} from "../types";

const StudentRootStack =
  createNativeStackNavigator<StudentRootStackParamList>();

const OrganizerRootStack =
  createNativeStackNavigator<OrganizerRootStackParamList>();

const StudentTab =
  createBottomTabNavigator();

const OrganizerTab =
  createBottomTabNavigator();

/* =========================================================
   STUDENT BOTTOM TABS
========================================================= */
function StudentTabs() {
  return (
    <StudentTab.Navigator
      id="StudentTabs"
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
          borderTopWidth: 1,
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
        options={{
          tabBarLabel: "Home",
        }}
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
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </StudentTab.Navigator>
  );
}

/* =========================================================
   STUDENT ROOT STACK
========================================================= */
function StudentNavigator() {
  return (
    <StudentRootStack.Navigator
      id="StudentRootStack"
    >
      <StudentRootStack.Screen
        name="MainTabs"
        component={StudentTabs}
        options={{
          headerShown: false,
        }}
      />

      <StudentRootStack.Screen
        name="EventDetails"
        component={EventDetailsScreen}
        options={{
          title: "Event Details",
          headerShadowVisible: false,
          headerTintColor: colors.text,

          headerStyle: {
            backgroundColor:
              colors.background,
          },

          headerTitleStyle: {
            fontWeight: "800",
          },
        }}
      />
    </StudentRootStack.Navigator>
  );
}

/* =========================================================
   ORGANIZER BOTTOM TABS
========================================================= */
function OrganizerTabs() {
  return (
    <OrganizerTab.Navigator
      id="OrganizerTabs"
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
          borderTopWidth: 1,
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

            ManageEvents: focused
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
        component={
          OrganizerDashboardScreen
        }
        options={{
          tabBarLabel: "Dashboard",
        }}
      />

      <OrganizerTab.Screen
        name="ManageEvents"
        component={ManageEventsScreen}
        options={{
          tabBarLabel: "Events",
        }}
      />

      <OrganizerTab.Screen
        name="Profile"
        component={OrganizerProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </OrganizerTab.Navigator>
  );
}

/* =========================================================
   ORGANIZER ROOT STACK
========================================================= */
function OrganizerNavigator() {
  return (
    <OrganizerRootStack.Navigator
      id="OrganizerRootStack"
    >
      <OrganizerRootStack.Screen
        name="OrganizerMainTabs"
        component={OrganizerTabs}
        options={{
          headerShown: false,
        }}
      />

      <OrganizerRootStack.Screen
        name="OrganizerEventDetails"
        component={
          OrganizerEventDetailsScreen
        }
        options={{
          title: "Event Details",
          headerShadowVisible: false,
          headerTintColor: colors.text,

          headerStyle: {
            backgroundColor:
              colors.background,
          },

          headerTitleStyle: {
            fontWeight: "800",
          },
        }}
      />

      <OrganizerRootStack.Screen
        name="OrganizerEventForm"
        component={OrganizerEventFormScreen}
        options={({ route }) => ({
          title: route.params?.eventId
            ? "Edit Event"
            : "Create Event",

          headerShadowVisible: false,
          headerTintColor: colors.text,

          headerStyle: {
            backgroundColor:
              colors.background,
          },

          headerTitleStyle: {
            fontWeight: "800",
          },
        })}
      />
    </OrganizerRootStack.Navigator>
  );
}

/* =========================================================
   ROOT NAVIGATOR
========================================================= */
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