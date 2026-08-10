import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  useMemo,
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

import { useAuthStore } from "../../store/authStore";
import { useEventStore } from "../../store/eventStore";
import { usePreferenceStore } from "../../store/preferenceStore";

import {
  useRegistrationStore,
} from "../../store/registrationStore";

import {
  CampusEvent,
  StudentRootStackParamList,
} from "../../types";

type NavigationProp =
  NativeStackNavigationProp<StudentRootStackParamList>;

type ScheduleTab =
  | "upcoming"
  | "past";

interface EventSection {
  title: string;
  data: CampusEvent[];
}

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

const CATEGORY_COLORS: Record<
  string,
  {
    foreground: string;
    background: string;
    accent: string;
  }
> = {
  technology: {
    foreground: "#7043CE",
    background: "#EBDCFF",
    accent: "#7043CE",
  },

  academic: {
    foreground: "#7043CE",
    background: "#EBDCFF",
    accent: "#7043CE",
  },

  career: {
    foreground: "#2F3037",
    background: "#E8E9ED",
    accent: "#A7A8B0",
  },

  social: {
    foreground: "#A52B16",
    background: "#FFD9D0",
    accent: "#6A281D",
  },

  sports: {
    foreground: "#1D6B4E",
    background: "#DCF4E9",
    accent: "#1D6B4E",
  },

  cultural: {
    foreground: "#C04B28",
    background: "#FFE4D8",
    accent: "#C04B28",
  },

  competition: {
    foreground: "#14669E",
    background: "#DCEFFF",
    accent: "#14669E",
  },
};

function getCategoryColors(
  category: string
) {
  return (
    CATEGORY_COLORS[
      category.trim().toLowerCase()
    ] ?? {
      foreground: palette.purpleDark,
      background: palette.purpleSoft,
      accent: palette.purpleDark,
    }
  );
}

function parseEventDate(
  event: CampusEvent
): Date | null {
  const dateValue =
    event.endDate ?? event.date;

  const parsedDate =
    new Date(dateValue);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return null;
  }

  return parsedDate;
}

function getMonthLabel(
  event: CampusEvent
): string {
  const date =
    parseEventDate(event);

  if (!date) {
    return "Other Events";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );
}

function getDateParts(
  event: CampusEvent
) {
  const date =
    parseEventDate(event);

  if (!date) {
    return {
      month: "EVENT",
      day: "--",
    };
  }

  return {
    month: date
      .toLocaleDateString(
        "en-US",
        {
          month: "short",
        }
      )
      .toUpperCase(),

    day: date
      .getDate()
      .toString()
      .padStart(2, "0"),
  };
}

function groupEventsByMonth(
  events: CampusEvent[]
): EventSection[] {
  const groups = events.reduce<
    Record<string, CampusEvent[]>
  >((result, event) => {
    const monthLabel =
      getMonthLabel(event);

    if (!result[monthLabel]) {
      result[monthLabel] = [];
    }

    result[monthLabel].push(
      event
    );

    return result;
  }, {});

  return Object.entries(groups).map(
    ([title, data]) => ({
      title,
      data,
    })
  );
}

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

  const studentEvents =
    useMemo<CampusEvent[]>(() => {
      if (!user) {
        return [];
      }

      const registeredEventIds =
        new Set(
          registrations
            .filter(
              (registration) =>
                registration.studentId ===
                  user.id &&
                registration.status ===
                  "registered"
            )
            .map(
              (registration) =>
                registration.eventId
            )
        );

      return events.filter(
        (event) =>
          registeredEventIds.has(
            event.id
          )
      );
    }, [
      events,
      registrations,
      user,
    ]);

  const scheduleSections =
    useMemo<EventSection[]>(() => {
      const now = new Date();

      const filtered =
        studentEvents.filter(
          (event) => {
            const eventDate =
              parseEventDate(event);

            const isPast =
              event.status ===
                "completed" ||
              (eventDate
                ? eventDate.getTime() <
                  now.getTime()
                : false);

            return selectedTab ===
              "past"
              ? isPast
              : !isPast;
          }
        );

      filtered.sort(
        (first, second) => {
          const firstDate =
            parseEventDate(first);

          const secondDate =
            parseEventDate(second);

          const firstTime =
            firstDate?.getTime() ?? 0;

          const secondTime =
            secondDate?.getTime() ?? 0;

          return selectedTab ===
            "past"
            ? secondTime - firstTime
            : firstTime - secondTime;
        }
      );

      return groupEventsByMonth(
        filtered
      );
    }, [
      studentEvents,
      selectedTab,
    ]);

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

interface ScheduleEventCardProps {
  event: CampusEvent;
  reminderEnabled: boolean;
  isPast: boolean;
  onPress: () => void;
  onToggleReminder: () => void;
}

function ScheduleEventCard({
  event,
  reminderEnabled,
  isPast,
  onPress,
  onToggleReminder,
}: ScheduleEventCardProps) {
  const dateParts =
    getDateParts(event);

  const categoryColors =
    getCategoryColors(
      event.category
    );

  return (
    <View style={styles.eventCard}>
      <View
        style={[
          styles.eventAccent,

          {
            backgroundColor:
              categoryColors.accent,
          },
        ]}
      />

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.eventContent,

          pressed &&
            styles.pressed,
        ]}
      >
        <View
          style={styles.eventTop}
        >
          <View
            style={styles.dateBox}
          >
            <Text
              style={[
                styles.dateMonth,

                {
                  color:
                    categoryColors.foreground,
                },
              ]}
            >
              {dateParts.month}
            </Text>

            <Text
              style={styles.dateDay}
            >
              {dateParts.day}
            </Text>
          </View>

          <View
            style={styles.eventDetails}
          >
            <View
              style={
                styles.eventTitleRow
              }
            >
              <Text
                style={styles.eventTitle}
                numberOfLines={1}
              >
                {event.title}
              </Text>

              <View
                style={[
                  styles.categoryBadge,

                  {
                    backgroundColor:
                      categoryColors.background,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,

                    {
                      color:
                        categoryColors.foreground,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {event.category}
                </Text>
              </View>
            </View>

            <View
              style={
                styles.informationRow
              }
            >
              <Ionicons
                name="time-outline"
                size={22}
                color={palette.text}
              />

              <Text
                style={
                  styles.informationText
                }
                numberOfLines={1}
              >
                {event.time}
                {event.endTime
                  ? ` - ${event.endTime}`
                  : ""}
              </Text>
            </View>

            <View
              style={
                styles.informationRow
              }
            >
              <Ionicons
                name="location-outline"
                size={22}
                color={palette.text}
              />

              <Text
                style={
                  styles.informationText
                }
                numberOfLines={1}
              >
                {event.venue}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={styles.divider}
        />

        <View
          style={styles.cardFooter}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              reminderEnabled
                ? "Disable event reminder"
                : "Enable event reminder"
            }
            onPress={(
              pressEvent
            ) => {
              pressEvent.stopPropagation();
              onToggleReminder();
            }}
            style={[
              styles.reminderButton,

              reminderEnabled &&
                styles.activeReminderButton,
            ]}
          >
            <Ionicons
              name={
                reminderEnabled
                  ? "notifications"
                  : "notifications-outline"
              }
              size={24}
              color={
                reminderEnabled
                  ? palette.purpleDark
                  : palette.navy
              }
            />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isPast
                ? "View event details"
                : "View event ticket"
            }
            onPress={(
              pressEvent
            ) => {
              pressEvent.stopPropagation();
              onPress();
            }}
            style={[
              styles.ticketButton,

              isPast &&
                styles.pastTicketButton,
            ]}
          >
            <Ionicons
              name={
                isPast
                  ? "eye-outline"
                  : "ticket-outline"
              }
              size={22}
              color={
                isPast
                  ? palette.navy
                  : palette.white
              }
            />

            <Text
              style={[
                styles.ticketText,

                isPast &&
                  styles.pastTicketText,
              ]}
            >
              {isPast
                ? "View Details"
                : reminderEnabled
                  ? "View Ticket"
                  : "Ticket"}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
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

  eventCard: {
    position: "relative",
    flexDirection: "row",
    marginBottom: 15,
    marginHorizontal: 20,
    overflow: "hidden",
    borderRadius: 18,
    borderWidth: 1,
    borderColor:
      palette.border,
    backgroundColor:
      palette.surface,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  eventAccent: {
    width: 7,
  },

  eventContent: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 16,
    paddingBottom: 14,
  },

  eventTop: {
    flexDirection: "row",
  },

  dateBox: {
    width: 68,
    height: 78,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
    borderWidth: 1,
    borderColor:
      "#D7D8DF",
    backgroundColor:
      "#F4F5F8",
  },

  dateMonth: {
    fontSize: 12,
    fontWeight: "900",
  },

  dateDay: {
    marginTop: 4,
    color: palette.text,
    fontSize: 27,
    fontWeight: "900",
  },

  eventDetails: {
    flex: 1,
    marginLeft: 14,
  },

  eventTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },

  eventTitle: {
    flex: 1,
    color: palette.text,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
  },

  categoryBadge: {
    maxWidth: 88,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 16,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "800",
  },

  informationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
    gap: 7,
  },

  informationText: {
    flex: 1,
    color: "#454752",
    fontSize: 13,
  },

  divider: {
    height: 1,
    marginTop: 16,
    backgroundColor:
      palette.border,
  },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginTop: 13,
  },

  reminderButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },

  activeReminderButton: {
    backgroundColor:
      palette.purpleSoft,
  },

  ticketButton: {
    minHeight: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 17,
    gap: 10,
    borderRadius: 14,
    backgroundColor:
      palette.navy,

    shadowColor: palette.navy,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },

  pastTicketButton: {
    borderWidth: 2,
    borderColor: palette.navy,
    backgroundColor:
      palette.surface,
    shadowOpacity: 0,
    elevation: 0,
  },

  ticketText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "900",
  },

  pastTicketText: {
    color: palette.navy,
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
