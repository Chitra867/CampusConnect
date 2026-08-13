import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useState,
} from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  useNavigation,
} from "@react-navigation/native";

import {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { SafeAreaView } from "react-native-safe-area-context";
import ScheduleEventCard from "../../components/student/ScheduleEventCard";
import { ScheduleTab, useStudentEvents } from "../../hooks/useStudentEvents";

import { useAuthStore } from "../../store/authStore";
import { useEventStore } from "../../store/eventStore";
import { usePreferenceStore } from "../../store/preferenceStore";

import {
  useRegistrationStore,
} from "../../store/registrationStore";

import { StudentRootStackParamList } from "../../types";

type NavigationProp =
  NativeStackNavigationProp<StudentRootStackParamList>;

const palette = {
  navy: "#111378",
  purple: "#A66BFA",
  purpleDark: "#7043CE",
  purpleSoft: "#E9DFFF",
  background: "#F7F8FC",
  surface: "#FFFFFF",
  text: "#24252B",
  secondary: "#6E707E",
  border: "#E0E1E8",
  red: "#C92525",
  orange: "#FF6B45",
  green: "#21885E",
  grey: "#F0F1F5",
  white: "#FFFFFF",
};

export default function MyEventsScreen() {
  const navigation =
    useNavigation<NavigationProp>();

  const user = useAuthStore(
    (state) => state.user
  );

  const events = useEventStore(
    (state) => state.events
  );

  const registrations =
    useRegistrationStore(
      (state) => state.registrations
    );

  const [selectedTab, setSelectedTab] =
    useState<ScheduleTab>(
      "upcoming"
    );

  const preferencesByUser = usePreferenceStore(
    (state) => state.preferencesByUser
  );
  const reminderEventIds = user
    ? preferencesByUser[user.id]?.reminderEventIds ?? []
    : [];

  const toggleReminder = usePreferenceStore(
    (state) => state.toggleReminder
  );

  const scheduleSections = useStudentEvents(
    events,
    registrations,
    user?.id,
    selectedTab
  );

  const openEvent = (
    eventId: string
  ) => {
    navigation.navigate(
      "EventDetails",
      {
        eventId,
      }
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <SectionList
        sections={scheduleSections}
        keyExtractor={(item) =>
          item.id
        }
        showsVerticalScrollIndicator={
          false
        }
        stickySectionHeadersEnabled={
          false
        }
        contentContainerStyle={
          styles.content
        }
        ListHeaderComponent={
          <>
            <View
              style={styles.topHeader}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open menu"
                style={
                  styles.headerIconButton
                }
              >
                <Ionicons
                  name="menu"
                  size={30}
                  color={palette.text}
                />
              </Pressable>

              <Text
                style={styles.brand}
              >
                CampusConnect
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View notifications"
                onPress={() => navigation.navigate("Notifications")}
                style={
                  styles.notificationButton
                }
              >
                <Ionicons
                  name="notifications-outline"
                  size={27}
                  color={palette.text}
                />

                <View
                  style={
                    styles.notificationDot
                  }
                />
              </Pressable>
            </View>

            <View
              style={styles.tabContainer}
            >
              <Pressable
                onPress={() =>
                  setSelectedTab(
                    "upcoming"
                  )
                }
                style={[
                  styles.tabButton,

                  selectedTab ===
                    "upcoming" &&
                    styles.activeTabButton,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,

                    selectedTab ===
                      "upcoming" &&
                      styles.activeTabText,
                  ]}
                >
                  Upcoming
                </Text>
              </Pressable>

              <Pressable
                onPress={() =>
                  setSelectedTab(
                    "past"
                  )
                }
                style={[
                  styles.tabButton,

                  selectedTab ===
                    "past" &&
                    styles.activeTabButton,
                ]}
              >
                <Text
                  style={[
                    styles.tabText,

                    selectedTab ===
                      "past" &&
                      styles.activeTabText,
                  ]}
                >
                  Past
                </Text>
              </Pressable>
            </View>
          </>
        }
        renderSectionHeader={({
          section,
        }) => (
          <View
            style={styles.monthHeader}
          >
            <Text
              style={styles.monthTitle}
            >
              {section.title}
            </Text>

            <Ionicons
              name="calendar-outline"
              size={26}
              color={palette.navy}
            />
          </View>
        )}
        renderItem={({ item }) => (
          <ScheduleEventCard
            event={item}
            reminderEnabled={reminderEventIds.includes(
              item.id
            )}
            isPast={
              selectedTab === "past"
            }
            onPress={() =>
              openEvent(item.id)
            }
            onToggleReminder={() =>
              toggleReminder(item.id)
            }
          />
        )}
        ListEmptyComponent={
          <View
            style={styles.emptyContainer}
          >
            <View
              style={styles.emptyIcon}
            >
              <Ionicons
                name={
                  selectedTab ===
                  "upcoming"
                    ? "calendar-outline"
                    : "time-outline"
                }
                size={54}
                color={
                  palette.purpleDark
                }
              />
            </View>

            <Text
              style={styles.emptyTitle}
            >
              {selectedTab ===
              "upcoming"
                ? "No upcoming events"
                : "No past events"}
            </Text>

            <Text
              style={
                styles.emptyDescription
              }
            >
              {selectedTab ===
              "upcoming"
                ? "Events you register for will appear in your schedule."
                : "Your completed events will appear here."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      palette.background,
  },

  content: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  topHeader: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor:
      palette.border,
    backgroundColor:
      palette.background,
  },

  headerIconButton: {
    width: 45,
    height: 45,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  brand: {
    flex: 1,
    color: palette.navy,
    fontSize: 23,
    fontWeight: "900",
    textAlign: "center",
  },

  notificationButton: {
    width: 45,
    height: 45,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  notificationDot: {
    position: "absolute",
    top: 5,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor:
      palette.background,
    backgroundColor:
      palette.orange,
  },

  tabContainer: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    marginHorizontal: 20,
    padding: 5,
    borderRadius: 17,
    backgroundColor:
      "#ECEEF3",
  },

  tabButton: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },

  activeTabButton: {
    backgroundColor:
      palette.surface,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  tabText: {
    color: "#4B4D59",
    fontSize: 15,
    fontWeight: "800",
  },

  activeTabText: {
    color: palette.navy,
  },

  monthHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    paddingTop: 27,
    paddingBottom: 15,
    paddingHorizontal: 22,
  },

  monthTitle: {
    color: palette.text,
    fontSize: 23,
    fontWeight: "900",
  },

  emptyContainer: {
    alignItems: "center",
    paddingTop: 75,
    paddingHorizontal: 35,
  },

  emptyIcon: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    backgroundColor:
      palette.purpleSoft,
  },

  emptyTitle: {
    marginTop: 20,
    color: palette.text,
    fontSize: 22,
    fontWeight: "900",
  },

  emptyDescription: {
    marginTop: 9,
    color: palette.secondary,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.82,
  },
});
