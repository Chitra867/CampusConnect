import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import EventCard from "../../components/EventCard";
import { EVENTS } from "../../data/events";
import { colors } from "../../theme/colors";

export default function ManageEventsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={EVENTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                Manage Events
              </Text>

              <Text style={styles.subtitle}>
                Create and manage events.
              </Text>
            </View>

            <Pressable
              onPress={() =>
                Alert.alert(
                  "Create Event",
                  "The event form will be added next."
                )
              }
              style={styles.addButton}
            >
              <Ionicons
                name="add"
                size={27}
                color={colors.white}
              />
            </Pressable>
          </View>
        }
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() =>
              Alert.alert(
                item.title,
                "Editing and participant management will be added next."
              )
            }
          />
        )}
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
    paddingTop: 12,
    paddingBottom: 22,
  },

  title: {
    color: colors.text,
    fontSize: 27,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 5,
    color: colors.textSecondary,
    fontSize: 14,
  },

  addButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: colors.primary,
  },
});
