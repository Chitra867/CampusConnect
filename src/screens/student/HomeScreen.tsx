import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import EventCard from "../../components/EventCard";
import { EVENTS } from "../../data/events";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";

export default function HomeScreen() {
  const user = useAuthStore(
    (state) => state.user
  );

  const [search, setSearch] = useState("");

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return EVENTS;
    }

    return EVENTS.filter((event) =>
      event.title.toLowerCase().includes(query)
    );
  }, [search]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.welcome}>
                  Welcome back
                </Text>

                <Text style={styles.name}>
                  {user?.fullName}
                </Text>
              </View>

              <View style={styles.notification}>
                <Ionicons
                  name="notifications-outline"
                  size={23}
                  color={colors.primary}
                />
              </View>
            </View>

            <View style={styles.hero}>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>
                  Explore Campus Events
                </Text>

                <Text style={styles.heroText}>
                  Discover workshops, seminars,
                  competitions and sports programs.
                </Text>
              </View>

              <Ionicons
                name="calendar"
                size={54}
                color={colors.white}
              />
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
                placeholder="Search events..."
                placeholderTextColor={
                  colors.textSecondary
                }
                style={styles.searchInput}
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Upcoming Events
              </Text>

              <Text style={styles.eventCount}>
                {filteredEvents.length} events
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() =>
              Alert.alert(
                item.title,
                item.description
              )
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="search-outline"
              size={46}
              color={colors.textSecondary}
            />

            <Text style={styles.emptyTitle}>
              No events found
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
    paddingHorizontal: 18,
    paddingBottom: 28,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 20,
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
    paddingVertical: 50,
  },

  emptyTitle: {
    marginTop: 12,
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },
});