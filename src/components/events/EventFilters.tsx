import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import type { EventFilter } from "../../hooks/useEventFilters";
import { colors } from "../../theme/colors";

interface Props {
  search: string;
  selected: EventFilter;
  counts: Record<EventFilter, number>;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: EventFilter) => void;
}

const visibleFilters: Array<{ value: EventFilter; label: string }> = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

export default function EventFilters({ search, selected, counts, onSearchChange, onFilterChange }: Props) {
  return (
    <>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={21} color={colors.textSecondary} />
        <TextInput
          value={search}
          onChangeText={onSearchChange}
          placeholder="Search your events..."
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInput}
        />
        {search.length > 0 ? (
          <Pressable onPress={() => onSearchChange("")}>
            <Ionicons name="close-circle" size={21} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {visibleFilters.map(({ value, label }) => (
          <Pressable
            key={value}
            onPress={() => onFilterChange(value)}
            style={[styles.filterButton, selected === value && styles.selectedFilterButton]}
          >
            <Text style={[styles.filterText, selected === value && styles.selectedFilterText]}>{label}</Text>
            <View style={[styles.filterCount, selected === value && styles.selectedFilterCount]}>
              <Text style={[styles.filterCountText, selected === value && styles.selectedFilterCountText]}>{counts[value]}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  searchBox: { minHeight: 53, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, gap: 10, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  searchInput: { flex: 1, color: colors.text, fontSize: 15 },
  filters: { paddingTop: 16, paddingBottom: 20, gap: 9 },
  filterButton: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, gap: 7, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  selectedFilterButton: { borderColor: colors.primary, backgroundColor: colors.primary },
  filterText: { color: colors.textSecondary, fontSize: 13, fontWeight: "800" },
  selectedFilterText: { color: colors.white },
  filterCount: { minWidth: 23, height: 23, alignItems: "center", justifyContent: "center", paddingHorizontal: 5, borderRadius: 8, backgroundColor: colors.primarySoft },
  selectedFilterCount: { backgroundColor: "rgba(255,255,255,0.2)" },
  filterCountText: { color: colors.primary, fontSize: 11, fontWeight: "900" },
  selectedFilterCountText: { color: colors.white },
});
