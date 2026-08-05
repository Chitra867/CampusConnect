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

import OrganizerDashboardScreen from "../screens/organizer/OrganizerDashboardScreen";

import EventDetailsScreen from "../screens/student/EventDetailsScreen";
import HomeScreen from "../screens/student/HomeScreen";
import MyEventsScreen from "../screens/student/MyEventsScreen";

import { useAuthStore } from "../store/authStore";
import { colors } from "../theme/colors";

import {
  StudentRootStackParamList,
} from "../types";

const StudentRootStack =
  createNativeStackNavigator<StudentRootStackParamList>();

const StudentTab =
  createBottomTabNavigator();

const OrganizerTab =
  createBottomTabNavigator();

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

function OrganizerNavigator() {
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