import React, { useState, useEffect } from 'react';
import { SlotConfig, Symbol, Payline, createDefaultSlotConfig } from '../../utils/slotMachineEngine';
import SlotMachine from '../SlotMachine/SlotMachine';
import EmojiPicker from '../EmojiPicker/EmojiPicker';
import './SlotBuilder.css';

interface SlotBuilderProps {
  onSave: (config: SlotConfig) => void;
  initialConfig?: SlotConfig;
}

const defaultConfig: SlotConfig = {
  id: '',
  name: 'My Emoji Slot',
  author: '',
  createdAt: Date.now(),
  reels: {
    rows: 3,
    cols: 3,
    symbolWeights: {}
  },
  symbols: [
    {
      id: 'symbol1',
      emoji: '🍒',
      name: 'Cherry',
      payout: { 3: 5, 4: 10, 5: 20 }
    },
    {
      id: 'symbol2',
      emoji: '🍋',
      name: 'Lemon',
      payout: { 3: 8, 4: 15, 5: 25 }
    },
    {
      id: 'symbol3',
      emoji: '🍊',
      name: 'Orange',
      payout: { 3: 10, 4: 20, 5: 30 }
    },
    {
      id: 'symbol4',
      emoji: '🍇',
      name: 'Grapes',
      payout: { 3: 15, 4: 30, 5: 50 }
    },
    {
      id: 'symbol5',
      emoji: '🔔',
      name: 'Bell',
      payout: { 3: 20, 4: 40, 5: 70 }
    },
    {
      id: 'wild',
      emoji: '⭐',
      name: 'Wild',
      payout: { 3: 25, 4: 50, 5: 100 },
      isWild: true
    },
    {
      id: 'scatter',
      emoji: '🎁',
      name: 'Scatter',
      payout: { 3: 5, 4: 10, 5: 20 },
      isScatter: true
    }
  ],
  paylines: [
    { id: 1, positions: [[1, 0], [1, 1], [1, 2]] }, // Middle row
    { id: 2, positions: [[0, 0], [0, 1], [0, 2]] }, // Top row
    { id: 3, positions: [[2, 0], [2, 1], [2, 2]] }, // Bottom row
    { id: 4, positions: [[0, 0], [1, 1], [2, 2]] }, // Diagonal top-left to bottom-right
    { id: 5, positions: [[2, 0], [1, 1], [0, 2]] }  // Diagonal bottom-left to top-right
  ],
  betOptions: [1, 5, 10, 25, 50],
  minBet: 1,
  maxBet: 50,
  rtp: 0.96,
  features: {
    hasWilds: true,
    hasScatters: true,
    hasFreespins: true,
    hasJackpot: false,
    hasMultipliers: false
  },
  theme: {
    backgroundColor: '#2c3e50',
    reelColor: '#34495e',
    buttonColor: '#e74c3c'
  }
};

// Initialize symbol weights
Object.keys(defaultConfig.reels.symbolWeights).forEach(key => {
  const symbolId = defaultConfig.symbols[parseInt(key)]?.id;
  if (symbolId) {
    defaultConfig.reels.symbolWeights[symbolId] = 1;
  }
});

const SlotBuilder: React.FC<SlotBuilderProps> = ({ onSave, initialConfig }) => {
  const [config, setConfig] = useState<SlotConfig>(initialConfig || createDefaultSlotConfig());
  const [activeTab, setActiveTab] = useState('general');
  const [showPreview, setShowPreview] = useState(false);
  const [editingSymbolIndex, setEditingSymbolIndex] = useState<number | null>(null);
  const [editingPaylineIndex, setEditingPaylineIndex] = useState<number | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentEmojiSymbolIndex, setCurrentEmojiSymbolIndex] = useState<number | null>(null);
  const [selectedThemeInspiration, setSelectedThemeInspiration] = useState<string | null>(null);
  const [showAddSymbolsModal, setShowAddSymbolsModal] = useState(false);
  const [symbolsToAdd, setSymbolsToAdd] = useState<Symbol[]>([]);

  // Theme inspirations for the slot builder
  const themeInspirations = [
    {
      name: "Fruits",
      symbols: ["🍎", "🍊", "🍋", "🍇", "🍉", "🍓", "🍒", "🍑", "🥝"],
      colors: {
        backgroundColor: "#8BC34A",
        reelColor: "#689F38",
        buttonColor: "#FF5722"
      }
    },
    {
      name: "Animals",
      symbols: ["🐶", "🐱", "🦁", "🐯", "🐮", "🐷", "🐸", "🦊", "🐻"],
      colors: {
        backgroundColor: "#795548",
        reelColor: "#5D4037",
        buttonColor: "#FF9800"
      }
    },
    {
      name: "Ocean",
      symbols: ["🐠", "🐙", "🦑", "🦈", "🐬", "🐳", "🦀", "🐚", "⚓"],
      colors: {
        backgroundColor: "#03A9F4",
        reelColor: "#0288D1",
        buttonColor: "#FFC107"
      }
    },
    {
      name: "Space",
      symbols: ["🚀", "🛸", "🌟", "🌙", "🪐", "☄️", "👽", "🌌", "🌠"],
      colors: {
        backgroundColor: "#3F51B5",
        reelColor: "#303F9F",
        buttonColor: "#E91E63"
      }
    },
    {
      name: "Fantasy",
      symbols: ["🧙‍♂️", "🧚", "🦄", "🐉", "🏰", "⚔️", "🔮", "👑", "💎"],
      colors: {
        backgroundColor: "#673AB7",
        reelColor: "#512DA8",
        buttonColor: "#FFC107"
      }
    }
  ];

  // Generate a unique ID when creating a new slot
  useEffect(() => {
    if (!config.id) {
      setConfig(prev => ({
        ...prev,
        id: `slot_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      }));
    }
  }, [config.id]);
  
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleReelChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value);
    
    if (isNaN(numValue) || numValue < 1 || numValue > 5) return;
    
    setConfig(prev => ({
      ...prev,
      reels: {
        ...prev.reels,
        [name]: numValue
      }
    }));
  };
  
  const handleSymbolChange = (index: number, field: keyof Symbol, value: any) => {
    setConfig(prev => {
      const newSymbols = [...prev.symbols];
      newSymbols[index] = {
        ...newSymbols[index],
        [field]: value
      };
      return {
        ...prev,
        symbols: newSymbols
      };
    });
  };
  
  const handleSymbolPayoutChange = (index: number, matches: 3 | 4 | 5, value: number) => {
    setConfig(prev => {
      const newSymbols = [...prev.symbols];
      newSymbols[index] = {
        ...newSymbols[index],
        payout: {
          ...newSymbols[index].payout,
          [matches]: value
        }
      };
      return {
        ...prev,
        symbols: newSymbols
      };
    });
  };
  
  const handleSymbolWeightChange = (symbolId: string, weight: number) => {
    if (weight < 1) return;
    
    setConfig(prev => ({
      ...prev,
      reels: {
        ...prev.reels,
        symbolWeights: {
          ...prev.reels.symbolWeights,
          [symbolId]: weight
        }
      }
    }));
  };
  
  const addSymbol = () => {
    // Calculate how many symbols we need based on rows and columns
    const totalCells = config.reels.rows * config.reels.cols;
    const currentSymbols = config.symbols.length;
    
    // Create a new symbol with a unique ID
    const newSymbol: Symbol = {
      id: `symbol_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      emoji: '❓',
      name: `Symbol ${currentSymbols + 1}`,
      payout: { 3: 5, 4: 10, 5: 20 }
    };
    
    // Update the config with the new symbol
    setConfig(prev => {
      const newSymbols = [...prev.symbols, newSymbol];
      const newSymbolWeights = { ...prev.reels.symbolWeights };
      newSymbolWeights[newSymbol.id] = 10;
      
      return {
        ...prev,
        symbols: newSymbols,
        reels: {
          ...prev.reels,
          symbolWeights: newSymbolWeights
        }
      };
    });
    
    // Set the new symbol to be edited immediately
    setEditingSymbolIndex(config.symbols.length);
  };
  
  const removeSymbol = (index: number) => {
    if (config.symbols.length <= 3) return; // Minimum 3 symbols
    
    setConfig(prev => {
      const newSymbols = [...prev.symbols];
      const removedSymbol = newSymbols[index];
      newSymbols.splice(index, 1);
      
      // Remove from weights
      const newWeights = { ...prev.reels.symbolWeights };
      delete newWeights[removedSymbol.id];
      
      return {
        ...prev,
        symbols: newSymbols,
        reels: {
          ...prev.reels,
          symbolWeights: newWeights
        }
      };
    });
  };
  
  const handlePaylineChange = (index: number, positions: number[][]) => {
    setConfig(prev => {
      const newPaylines = [...prev.paylines];
      newPaylines[index] = {
        ...newPaylines[index],
        positions
      };
      return {
        ...prev,
        paylines: newPaylines
      };
    });
  };
  
  const addPayline = () => {
    const newId = config.paylines.length + 1;
    setConfig(prev => {
      const newPayline: Payline = {
        id: newId,
        positions: [[1, 0], [1, 1], [1, 2]] // Default middle row
      };
      
      return {
        ...prev,
        paylines: [...prev.paylines, newPayline]
      };
    });
  };
  
  const removePayline = (index: number) => {
    if (config.paylines.length <= 1) return; // Minimum 1 payline
    
    setConfig(prev => {
      const newPaylines = [...prev.paylines];
      newPaylines.splice(index, 1);
      
      // Renumber payline IDs
      newPaylines.forEach((payline, i) => {
        payline.id = i + 1;
      });
      
      return {
        ...prev,
        paylines: newPaylines
      };
    });
  };
  
  const handleFeatureChange = (feature: keyof typeof config.features, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: value
      }
    }));
  };
  
  const handleThemeChange = (property: keyof typeof config.theme, value: string) => {
    setConfig(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [property]: value
      }
    }));
  };
  
  const handleBetOptionsChange = (index: number, value: number) => {
    if (value < 1) return;
    
    setConfig(prev => {
      const newBetOptions = [...prev.betOptions];
      newBetOptions[index] = value;
      
      // Sort bet options
      newBetOptions.sort((a, b) => a - b);
      
      return {
        ...prev,
        betOptions: newBetOptions
      };
    });
  };
  
  const addBetOption = () => {
    setConfig(prev => {
      const newBetOptions = [...prev.betOptions];
      const lastOption = newBetOptions[newBetOptions.length - 1] || 1;
      newBetOptions.push(lastOption * 2);
      
      return {
        ...prev,
        betOptions: newBetOptions
      };
    });
  };
  
  const removeBetOption = (index: number) => {
    if (config.betOptions.length <= 1) return; // Minimum 1 bet option
    
    setConfig(prev => {
      const newBetOptions = [...prev.betOptions];
      newBetOptions.splice(index, 1);
      
      return {
        ...prev,
        betOptions: newBetOptions
      };
    });
  };
  
  const handleMinMaxBetChange = (field: 'minBet' | 'maxBet', value: number) => {
    if (value < 1) return;
    
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleRTPChange = (value: number) => {
    if (value < 0.5 || value > 1) return;
    
    setConfig(prev => ({
      ...prev,
      rtp: value
    }));
  };
  
  const handleSaveClick = () => {
    // Validate configuration
    if (!config.name || !config.author) {
      alert('Please fill in all required fields');
      return;
    }
    
    onSave(config);
  };
  
  const handleEmojiSelect = (index: number, emoji: string) => {
    handleSymbolChange(index, 'emoji', emoji);
    setShowEmojiPicker(false);
    setCurrentEmojiSymbolIndex(null);
  };
  
  const openEmojiPicker = (index: number) => {
    setCurrentEmojiSymbolIndex(index);
    setShowEmojiPicker(true);
  };
  
  const closeEmojiPicker = () => {
    setShowEmojiPicker(false);
    setCurrentEmojiSymbolIndex(null);
  };
  
  const applyThemeInspiration = (themeName: string) => {
    const theme = themeInspirations.find(t => t.name === themeName);
    if (!theme) return;

    // Update theme colors
    const updatedConfig = {
      ...config,
      theme: {
        ...config.theme,
        backgroundColor: theme.colors.backgroundColor,
        reelColor: theme.colors.reelColor,
        buttonColor: theme.colors.buttonColor
      }
    };

    setConfig(updatedConfig);
    setSelectedThemeInspiration(themeName);
  };
  
  const prepareThemeSymbols = (themeName: string) => {
    const theme = themeInspirations.find(t => t.name === themeName);
    if (!theme) return;

    // Create new symbols from the theme but don't add them to the config yet
    const newSymbols = theme.symbols.map((emoji, index) => {
      const id = `theme_${themeName.toLowerCase()}_${index}`;
      return {
        id,
        emoji,
        name: `${themeName} ${index + 1}`,
        payout: { 3: 5 + index * 2, 4: 10 + index * 5, 5: 20 + index * 10 }
      };
    });

    setSymbolsToAdd(newSymbols);
    setShowAddSymbolsModal(true);
  };
  
  const addSymbolsFromTheme = () => {
    if (symbolsToAdd.length === 0) return;

    // Update symbol weights
    const newSymbolWeights = { ...config.reels.symbolWeights };
    symbolsToAdd.forEach(symbol => {
      newSymbolWeights[symbol.id] = 10;
    });

    // Update config with new symbols
    const updatedConfig = {
      ...config,
      symbols: [...config.symbols, ...symbolsToAdd],
      reels: {
        ...config.reels,
        symbolWeights: newSymbolWeights
      }
    };

    setConfig(updatedConfig);
    setShowAddSymbolsModal(false);
    setSymbolsToAdd([]);
  };
  
  const cancelAddSymbols = () => {
    setShowAddSymbolsModal(false);
    setSymbolsToAdd([]);
  };
  
  const toggleSymbolSelection = (index: number) => {
    const updatedSymbols = [...symbolsToAdd];
    if (updatedSymbols[index]) {
      // If the symbol is already selected, remove it
      updatedSymbols.splice(index, 1);
    } else {
      // If the symbol is not selected, add it back
      const theme = themeInspirations.find(t => t.name === selectedThemeInspiration);
      if (theme && theme.symbols[index]) {
        const emoji = theme.symbols[index];
        const id = `theme_${selectedThemeInspiration?.toLowerCase()}_${index}`;
        updatedSymbols[index] = {
          id,
          emoji,
          name: `${selectedThemeInspiration} ${index + 1}`,
          payout: { 3: 5 + index * 2, 4: 10 + index * 5, 5: 20 + index * 10 }
        };
      }
    }
    setSymbolsToAdd(updatedSymbols.filter(Boolean));
  };
  
  const addSpecialSymbol = (type: 'wild' | 'scatter' | 'jackpot') => {
    let emoji = '⭐';
    let name = 'Wild';
    let payout = { 3: 25, 4: 50, 5: 100 };
    
    if (type === 'scatter') {
      emoji = '🎁';
      name = 'Scatter';
      payout = { 3: 5, 4: 10, 5: 20 };
    } else if (type === 'jackpot') {
      emoji = '💰';
      name = 'Jackpot';
      payout = { 3: 50, 4: 200, 5: 500 };
    }
    
    const newSymbol: Symbol = {
      id: `${type}_${Date.now()}`,
      emoji,
      name,
      payout,
      [type === 'wild' ? 'isWild' : type === 'scatter' ? 'isScatter' : 'isJackpot']: true
    };
    
    setConfig(prev => {
      const newSymbols = [...prev.symbols, newSymbol];
      const newSymbolWeights = { ...prev.reels.symbolWeights };
      newSymbolWeights[newSymbol.id] = type === 'jackpot' ? 5 : 10;
      
      return {
        ...prev,
        symbols: newSymbols,
        reels: {
          ...prev.reels,
          symbolWeights: newSymbolWeights
        }
      };
    });
  };
  
  const renderGeneralTab = () => (
    <div className="builder-tab">
      <h3>General Settings</h3>
      
      <div className="form-group">
        <label htmlFor="name">Slot Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={config.name}
          onChange={handleGeneralChange}
          placeholder="Enter slot name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          id="author"
          name="author"
          value={config.author}
          onChange={handleGeneralChange}
          placeholder="Your name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="rows">Rows:</label>
        <input
          type="number"
          id="rows"
          name="rows"
          min="1"
          max="5"
          value={config.reels.rows}
          onChange={handleReelChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="cols">Columns:</label>
        <input
          type="number"
          id="cols"
          name="cols"
          min="3"
          max="5"
          value={config.reels.cols}
          onChange={handleReelChange}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="rtp">Return to Player (RTP):</label>
        <input
          type="number"
          id="rtp"
          name="rtp"
          min="0.5"
          max="1"
          step="0.01"
          value={config.rtp}
          onChange={(e) => handleRTPChange(parseFloat(e.target.value))}
        />
        <span className="help-text">{(config.rtp * 100).toFixed(2)}%</span>
      </div>
    </div>
  );
  
  const renderSymbolsTab = () => (
    <div className="builder-tab">
      <h3>Symbols</h3>
      
      {/* Theme Inspiration Section */}
      <div className="theme-inspiration-section">
        <h4>Theme Inspirations</h4>
        <p className="help-text">Click on a theme to apply its colors or prepare to add its symbols to your slot machine</p>
        
        <div className="theme-tabs">
          {themeInspirations.map(theme => (
            <div 
              key={theme.name} 
              className={`theme-tab ${selectedThemeInspiration === theme.name ? 'active' : ''}`}
              onClick={() => setSelectedThemeInspiration(theme.name)}
            >
              <h4>{theme.name}</h4>
              <div className="theme-symbols">
                {theme.symbols.slice(0, 5).map((symbol, index) => (
                  <span key={index} className="theme-symbol">{symbol}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {selectedThemeInspiration && (
          <div className="theme-actions">
            <button 
              className="theme-action-button"
              onClick={() => applyThemeInspiration(selectedThemeInspiration)}
            >
              Apply {selectedThemeInspiration} Colors
            </button>
            <button 
              className="theme-action-button"
              onClick={() => prepareThemeSymbols(selectedThemeInspiration)}
            >
              Prepare {selectedThemeInspiration} Symbols
            </button>
          </div>
        )}
      </div>
      
      <div className="symbols-management">
        <h4>Symbol Management</h4>
        <p className="help-text">Add and manage symbols for your slot machine</p>
        
        <div className="symbol-stats">
          <div className="stat-item">
            <span className="stat-label">Total Symbols:</span>
            <span className="stat-value">{config.symbols.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Recommended Min:</span>
            <span className="stat-value">{Math.max(5, config.reels.rows * config.reels.cols - 2)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Special Symbols:</span>
            <span className="stat-value">
              {config.symbols.filter(s => s.isWild || s.isScatter || s.isJackpot).length}
            </span>
          </div>
        </div>
        
        <div className="add-symbol-buttons">
          <button className="add-button" onClick={addSymbol}>
            Add Regular Symbol
          </button>
          <button className="add-special-button wild" onClick={() => addSpecialSymbol('wild')}>
            Add Wild Symbol
          </button>
          <button className="add-special-button scatter" onClick={() => addSpecialSymbol('scatter')}>
            Add Scatter Symbol
          </button>
          <button className="add-special-button jackpot" onClick={() => addSpecialSymbol('jackpot')}>
            Add Jackpot Symbol
          </button>
        </div>
      </div>
      
      <div className="symbols-list">
        {config.symbols.map((symbol, index) => (
          <div key={symbol.id} className="symbol-item">
            <div className="symbol-header">
              <div className={`symbol-emoji ${symbol.isWild ? 'wild' : symbol.isScatter ? 'scatter' : symbol.isJackpot ? 'jackpot' : ''}`}>
                {symbol.emoji}
              </div>
              <div className="symbol-name">{symbol.name}</div>
              <div className="symbol-type">
                {symbol.isWild && <span className="symbol-tag wild">Wild</span>}
                {symbol.isScatter && <span className="symbol-tag scatter">Scatter</span>}
                {symbol.isJackpot && <span className="symbol-tag jackpot">Jackpot</span>}
              </div>
              <button 
                className="edit-button"
                onClick={() => setEditingSymbolIndex(editingSymbolIndex === index ? null : index)}
              >
                {editingSymbolIndex === index ? 'Done' : 'Edit'}
              </button>
              <button 
                className="remove-button"
                onClick={() => removeSymbol(index)}
                disabled={config.symbols.length <= 3}
              >
                Remove
              </button>
            </div>
            
            {editingSymbolIndex === index && (
              <div className="symbol-edit">
                <div className="form-group">
                  <label>Emoji:</label>
                  <div className="emoji-selector">
                    <div className="selected-emoji">{symbol.emoji}</div>
                    <button onClick={() => openEmojiPicker(index)}>Change</button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    value={symbol.name}
                    onChange={(e) => handleSymbolChange(index, 'name', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Payouts:</label>
                  <div className="payout-grid">
                    <div>
                      <label>3 of a kind:</label>
                      <input
                        type="number"
                        min="1"
                        value={symbol.payout[3]}
                        onChange={(e) => handleSymbolPayoutChange(index, 3, parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label>4 of a kind:</label>
                      <input
                        type="number"
                        min="1"
                        value={symbol.payout[4]}
                        onChange={(e) => handleSymbolPayoutChange(index, 4, parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label>5 of a kind:</label>
                      <input
                        type="number"
                        min="1"
                        value={symbol.payout[5]}
                        onChange={(e) => handleSymbolPayoutChange(index, 5, parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Weight:</label>
                  <input
                    type="number"
                    min="1"
                    value={config.reels.symbolWeights[symbol.id] || 1}
                    onChange={(e) => handleSymbolWeightChange(symbol.id, parseInt(e.target.value))}
                  />
                  <span className="help-text">Higher weight = more frequent</span>
                </div>
                
                <div className="form-group">
                  <label>Special:</label>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!symbol.isWild}
                        onChange={(e) => handleSymbolChange(index, 'isWild', e.target.checked)}
                      />
                      Wild Symbol
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={!!symbol.isScatter}
                        onChange={(e) => handleSymbolChange(index, 'isScatter', e.target.checked)}
                      />
                      Scatter Symbol
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={!!symbol.isJackpot}
                        onChange={(e) => handleSymbolChange(index, 'isJackpot', e.target.checked)}
                      />
                      Jackpot Symbol
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
  const renderPaylinesTab = () => (
    <div className="builder-tab">
      <h3>Paylines</h3>
      
      <div className="paylines-list">
        {config.paylines.map((payline, index) => (
          <div key={payline.id} className="payline-item">
            <div className="payline-header">
              <div className="payline-id">Payline {payline.id}</div>
              <button 
                className="edit-button"
                onClick={() => setEditingPaylineIndex(editingPaylineIndex === index ? null : index)}
              >
                {editingPaylineIndex === index ? 'Done' : 'Edit'}
              </button>
              <button 
                className="remove-button"
                onClick={() => removePayline(index)}
                disabled={config.paylines.length <= 1}
              >
                Remove
              </button>
            </div>
            
            {editingPaylineIndex === index && (
              <div className="payline-edit">
                <div className="payline-grid">
                  {Array.from({ length: config.reels.rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className="payline-row">
                      {Array.from({ length: config.reels.cols }).map((_, colIndex) => {
                        const isSelected = payline.positions.some(
                          ([r, c]) => r === rowIndex && c === colIndex
                        );
                        
                        return (
                          <div 
                            key={colIndex}
                            className={`payline-cell ${isSelected ? 'selected' : ''}`}
                            onClick={() => {
                              // Toggle this position in the payline
                              const newPositions = [...payline.positions];
                              const existingIndex = newPositions.findIndex(
                                ([r, c]) => r === rowIndex && c === colIndex
                              );
                              
                              if (existingIndex >= 0) {
                                newPositions.splice(existingIndex, 1);
                              } else {
                                newPositions.push([rowIndex, colIndex]);
                              }
                              
                              handlePaylineChange(index, newPositions);
                            }}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="help-text">Click cells to create payline pattern</div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <button className="add-button" onClick={addPayline}>
        Add Payline
      </button>
    </div>
  );
  
  const renderFeaturesTab = () => (
    <div className="builder-tab">
      <h3>Special Features</h3>
      
      <div className="features-list">
        <div className="feature-item">
          <label>
            <input
              type="checkbox"
              checked={config.features.hasWilds}
              onChange={(e) => handleFeatureChange('hasWilds', e.target.checked)}
            />
            Wild Symbols
          </label>
          <div className="help-text">Wild symbols substitute for any other symbol</div>
        </div>
        
        <div className="feature-item">
          <label>
            <input
              type="checkbox"
              checked={config.features.hasScatters}
              onChange={(e) => handleFeatureChange('hasScatters', e.target.checked)}
            />
            Scatter Symbols
          </label>
          <div className="help-text">Scatter symbols pay anywhere on the reels</div>
        </div>
        
        <div className="feature-item">
          <label>
            <input
              type="checkbox"
              checked={config.features.hasFreespins}
              onChange={(e) => handleFeatureChange('hasFreespins', e.target.checked)}
            />
            Free Spins
          </label>
          <div className="help-text">3 or more scatters trigger free spins</div>
        </div>
        
        <div className="feature-item">
          <label>
            <input
              type="checkbox"
              checked={config.features.hasMultipliers}
              onChange={(e) => handleFeatureChange('hasMultipliers', e.target.checked)}
            />
            Win Multipliers
          </label>
          <div className="help-text">Random multipliers can increase wins</div>
        </div>
        
        <div className="feature-item">
          <label>
            <input
              type="checkbox"
              checked={config.features.hasJackpot}
              onChange={(e) => handleFeatureChange('hasJackpot', e.target.checked)}
            />
            Progressive Jackpot
          </label>
          <div className="help-text">A special jackpot that grows over time</div>
        </div>
      </div>
    </div>
  );
  
  const renderBettingTab = () => (
    <div className="builder-tab">
      <h3>Betting Options</h3>
      
      <div className="form-group">
        <label>Bet Options:</label>
        <div className="bet-options-list">
          {config.betOptions.map((bet, index) => (
            <div key={index} className="bet-option-item">
              <input
                type="number"
                min="1"
                value={bet}
                onChange={(e) => handleBetOptionsChange(index, parseInt(e.target.value))}
              />
              <button 
                className="remove-button"
                onClick={() => removeBetOption(index)}
                disabled={config.betOptions.length <= 1}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button className="add-button" onClick={addBetOption}>
          Add Bet Option
        </button>
      </div>
      
      <div className="form-group">
        <label htmlFor="minBet">Minimum Bet:</label>
        <input
          type="number"
          id="minBet"
          min="1"
          value={config.minBet}
          onChange={(e) => handleMinMaxBetChange('minBet', parseInt(e.target.value))}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="maxBet">Maximum Bet:</label>
        <input
          type="number"
          id="maxBet"
          min="1"
          value={config.maxBet}
          onChange={(e) => handleMinMaxBetChange('maxBet', parseInt(e.target.value))}
        />
      </div>
    </div>
  );
  
  const renderThemeTab = () => (
    <div className="builder-tab">
      <h3>Theme & Appearance</h3>
      
      <div className="form-group">
        <label htmlFor="backgroundColor">Background Color:</label>
        <input
          type="color"
          id="backgroundColor"
          value={config.theme.backgroundColor}
          onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="reelColor">Reel Background:</label>
        <input
          type="color"
          id="reelColor"
          value={config.theme.reelColor}
          onChange={(e) => handleThemeChange('reelColor', e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="buttonColor">Button Color:</label>
        <input
          type="color"
          id="buttonColor"
          value={config.theme.buttonColor}
          onChange={(e) => handleThemeChange('buttonColor', e.target.value)}
        />
      </div>
      
      <div className="theme-preview">
        <div 
          className="preview-box"
          style={{ 
            backgroundColor: config.theme.backgroundColor,
            padding: '10px',
            borderRadius: '5px'
          }}
        >
          <div 
            className="preview-reel"
            style={{ 
              backgroundColor: config.theme.reelColor,
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '10px'
            }}
          >
            <div className="preview-symbols">
              {config.symbols.slice(0, 3).map((symbol, index) => (
                <div key={index} className="preview-symbol">
                  {symbol.emoji}
                </div>
              ))}
            </div>
          </div>
          <button
            className="preview-button"
            style={{ 
              backgroundColor: config.theme.buttonColor,
              color: 'white',
              border: 'none',
              padding: '5px 15px',
              borderRadius: '20px'
            }}
          >
            SPIN
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="slot-builder">
      <div className="builder-header">
        <h2>{config.name || 'New Slot Machine'}</h2>
        <div className="builder-actions">
          <button 
            className="preview-toggle"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Edit Mode' : 'Preview Mode'}
          </button>
          <button 
            className="save-button"
            onClick={handleSaveClick}
          >
            Save Slot Machine
          </button>
        </div>
      </div>
      
      {showPreview ? (
        <div className="preview-container">
          <SlotMachine config={config} />
        </div>
      ) : (
        <div className="builder-content">
          <div className="builder-tabs">
            <button 
              className={activeTab === 'general' ? 'active' : ''}
              onClick={() => setActiveTab('general')}
            >
              General
            </button>
            <button 
              className={activeTab === 'symbols' ? 'active' : ''}
              onClick={() => setActiveTab('symbols')}
            >
              Symbols
            </button>
            <button 
              className={activeTab === 'paylines' ? 'active' : ''}
              onClick={() => setActiveTab('paylines')}
            >
              Paylines
            </button>
            <button 
              className={activeTab === 'features' ? 'active' : ''}
              onClick={() => setActiveTab('features')}
            >
              Features
            </button>
            <button 
              className={activeTab === 'betting' ? 'active' : ''}
              onClick={() => setActiveTab('betting')}
            >
              Betting
            </button>
            <button 
              className={activeTab === 'theme' ? 'active' : ''}
              onClick={() => setActiveTab('theme')}
            >
              Theme
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'general' && renderGeneralTab()}
            {activeTab === 'symbols' && renderSymbolsTab()}
            {activeTab === 'paylines' && renderPaylinesTab()}
            {activeTab === 'features' && renderFeaturesTab()}
            {activeTab === 'betting' && renderBettingTab()}
            {activeTab === 'theme' && renderThemeTab()}
          </div>
        </div>
      )}
      
      {showEmojiPicker && currentEmojiSymbolIndex !== null && (
        <EmojiPicker 
          onSelect={(emoji) => handleEmojiSelect(currentEmojiSymbolIndex, emoji)} 
          onClose={closeEmojiPicker}
        />
      )}
      
      {/* Add Symbols Modal */}
      {showAddSymbolsModal && selectedThemeInspiration && (
        <div className="modal-overlay">
          <div className="add-symbols-modal">
            <h3>Add {selectedThemeInspiration} Symbols</h3>
            <p>Select the symbols you want to add to your slot machine:</p>
            
            <div className="theme-symbols-grid">
              {themeInspirations.find(t => t.name === selectedThemeInspiration)?.symbols.map((emoji, index) => {
                const isSelected = symbolsToAdd.some(s => s.emoji === emoji);
                return (
                  <div 
                    key={index} 
                    className={`theme-symbol-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSymbolSelection(index)}
                  >
                    <span className="theme-symbol-large">{emoji}</span>
                    <span className="theme-symbol-name">{`${selectedThemeInspiration} ${index + 1}`}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="modal-actions">
              <button 
                className="modal-button cancel"
                onClick={cancelAddSymbols}
              >
                Cancel
              </button>
              <button 
                className="modal-button confirm"
                onClick={addSymbolsFromTheme}
                disabled={symbolsToAdd.length === 0}
              >
                Add {symbolsToAdd.length} Symbol{symbolsToAdd.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlotBuilder;
