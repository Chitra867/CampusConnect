import { FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import EventCard from "../../components/EventCard";
import { useEventStore } from "../../store/eventStore";
import { usePreferenceStore } from "../../store/preferenceStore";
import { useRegistrationStore } from "../../store/registrationStore";
import { colors } from "../../theme/colors";
import { StudentRootStackParamList } from "../../types";

type NavigationProp = NativeStackNavigationProp<StudentRootStackParamList>;

export default function SavedEventsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const events = useEventStore((state) => state.events);
  const registrations = useRegistrationStore((state) => state.registrations);
  const bookmarkedEventIds = usePreferenceStore(
    (state) => state.bookmarkedEventIds
  );
  const toggleBookmark = usePreferenceStore((state) => state.toggleBookmark);

  const activeCounts = registrations.reduce<Record<string, number>>(
    (counts, registration) => {
      if (registration.status === "registered") {
        counts[registration.eventId] =
          (counts[registration.eventId] ?? 0) + 1;
      }
      return counts;
    },
    {}
  );

  const savedEvents = events
    .filter((event) => bookmarkedEventIds.includes(event.id))
    .map((event) => ({
      ...event,
      registered: event.registered + (activeCounts[event.id] ?? 0),
    }));

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={savedEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>YOUR COLLECTION</Text>
            <Text style={styles.title}>Saved Events</Text>
            <Text style={styles.subtitle}>
              Keep interesting events close and decide when you are ready.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
            actionLabel="Remove"
            actionIcon="bookmark"
            actionTone="danger"
            onAction={() => toggleBookmark(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="bookmark-outline" size={44} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptyText}>
              Tap the bookmark icon on an event to keep it here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, padding: 20, paddingBottom: 32 },
  header: { marginBottom: 24 },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: "900", letterSpacing: 1.4 },
  title: { marginTop: 7, color: colors.text, fontSize: 30, fontWeight: "900" },
  subtitle: { marginTop: 8, maxWidth: 360, color: colors.textSecondary, fontSize: 15, lineHeight: 22 },
  emptyState: { alignItems: "center", paddingTop: 70, paddingHorizontal: 28 },
  emptyIcon: { width: 92, height: 92, alignItems: "center", justifyContent: "center", borderRadius: 30, backgroundColor: colors.primarySoft },
  emptyTitle: { marginTop: 20, color: colors.text, fontSize: 21, fontWeight: "900" },
  emptyText: { marginTop: 8, color: colors.textSecondary, fontSize: 15, lineHeight: 22, textAlign: "center" },
});
