# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `yarn start --clear --tunnel` - Start Expo development server with cache clearing and tunneling for remote development
- `yarn web` - Start web version with Expo
- `yarn android` - Run on Android device/emulator
- `yarn ios` - Run on iOS device/simulator
- `yarn lint` - Run ESLint with auto-fix
- `yarn generate-colors` - Generate color constants and lint the colors.ts file

## Development Guidelines

- Always use English for code comments and documentation
- Use TypeScript with strong typing throughout the codebase
- Use React functional components exclusively
- Use underscore for private field names in TypeScript
- Search existing components before creating new ones to avoid duplication
- Export and import TypeScript interfaces instead of cloning them
- Create reusable validation schemas in separate files
- Use yarn for all package management
- Save migration files in `data/migrations/` folder for Supabase SQL editor

## Architecture Overview

This is an Expo React Native application with Supabase backend integration. Key architectural components:

### Navigation & Routing
- Uses Expo Router with file-based routing in the `app/` directory
- Protected routes are under `app/(protected)/` with authentication guard
- Tab-based navigation in `app/(protected)/(tabs)/`
- Modal presentations for sign-in/sign-up flows

### Authentication
- Supabase Auth with custom secure storage implementation (`config/supabase.ts`)
- Uses `LargeSecureStore` class that combines Expo SecureStore with AsyncStorage for encrypted session storage
- Authentication context provided via `AuthProvider` in `context/supabase-provider.tsx`
- Session management with auto-refresh based on app state
- Use `@supabase/supabase-js` for Supabase client operations

### Styling & UI
- NativeWind (Tailwind CSS for React Native) with custom color system
- Dark/light theme support with `useColorScheme` hook
- UI components in `components/ui/` following shadcn/ui patterns
- Custom color constants generated via script in `scripts/generate-colors.js`

### Form Handling
- React Hook Form with Zod schema validation
- Form components built with accessibility in mind using rn-primitives

### State Management
- Context-based authentication state
- No global state management library - uses React context and local state

## Key Configuration Files

- `app.json` - Expo configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `metro.config.js` - Metro bundler configuration with NativeWind setup
- `babel.config.js` - Babel configuration for NativeWind support

## Environment Setup

Requires `.env` file with:
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Project Structure Notes

- `app/` - File-based routing with Expo Router
- `components/` - Reusable UI components
- `config/` - Configuration files (Supabase client setup)
- `constants/` - Generated color constants
- `context/` - React context providers
- `lib/` - Utility functions and custom hooks
- `docs/` - Comprehensive documentation about the project structure and patterns
- `data/migrations/` - Supabase SQL migration files

## Communication Style

- Address the developer as "Bro"
- Act as a lead developer and coding buddy
- Explain concepts in simple terms and suggest improvements
- Ask clarifying questions when needed
- Always explain thought process behind decisions