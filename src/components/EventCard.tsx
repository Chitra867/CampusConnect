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

  actionLabel?: string;

  actionIcon?: keyof typeof Ionicons.glyphMap;

  actionTone?: "primary" | "danger";

  onAction?: () => void;
}

export default function EventCard({
  event,
  onPress,
  actionLabel,
  actionIcon = "close-circle-outline",
  actionTone = "primary",
  onAction,
}: EventCardProps) {
  const availableSeats = Math.max(
    event.capacity - event.registered,
    0
  );

  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.mainContent,
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
        </View>
      </Pressable>

      <View style={styles.footer}>
        <Text
          style={[
            styles.seats,
            availableSeats <= 10 &&
              styles.lowSeats,
          ]}
        >
          {availableSeats > 0
            ? `${availableSeats} seats available`
            : "Event is full"}
        </Text>

        <View style={styles.footerActions}>
          {onAction && actionLabel ? (
            <Pressable
              onPress={onAction}
              style={({ pressed }) => [
                styles.actionButton,
                actionTone === "danger" &&
                  styles.dangerActionButton,
                pressed &&
                  styles.actionPressed,
              ]}
            >
              <Ionicons
                name={actionIcon}
                size={16}
                color={
                  actionTone === "danger"
                    ? colors.danger
                    : colors.primary
                }
              />

              <Text
                style={[
                  styles.actionText,
                  actionTone === "danger" &&
                    styles.dangerActionText,
                ]}
              >
                {actionLabel}
              </Text>
            </Pressable>
          ) : null}

          <Pressable
            onPress={onPress}
            style={styles.detailsButton}
            hitSlop={8}
          >
            <Text style={styles.detailsText}>
              Details
            </Text>

            <Ionicons
              name="arrow-forward"
              size={17}
              color={colors.primary}
            />
          </Pressable>
        </View>
      </View>
    </View>
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

  mainContent: {
    backgroundColor: colors.surface,
  },

  pressed: {
    opacity: 0.86,
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
    paddingBottom: 10,
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
    minHeight: 58,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  seats: {
    flex: 1,
    color: colors.success,
    fontSize: 12,
    fontWeight: "700",
  },

  lowSeats: {
    color: colors.danger,
  },

  footerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  detailsText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 7,
    gap: 4,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
  },

  dangerActionButton: {
    backgroundColor: "#FFF1F1",
  },

  actionText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  dangerActionText: {
    color: colors.danger,
  },

  actionPressed: {
    opacity: 0.7,
  },
});