# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React Native mobile application built with Expo that generates G-code patterns for wrapping machines. The app allows users to configure wrap parameters, preview G-code output, and export/import pattern configurations as `.mum` files.

## Development Commands

### Project Setup
```bash
# Install dependencies
npm install

# Start development server
npm start
# or
expo start

# Reset project to clean template
npm run reset-project
```

### Platform-Specific Development
```bash
# Run on Android device/emulator
npm run android
# or
expo run:android

# Run on iOS simulator
npm run ios
# or  
expo run:ios

# Run in web browser
npm run web
# or
expo start --web
```

### Code Quality
```bash
# Run ESLint
npm run lint
# or
expo lint

# Auto-fix ESLint issues
npx eslint . --fix
```

### Testing and Debugging
```bash
# Start with development client
expo start --dev-client

# Clear cache and start fresh
expo start --clear
```

### EAS Build Commands
```bash
# Build for development
eas build --profile development

# Build preview APK
eas build --profile preview --platform android

# Build for production
eas build --profile production
```

## Architecture Overview

### File-Based Routing Structure
The app uses Expo Router with file-based routing:
- `app/index.tsx` - Main application entry point containing all state management and core logic
- `app/_layout.tsx` - Root layout with SafeAreaProvider
- `app/tabs/` - Tab-specific content components (Shell, Wrap, Machine tabs)

### Core Components Architecture

#### Main State Management (index.tsx)
The main component manages all application state including:
- Shell parameters (size, diameter, kick ratios, etc.)
- Wrap parameters (feedrate, layers, overwrap percentages)
- Burnish settings (enabled/disabled with speed parameters)
- Pump control (cycles, duration, on/off codes)
- G-code generation and preview
- File I/O operations (.mum files)

#### Component Structure
```
app/
├── components/
│   ├── ActionButtons.tsx         # Load, save, export, generate actions
│   ├── GCodePreview.tsx         # G-code output display
│   ├── Header.tsx               # App header
│   ├── NotificationToast.tsx    # Toast notifications
│   ├── TabBar.tsx              # Custom tab navigation
│   └── shared/                 # Reusable UI components
│       ├── Card.tsx            # Container with optional toggle
│       ├── InputField.tsx      # Validated input fields
│       ├── AreaField.tsx       # Multi-line text areas
│       └── TitleEditorModal.tsx # File naming modal
├── tabs/                       # Tab content components
│   ├── ShellTab.tsx           # Shell parameter inputs
│   ├── WrapTab.tsx            # Wrap and burnish parameters
│   └── machineTab.tsx         # Machine-specific settings
└── utils/
    ├── genGCode.ts            # Core G-code generation logic
    └── utils.ts              # Utility functions
```

### Data Flow Pattern
1. User inputs parameters via tab components
2. State is managed centrally in `index.tsx`
3. G-code generation triggered via `genMainGCode()` from `utils/genGCode.ts`
4. Generated G-code displayed in preview component
5. Export functionality saves all parameters as JSON in `.mum` files

### G-Code Generation Engine
The core algorithm in `genGCode.ts`:
- Calculates wrap patterns based on shell dimensions and kick ratios
- Generates coordinate sequences for X/Y axis movements
- Handles layered wrapping with overwrap calculations
- Integrates pump control codes at specified intervals
- Supports variable replacement in custom G-code templates
- Estimates total tape footage required

### File Format
- **Configuration files**: `.mum` format (JSON structure)
- **Export formats**: `.mum` and `.gcode` files
- **Pattern data**: Includes all parameters needed to regenerate G-code

### Key TypeScript Patterns
- Props interfaces for all components
- Type-safe state management with useState hooks
- Validation patterns in InputField component (float, integer validation)
- File system operations using Expo APIs

### Platform Considerations
- Uses Expo managed workflow with custom dev client support
- Cross-platform compatibility (iOS, Android, Web)
- File system access via `expo-document-picker` and `expo-file-system`
- Location permissions configured for Android
- Edge-to-edge display support enabled

### Development Configuration
- **TypeScript**: Strict mode enabled with path aliases (`@/*`)
- **ESLint**: Expo configuration with auto-fix on save
- **Metro bundler**: For web builds with static output
- **EAS**: Multiple build profiles (development, preview, production)