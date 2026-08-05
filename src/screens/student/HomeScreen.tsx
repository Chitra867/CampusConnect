import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
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

import EventCard from "../../components/EventCard";

import { useAuthStore } from "../../store/authStore";
import { useEventStore } from "../../store/eventStore";

import {
  useRegistrationStore,
} from "../../store/registrationStore";

import { colors } from "../../theme/colors";

import {
  CampusEvent,
  StudentRootStackParamList,
} from "../../types";

type NavigationProp =
  NativeStackNavigationProp<StudentRootStackParamList>;

export default function HomeScreen() {
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

  const [search, setSearch] =
    useState("");

  const filteredEvents =
    useMemo<CampusEvent[]>(() => {
      const query = search
        .trim()
        .toLowerCase();

      const registrationCountMap =
        registrations.reduce<
          Record<string, number>
        >((counts, registration) => {
          if (
            registration.status !==
            "registered"
          ) {
            return counts;
          }

          counts[registration.eventId] =
            (counts[
              registration.eventId
            ] ?? 0) + 1;

          return counts;
        }, {});

      const publishedEvents = events
        .filter(
          (event) =>
            event.status ===
            "published"
        )
        .map((event) => ({
          ...event,

          registered:
            event.registered +
            (registrationCountMap[
              event.id
            ] ?? 0),
        }));

      if (!query) {
        return publishedEvents;
      }

      return publishedEvents.filter(
        (event) =>
          event.title
            .toLowerCase()
            .includes(query) ||
          event.category
            .toLowerCase()
            .includes(query) ||
          event.venue
            .toLowerCase()
            .includes(query) ||
          event.organizerName
            .toLowerCase()
            .includes(query)
      );
    }, [
      events,
      registrations,
      search,
    ]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.welcome}>
                  Welcome back
                </Text>

                <Text
                  style={styles.name}
                  numberOfLines={1}
                >
                  {user?.fullName ??
                    "Campus Student"}
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="View notifications"
                style={({ pressed }) => [
                  styles.notification,
                  pressed &&
                    styles.pressed,
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={23}
                  color={colors.primary}
                />
              </Pressable>
            </View>

            <View style={styles.hero}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>
                  Explore Campus Events
                </Text>

                <Text style={styles.heroText}>
                  Discover workshops, seminars,
                  competitions and club programs.
                </Text>
              </View>

              <View style={styles.heroIcon}>
                <Ionicons
                  name="calendar"
                  size={48}
                  color={colors.white}
                />
              </View>
            </View>

            <View style={styles.searchBox}>
              <Ionicons
                name="search-outline"
                size={21}
                color={colors.textSecondary}
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search events, venue or club..."
                placeholderTextColor={
                  colors.textSecondary
                }
                autoCorrect={false}
                style={styles.searchInput}
              />

              {search.length > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  onPress={() =>
                    setSearch("")
                  }
                  hitSlop={10}
                >
                  <Ionicons
                    name="close-circle"
                    size={21}
                    color={
                      colors.textSecondary
                    }
                  />
                </Pressable>
              ) : null}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Upcoming Events
              </Text>

              <Text style={styles.eventCount}>
                {filteredEvents.length}{" "}
                {filteredEvents.length === 1
                  ? "event"
                  : "events"}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() =>
              navigation.navigate(
                "EventDetails",
                {
                  eventId: item.id,
                }
              )
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="search-outline"
                size={48}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No events found
            </Text>

            <Text style={styles.emptyDescription}>
              Try another event title, category,
              venue or organizer.
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
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingBottom: 28,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },

  headerContent: {
    flex: 1,
    paddingRight: 12,
  },

  welcome: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  name: {
    marginTop: 2,
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
  },

  notification: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    backgroundColor: colors.primarySoft,
  },

  hero: {
    minHeight: 150,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    padding: 21,
    borderRadius: 24,
    backgroundColor: colors.primary,
  },

  heroContent: {
    flex: 1,
    paddingRight: 10,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
  },

  heroText: {
    marginTop: 8,
    color: "#E9E6FF",
    fontSize: 14,
    lineHeight: 21,
  },

  heroIcon: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor:
      "rgba(255,255,255,0.15)",
  },

  searchBox: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 23,
    paddingHorizontal: 15,
    gap: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },

  eventCount: {
    color: colors.textSecondary,
    fontSize: 13,
  },

  empty: {
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 55,
  },

  emptyIcon: {
    width: 92,
    height: 92,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    backgroundColor: colors.primarySoft,
  },

  emptyTitle: {
    marginTop: 16,
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
  },

  emptyDescription: {
    marginTop: 7,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.8,
  },
});