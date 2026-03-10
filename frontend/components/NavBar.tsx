import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = 'mealPlan' | 'savedRecipes' | 'profile';

interface NavBarProps {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
}

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { key: TabKey; label: string; icon: string; activeIcon: string }[] = [
  { key: 'mealPlan',      label: 'Meal Plan',      icon: '📅', activeIcon: '📅' },
  { key: 'savedRecipes',  label: 'Saved',          icon: '🔖', activeIcon: '🔖' },
  { key: 'profile',       label: 'Profile',        icon: '👤', activeIcon: '👤' },
];

const ACTIVE_COLOR = '#2D6A4F';
const INACTIVE_COLOR = '#9CA3AF';
const INDICATOR_COLOR = '#52B788';

// ─── Component ────────────────────────────────────────────────────────────────

export default function NavBar({ activeTab, onTabPress }: NavBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 6 }]}>
      {/* Top border accent */}
      <View style={styles.topBorder} />

      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabPress(tab.key)}
              style={({ pressed }) => [
                styles.tab,
                pressed && styles.tabPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: isActive }}
            >
              {/* Active indicator dot */}
              <View style={styles.indicatorWrap}>
                {isActive && <View style={styles.indicator} />}
              </View>

              {/* Icon */}
              <Text style={styles.icon}>{isActive ? tab.activeIcon : tab.icon}</Text>

              {/* Label */}
              <Text style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      ios: {
        shadowColor: '#0D1F2D',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  topBorder: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  tabRow: {
    flexDirection: 'row',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  tabPressed: {
    opacity: 0.7,
  },
  indicatorWrap: {
    height: 3,
    width: 24,
    alignItems: 'center',
    marginBottom: 6,
  },
  indicator: {
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: INDICATOR_COLOR,
  },
  icon: {
    fontSize: 22,
    marginBottom: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: ACTIVE_COLOR,
  },
  labelInactive: {
    color: INACTIVE_COLOR,
  },
});
