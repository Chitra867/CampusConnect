import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../theme/colors";
import { CampusEvent } from "../types";

interface EventCardProps {
  event: CampusEvent;
  onPress: () => void;
}

export default function EventCard({
  event,
  onPress,
}: EventCardProps) {
  const availableSeats =
    event.capacity - event.registered;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.poster}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {event.category}
          </Text>
        </View>

        <Ionicons
          name="calendar"
          size={52}
          color={colors.primary}
        />
      </View>

      <View style={styles.content}>
        <Text
          style={styles.title}
          numberOfLines={2}
        >
          {event.title}
        </Text>

        <InformationRow
          icon="calendar-outline"
          value={event.date}
        />

        <InformationRow
          icon="time-outline"
          value={event.time}
        />

        <InformationRow
          icon="location-outline"
          value={event.venue}
        />

        <View style={styles.footer}>
          <Text
            style={[
              styles.seats,
              availableSeats <= 10 &&
                styles.lowSeats,
            ]}
          >
            {availableSeats} seats available
          </Text>

          <View style={styles.details}>
            <Text style={styles.detailsText}>
              Details
            </Text>

            <Ionicons
              name="arrow-forward"
              size={17}
              color={colors.primary}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

interface InformationRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
}

function InformationRow({
  icon,
  value,
}: InformationRowProps) {
  return (
    <View style={styles.informationRow}>
      <Ionicons
        name={icon}
        size={17}
        color={colors.primary}
      />

      <Text
        style={styles.informationText}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },

  poster: {
    height: 125,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primarySoft,
  },

  categoryBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.primary,
  },

  categoryText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },

  content: {
    padding: 16,
  },

  title: {
    marginBottom: 13,
    color: colors.text,
    fontSize: 18,
    fontWeight: "800",
  },

  informationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },

  informationText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 14,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 9,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  seats: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "700",
  },

  lowSeats: {
    color: colors.danger,
  },

  details: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  detailsText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
});