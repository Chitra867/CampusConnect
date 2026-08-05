import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  useEffect,
  useState,
} from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../store/authStore";
import { useEventStore } from "../../store/eventStore";
import { colors } from "../../theme/colors";

import {
  EventFormValues,
  OrganizerRootStackParamList,
} from "../../types";

type Props = NativeStackScreenProps<
  OrganizerRootStackParamList,
  "OrganizerEventForm"
>;

export default function OrganizerEventFormScreen({
  navigation,
  route,
}: Props) {
  const user = useAuthStore(
    (state) => state.user
  );

  const events = useEventStore(
    (state) => state.events
  );

  const addEvent = useEventStore(
    (state) => state.addEvent
  );

  const updateEvent = useEventStore(
    (state) => state.updateEvent
  );

  const eventId =
    route.params?.eventId;

  const editingEvent = events.find(
    (event) => event.id === eventId
  );

  const editing = Boolean(editingEvent);

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [venue, setVenue] =
    useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [capacity, setCapacity] =
    useState("50");

  const [organizerName, setOrganizerName] =
    useState(
      user?.fullName ??
        "Campus Organizer"
    );

  const [description, setDescription] =
    useState("");

  useEffect(() => {
    if (!editingEvent) {
      return;
    }

    setTitle(editingEvent.title);
    setCategory(editingEvent.category);
    setVenue(editingEvent.venue);
    setDate(editingEvent.date);
    setTime(editingEvent.time);

    setCapacity(
      editingEvent.capacity.toString()
    );

    setOrganizerName(
      editingEvent.organizerName
    );

    setDescription(
      editingEvent.description
    );
  }, [editingEvent]);

  const handleSave = () => {
    const cleanTitle = title.trim();
    const cleanCategory =
      category.trim();
    const cleanVenue = venue.trim();
    const cleanDate = date.trim();
    const cleanTime = time.trim();

    const cleanOrganizerName =
      organizerName.trim();

    const cleanDescription =
      description.trim();

    const parsedCapacity =
      Number(capacity);

    if (
      !cleanTitle ||
      !cleanCategory ||
      !cleanVenue ||
      !cleanDate ||
      !cleanTime ||
      !cleanOrganizerName ||
      !cleanDescription
    ) {
      Alert.alert(
        "Missing Information",
        "Complete every event field."
      );

      return;
    }

    if (
      !Number.isInteger(
        parsedCapacity
      ) ||
      parsedCapacity <= 0
    ) {
      Alert.alert(
        "Invalid Capacity",
        "Capacity must be a whole number greater than zero."
      );

      return;
    }

    if (
      editingEvent &&
      parsedCapacity <
        editingEvent.registered
    ) {
      Alert.alert(
        "Invalid Capacity",
        `Capacity cannot be lower than the current ${editingEvent.registered} registrations.`
      );

      return;
    }

    const values: EventFormValues = {
      title: cleanTitle,
      category: cleanCategory,
      venue: cleanVenue,
      date: cleanDate,
      time: cleanTime,
      capacity: parsedCapacity,
      organizerName:
        cleanOrganizerName,
      description:
        cleanDescription,
    };

    if (editingEvent) {
      updateEvent(
        editingEvent.id,
        values
      );

      Alert.alert(
        "Event Updated",
        "The event changes have been saved.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.goBack(),
          },
        ]
      );

      return;
    }

    const newEventId = addEvent(
      values,
      user?.id ?? "organizer"
    );

    navigation.replace(
      "OrganizerEventDetails",
      {
        eventId: newEventId,
      }
    );
  };

  if (eventId && !editingEvent) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>
          Event not found.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={["bottom"]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.pageTitle}>
            {editing
              ? "Edit Event"
              : "Create Event"}
          </Text>

          <Text style={styles.subtitle}>
            {editing
              ? "Update the selected event information."
              : "Enter the information for your new campus event."}
          </Text>

          <FormInput
            label="Event Title"
            icon="calendar-outline"
            value={title}
            onChangeText={setTitle}
            placeholder="React Native Workshop"
          />

          <FormInput
            label="Category"
            icon="grid-outline"
            value={category}
            onChangeText={setCategory}
            placeholder="Technology"
          />

          <FormInput
            label="Venue"
            icon="location-outline"
            value={venue}
            onChangeText={setVenue}
            placeholder="Computer Lab 3"
          />

          <FormInput
            label="Date"
            icon="calendar-number-outline"
            value={date}
            onChangeText={setDate}
            placeholder="September 10, 2026"
          />

          <FormInput
            label="Time"
            icon="time-outline"
            value={time}
            onChangeText={setTime}
            placeholder="10:00 AM"
          />

          <FormInput
            label="Capacity"
            icon="people-outline"
            value={capacity}
            onChangeText={setCapacity}
            placeholder="50"
            keyboardType="number-pad"
          />

          <FormInput
            label="Organizer or Club"
            icon="business-outline"
            value={organizerName}
            onChangeText={
              setOrganizerName
            }
            placeholder="IT Club"
          />

          <Text style={styles.label}>
            Description
          </Text>

          <View
            style={[
              styles.inputContainer,
              styles.descriptionContainer,
            ]}
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color={colors.textSecondary}
              style={styles.descriptionIcon}
            />

            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Enter complete event details..."
              placeholderTextColor={
                colors.textSecondary
              }
              multiline
              textAlignVertical="top"
              style={[
                styles.input,
                styles.descriptionInput,
              ]}
            />
          </View>

          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={
                editing
                  ? "save-outline"
                  : "add-circle-outline"
              }
              size={21}
              color={colors.white}
            />

            <Text style={styles.saveText}>
              {editing
                ? "Save Changes"
                : "Create Event"}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface FormInputProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  placeholder: string;
  keyboardType?: "default" | "number-pad";
  onChangeText: (
    value: string
  ) => void;
}

function FormInput({
  label,
  icon,
  value,
  placeholder,
  keyboardType = "default",
  onChangeText,
}: FormInputProps) {
  return (
    <>
      <Text style={styles.label}>
        {label}
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name={icon}
          size={20}
          color={colors.textSecondary}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={
            colors.textSecondary
          }
          keyboardType={keyboardType}
          style={styles.input}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  errorText: {
    color: colors.danger,
    fontSize: 17,
    fontWeight: "800",
  },

  content: {
    padding: 18,
    paddingBottom: 35,
  },

  pageTitle: {
    marginTop: 5,
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 23,
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  label: {
    marginBottom: 8,
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
  },

  inputContainer: {
    minHeight: 53,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 17,
    paddingHorizontal: 15,
    gap: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  input: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
  },

  descriptionContainer: {
    minHeight: 130,
    alignItems: "flex-start",
    paddingTop: 15,
  },

  descriptionIcon: {
    marginTop: 2,
  },

  descriptionInput: {
    minHeight: 100,
    paddingTop: 0,
  },

  saveButton: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    gap: 8,
    borderRadius: 16,
    backgroundColor: colors.primary,
  },

  saveText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },

  pressed: {
    opacity: 0.82,
  },
});