import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import {
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";

import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const palette = {
  purple: "#AE7BFF",
  purpleDark: "#52328B",
  surface: "#FFFFFF",
  text: "#565866",
  border: "#EEEEF4",
};

interface RouteDesign {
  label: string;

  activeIcon:
    keyof typeof Ionicons.glyphMap;

  inactiveIcon:
    keyof typeof Ionicons.glyphMap;
}

const routeDesigns: Record<
  string,
  RouteDesign
> = {
  Home: {
    label: "Home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
  },

  MyEvents: {
    label: "Schedule",
    activeIcon: "calendar",
    inactiveIcon: "calendar-outline",
  },

  Saved: {
    label: "Saved",
    activeIcon: "bookmark",
    inactiveIcon: "bookmark-outline",
  },

  Profile: {
    label: "Profile",
    activeIcon: "person",
    inactiveIcon: "person-outline",
  },

  Dashboard: {
    label: "Home",
    activeIcon: "grid",
    inactiveIcon: "grid-outline",
  },

  ManageEvents: {
    label: "Events",
    activeIcon: "calendar",
    inactiveIcon: "calendar-outline",
  },
};

export default function ModernTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(
            insets.bottom,
            8
          ),
        },
      ]}
    >
      {state.routes.map(
        (route, index) => {
          const focused =
            state.index === index;

          const options =
            descriptors[route.key]
              .options;

          const design =
            routeDesigns[
              route.name
            ] ?? {
              label: route.name,

              activeIcon:
                "ellipse" as const,

              inactiveIcon:
                "ellipse-outline" as const,
            };

          const handlePress = () => {
            const event =
              navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

            if (
              !focused &&
              !event.defaultPrevented
            ) {
              navigation.navigate(
                route.name,
                route.params
              );
            }
          };

          const handleLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={
                focused
                  ? {
                      selected: true,
                    }
                  : {}
              }
              accessibilityLabel={
                options.tabBarAccessibilityLabel ??
                design.label
              }
              testID={
                options.tabBarButtonTestID
              }
              onPress={handlePress}
              onLongPress={
                handleLongPress
              }
              style={[
                styles.tabButton,
                focused &&
                  styles.activeTabButton,
              ]}
            >
              <Ionicons
                name={
                  focused
                    ? design.activeIcon
                    : design.inactiveIcon
                }
                size={25}
                color={
                  focused
                    ? palette.purpleDark
                    : palette.text
                }
              />

              <Text
                numberOfLines={1}
                style={[
                  styles.tabLabel,
                  focused &&
                    styles.activeTabLabel,
                ]}
              >
                {design.label}
              </Text>
            </Pressable>
          );
        }
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 7,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    backgroundColor: palette.surface,
  },

  tabButton: {
    flex: 1,
    minHeight: 58,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
    gap: 4,
    borderRadius: 30,
  },

  activeTabButton: {
    backgroundColor: palette.purple,
  },

  tabLabel: {
    color: palette.text,
    fontSize: 11,
    fontWeight: "800",
  },

  activeTabLabel: {
    color: palette.purpleDark,
  },
});
