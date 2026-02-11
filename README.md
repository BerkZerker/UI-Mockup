# MicroGoals — React Native + Expo Go App

A beautiful productivity app for tracking daily goals, habits, and long-term objectives. Built with React Native, Expo, and TypeScript.

## Features

- **Today Screen**: Track daily micro-goals with category filtering and progress tracking
- **Plan Screen**: View your week at a glance with task summaries
- **Habits Screen**: Weekly habit tracker with interactive toggle grid
- **Goals Screen**: Long-term objectives with progress visualization
- **Settings Screen**: Dark/light mode toggle and app preferences
- **Profile Screen**: Personal stats and data management

## Tech Stack

- **Framework**: Expo SDK 54 (React Native)
- **Language**: TypeScript
- **Routing**: Expo Router (file-based)
- **Icons**: Lucide React Native
- **UI Effects**: expo-blur for glass morphism (iOS)
- **State**: React Context API
- **Animations**: react-native-reanimated

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo Go app on your iOS/Android device (download from App Store/Play Store)
- OR iOS Simulator (Mac only) / Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running on Device

1. Scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
2. The app will open in Expo Go

### Running on Simulator/Emulator

```bash
# iOS (Mac only)
npx expo start --ios

# Android
npx expo start --android
```

## Project Structure

```text
MicroGoals/
├── app/                      # Expo Router screens
│   ├── _layout.tsx           # Root layout with providers
│   ├── (tabs)/               # Bottom tab navigation
│   │   ├── _layout.tsx       # Tab navigator
│   │   ├── index.tsx         # Today screen
│   │   ├── plan.tsx          # Plan screen
│   │   ├── habits.tsx        # Habits screen
│   │   ├── goals.tsx         # Goals screen
│   │   ├── settings.tsx      # Settings screen
│   │   └── profile.tsx       # Profile screen
│   ├── goal/[id].tsx         # Goal detail screen
│   └── habit/[id].tsx        # Habit detail screen
├── src/
│   ├── theme/                # Theme system (colors, styles, context)
│   ├── components/           # Reusable UI components
│   ├── data/                 # Initial data (goals, habits, plan)
│   ├── state/                # App state management
│   └── types/                # TypeScript type definitions
└── assets/                   # Images and static files
```

## Features Breakdown

### Theme System

- Dark and light modes with smooth transitions
- Deep green accent color (#4a8d5f)
- Glass morphism effects (iOS BlurView, Android fallback)
- WCAG AA compliant color contrast

### State Management

- In-memory state using React Context
- Toggle goals/habits
- Category filtering
- User profile management
- Reset functionality

### Navigation

- 6-tab bottom navigation
- Modal detail screens for goals/habits
- Smooth transitions with native animations

## Development Notes

- **Glass Effects**: iOS uses BlurView, Android uses semi-transparent backgrounds
- **Icons**: All icons from Lucide React Native for consistency
- **Data Persistence**: Currently in-memory only (resets on app restart)
- **Expo Go Compatible**: No native modules required

## Archive

The original web mockup (Vite + React) is preserved in `web-mockup-archive/` for reference.

## License

MIT
