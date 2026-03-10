import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface NutritionInfo {
  calories: number;
  proteinG: number;
  fiberG: number;
  carbsG: number;
  fatG: number;
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  imageUrl: string;
  nutrition: NutritionInfo;
  prepTimeMinutes: number;
  tags: string[];
}

interface DayPlan {
  date: string; // ISO date string
  meals: Meal[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_PLAN: DayPlan[] = [
  {
    date: '2026-03-09',
    meals: [
      {
        id: 'm1',
        name: 'Greek Yogurt & Berry Bowl',
        type: 'breakfast',
        imageUrl: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=200&q=80',
        nutrition: { calories: 320, proteinG: 22, fiberG: 5, carbsG: 38, fatG: 6 },
        prepTimeMinutes: 5,
        tags: ['high-protein', 'vegetarian'],
      },
      {
        id: 'm2',
        name: 'Grilled Chicken & Quinoa',
        type: 'lunch',
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80',
        nutrition: { calories: 510, proteinG: 45, fiberG: 6, carbsG: 42, fatG: 12 },
        prepTimeMinutes: 25,
        tags: ['high-protein', 'gluten-free'],
      },
      {
        id: 'm3',
        name: 'Salmon with Roasted Veg',
        type: 'dinner',
        imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&q=80',
        nutrition: { calories: 620, proteinG: 48, fiberG: 8, carbsG: 28, fatG: 28 },
        prepTimeMinutes: 35,
        tags: ['omega-3', 'gluten-free'],
      },
    ],
  },
  {
    date: '2026-03-10',
    meals: [
      {
        id: 'm4',
        name: 'Avocado Toast & Eggs',
        type: 'breakfast',
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&q=80',
        nutrition: { calories: 410, proteinG: 18, fiberG: 7, carbsG: 32, fatG: 22 },
        prepTimeMinutes: 10,
        tags: ['vegetarian'],
      },
      {
        id: 'm5',
        name: 'Lentil & Spinach Soup',
        type: 'lunch',
        imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=200&q=80',
        nutrition: { calories: 380, proteinG: 20, fiberG: 14, carbsG: 52, fatG: 6 },
        prepTimeMinutes: 30,
        tags: ['vegan', 'high-fiber'],
      },
      {
        id: 'm6',
        name: 'Turkey Meatballs & Zoodles',
        type: 'dinner',
        imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=200&q=80',
        nutrition: { calories: 490, proteinG: 42, fiberG: 5, carbsG: 18, fatG: 24 },
        prepTimeMinutes: 40,
        tags: ['low-carb', 'high-protein'],
      },
    ],
  },
  {
    date: '2026-03-11',
    meals: [
      {
        id: 'm7',
        name: 'Overnight Oats',
        type: 'breakfast',
        imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=200&q=80',
        nutrition: { calories: 350, proteinG: 12, fiberG: 9, carbsG: 58, fatG: 8 },
        prepTimeMinutes: 5,
        tags: ['vegan', 'meal-prep'],
      },
      {
        id: 'm8',
        name: 'Tuna Niçoise Salad',
        type: 'lunch',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80',
        nutrition: { calories: 440, proteinG: 36, fiberG: 7, carbsG: 24, fatG: 20 },
        prepTimeMinutes: 15,
        tags: ['gluten-free', 'high-protein'],
      },
      {
        id: 'm9',
        name: 'Chicken Tikka Masala',
        type: 'dinner',
        imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&q=80',
        nutrition: { calories: 580, proteinG: 44, fiberG: 4, carbsG: 36, fatG: 26 },
        prepTimeMinutes: 45,
        tags: ['gluten-free'],
      },
    ],
  },
  {
    date: '2026-03-12',
    meals: [
      {
        id: 'm10',
        name: 'Smoothie Bowl',
        type: 'breakfast',
        imageUrl: 'https://images.unsplash.com/photo-1490323814790-e01a18f7d31b?w=200&q=80',
        nutrition: { calories: 290, proteinG: 10, fiberG: 8, carbsG: 50, fatG: 6 },
        prepTimeMinutes: 8,
        tags: ['vegan', 'antioxidants'],
      },
      {
        id: 'm11',
        name: 'Black Bean Burrito Bowl',
        type: 'lunch',
        imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=200&q=80',
        nutrition: { calories: 520, proteinG: 22, fiberG: 16, carbsG: 72, fatG: 14 },
        prepTimeMinutes: 20,
        tags: ['vegan', 'high-fiber'],
      },
      {
        id: 'm12',
        name: 'Baked Cod & Sweet Potato',
        type: 'dinner',
        imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&q=80',
        nutrition: { calories: 430, proteinG: 38, fiberG: 6, carbsG: 38, fatG: 10 },
        prepTimeMinutes: 35,
        tags: ['gluten-free', 'low-fat'],
      },
    ],
  },
  {
    date: '2026-03-13',
    meals: [
      {
        id: 'm13',
        name: 'Egg White Frittata',
        type: 'breakfast',
        imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=200&q=80',
        nutrition: { calories: 280, proteinG: 28, fiberG: 3, carbsG: 12, fatG: 10 },
        prepTimeMinutes: 15,
        tags: ['high-protein', 'low-carb'],
      },
      {
        id: 'm14',
        name: 'Mediterranean Wrap',
        type: 'lunch',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&q=80',
        nutrition: { calories: 460, proteinG: 24, fiberG: 8, carbsG: 48, fatG: 18 },
        prepTimeMinutes: 10,
        tags: ['vegetarian'],
      },
      {
        id: 'm15',
        name: 'Beef Stir-Fry & Brown Rice',
        type: 'dinner',
        imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200&q=80',
        nutrition: { calories: 610, proteinG: 40, fiberG: 5, carbsG: 56, fatG: 22 },
        prepTimeMinutes: 30,
        tags: ['high-protein'],
      },
    ],
  },
  {
    date: '2026-03-14',
    meals: [
      {
        id: 'm16',
        name: 'Banana Protein Pancakes',
        type: 'breakfast',
        imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=80',
        nutrition: { calories: 380, proteinG: 24, fiberG: 4, carbsG: 48, fatG: 10 },
        prepTimeMinutes: 20,
        tags: ['high-protein', 'vegetarian'],
      },
      {
        id: 'm17',
        name: 'Shrimp Fried Cauliflower Rice',
        type: 'lunch',
        imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&q=80',
        nutrition: { calories: 390, proteinG: 32, fiberG: 6, carbsG: 22, fatG: 16 },
        prepTimeMinutes: 25,
        tags: ['low-carb', 'gluten-free'],
      },
      {
        id: 'm18',
        name: 'Lamb Kofta & Tabbouleh',
        type: 'dinner',
        imageUrl: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=200&q=80',
        nutrition: { calories: 640, proteinG: 46, fiberG: 7, carbsG: 34, fatG: 32 },
        prepTimeMinutes: 50,
        tags: ['high-protein'],
      },
    ],
  },
  {
    date: '2026-03-15',
    meals: [
      {
        id: 'm19',
        name: 'Chia Pudding & Mango',
        type: 'breakfast',
        imageUrl: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=200&q=80',
        nutrition: { calories: 310, proteinG: 10, fiberG: 12, carbsG: 42, fatG: 10 },
        prepTimeMinutes: 5,
        tags: ['vegan', 'high-fiber'],
      },
      {
        id: 'm20',
        name: 'Roast Chicken Caesar',
        type: 'lunch',
        imageUrl: 'https://images.unsplash.com/photo-1580013759032-c96505e24c1f?w=200&q=80',
        nutrition: { calories: 480, proteinG: 40, fiberG: 4, carbsG: 18, fatG: 26 },
        prepTimeMinutes: 15,
        tags: ['high-protein', 'gluten-free'],
      },
      {
        id: 'm21',
        name: 'Mushroom Risotto',
        type: 'dinner',
        imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=200&q=80',
        nutrition: { calories: 540, proteinG: 16, fiberG: 5, carbsG: 72, fatG: 18 },
        prepTimeMinutes: 40,
        tags: ['vegetarian'],
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDayHeader(isoDate: string): { dayName: string; dayNum: number; month: string; isToday: boolean } {
  const d = new Date(isoDate);
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  return {
    dayName: DAYS[d.getDay()] ?? '',
    dayNum: d.getDate(),
    month: MONTHS[d.getMonth()] ?? '',
    isToday,
  };
}

function sumNutrition(meals: Meal[]): NutritionInfo {
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.nutrition.calories,
      proteinG: acc.proteinG + m.nutrition.proteinG,
      fiberG: acc.fiberG + m.nutrition.fiberG,
      carbsG: acc.carbsG + m.nutrition.carbsG,
      fatG: acc.fatG + m.nutrition.fatG,
    }),
    { calories: 0, proteinG: 0, fiberG: 0, carbsG: 0, fatG: 0 }
  );
}

const MEAL_TYPE_COLORS: Record<Meal['type'], string> = {
  breakfast: '#F4A261',
  lunch: '#52B788',
  dinner: '#3A86FF',
  snack: '#8338EC',
};

const MEAL_TYPE_LABELS: Record<Meal['type'], string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

// ─── Macro Pill ───────────────────────────────────────────────────────────────

function MacroPill({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <View style={[pillStyles.pill, { backgroundColor: color + '18', borderColor: color + '40' }]}>
      <Text style={[pillStyles.value, { color }]}>{value}</Text>
      <Text style={[pillStyles.unit, { color: color + 'CC' }]}>{unit}</Text>
      <Text style={pillStyles.label}>{label}</Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  pill: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 6,
    minWidth: 52,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  unit: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: -1,
  },
  label: {
    fontSize: 9,
    color: '#9CA3AF',
    marginTop: 1,
    fontWeight: '500',
  },
});

// ─── Meal Card ────────────────────────────────────────────────────────────────

function MealCard({ meal, onPress }: { meal: Meal; onPress: () => void }) {
  const typeColor = MEAL_TYPE_COLORS[meal.type];
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[cardStyles.card, { transform: [{ scale: scaleAnim }] }]}>
        {/* Image */}
        <Image
          source={{ uri: meal.imageUrl }}
          style={cardStyles.image}
          resizeMode="cover"
        />

        {/* Content */}
        <View style={cardStyles.content}>
          {/* Meal type badge + prep time */}
          <View style={cardStyles.topRow}>
            <View style={[cardStyles.typeBadge, { backgroundColor: typeColor + '22' }]}>
              <View style={[cardStyles.typeDot, { backgroundColor: typeColor }]} />
              <Text style={[cardStyles.typeLabel, { color: typeColor }]}>
                {MEAL_TYPE_LABELS[meal.type]}
              </Text>
            </View>
            <Text style={cardStyles.prepTime}>⏱ {meal.prepTimeMinutes}m</Text>
          </View>

          {/* Name */}
          <Text style={cardStyles.name} numberOfLines={2}>{meal.name}</Text>

          {/* Macros */}
          <View style={cardStyles.macroRow}>
            <MacroPill label="cal" value={meal.nutrition.calories} unit="kcal" color="#E76F51" />
            <MacroPill label="protein" value={meal.nutrition.proteinG} unit="g" color="#3A86FF" />
            <MacroPill label="fiber" value={meal.nutrition.fiberG} unit="g" color="#8338EC" />
          </View>
        </View>

        {/* Chevron */}
        <View style={cardStyles.chevronWrap}>
          <Text style={cardStyles.chevron}>›</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 5,
    overflow: 'hidden',
    shadowColor: '#0D1F2D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 88,
    height: 88,
  },
  content: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  typeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 4,
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  prepTime: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
    letterSpacing: -0.2,
    lineHeight: 19,
  },
  macroRow: {
    flexDirection: 'row',
  },
  chevronWrap: {
    paddingRight: 12,
    paddingLeft: 4,
  },
  chevron: {
    fontSize: 22,
    color: '#D1D5DB',
    fontWeight: '300',
  },
});

// ─── Day Section ──────────────────────────────────────────────────────────────

function DaySection({ day, defaultExpanded = false }: { day: DayPlan; defaultExpanded?: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const rotateAnim = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;

  const { dayName, dayNum, month, isToday } = formatDayHeader(day.date);
  const totals = sumNutrition(day.meals);

  const toggle = () => {
    LayoutAnimation.configureNext({
      duration: 280,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'spring', springDamping: 0.85 },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
    Animated.timing(rotateAnim, {
      toValue: expanded ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setExpanded((e) => !e);
  };

  const chevronRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View style={daySectionStyles.container}>
      {/* Day Header */}
      <Pressable onPress={toggle} style={({ pressed }) => [
        daySectionStyles.header,
        isToday && daySectionStyles.headerToday,
        pressed && { opacity: 0.85 },
      ]}>
        {/* Date block */}
        <View style={[daySectionStyles.dateBlock, isToday && daySectionStyles.dateBlockToday]}>
          <Text style={[daySectionStyles.dayName, isToday && daySectionStyles.dateTextToday]}>
            {dayName}
          </Text>
          <Text style={[daySectionStyles.dayNum, isToday && daySectionStyles.dateTextToday]}>
            {dayNum}
          </Text>
          <Text style={[daySectionStyles.month, isToday && daySectionStyles.dateTextToday]}>
            {month}
          </Text>
        </View>

        {/* Day summary */}
        <View style={daySectionStyles.summary}>
          {isToday && (
            <View style={daySectionStyles.todayBadge}>
              <Text style={daySectionStyles.todayBadgeText}>TODAY</Text>
            </View>
          )}
          <View style={daySectionStyles.summaryMacros}>
            <Text style={daySectionStyles.summaryCalories}>{totals.calories} kcal</Text>
            <Text style={daySectionStyles.summarySub}>
              {totals.proteinG}g protein · {totals.fiberG}g fiber · {day.meals.length} meals
            </Text>
          </View>
        </View>

        {/* Chevron */}
        <Animated.Text style={[daySectionStyles.headerChevron, { transform: [{ rotate: chevronRotate }] }]}>
          ›
        </Animated.Text>
      </Pressable>

      {/* Meals */}
      {expanded && (
        <View style={daySectionStyles.mealsContainer}>
          {day.meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onPress={() => {
                // TODO: navigate to detail view
                console.log('Navigate to meal:', meal.id);
              }}
            />
          ))}
          <View style={daySectionStyles.spacer} />
        </View>
      )}
    </View>
  );
}

const daySectionStyles = StyleSheet.create({
  container: {
    marginBottom: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: '#0D1F2D',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  headerToday: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#52B788',
  },
  dateBlock: {
    alignItems: 'center',
    width: 44,
    marginRight: 14,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 6,
  },
  dateBlockToday: {
    backgroundColor: '#2D6A4F',
  },
  dayName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dayNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
    lineHeight: 24,
  },
  month: {
    fontSize: 9,
    fontWeight: '600',
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
  dateTextToday: {
    color: '#FFFFFF',
  },
  summary: {
    flex: 1,
  },
  todayBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#52B788',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  todayBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  summaryMacros: {},
  summaryCalories: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
    letterSpacing: -0.3,
  },
  summarySub: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
    fontWeight: '500',
  },
  headerChevron: {
    fontSize: 22,
    color: '#D1D5DB',
    marginLeft: 8,
  },
  mealsContainer: {
    marginTop: 6,
  },
  spacer: {
    height: 4,
  },
});

// ─── Week Summary Bar ─────────────────────────────────────────────────────────

function WeekSummaryBar({ plan }: { plan: DayPlan[] }) {
  const allMeals = plan.flatMap((d) => d.meals);
  const totals = sumNutrition(allMeals);
  const avgCalories = Math.round(totals.calories / plan.length);

  return (
    <View style={summaryStyles.bar}>
      <View style={summaryStyles.item}>
        <Text style={summaryStyles.value}>{avgCalories}</Text>
        <Text style={summaryStyles.label}>avg kcal/day</Text>
      </View>
      <View style={summaryStyles.divider} />
      <View style={summaryStyles.item}>
        <Text style={summaryStyles.value}>{Math.round(totals.proteinG / plan.length)}g</Text>
        <Text style={summaryStyles.label}>avg protein</Text>
      </View>
      <View style={summaryStyles.divider} />
      <View style={summaryStyles.item}>
        <Text style={summaryStyles.value}>{Math.round(totals.fiberG / plan.length)}g</Text>
        <Text style={summaryStyles.label}>avg fiber</Text>
      </View>
      <View style={summaryStyles.divider} />
      <View style={summaryStyles.item}>
        <Text style={summaryStyles.value}>{allMeals.length}</Text>
        <Text style={summaryStyles.label}>total meals</Text>
      </View>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#2D6A4F',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: '#2D6A4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 10,
    color: '#74C69D',
    marginTop: 2,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  divider: {
    width: 1,
    backgroundColor: '#FFFFFF22',
    marginVertical: 4,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function MealPlanScreen() {
  // Find today's index to auto-expand it
  const today = new Date().toISOString().slice(0, 10);
  const todayIndex = MOCK_PLAN.findIndex((d) => d.date === today);

  return (
    <SafeAreaView style={screenStyles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F7F4" />
      <ScrollView
        style={screenStyles.scroll}
        contentContainerStyle={screenStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={screenStyles.header}>
          <View>
            <Text style={screenStyles.headerEyebrow}>Weekly Overview</Text>
            <Text style={screenStyles.headerTitle}>Meal Plan</Text>
          </View>
          <Pressable style={screenStyles.regenerateBtn}>
            <Text style={screenStyles.regenerateBtnText}>↺  Regenerate</Text>
          </Pressable>
        </View>

        {/* Week summary */}
        <WeekSummaryBar plan={MOCK_PLAN} />

        {/* Day sections */}
        {MOCK_PLAN.map((day, i) => (
          <DaySection
            key={day.date}
            day={day}
            defaultExpanded={i === (todayIndex >= 0 ? todayIndex : 0)}
          />
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const screenStyles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F7F4',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#52B788',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -1,
  },
  regenerateBtn: {
    backgroundColor: '#2D6A4F',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  regenerateBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
