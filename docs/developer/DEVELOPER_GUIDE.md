# Developer Guide

This guide provides detailed information for developers who want to understand, modify, or extend the Emoji Slots Builder application.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Core Components](#core-components)
- [Slot Machine Engine](#slot-machine-engine)
- [State Management](#state-management)
- [Adding New Features](#adding-new-features)
- [Testing](#testing)
- [Performance Considerations](#performance-considerations)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

Emoji Slots Builder is built as a single-page application (SPA) using React and TypeScript. The application follows a component-based architecture with clear separation of concerns:

- **UI Components**: React components that handle rendering and user interactions
- **Game Logic**: Core slot machine engine that handles game mechanics
- **State Management**: Local state management using React hooks and localStorage for persistence
- **Routing**: React Router for navigation between different views

The application does not rely on a backend server and uses the browser's localStorage API to persist user data.

## Technology Stack

- **React**: UI library for building component-based interfaces
- **TypeScript**: Typed superset of JavaScript for improved developer experience
- **React Router**: For handling navigation and routing
- **CSS**: For styling components
- **localStorage API**: For persisting user data
- **Jest**: For testing (recommended)

## Project Structure

```
/
├── src/
│   ├── components/           # React components
│   │   ├── EmojiPicker/      # Emoji selection component
│   │   │   ├── EmojiPicker.tsx
│   │   │   └── EmojiPicker.css
│   │   ├── GameDirectory/    # Game listing component
│   │   │   ├── GameDirectory.tsx
│   │   │   └── GameDirectory.css
│   │   ├── SlotBuilder/      # Slot machine creation component
│   │   │   ├── SlotBuilder.tsx
│   │   │   └── SlotBuilder.css
│   │   └── SlotMachine/      # Slot machine gameplay component
│   │       ├── SlotMachine.tsx
│   │       └── SlotMachine.css
│   ├── utils/                # Utility functions
│   │   └── slotMachineEngine.ts  # Core game logic
│   ├── App.tsx               # Main application component
│   ├── App.css               # Main application styles
│   ├── index.tsx             # Application entry point
│   └── index.css             # Global styles
└── public/                   # Static files
```

## Core Components

### App Component (`App.tsx`)

The main application component that handles routing and global state management. It uses React Router to navigate between different views and manages the saved games using localStorage.

### SlotBuilder Component (`SlotBuilder.tsx`)

Allows users to create and customize slot machines. Key features include:

- General settings (name, author, rows, columns)
- Symbol management (add, edit, remove symbols)
- Payline configuration
- Feature toggles (wilds, scatters, jackpots, etc.)
- Betting options
- Theme customization

### SlotMachine Component (`SlotMachine.tsx`)

Renders a playable slot machine based on a provided configuration. Key features include:

- Spinning animation
- Win calculation and display
- Bet management
- Payline visualization
- Special feature handling (free spins, jackpots)

### GameDirectory Component (`GameDirectory.tsx`)

Displays a list of saved slot machines with options to play, edit, or delete them. Includes filtering and sorting capabilities.

### EmojiPicker Component (`EmojiPicker.tsx`)

A reusable component for selecting emojis, used in the SlotBuilder for symbol customization.

## Slot Machine Engine

The core game logic is implemented in `slotMachineEngine.ts`. This module handles:

### Data Types

```typescript
// Symbol definition
export type Symbol = {
  id: string;
  emoji: string;
  name: string;
  payout: {
    3: number;
    4: number;
    5: number;
  };
  isWild?: boolean;
  isScatter?: boolean;
  isJackpot?: boolean;
};

// Payline definition
export type Payline = {
  id: number;
  positions: number[][];
};

// Complete slot machine configuration
export type SlotConfig = {
  id: string;
  name: string;
  author: string;
  createdAt: number;
  reels: {
    rows: number;
    cols: number;
    symbolWeights: Record<string, number>;
  };
  symbols: Symbol[];
  paylines: Payline[];
  betOptions: number[];
  minBet: number;
  maxBet: number;
  rtp: number;
  features: {
    hasWilds: boolean;
    hasScatters: boolean;
    hasFreespins: boolean;
    hasJackpot: boolean;
    hasMultipliers: boolean;
  };
  theme: {
    backgroundColor: string;
    reelColor: string;
    buttonColor: string;
  };
};

// Spin result
export type SpinResult = {
  reelPositions: string[][];
  winningLines: {
    paylineId: number;
    symbols: string[];
    winAmount: number;
  }[];
  totalWin: number;
  triggeredFeatures: {
    freeSpins?: number;
    multiplier?: number;
    jackpot?: boolean;
  };
};
```

### Key Functions

- `validateSlotConfig(config: SlotConfig)`: Validates a slot configuration for correctness
- `generateSpin(config: SlotConfig, bet: number)`: Generates a random spin result based on the configuration
- `generateReelPositions(config: SlotConfig)`: Generates random symbols for each reel position based on weights
- `calculateWinningLines(reelPositions: string[][], config: SlotConfig, bet: number)`: Calculates winning lines based on the reel positions
- `checkTriggeredFeatures(reelPositions: string[][], config: SlotConfig, bet: number)`: Checks for triggered special features
- `calculateTheoreticalRTP(config: SlotConfig)`: Calculates the theoretical Return to Player percentage
- `createDefaultSlotConfig()`: Creates a default slot configuration as a starting point

## State Management

The application uses React's built-in state management with hooks:

- `useState`: For component-level state
- `useEffect`: For side effects like localStorage persistence
- `useRef`: For DOM references (used in animations)

Global state is managed in the `App` component and passed down to child components as props. Persistent storage is handled using the browser's localStorage API.

## Adding New Features

### Adding a New Symbol Type

1. Update the `Symbol` type in `slotMachineEngine.ts` to include the new property
2. Modify the `SlotBuilder` component to allow editing the new property
3. Update the `calculateWinningLines` function to handle the new symbol type
4. Add UI elements to the `SlotMachine` component to display the new symbol type

### Adding a New Special Feature

1. Update the `features` object in the `SlotConfig` type
2. Add UI controls in the `SlotBuilder` component to toggle the feature
3. Implement the feature logic in `checkTriggeredFeatures` function
4. Update the `SlotMachine` component to display and handle the feature

### Adding a New Theme Option

1. Update the `theme` object in the `SlotConfig` type
2. Add UI controls in the `SlotBuilder` component to customize the new theme option
3. Update the `SlotMachine` component to apply the new theme option

## Testing

### Unit Testing

Use Jest and React Testing Library to write unit tests for components and utility functions:

```typescript
// Example test for slotMachineEngine.ts
import { generateSpin, createDefaultSlotConfig } from '../src/utils/slotMachineEngine';

describe('slotMachineEngine', () => {
  test('generateSpin returns a valid result', () => {
    const config = createDefaultSlotConfig();
    const result = generateSpin(config, 10);
    
    expect(result).toHaveProperty('reelPositions');
    expect(result).toHaveProperty('winningLines');
    expect(result).toHaveProperty('totalWin');
    expect(result).toHaveProperty('triggeredFeatures');
  });
});
```

### Integration Testing

Test the interaction between components:

```typescript
// Example integration test
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

test('creating and playing a slot machine', async () => {
  render(<App />);
  
  // Navigate to create page
  fireEvent.click(screen.getByText('Create New Slot'));
  
  // Fill in slot details
  fireEvent.change(screen.getByLabelText('Slot Name:'), {
    target: { value: 'Test Slot' }
  });
  
  // Save the slot
  fireEvent.click(screen.getByText('Save Slot Machine'));
  
  // Navigate to directory
  fireEvent.click(screen.getByText('Game Directory'));
  
  // Verify slot appears in directory
  expect(screen.getByText('Test Slot')).toBeInTheDocument();
});
```

## Performance Considerations

### Animation Optimization

The slot machine animations can be performance-intensive. Consider these optimizations:

- Use CSS transitions and animations where possible
- Use `requestAnimationFrame` for JavaScript animations
- Implement virtualization for large lists of symbols or games
- Use the `React.memo` HOC to prevent unnecessary re-renders

### Local Storage Limitations

Be mindful of localStorage limitations:

- Storage is limited to about 5MB per domain
- Use compression techniques for large datasets
- Implement cleanup mechanisms to remove old or unused data

## Troubleshooting

### Common Issues

1. **Animations not working smoothly**
   - Check for unnecessary re-renders
   - Use Chrome DevTools Performance tab to identify bottlenecks
   - Consider reducing animation complexity

2. **localStorage errors**
   - Check if localStorage is available (may be disabled in private browsing)
   - Handle storage quota exceeded errors
   - Implement fallback mechanisms

3. **Symbol rendering issues**
   - Ensure emoji compatibility across browsers
   - Consider using SVG icons as a fallback

### Debugging Tips

- Use React DevTools to inspect component state and props
- Add console logging for complex calculations
- Use Chrome DevTools to debug animations and performance issues 