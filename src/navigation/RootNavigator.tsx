import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import ModernTabBar from "../components/navigation/ModernTabBar";

import AuthNavigator from "./AuthNavigator";

import ProfileScreen from "../screens/common/ProfileScreen";

import EventParticipantsScreen from "../screens/organizer/EventParticipantsScreen";
import ManageEventsScreen from "../screens/organizer/ManageEventsScreen";
import OrganizerDashboardScreen from "../screens/organizer/OrganizerDashboardScreen";
import OrganizerEventDetailsScreen from "../screens/organizer/OrganizerEventDetailsScreen";
import OrganizerEventFormScreen from "../screens/organizer/OrganizerEventFormScreen";
import OrganizerProfileScreen from "../screens/organizer/OrganizerProfileScreen";

import EventDetailsScreen from "../screens/student/EventDetailsScreen";
import HomeScreen from "../screens/student/HomeScreen";
import MyEventsScreen from "../screens/student/MyEventsScreen";
import NotificationsScreen from "../screens/student/NotificationsScreen";
import SavedEventsScreen from "../screens/student/SavedEventsScreen";

import { useAuthStore } from "../store/authStore";

import {
  OrganizerRootStackParamList,
  StudentRootStackParamList,
} from "../types";

const navigationColors = {
  background: "#F7F8FC",
  text: "#222329",
};

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
      tabBar={(props) => (
        <ModernTabBar {...props} />
      )}
      screenOptions={{
        headerShown: false,
      }}
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
          tabBarLabel: "Schedule",
        }}
      />

      <StudentTab.Screen
        name="Saved"
        component={SavedEventsScreen}
        options={{
          tabBarLabel: "Saved",
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
          headerTintColor:
            navigationColors.text,

          headerStyle: {
            backgroundColor:
              navigationColors.background,
          },

          headerTitleStyle: {
            fontWeight: "800",
          },
        }}
      />

      <StudentRootStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: "Notifications",
          headerShadowVisible: false,
          headerTintColor: navigationColors.text,
          headerStyle: {
            backgroundColor: navigationColors.background,
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
      tabBar={(props) => (
        <ModernTabBar {...props} />
      )}
      screenOptions={{
        headerShown: false,
      }}
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
        component={
          OrganizerProfileScreen
        }
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
          headerTintColor:
            navigationColors.text,

          headerStyle: {
            backgroundColor:
              navigationColors.background,
          },

          headerTitleStyle: {
            fontWeight: "800",
          },
        }}
      />

      <OrganizerRootStack.Screen
        name="OrganizerEventForm"
        component={
          OrganizerEventFormScreen
        }
        options={({ route }) => ({
          title: route.params?.eventId
            ? "Edit Event"
            : "Create Event",

          headerShadowVisible: false,
          headerTintColor:
            navigationColors.text,

          headerStyle: {
            backgroundColor:
              navigationColors.background,
          },

          headerTitleStyle: {
            fontWeight: "800",
          },
        })}
      />

      <OrganizerRootStack.Screen
        name="OrganizerParticipants"
        component={
          EventParticipantsScreen
        }
        options={{
          title: "Participants",
          headerShadowVisible: false,
          headerTintColor:
            navigationColors.text,

          headerStyle: {
            backgroundColor:
              navigationColors.background,
          },

          headerTitleStyle: {
            fontWeight: "800",
          },
        }}
      />
    </OrganizerRootStack.Navigator>
  );
}

/* =========================================================
   APPLICATION ROOT NAVIGATOR
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
