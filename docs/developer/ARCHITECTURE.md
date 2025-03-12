# Emoji Slots Builder Architecture

## Overview

This document outlines the architecture of the Emoji Slots Builder application, including the project structure, component relationships, data flow, and key design decisions. This serves as a reference for developers working on the project.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        App Component                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      React Router                            │
└───────┬─────────────────┬────────────────────┬──────────────┘
        │                 │                    │
        ▼                 ▼                    ▼
┌───────────────┐ ┌───────────────┐  ┌──────────────────┐
│ GameDirectory │ │  SlotBuilder  │  │   SlotMachine    │
└───────┬───────┘ └───────┬───────┘  └────────┬─────────┘
        │                 │                    │
        │                 │                    │
┌───────▼───────┐ ┌───────▼───────┐  ┌────────▼─────────┐
│  Game Cards   │ │ Builder Tabs  │  │  Reels & Controls│
└───────────────┘ └───────┬───────┘  └────────┬─────────┘
                          │                    │
                  ┌───────▼───────┐   ┌───────▼─────────┐
                  │ Symbol Editor │   │ Slot Machine    │
                  │ Payline Config│   │ Engine          │
                  │ Theme Settings│   └─────────────────┘
                  └───────────────┘
```

## Project Structure

The application follows a component-based architecture using React and TypeScript. The project is organized as follows:

```
src/
├── components/           # React components
│   ├── App/              # Main application component
│   ├── GameDirectory/    # Game browsing and management
│   ├── SlotBuilder/      # Slot machine creation interface
│   ├── SlotMachine/      # Slot machine gameplay
│   ├── EmojiPicker/      # Emoji selection component
│   └── common/           # Shared UI components
├── utils/                # Utility functions
│   ├── slotMachineEngine.ts  # Core game logic
│   ├── storage.ts        # Local storage management
│   └── validators.ts     # Input validation
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── assets/               # Static assets (images, sounds)
├── styles/               # Global CSS styles
└── index.tsx             # Application entry point
```

## Component Hierarchy

### App Component
- Root component that initializes the application
- Sets up routing using React Router
- Manages global state and theme

### GameDirectory Component
- Displays a list of saved slot machines
- Provides filtering and sorting options
- Handles game deletion and navigation to edit/play

### SlotBuilder Component
- Multi-tab interface for slot machine creation
- Manages the slot configuration state
- Provides preview functionality
- Handles saving to local storage

### SlotMachine Component
- Renders the playable slot machine
- Manages game state (credits, current bet)
- Handles animations and sound effects
- Displays win information

## Data Flow

### State Management

The application uses React's Context API and hooks for state management:

1. **Local Component State**: Used for UI state that doesn't need to be shared
2. **Context API**: Used for theme settings and global application state
3. **Custom Hooks**: Encapsulate complex state logic and side effects

### Data Persistence

Data is persisted using the browser's localStorage API:

1. **Slot Configurations**: Saved as JSON objects
2. **User Preferences**: Theme settings, sound preferences
3. **Game State**: Credits, last played game

## Key Interfaces

### SlotConfiguration

```typescript
interface SlotConfiguration {
  id: string;
  name: string;
  author: string;
  createdAt: number;
  updatedAt: number;
  symbols: Symbol[];
  reels: {
    count: number;
    positions: number;
    symbolWeights: Record<string, number>;
  };
  paylines: Payline[];
  features: {
    wilds: boolean;
    scatters: boolean;
    jackpots: boolean;
    multipliers: boolean;
  };
  betting: {
    minBet: number;
    maxBet: number;
    defaultBet: number;
    betIncrements: number[];
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
  };
  rtp: number;
}
```

### Symbol

```typescript
interface Symbol {
  id: string;
  emoji: string;
  name: string;
  payouts: number[];
  isWild: boolean;
  isScatter: boolean;
  isJackpot: boolean;
  weight: number;
}
```

### Payline

```typescript
interface Payline {
  id: string;
  positions: number[];
  color: string;
}
```

### SpinResult

```typescript
interface SpinResult {
  reelPositions: number[][];
  symbolGrid: string[][];
  winningLines: {
    paylineId: string;
    symbols: string[];
    payout: number;
  }[];
  totalWin: number;
  triggeredFeatures: {
    type: 'scatter' | 'jackpot' | 'multiplier';
    value: number;
  }[];
}
```

## Core Algorithms

### Slot Machine Engine

The slot machine engine is responsible for:

1. **Generating Spins**: Randomly selecting symbols based on their weights
2. **Calculating Wins**: Checking paylines against the symbol grid
3. **Applying Special Features**: Handling wilds, scatters, and multipliers
4. **Maintaining RTP**: Ensuring the return-to-player percentage is maintained

Key functions:

- `generateSpin(config, bet)`: Generates a random spin result
- `checkWinningLines(grid, paylines, symbols, bet)`: Calculates winning paylines
- `applyFeatures(result, config, bet)`: Applies special features to the result

### Symbol Weight Distribution

Symbol weights determine the probability of each symbol appearing on the reels:

1. Higher value symbols have lower weights
2. Special symbols (wilds, scatters) have the lowest weights
3. Weights can be adjusted per reel to create "near miss" experiences

## Performance Considerations

### Animation Optimization

- CSS animations are used for better performance
- RequestAnimationFrame is used for JavaScript animations
- Heavy animations are disabled on lower-end devices

### State Updates

- Batch state updates to minimize renders
- Use memoization for expensive calculations
- Implement virtualization for long lists

### Storage Limitations

- localStorage has a 5MB limit per domain
- Large slot configurations are compressed
- Older saved games are archived or removed when approaching limits

## Security Considerations

- Input validation to prevent injection attacks
- No sensitive data is stored (free-to-play game)
- Random number generation is pseudo-random (not cryptographically secure)

## Testing Strategy

- Unit tests for utility functions and algorithms
- Component tests for UI behavior
- Integration tests for key user flows
- Performance testing for animations and state updates

## Future Architecture Considerations

### Server Integration

If the application evolves to include server components:

- RESTful API for game storage and retrieval
- User authentication and profiles
- Leaderboards and social features

### Progressive Web App

- Service workers for offline play
- Push notifications for updates
- Installation on home screen

### Mobile Optimization

- Touch-friendly controls
- Responsive design for various screen sizes
- Native-like animations and transitions 