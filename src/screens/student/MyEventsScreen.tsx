import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useMemo } from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  useNavigation,
} from "@react-navigation/native";

import {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { SafeAreaView } from "react-native-safe-area-context";

import EventCard from "../../components/EventCard";
import { EVENTS } from "../../data/events";

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

export default function MyEventsScreen() {
  const navigation =
    useNavigation<NavigationProp>();

  const registeredEventIds =
    useRegistrationStore(
      (state) =>
        state.registeredEventIds
    );

  const cancelRegistration =
    useRegistrationStore(
      (state) =>
        state.cancelRegistration
    );

  const registeredEvents =
    useMemo<CampusEvent[]>(() => {
      return EVENTS.filter((event) =>
        registeredEventIds.includes(
          event.id
        )
      ).map((event) => ({
        ...event,
        registered: event.registered + 1,
      }));
    }, [registeredEventIds]);

  const handleCancel = (
    event: CampusEvent
  ) => {
    Alert.alert(
      "Cancel Registration",
      `Remove ${event.title} from My Events?`,
      [
        {
          text: "Keep Registration",
          style: "cancel",
        },
        {
          text: "Cancel Registration",
          style: "destructive",
          onPress: () => {
            cancelRegistration(event.id);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={registeredEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>
              My Events
            </Text>

            <Text style={styles.subtitle}>
              {registeredEvents.length > 0
                ? `${registeredEvents.length} registered ${
                    registeredEvents.length === 1
                      ? "event"
                      : "events"
                  }`
                : "Your registered events will appear here."}
            </Text>
          </View>
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
            actionLabel="Cancel"
            actionIcon="close-circle-outline"
            actionTone="danger"
            onAction={() =>
              handleCancel(item)
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="calendar-outline"
                size={52}
                color={colors.primary}
              />
            </View>

            <Text style={styles.emptyTitle}>
              No registered events
            </Text>

            <Text style={styles.emptyDescription}>
              Open an event from the Home screen
              and select Register for Event.
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
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingBottom: 80,
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
    marginTop: 18,
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
  },

  emptyDescription: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
});