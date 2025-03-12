/**
 * Slot Machine Engine
 * 
 * A comprehensive engine for slot machine game mechanics including:
 * - Reel spinning and symbol generation
 * - Win calculation based on paylines
 * - Special features (wilds, scatters, free spins, etc.)
 * - RTP calculation
 * 
 * @module slotMachineEngine
 */

/**
 * Represents a symbol in the slot machine
 */
export type Symbol = {
  /** Unique identifier for the symbol */
  id: string;
  /** Emoji character representing the symbol */
  emoji: string;
  /** Display name of the symbol */
  name: string;
  /** Payout multipliers based on the number of matching symbols */
  payout: {
    3: number;
    4: number;
    5: number;
  };
  /** Whether this symbol acts as a wild (substitutes for other symbols) */
  isWild?: boolean;
  /** Whether this symbol acts as a scatter (triggers special features) */
  isScatter?: boolean;
  /** Whether this symbol is part of the jackpot combination */
  isJackpot?: boolean;
};

/**
 * Represents a payline in the slot machine
 */
export type Payline = {
  /** Unique identifier for the payline */
  id: number;
  /** Array of [row, col] positions defining the payline path */
  positions: number[][];
};

/**
 * Complete configuration for a slot machine
 */
export type SlotConfig = {
  /** Unique identifier for the slot machine */
  id: string;
  /** Display name of the slot machine */
  name: string;
  /** Creator of the slot machine */
  author: string;
  /** Creation timestamp */
  createdAt: number;
  /** Reel configuration */
  reels: {
    /** Number of rows in the slot machine */
    rows: number;
    /** Number of columns (reels) in the slot machine */
    cols: number;
    /** Weight distribution for symbols (determines probability) */
    symbolWeights: Record<string, number>; // symbolId -> weight
  };
  /** Array of symbols used in the slot machine */
  symbols: Symbol[];
  /** Array of paylines used for win calculation */
  paylines: Payline[];
  /** Available betting options */
  betOptions: number[];
  /** Minimum allowed bet */
  minBet: number;
  /** Maximum allowed bet */
  maxBet: number;
  /** Return to player percentage (0-1) */
  rtp: number;
  /** Special features configuration */
  features: {
    /** Whether wild symbols are enabled */
    hasWilds: boolean;
    /** Whether scatter symbols are enabled */
    hasScatters: boolean;
    /** Whether free spins feature is enabled */
    hasFreespins: boolean;
    /** Whether jackpot feature is enabled */
    hasJackpot: boolean;
    /** Whether multipliers feature is enabled */
    hasMultipliers: boolean;
  };
  /** Visual theme configuration */
  theme: {
    /** Background color of the slot machine */
    backgroundColor: string;
    /** Background color of the reels */
    reelColor: string;
    /** Color of the spin button */
    buttonColor: string;
  };
};

/**
 * Result of a single spin
 */
export type SpinResult = {
  /** 2D array of symbolIds representing the current state of the reels */
  reelPositions: string[][];
  /** Array of winning paylines */
  winningLines: {
    /** ID of the winning payline */
    paylineId: number;
    /** Array of symbolIds in the winning line */
    symbols: string[];
    /** Amount won on this line */
    winAmount: number;
  }[];
  /** Total amount won in this spin */
  totalWin: number;
  /** Special features triggered by this spin */
  triggeredFeatures: {
    /** Number of free spins awarded */
    freeSpins?: number;
    /** Win multiplier */
    multiplier?: number;
    /** Whether jackpot was triggered */
    jackpot?: boolean;
  };
};

/**
 * Validates a slot configuration for correctness
 * 
 * @param config - The slot configuration to validate
 * @returns An object with validation result and optional error message
 */
export const validateSlotConfig = (config: SlotConfig): { isValid: boolean; error?: string } => {
  // Check for required fields
  if (!config.id) return { isValid: false, error: 'Missing slot machine ID' };
  if (!config.name) return { isValid: false, error: 'Missing slot machine name' };
  
  // Validate reels configuration
  if (config.reels.rows < 1) return { isValid: false, error: 'Invalid number of rows' };
  if (config.reels.cols < 1) return { isValid: false, error: 'Invalid number of columns' };
  
  // Validate symbols
  if (config.symbols.length === 0) return { isValid: false, error: 'No symbols defined' };
  
  // Validate symbol weights
  const symbolIds = config.symbols.map(s => s.id);
  for (const symbolId of Object.keys(config.reels.symbolWeights)) {
    if (!symbolIds.includes(symbolId)) {
      return { isValid: false, error: `Symbol weight defined for non-existent symbol: ${symbolId}` };
    }
  }
  
  // Validate paylines
  if (config.paylines.length === 0) return { isValid: false, error: 'No paylines defined' };
  
  // Validate payline positions
  for (const payline of config.paylines) {
    if (payline.positions.length !== config.reels.cols) {
      return { isValid: false, error: `Payline ${payline.id} has incorrect number of positions` };
    }
    
    for (const [row, col] of payline.positions) {
      if (row < 0 || row >= config.reels.rows || col < 0 || col >= config.reels.cols) {
        return { isValid: false, error: `Payline ${payline.id} has invalid position: [${row}, ${col}]` };
      }
    }
  }
  
  // Validate bet options
  if (config.betOptions.length === 0) return { isValid: false, error: 'No bet options defined' };
  if (config.minBet <= 0) return { isValid: false, error: 'Minimum bet must be greater than 0' };
  if (config.maxBet < config.minBet) return { isValid: false, error: 'Maximum bet must be greater than or equal to minimum bet' };
  
  // Validate RTP
  if (config.rtp <= 0 || config.rtp > 1) return { isValid: false, error: 'RTP must be between 0 and 1' };
  
  return { isValid: true };
};

/**
 * Generates a random spin result based on the slot configuration
 * 
 * @param config - The slot configuration
 * @param bet - The bet amount for this spin
 * @returns The result of the spin
 */
export const generateSpin = (config: SlotConfig, bet: number): SpinResult => {
  // Validate configuration
  const validation = validateSlotConfig(config);
  if (!validation.isValid) {
    console.error(`Invalid slot configuration: ${validation.error}`);
    // Return a default empty result
    return {
      reelPositions: Array(config.reels.rows).fill(Array(config.reels.cols).fill('')),
      winningLines: [],
      totalWin: 0,
      triggeredFeatures: {}
    };
  }
  
  // Generate random symbols for each position based on weights
  const reelPositions = generateReelPositions(config);
  
  // Calculate wins based on paylines
  const winningLines = calculateWinningLines(reelPositions, config, bet);
  
  // Calculate total win
  const totalWin = winningLines.reduce((sum, line) => sum + line.winAmount, 0);
  
  // Check for triggered features
  const triggeredFeatures = checkTriggeredFeatures(reelPositions, config, bet);
  
  // Apply multiplier if triggered
  let finalTotalWin = totalWin;
  if (triggeredFeatures.multiplier) {
    finalTotalWin *= triggeredFeatures.multiplier;
    
    // Update winning line amounts with the multiplier
    winningLines.forEach(line => {
      line.winAmount *= triggeredFeatures.multiplier || 1;
    });
  }
  
  // Add jackpot amount if triggered
  if (triggeredFeatures.jackpot) {
    finalTotalWin += bet * 1000; // Jackpot is 1000x the bet
  }
  
  return {
    reelPositions,
    winningLines,
    totalWin: finalTotalWin,
    triggeredFeatures
  };
};

/**
 * Generates random symbols for each reel position based on configured weights
 * 
 * @param config - The slot configuration
 * @returns 2D array of symbolIds
 */
const generateReelPositions = (config: SlotConfig): string[][] => {
  const { rows, cols, symbolWeights } = config.reels;
  const positions: string[][] = [];
  
  // Create a weighted selection array for each reel
  // This simulates real slot machines where each reel has different probabilities
  for (let i = 0; i < rows; i++) {
    const rowSymbols: string[] = [];
    
    for (let j = 0; j < cols; j++) {
      // Adjust weights based on column to make certain reels more likely to match
      const adjustedWeights: Record<string, number> = {};
      
      Object.keys(symbolWeights).forEach(symbolId => {
        // Make jackpot symbols rarer on later reels
        const symbol = config.symbols.find(s => s.id === symbolId);
        if (symbol?.isJackpot) {
          adjustedWeights[symbolId] = symbolWeights[symbolId] * Math.max(0.1, 1 - (j * 0.2));
        } 
        // Make wilds more common on middle reels
        else if (symbol?.isWild) {
          const middleReelBoost = j === Math.floor(cols / 2) ? 1.5 : 1;
          adjustedWeights[symbolId] = symbolWeights[symbolId] * middleReelBoost;
        }
        // Make scatters more evenly distributed
        else if (symbol?.isScatter) {
          adjustedWeights[symbolId] = symbolWeights[symbolId] * 0.8;
        }
        else {
          adjustedWeights[symbolId] = symbolWeights[symbolId];
        }
      });
      
      // Create weighted array for this specific reel
      const reelSymbols: string[] = [];
      Object.keys(adjustedWeights).forEach(symbolId => {
        const weight = Math.floor(adjustedWeights[symbolId]);
        for (let k = 0; k < weight; k++) {
          reelSymbols.push(symbolId);
        }
      });
      
      // Select random symbol for this position
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      rowSymbols.push(reelSymbols[randomIndex]);
    }
    
    positions.push(rowSymbols);
  }
  
  return positions;
};

/**
 * Calculates winning lines based on the reel positions and paylines
 * 
 * @param reelPositions - Current state of the reels
 * @param config - The slot configuration
 * @param bet - The bet amount for this spin
 * @returns Array of winning lines
 */
const calculateWinningLines = (
  reelPositions: string[][],
  config: SlotConfig,
  bet: number
): { paylineId: number; symbols: string[]; winAmount: number }[] => {
  const winningLines: { paylineId: number; symbols: string[]; winAmount: number }[] = [];
  const { symbols, paylines } = config;
  
  // Find wild symbol if it exists
  const wildSymbol = symbols.find(s => s.isWild)?.id;
  
  // Check each payline
  paylines.forEach(payline => {
    const lineSymbols: string[] = [];
    
    // Get symbols on this payline
    payline.positions.forEach(([row, col]) => {
      if (reelPositions[row] && reelPositions[row][col]) {
        lineSymbols.push(reelPositions[row][col]);
      }
    });
    
    // Count consecutive symbols from left to right
    let firstSymbol = lineSymbols[0];
    let count = 1;
    
    for (let i = 1; i < lineSymbols.length; i++) {
      const currentSymbol = lineSymbols[i];
      
      // If current symbol matches first symbol or is wild, increment count
      if (currentSymbol === firstSymbol || 
          currentSymbol === wildSymbol || 
          (firstSymbol === wildSymbol && i === 1 && currentSymbol)) {
        
        // If this is position 1 and first symbol is wild, set first symbol to current
        if (i === 1 && firstSymbol === wildSymbol) {
          firstSymbol = currentSymbol;
        }
        
        count++;
      } else {
        break; // Stop counting if symbols don't match
      }
    }
    
    // Check if we have a win
    if (count >= 3) {
      const symbolObj = symbols.find(s => s.id === firstSymbol);
      if (symbolObj) {
        const multiplier = count <= 5 ? symbolObj.payout[count as 3 | 4 | 5] : symbolObj.payout[5];
        const winAmount = bet * multiplier;
        
        if (winAmount > 0) {
          winningLines.push({
            paylineId: payline.id,
            symbols: lineSymbols.slice(0, count),
            winAmount
          });
        }
      }
    }
  });
  
  return winningLines;
};

/**
 * Checks for triggered special features
 * 
 * @param reelPositions - Current state of the reels
 * @param config - The slot configuration
 * @param bet - The bet amount for this spin
 * @returns Object containing triggered features
 */
const checkTriggeredFeatures = (
  reelPositions: string[][],
  config: SlotConfig,
  bet: number
): { freeSpins?: number; multiplier?: number; jackpot?: boolean } => {
  const features: { freeSpins?: number; multiplier?: number; jackpot?: boolean } = {};
  
  // Find scatter symbol if it exists
  const scatterSymbol = config.symbols.find(s => s.isScatter);
  
  if (scatterSymbol && config.features.hasFreespins) {
    // Count scatters
    let scatterCount = 0;
    
    reelPositions.forEach(row => {
      row.forEach(symbol => {
        if (symbol === scatterSymbol.id) {
          scatterCount++;
        }
      });
    });
    
    // Award free spins based on scatter count
    if (scatterCount >= 3) {
      features.freeSpins = scatterCount * 5; // 3 scatters = 15 free spins, etc.
    }
  }
  
  // Check for jackpot
  if (config.features.hasJackpot) {
    // Find jackpot symbol or use highest paying symbol
    const jackpotSymbol = config.symbols.find(s => s.isJackpot) || 
                         [...config.symbols]
                           .filter(s => !s.isWild && !s.isScatter)
                           .sort((a, b) => b.payout[5] - a.payout[5])[0];
    
    if (jackpotSymbol) {
      // Check for jackpot on first payline (typically the middle row)
      const middlePayline = config.paylines.find(p => p.id === 1);
      
      if (middlePayline) {
        const lineSymbols: string[] = [];
        
        // Get symbols on this payline
        middlePayline.positions.forEach(([row, col]) => {
          if (reelPositions[row] && reelPositions[row][col]) {
            lineSymbols.push(reelPositions[row][col]);
          }
        });
        
        // Check if all symbols are jackpot symbols
        const allJackpotSymbols = lineSymbols.every(
          symbol => symbol === jackpotSymbol.id
        );
        
        if (allJackpotSymbols) {
          features.jackpot = true;
        }
      }
    }
    
    // Rare chance of random jackpot (casino style)
    if (!features.jackpot && Math.random() < 0.001 * (bet / config.minBet)) {
      features.jackpot = true;
    }
  }
  
  // Check for multipliers
  if (config.features.hasMultipliers) {
    // Higher chance of multiplier with higher bets
    const multiplierChance = 0.05 * (bet / config.minBet);
    
    if (Math.random() < multiplierChance) {
      // Determine multiplier value (2x, 3x, or 5x)
      const multiplierValues = [2, 3, 5];
      const randomIndex = Math.floor(Math.random() * multiplierValues.length);
      features.multiplier = multiplierValues[randomIndex];
    }
  }
  
  return features;
};

/**
 * Calculates the theoretical RTP (Return to Player) for a slot configuration
 * 
 * @param config - The slot configuration
 * @returns The calculated RTP value (0-1)
 */
export const calculateTheoreticalRTP = (config: SlotConfig): number => {
  // For a proper RTP calculation, we would need to:
  // 1. Calculate the probability of each possible outcome
  // 2. Multiply each probability by its payout
  // 3. Sum all these values
  
  // This would be a complex calculation based on symbol weights and payouts
  // For MVP, we'll use the configured RTP value
  return config.rtp;
};

/**
 * Creates a default slot configuration that can be used as a starting point
 * 
 * @returns A default slot configuration
 */
export const createDefaultSlotConfig = (): SlotConfig => {
  const id = `slot_${Date.now()}`;
  
  return {
    id,
    name: 'New Slot Machine',
    author: 'kparameshwara',
    createdAt: Date.now(),
    reels: {
      rows: 3,
      cols: 5,
      symbolWeights: {
        'symbol_1': 10,
        'symbol_2': 8,
        'symbol_3': 6,
        'symbol_4': 4,
        'symbol_5': 2,
        'wild': 1,
        'scatter': 1,
        'jackpot': 1
      }
    },
    symbols: [
      {
        id: 'symbol_1',
        emoji: '🍒',
        name: 'Cherry',
        payout: { 3: 5, 4: 10, 5: 25 }
      },
      {
        id: 'symbol_2',
        emoji: '🍋',
        name: 'Lemon',
        payout: { 3: 8, 4: 15, 5: 40 }
      },
      {
        id: 'symbol_3',
        emoji: '🍊',
        name: 'Orange',
        payout: { 3: 10, 4: 20, 5: 60 }
      },
      {
        id: 'symbol_4',
        emoji: '🍇',
        name: 'Grapes',
        payout: { 3: 15, 4: 30, 5: 80 }
      },
      {
        id: 'symbol_5',
        emoji: '7️⃣',
        name: 'Seven',
        payout: { 3: 20, 4: 50, 5: 150 }
      },
      {
        id: 'wild',
        emoji: '⭐',
        name: 'Wild',
        payout: { 3: 25, 4: 75, 5: 200 },
        isWild: true
      },
      {
        id: 'scatter',
        emoji: '🎁',
        name: 'Scatter',
        payout: { 3: 5, 4: 10, 5: 50 },
        isScatter: true
      },
      {
        id: 'jackpot',
        emoji: '💰',
        name: 'Jackpot',
        payout: { 3: 50, 4: 200, 5: 500 },
        isJackpot: true
      }
    ],
    paylines: [
      // Horizontal lines
      { id: 1, positions: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4]] }, // Middle row
      { id: 2, positions: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] }, // Top row
      { id: 3, positions: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] }, // Bottom row
      // V-shapes
      { id: 4, positions: [[0, 0], [1, 1], [2, 2], [1, 3], [0, 4]] },
      { id: 5, positions: [[2, 0], [1, 1], [0, 2], [1, 3], [2, 4]] },
      // Zigzag
      { id: 6, positions: [[0, 0], [0, 1], [1, 2], [2, 3], [2, 4]] },
      { id: 7, positions: [[2, 0], [2, 1], [1, 2], [0, 3], [0, 4]] },
      // W shape
      { id: 8, positions: [[0, 0], [1, 1], [0, 2], [1, 3], [0, 4]] },
      { id: 9, positions: [[2, 0], [1, 1], [2, 2], [1, 3], [2, 4]] },
    ],
    betOptions: [1, 5, 10, 25, 50, 100],
    minBet: 1,
    maxBet: 100,
    rtp: 0.96,
    features: {
      hasWilds: true,
      hasScatters: true,
      hasFreespins: true,
      hasJackpot: true,
      hasMultipliers: true
    },
    theme: {
      backgroundColor: '#2c3e50',
      reelColor: '#34495e',
      buttonColor: '#e74c3c'
    }
  };
}; 