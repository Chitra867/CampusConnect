import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import EventCard from "../../components/EventCard";
import { EVENTS } from "../../data/events";
import { colors } from "../../theme/colors";

export default function MyEventsScreen() {
  const registeredEvents = EVENTS.slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={registeredEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>
              My Events
            </Text>

            <Text style={styles.subtitle}>
              Events you have registered for.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="calendar-outline"
              size={52}
              color={colors.textSecondary}
            />

            <Text style={styles.emptyTitle}>
              No registered events
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
    paddingTop: 12,
    paddingBottom: 22,
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 5,
    color: colors.textSecondary,
    fontSize: 14,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyTitle: {
    marginTop: 14,
    color: colors.text,
    fontSize: 19,
    fontWeight: "800",
  },
});