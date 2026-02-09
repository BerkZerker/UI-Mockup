# MicroGoals — React Native + Expo Go Conversion Plan

## Context

The existing `ui_mockup.jsx` is a 1394-line React web mockup of a "Scaffold: Habbit Tracker" productivity app rendered inside a fake phone frame using Vite. The goal is to convert this into a real React Native + Expo Go app — pure UI/UX mockup, no backend, no native modules. The web file provides the **theme system, color tokens, and design language** to preserve; the layout will be rebuilt with native components.

---

## Architecture Decisions

| Decision      | Choice                                                            |
| ------------- | ----------------------------------------------------------------- |
| Framework     | Expo Go (SDK 52)                                                  |
| Language      | TypeScript                                                        |
| Routing       | Expo Router (file-based, `app/` directory)                        |
| Navigation    | Bottom tabs (6) + stack nav for detail screens                    |
| Styling       | Built-in `StyleSheet` + inline dynamic styles                     |
| Glass effects | `expo-blur` BlurView on iOS, semi-transparent fallback on Android |
| Icons         | Port existing SVGs to `react-native-svg`                          |
| State         | In-memory only (`useState` + React Context)                       |
| Screens       | Today, Plan, Habits, Goals, Settings (new), Profile (new)         |

---

## File Structure

```
MicroGoals/
├── app/
│   ├── _layout.tsx              # Root: ThemeProvider + AppStateProvider + SafeArea + Stack
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab navigator (6 tabs)
│   │   ├── index.tsx            # Today screen
│   │   ├── plan.tsx             # Plan screen
│   │   ├── habits.tsx           # Habits screen
│   │   ├── goals.tsx            # Goals screen
│   │   ├── settings.tsx         # Settings screen (NEW)
│   │   └── profile.tsx          # Profile screen (NEW)
│   ├── goal/
│   │   └── [id].tsx             # Goal detail (stack push)
│   └── habit/
│       └── [id].tsx             # Habit detail (stack push)
├── src/
│   ├── theme/
│   │   ├── colors.ts            # ACCENT + THEMES (direct port from mockup lines 4-58)
│   │   ├── styles.ts            # glassCard/glassCardSubtle adapted for ViewStyle
│   │   ├── ThemeContext.tsx      # ThemeProvider, useTheme() hook
│   │   └── index.ts
│   ├── icons/
│   │   ├── IconWrapper.tsx      # Svg wrapper (replaces web `I` component)
│   │   ├── icons.tsx            # All 14 icons (12 existing + Gear + User)
│   │   └── index.ts
│   ├── components/
│   │   ├── GlassCard.tsx        # BlurView (iOS) / transparent bg (Android)
│   │   ├── ProgressBar.tsx      # Animated width bar
│   │   ├── ScreenHeader.tsx     # Title + subtitle pattern
│   │   ├── CategoryPills.tsx    # Horizontal ScrollView of filter pills
│   │   ├── GoalListItem.tsx     # Goal row with checkbox, streak, chevron
│   │   ├── HabitRow.tsx         # Habit row with weekly toggle grid
│   │   ├── WeekStrip.tsx        # 7-day calendar strip
│   │   ├── DayCard.tsx          # Plan day card
│   │   ├── LongGoalCard.tsx     # Long-term goal card with progress
│   │   ├── StatsSummaryCard.tsx # 3-column stats in a glass card
│   │   ├── FAB.tsx              # Floating action button
│   │   └── index.ts
│   ├── data/
│   │   ├── goals.ts             # GOALS_INIT, LONG_GOALS
│   │   ├── habits.ts            # HABITS_INIT
│   │   ├── plan.ts              # PLAN
│   │   ├── categories.ts        # CATS, WKDAYS
│   │   └── index.ts
│   ├── state/
│   │   └── AppStateContext.tsx   # Goals, habits, category filter, toggles, reset
│   └── types/
│       └── index.ts             # Goal, Habit, LongGoal, PlanDay, ThemeColors, etc.
├── app.json
├── tsconfig.json
├── babel.config.js
├── package.json
└── .gitignore
```

---

## Dependencies (all Expo Go compatible)

```
expo, expo-router, expo-blur, expo-status-bar,
react, react-native,
react-native-safe-area-context, react-native-screens,
react-native-svg, react-native-reanimated, react-native-gesture-handler,
@expo/vector-icons
```

Dev: `typescript, @types/react`

---

## Implementation Phases

### Phase 0: Scaffolding

1. `npx create-expo-app MicroGoals --template blank-typescript`
2. Install deps: `npx expo install expo-router expo-blur expo-status-bar react-native-svg react-native-safe-area-context react-native-screens react-native-reanimated react-native-gesture-handler @expo/vector-icons`
3. Configure `app.json` (scheme, name), `babel.config.js` (reanimated plugin)
4. Create directory structure under `src/`

### Phase 1: Foundation

5. `src/types/index.ts` — TypeScript interfaces for Goal, Habit, LongGoal, PlanDay, ThemeColors, AccentColors
6. `src/theme/colors.ts` — port ACCENT and THEMES verbatim from mockup lines 4-58
7. `src/theme/styles.ts` — adapt glassCard/glassCardSubtle for RN `ViewStyle` (no backdropFilter, use borderWidth/borderColor/borderRadius/backgroundColor)
8. `src/theme/ThemeContext.tsx` — provider with `mode` state, `useTheme()` hook returning `{ mode, theme, accent, toggleMode }`
9. `src/data/` — port all data arrays with proper types
10. Barrel exports

### Phase 2: Navigation Shell

11. `app/_layout.tsx` — wrap in ThemeProvider → AppStateProvider → SafeAreaProvider → Stack (headerShown: false for tabs group)
12. `app/(tabs)/_layout.tsx` — Tabs component with 6 tabs, custom tab bar styling (glass bg, accent active color, theme-aware)
13. Placeholder screens for all tabs — verify navigation works in Expo Go

### Phase 3: Icons

14. `src/icons/IconWrapper.tsx` — `Svg` wrapper matching web `I` component
15. `src/icons/icons.tsx` — port 12 icons (Line, Circle, Polyline, Path, Rect, G from react-native-svg) + add Gear and User icons
16. Update tab layout to use custom icons

### Phase 4: Shared Components

17. `GlassCard.tsx` — Platform.OS check: BlurView (iOS intensity=40) vs semi-transparent View (Android)
18. `ProgressBar.tsx` — Animated.View width animation
19. `ScreenHeader.tsx`, `CategoryPills.tsx`, `GoalListItem.tsx`, `FAB.tsx`
20. `WeekStrip.tsx`, `DayCard.tsx`, `HabitRow.tsx`, `LongGoalCard.tsx`, `StatsSummaryCard.tsx`

### Phase 5: App State

21. `src/state/AppStateContext.tsx` — goals, habits, categoryFilter, userName state + toggleGoal, toggleHabitDay, setCategoryFilter, setUserName, resetAll

### Phase 6: Core Screens

22. **Today** (`index.tsx`) — logo header, GlassCard progress summary, CategoryPills, FlatList of GoalListItem, upcoming section, FAB
23. **Plan** (`plan.tsx`) — ScreenHeader, WeekStrip in GlassCard, FlatList of DayCard
24. **Habits** (`habits.tsx`) — ScreenHeader, weekday header row, FlatList of HabitRow, StatsSummaryCard
25. **Goals** (`goals.tsx`) — ScreenHeader, FlatList of LongGoalCard, "Add a goal" button

### Phase 7: New Screens

26. **Settings** (`settings.tsx`) — theme toggle Switch, notification placeholders, default category, about/version
27. **Profile** (`profile.tsx`) — avatar circle with initials, editable name TextInput, stats summary, "Reset All Data" button

### Phase 8: Detail Screens

28. `app/goal/[id].tsx` — useLocalSearchParams(), look up LongGoal, render detail card (title, large progress, current/target, deadline)
29. `app/habit/[id].tsx` — look up Habit, render detail (title, large weekly grid, streak)
30. Wire onPress in GoalListItem/HabitRow/LongGoalCard → `router.push()`

### Phase 9: Polish

31. `expo-status-bar` style toggle (light content for dark theme, dark for light)
32. Press animations on interactive elements (Pressable style function)
33. Fine-tune spacing for safe areas (bottom tab bar, notch)
34. Test on iOS and Android via Expo Go

---

## Key Conversion Notes

| Web                              | React Native                           |
| -------------------------------- | -------------------------------------- |
| `div`                            | `View`                                 |
| `span`, `p`, `h1`                | `Text`                                 |
| `button onClick`                 | `Pressable onPress`                    |
| `borderRadius: '50%'`            | `borderRadius: width/2`                |
| `fontWeight: 600`                | `fontWeight: '600'` (string)           |
| `border: '1px solid red'`        | `borderWidth: 1, borderColor: 'red'`   |
| `overflowY: 'auto'`              | `ScrollView` or `FlatList`             |
| `backdropFilter: blur()`         | `expo-blur` BlurView or transparent bg |
| `textDecoration: 'line-through'` | `textDecorationLine: 'line-through'`   |
| `aria-label`                     | `accessibilityLabel`                   |
| `transition: 'all 0.2s'`         | Animated API                           |
| `cursor: pointer`                | removed (no cursor on mobile)          |

---

## New Screen Designs

### Settings

- **Appearance**: Dark mode toggle (Switch component, wired to ThemeContext)
- **Notifications**: "Daily Reminders" + "Streak Alerts" toggles (UI-only placeholders)
- **Data**: "Default Category" row
- **About**: Version "1.0.0"

### Profile

- **Avatar**: 80x80 circle, ACCENT.primary bg, white initials from userName
- **Name**: Editable TextInput, in-memory only
- **Stats**: 3-column layout — total goals, total habits, completion %
- **Actions**: "Reset All Data" button (resets to \_INIT values)

---

## Verification

1. Run `npx expo start` and open in Expo Go on a physical device or simulator
2. Verify all 6 tabs render and are navigable
3. Toggle dark/light mode in Settings — all screens should update
4. Tap goals/habits to navigate to detail screens, verify back navigation
5. Toggle goal checkboxes on Today screen — progress bar should update
6. Toggle habit day squares on Habits screen
7. Scroll category pills on Today screen
8. Test on both iOS and Android Expo Go for glass effect rendering

---

## Source File

All theme tokens, data, icons, and component logic are sourced from:

- `ui_mockup.jsx` (1394 lines)
