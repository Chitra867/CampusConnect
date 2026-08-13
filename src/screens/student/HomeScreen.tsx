import {
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  useState,
} from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  useNavigation,
} from "@react-navigation/native";

import type {
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "../../store/authStore";
import { useEventStore } from "../../store/eventStore";
import { usePreferenceStore } from "../../store/preferenceStore";

import {
  useRegistrationStore,
} from "../../store/registrationStore";
import { useHomeEvents } from "../../hooks/useHomeEvents";

import type {
  CampusEvent,
  StudentRootStackParamList,
} from "../../types";

type NavigationProp =
  NativeStackNavigationProp<StudentRootStackParamList>;

const palette = {
  navy: "#111378",
  purple: "#A66BFA",
  purpleDark: "#7043CE",
  purpleSoft: "#EEE7FF",
  background: "#F7F8FC",
  surface: "#FFFFFF",
  text: "#222329",
  secondary: "#737583",
  border: "#E7E7EF",
  orange: "#FF6B3D",
  success: "#21885E",
  white: "#FFFFFF",
};

const CATEGORY_IMAGES: Record<
  string,
  string
> = {
  technology:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",

  workshop:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",

  arts:
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85",

  cultural:
    "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=900&q=85",

  sports:
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=85",

  career:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",

  competition:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
};

const DEFAULT_EVENT_IMAGE =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=85";

function getEventImage(
  event: CampusEvent
): string {
  if (event.posterUrl) {
    return event.posterUrl;
  }

  const category =
    event.category.trim().toLowerCase();

  return (
    CATEGORY_IMAGES[category] ??
    DEFAULT_EVENT_IMAGE
  );
}

function getShortDate(dateValue: string): {
  month: string;
  day: string;
} {
  const parsedDate = new Date(dateValue);

  if (
    Number.isNaN(parsedDate.getTime())
  ) {
    return {
      month: "EVENT",
      day: "--",
    };
  }

  return {
    month: parsedDate
      .toLocaleDateString("en-US", {
        month: "short",
      })
      .toUpperCase(),

    day: parsedDate
      .getDate()
      .toString(),
  };
}

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

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("All");

  const [
    selectedClub,
    setSelectedClub,
  ] = useState<string | null>(null);

  const preferencesByUser = usePreferenceStore(
    (state) => state.preferencesByUser
  );
  const bookmarkedIds = user
    ? preferencesByUser[user.id]?.bookmarkedEventIds ?? []
    : [];

  const toggleBookmark = usePreferenceStore(
    (state) => state.toggleBookmark
  );

  const {
    categories,
    clubs,
    filteredEvents,
    featuredEvent,
    recommendationEvents,
    upcomingEvents,
  } = useHomeEvents(events, registrations, search, selectedCategory, selectedClub);

  const navigateToEvent = (
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
      <FlatList
        data={upcomingEvents}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.content
        }
        ListHeaderComponent={
          <>
            <View style={styles.topHeader}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Open menu"
                style={styles.headerIconButton}
              >
                <Ionicons
                  name="menu"
                  size={29}
                  color={palette.navy}
                />
              </Pressable>

              <Text style={styles.brand}>
                CampusConnect
              </Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Notifications"
                onPress={() => navigation.navigate("Notifications")}
                style={styles.notificationButton}
              >
                <Ionicons
                  name="notifications-outline"
                  size={25}
                  color={palette.text}
                />

                <View
                  style={styles.notificationDot}
                />
              </Pressable>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons
                name="search-outline"
                size={25}
                color={palette.secondary}
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search events, clubs, or venues..."
                placeholderTextColor={
                  palette.secondary
                }
                autoCorrect={false}
                returnKeyType="search"
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
                    size={22}
                    color={
                      palette.secondary
                    }
                  />
                </Pressable>
              ) : null}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={
                styles.categoryList
              }
            >
              {categories.map(
                (category) => {
                  const selected =
                    category ===
                    selectedCategory;

                  return (
                    <Pressable
                      key={category}
                      onPress={() =>
                        setSelectedCategory(
                          category
                        )
                      }
                      style={[
                        styles.categoryChip,
                        selected &&
                          styles.selectedCategoryChip,
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          selected &&
                            styles.selectedCategoryChipText,
                        ]}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </ScrollView>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={
                styles.clubList
              }
            >
              {clubs.map((club) => {
                const selected =
                  club === selectedClub;

                return (
                  <Pressable
                    key={club}
                    onPress={() =>
                      setSelectedClub(
                        selected
                          ? null
                          : club
                      )
                    }
                    style={[
                      styles.clubChip,
                      selected &&
                        styles.selectedClubChip,
                    ]}
                  >
                    <Text
                      style={[
                        styles.clubChipText,
                        selected &&
                          styles.selectedClubChipText,
                      ]}
                    >
                      {club}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={styles.mainHeading}>
              For You
            </Text>

            {featuredEvent ? (
              <FeaturedEventCard
                event={featuredEvent}
                onPress={() =>
                  navigateToEvent(
                    featuredEvent.id
                  )
                }
              />
            ) : null}

            {recommendationEvents.map(
              (event) => (
                <CompactEventCard
                  key={event.id}
                  event={event}
                  onPress={() =>
                    navigateToEvent(
                      event.id
                    )
                  }
                />
              )
            )}

            {filteredEvents.length >
            0 ? (
              <View
                style={
                  styles.upcomingHeader
                }
              >
                <Text
                  style={
                    styles.upcomingHeading
                  }
                >
                  Upcoming Events
                </Text>

                <Text
                  style={styles.viewAllText}
                >
                  View All
                </Text>
              </View>
            ) : null}
          </>
        }
        renderItem={({ item }) => (
          <UpcomingEventRow
            event={item}
            bookmarked={bookmarkedIds.includes(
              item.id
            )}
            onPress={() =>
              navigateToEvent(item.id)
            }
            onBookmark={() =>
              toggleBookmark(item.id)
            }
          />
        )}
        ListEmptyComponent={
          filteredEvents.length ===
          0 ? (
            <View style={styles.emptyState}>
              <View
                style={styles.emptyIcon}
              >
                <Ionicons
                  name="calendar-outline"
                  size={48}
                  color={palette.purpleDark}
                />
              </View>

              <Text style={styles.emptyTitle}>
                No events found
              </Text>

              <Text
                style={styles.emptyDescription}
              >
                Change your search, category or
                club filter.
              </Text>

              <Pressable
                onPress={() => {
                  setSearch("");
                  setSelectedCategory(
                    "All"
                  );
                  setSelectedClub(null);
                }}
                style={styles.clearFiltersButton}
              >
                <Text
                  style={
                    styles.clearFiltersText
                  }
                >
                  Clear Filters
                </Text>
              </Pressable>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

interface FeaturedEventCardProps {
  event: CampusEvent;
  onPress: () => void;
}

function FeaturedEventCard({
  event,
  onPress,
}: FeaturedEventCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.featuredCard,
        pressed && styles.pressed,
      ]}
    >
      <ImageBackground
        source={{
          uri: getEventImage(event),
        }}
        resizeMode="cover"
        style={styles.featuredImage}
        imageStyle={
          styles.featuredImageStyle
        }
      >
        <View
          style={styles.trendingBadge}
        >
          <Text
            style={styles.trendingText}
          >
            Trending
          </Text>
        </View>
      </ImageBackground>

      <View
        style={styles.featuredContent}
      >
        <View
          style={styles.featuredMetadata}
        >
          <Text
            style={styles.featuredClub}
            numberOfLines={1}
          >
            {event.organizerName.toUpperCase()}
          </Text>

          <Text
            style={styles.featuredDate}
            numberOfLines={1}
          >
            {event.date} • {event.time}
          </Text>
        </View>

        <Text
          style={styles.featuredTitle}
          numberOfLines={2}
        >
          {event.title}
        </Text>

        <Text
          style={styles.featuredDescription}
          numberOfLines={2}
        >
          {event.description}
        </Text>
      </View>
    </Pressable>
  );
}

interface CompactEventCardProps {
  event: CampusEvent;
  onPress: () => void;
}

function CompactEventCard({
  event,
  onPress,
}: CompactEventCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.compactCard,
        pressed && styles.pressed,
      ]}
    >
      <ImageBackground
        source={{
          uri: getEventImage(event),
        }}
        resizeMode="cover"
        style={styles.compactImage}
        imageStyle={
          styles.compactImageStyle
        }
      />

      <View
        style={styles.compactContent}
      >
        <Text
          style={styles.compactCategory}
        >
          {event.category.toUpperCase()}
        </Text>

        <Text
          style={styles.compactTitle}
          numberOfLines={2}
        >
          {event.title}
        </Text>

        <Text
          style={styles.compactMetadata}
          numberOfLines={1}
        >
          {event.date} • {event.venue}
        </Text>
      </View>
    </Pressable>
  );
}

interface UpcomingEventRowProps {
  event: CampusEvent;
  bookmarked: boolean;
  onPress: () => void;
  onBookmark: () => void;
}

function UpcomingEventRow({
  event,
  bookmarked,
  onPress,
  onBookmark,
}: UpcomingEventRowProps) {
  const date = getShortDate(event.date);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.upcomingCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.dateBox}>
        <Text style={styles.dateMonth}>
          {date.month}
        </Text>

        <Text style={styles.dateDay}>
          {date.day}
        </Text>
      </View>

      <View
        style={styles.upcomingContent}
      >
        <Text
          style={styles.upcomingTitle}
          numberOfLines={1}
        >
          {event.title}
        </Text>

        <Text
          style={styles.upcomingMetadata}
          numberOfLines={1}
        >
          {event.venue} • {event.time}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          bookmarked
            ? "Remove bookmark"
            : "Bookmark event"
        }
        onPress={(pressEvent) => {
          pressEvent.stopPropagation();
          onBookmark();
        }}
        style={[
          styles.bookmarkButton,
          bookmarked &&
            styles.bookmarkedButton,
        ]}
      >
        <Ionicons
          name={
            bookmarked
              ? "bookmark"
              : "bookmark-outline"
          }
          size={23}
          color={
            bookmarked
              ? palette.purpleDark
              : "#A6A7B5"
          }
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },

  content: {
    flexGrow: 1,
    paddingBottom: 28,
  },

  topHeader: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    backgroundColor: palette.background,
  },

  headerIconButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  brand: {
    flex: 1,
    color: palette.navy,
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },

  notificationButton: {
    width: 40,
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  notificationDot: {
    position: "absolute",
    top: 6,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: palette.background,
    backgroundColor: palette.orange,
  },

  searchContainer: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 19,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    gap: 13,
    borderRadius: 17,
    backgroundColor: palette.surface,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  searchInput: {
    flex: 1,
    color: palette.text,
    fontSize: 16,
  },

  categoryList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 10,
  },

  categoryChip: {
    minWidth: 92,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 19,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "#EDEEF2",
  },

  selectedCategoryChip: {
    backgroundColor: palette.purple,
  },

  categoryChipText: {
    color: "#535563",
    fontSize: 14,
    fontWeight: "800",
  },

  selectedCategoryChipText: {
    color: "#50317D",
  },

  clubList: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
    gap: 10,
  },

  clubChip: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 19,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#CBCBD9",
    backgroundColor: palette.background,
  },

  selectedClubChip: {
    borderColor: palette.purpleDark,
    backgroundColor: palette.purpleSoft,
  },

  clubChipText: {
    color: "#535563",
    fontSize: 14,
    fontWeight: "800",
  },

  selectedClubChipText: {
    color: palette.purpleDark,
  },

  mainHeading: {
    marginTop: 10,
    marginBottom: 13,
    marginHorizontal: 20,
    color: palette.navy,
    fontSize: 27,
    fontWeight: "900",
  },

  featuredCard: {
    marginHorizontal: 20,
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: palette.surface,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.08,
    shadowRadius: 13,
    elevation: 5,
  },

  featuredImage: {
    height: 250,
    padding: 18,
  },

  featuredImageStyle: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  trendingBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.92)",
  },

  trendingText: {
    color: palette.text,
    fontSize: 13,
    fontWeight: "700",
  },

  featuredContent: {
    paddingHorizontal: 27,
    paddingTop: 22,
    paddingBottom: 27,
  },

  featuredMetadata: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  featuredClub: {
    flex: 1,
    color: palette.navy,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.5,
  },

  featuredDate: {
    maxWidth: "52%",
    color: palette.secondary,
    fontSize: 12,
    fontWeight: "600",
  },

  featuredTitle: {
    marginTop: 15,
    color: palette.text,
    fontSize: 25,
    lineHeight: 32,
    fontWeight: "900",
  },

  featuredDescription: {
    marginTop: 13,
    color: palette.secondary,
    fontSize: 15,
    lineHeight: 22,
  },

  compactCard: {
    minHeight: 154,
    flexDirection: "row",
    marginTop: 18,
    marginHorizontal: 20,
    overflow: "hidden",
    borderRadius: 22,
    backgroundColor: palette.surface,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  compactImage: {
    width: 148,
    minHeight: 154,
  },

  compactImageStyle: {
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },

  compactContent: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 19,
    paddingVertical: 16,
  },

  compactCategory: {
    color: palette.orange,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  compactTitle: {
    marginTop: 8,
    color: palette.text,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "900",
  },

  compactMetadata: {
    marginTop: 7,
    color: palette.secondary,
    fontSize: 12,
    fontWeight: "600",
  },

  upcomingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 35,
    marginBottom: 14,
    marginHorizontal: 20,
  },

  upcomingHeading: {
    color: palette.navy,
    fontSize: 27,
    fontWeight: "900",
  },

  viewAllText: {
    color: palette.navy,
    fontSize: 14,
    fontWeight: "800",
  },

  upcomingCard: {
    minHeight: 100,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginHorizontal: 20,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 18,
    backgroundColor: palette.surface,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  dateBox: {
    width: 70,
    minHeight: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: "#E5DEFF",
  },

  dateMonth: {
    color: palette.navy,
    fontSize: 12,
    fontWeight: "800",
  },

  dateDay: {
    marginTop: 2,
    color: palette.navy,
    fontSize: 26,
    fontWeight: "900",
  },

  upcomingContent: {
    flex: 1,
    marginLeft: 18,
    paddingRight: 8,
  },

  upcomingTitle: {
    color: palette.text,
    fontSize: 17,
    fontWeight: "900",
  },

  upcomingMetadata: {
    marginTop: 7,
    color: palette.secondary,
    fontSize: 13,
  },

  bookmarkButton: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#CFCFDC",
    backgroundColor: palette.surface,
  },

  bookmarkedButton: {
    borderColor: palette.purple,
    backgroundColor: palette.purpleSoft,
  },

  emptyState: {
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: 70,
    paddingBottom: 100,
  },

  emptyIcon: {
    width: 94,
    height: 94,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 31,
    backgroundColor: palette.purpleSoft,
  },

  emptyTitle: {
    marginTop: 18,
    color: palette.text,
    fontSize: 20,
    fontWeight: "900",
  },

  emptyDescription: {
    marginTop: 7,
    color: palette.secondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  clearFiltersButton: {
    marginTop: 19,
    paddingHorizontal: 21,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: palette.purple,
  },

  clearFiltersText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "900",
  },

  pressed: {
    opacity: 0.82,
  },
});
