import React, { useState, useEffect, useRef } from 'react';
import { SlotConfig, SpinResult, generateSpin } from '../../utils/slotMachineEngine';
import './SlotMachine.css';

interface SlotMachineProps {
  config: SlotConfig;
  onWin?: (amount: number) => void;
  onSpin?: () => void;
}

/**
 * SlotMachine Component
 * 
 * Renders a playable slot machine based on the provided configuration.
 * Handles spinning, win calculations, animations, and sound effects.
 */
const SlotMachine: React.FC<SlotMachineProps> = ({ config, onWin, onSpin }) => {
  const [credits, setCredits] = useState(1000); // Starting credits
  const [bet, setBet] = useState(config.minBet);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null);
  const [showWinAnimation, setShowWinAnimation] = useState(false);
  const [autoSpinCount, setAutoSpinCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showJackpot, setShowJackpot] = useState(false);
  const [activePaylines, setActivePaylines] = useState<number[]>([]);
  const [lastWinAmount, setLastWinAmount] = useState<number | null>(null);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  // Refs for DOM elements
  const reelsRef = useRef<HTMLDivElement>(null);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Generate extra symbols for the spinning animation
  const generateExtraSymbols = () => {
    const extraSymbols = [];
    for (let i = 0; i < 15; i++) {
      const randomIndex = Math.floor(Math.random() * config.symbols.length);
      extraSymbols.push(config.symbols[randomIndex]);
    }
    return extraSymbols;
  };
  
  // Initialize reel refs
  useEffect(() => {
    // Initialize reel refs array
    reelRefs.current = Array(config.reels.cols).fill(null);
  }, [config.reels.cols]);

  // Handle auto-spin
  useEffect(() => {
    if ((autoSpinCount > 0 || isAutoPlayEnabled) && !isSpinning && credits >= bet) {
      const timer = setTimeout(() => {
        handleSpin();
        if (autoSpinCount > 0) {
          setAutoSpinCount(prev => prev - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (autoSpinCount === 0 && isAutoPlayEnabled && !isSpinning && credits >= bet) {
      const timer = setTimeout(() => {
        handleSpin();
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isAutoPlayEnabled && credits < bet) {
      // Stop autoplay if not enough credits
      setIsAutoPlayEnabled(false);
    }
  }, [autoSpinCount, isSpinning, isAutoPlayEnabled, credits, bet]);

  /**
   * Handles the spin action
   * - Deducts bet from credits
   * - Triggers animations
   * - Calculates results
   * - Updates credits based on wins
   */
  const handleSpin = () => {
    // Clear any previous error messages and win animations
    setErrorMessage(null);
    setShowWinAnimation(false);
    setActivePaylines([]);
    setLastWinAmount(null);
    
    // Validate spin conditions
    if (isSpinning) return;
    
    if (credits < bet) {
      setErrorMessage("Not enough credits! Add more credits to continue playing.");
      return;
    }
    
    // Deduct bet from credits
    setCredits(prev => prev - bet);
    setIsSpinning(true);
    
    if (onSpin) onSpin();
    
    // Animate reels
    animateReels();
    
    // Generate spin result
    const result = generateSpin(config, bet);
    
    // After animation completes, show result
    setTimeout(() => {
      setSpinResult(result);
      setIsSpinning(false);
      
      // Set last win amount
      setLastWinAmount(result.totalWin);
      
      // Add winnings to credits
      if (result.totalWin > 0) {
        setCredits(prev => prev + result.totalWin);
        setShowWinAnimation(true);
        
        // Set active paylines
        setActivePaylines(result.winningLines.map(line => line.paylineId));
        
        if (onWin) onWin(result.totalWin);
      }
      
      // Handle jackpot
      if (result.triggeredFeatures.jackpot) {
        setShowJackpot(true);
      }
      
      // Handle free spins
      if (result.triggeredFeatures.freeSpins) {
        setAutoSpinCount(result.triggeredFeatures.freeSpins);
      }
    }, config.reels.cols * 600 + 500); // Animation duration based on number of reels
  };

  /**
   * Animates all reels with a staggered delay
   */
  const animateReels = () => {
    reelRefs.current.forEach((reel, index) => {
      if (reel) {
        setTimeout(() => {
          animateReel(reel, index);
        }, index * 200); // Staggered start for each reel
      }
    });
  };

  /**
   * Animates a single reel during spin
   */
  const animateReel = (reel: HTMLDivElement, index: number) => {
    // Create a sequence of random symbols for the animation
    const symbolsContainer = reel.querySelector('.reel-symbols') as HTMLDivElement;
    if (!symbolsContainer) return;
    
    // Reset position
    symbolsContainer.style.transition = 'none';
    symbolsContainer.style.top = '0px';
    
    // Force reflow
    void symbolsContainer.offsetHeight;
    
    // Start animation
    symbolsContainer.style.transition = `top ${0.5 + index * 0.1}s cubic-bezier(0.25, 0.1, 0.25, 1.0)`;
    symbolsContainer.style.top = `-${(15 - config.reels.rows) * 80}px`; // Scroll to show the last 3 symbols
  };

  /**
   * Handles bet amount changes
   */
  const handleBetChange = (newBet: number) => {
    if (!isSpinning && newBet >= config.minBet && newBet <= config.maxBet) {
      setBet(newBet);
    }
  };

  /**
   * Adds more credits to the player's balance
   */
  const handleAddCredits = () => {
    setCredits(prev => prev + 1000);
    setErrorMessage(null);
  };
  
  /**
   * Toggles autoplay on/off
   */
  const toggleAutoPlay = () => {
    setIsAutoPlayEnabled(prev => !prev);
  };
  
  /**
   * Closes the jackpot celebration modal
   */
  const closeJackpot = () => {
    setShowJackpot(false);
  };
  
  /**
   * Toggles the menu
   */
  const toggleMenu = () => {
    setShowMenu(prev => !prev);
    if (showMenu) {
      setActiveMenuItem(null);
    }
  };
  
  /**
   * Sets the active menu item
   */
  const handleMenuItemClick = (item: string) => {
    setActiveMenuItem(item);
  };
  
  /**
   * Closes the menu popup
   */
  const closeMenuPopup = () => {
    setActiveMenuItem(null);
  };
  
  /**
   * Toggles share options
   */
  const toggleShareOptions = () => {
    setShowShareOptions(prev => !prev);
  };
  
  /**
   * Shares the game on social media
   */
  const shareOnSocialMedia = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this awesome slot machine game: ${config.name}!`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    setShowShareOptions(false);
  };
  
  /**
   * Renders the payline indicators
   */
  const renderPaylineIndicators = () => {
    return (
      <div className="payline-indicators">
        {config.paylines.map(payline => (
          <div 
            key={payline.id} 
            className={`payline-indicator ${activePaylines.includes(payline.id) ? 'active' : ''}`}
          >
            {payline.id}
          </div>
        ))}
      </div>
    );
  };
  
  /**
   * Renders the payline paths for highlighting winning lines
   */
  const renderPaylinePaths = () => {
    if (!showWinAnimation || !spinResult) return null;
    
    return (
      <div className="payline-paths">
        {activePaylines.map(paylineId => {
          const payline = config.paylines.find(p => p.id === paylineId);
          if (!payline) return null;
          
          return (
            <svg key={paylineId} className="payline-path" viewBox={`0 0 ${config.reels.cols * 100} ${config.reels.rows * 100}`}>
              <path 
                d={generatePaylinePath(payline.positions)} 
                className={`payline-path-${paylineId % 5}`} 
              />
            </svg>
          );
        })}
      </div>
    );
  };
  
  /**
   * Generates SVG path for a payline
   */
  const generatePaylinePath = (positions: number[][]) => {
    if (!positions.length) return '';
    
    // Start at the center of the first position
    const startX = positions[0][1] * 100 + 50;
    const startY = positions[0][0] * 100 + 50;
    
    let path = `M ${startX} ${startY}`;
    
    // Add line to each subsequent position
    for (let i = 1; i < positions.length; i++) {
      const x = positions[i][1] * 100 + 50;
      const y = positions[i][0] * 100 + 50;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };
  
  /**
   * Renders the game rules popup
   */
  const renderGameRules = () => {
    return (
      <div className="menu-popup">
        <div className="menu-popup-content">
          <h2>Game Rules</h2>
          <div className="rules-content">
            <p>Welcome to {config.name}! Here's how to play:</p>
            <ol>
              <li>Select your bet amount using the bet buttons or predefined bet tabs.</li>
              <li>Click the SPIN button to start the game.</li>
              <li>Match 3 or more identical symbols on a payline to win.</li>
              <li>Wild symbols ({config.symbols.find(s => s.isWild)?.emoji || '⭐'}) substitute for any symbol except Scatter.</li>
              <li>Scatter symbols ({config.symbols.find(s => s.isScatter)?.emoji || '🎁'}) trigger free spins when 3 or more appear.</li>
              <li>Jackpot symbols ({config.symbols.find(s => s.isJackpot)?.emoji || '💰'}) on a payline award the jackpot prize.</li>
            </ol>
            <p>Good luck and have fun!</p>
          </div>
          <button className="close-popup-button" onClick={closeMenuPopup}>Close</button>
        </div>
      </div>
    );
  };
  
  /**
   * Renders the paytable popup
   */
  const renderPaytable = () => {
    return (
      <div className="menu-popup">
        <div className="menu-popup-content">
          <h2>Paytable</h2>
          <div className="paytable-content">
            <table className="paytable-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>3 of a kind</th>
                  <th>4 of a kind</th>
                  <th>5 of a kind</th>
                </tr>
              </thead>
              <tbody>
                {config.symbols.map(symbol => (
                  <tr key={symbol.id}>
                    <td className="symbol-cell">{symbol.emoji}</td>
                    <td>{symbol.name}</td>
                    <td>${symbol.payout[3] * bet}</td>
                    <td>${symbol.payout[4] * bet}</td>
                    <td>${symbol.payout[5] * bet}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="special-symbols">
              <h3>Special Symbols</h3>
              <ul>
                {config.symbols.find(s => s.isWild) && (
                  <li>
                    <span className="symbol-cell">{config.symbols.find(s => s.isWild)?.emoji}</span>
                    <span>Wild: Substitutes for any symbol except Scatter</span>
                  </li>
                )}
                {config.symbols.find(s => s.isScatter) && (
                  <li>
                    <span className="symbol-cell">{config.symbols.find(s => s.isScatter)?.emoji}</span>
                    <span>Scatter: 3 or more award free spins</span>
                  </li>
                )}
                {config.symbols.find(s => s.isJackpot) && (
                  <li>
                    <span className="symbol-cell">{config.symbols.find(s => s.isJackpot)?.emoji}</span>
                    <span>Jackpot: 5 on a payline awards the jackpot of ${bet * 1000}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <button className="close-popup-button" onClick={closeMenuPopup}>Close</button>
        </div>
      </div>
    );
  };
  
  /**
   * Renders the how to play popup
   */
  const renderHowToPlay = () => {
    return (
      <div className="menu-popup">
        <div className="menu-popup-content">
          <h2>How to Play</h2>
          <div className="how-to-play-content">
            <h3>Getting Started</h3>
            <ol>
              <li>Choose your bet amount using the predefined bet tabs or the + and - buttons.</li>
              <li>Click the SPIN button to start the game.</li>
              <li>You can also use Auto Play to spin automatically.</li>
            </ol>
            
            <h3>Understanding Paylines</h3>
            <p>This slot machine has {config.paylines.length} paylines. Each payline represents a possible winning combination.</p>
            <p>The payline indicators at the top of the reels show which paylines are active when you win.</p>
            
            <h3>Special Features</h3>
            <ul>
              {config.features.hasWilds && (
                <li><strong>Wild Symbols:</strong> Substitute for any regular symbol to help form winning combinations.</li>
              )}
              {config.features.hasScatters && (
                <li><strong>Scatter Symbols:</strong> Trigger free spins when 3 or more appear anywhere on the reels.</li>
              )}
              {config.features.hasJackpot && (
                <li><strong>Jackpot:</strong> Get 5 jackpot symbols on a payline to win the jackpot prize.</li>
              )}
              {config.features.hasMultipliers && (
                <li><strong>Multipliers:</strong> Randomly triggered to multiply your winnings.</li>
              )}
            </ul>
          </div>
          <button className="close-popup-button" onClick={closeMenuPopup}>Close</button>
        </div>
      </div>
    );
  };
  
  /**
   * Renders theme inspiration tabs for the slot builder
   */
  const renderThemeInspirations = () => {
    const themeInspirations = [
      {
        name: "Fruits",
        symbols: ["🍎", "🍊", "🍋", "🍇", "🍉", "🍓", "🍒", "🍑", "🥝"]
      },
      {
        name: "Animals",
        symbols: ["🐶", "🐱", "🦁", "🐯", "🐮", "🐷", "🐸", "🦊", "🐻"]
      },
      {
        name: "Ocean",
        symbols: ["🐠", "🐙", "🦑", "🦈", "🐬", "🐳", "🦀", "🐚", "⚓"]
      },
      {
        name: "Space",
        symbols: ["🚀", "🛸", "🌟", "🌙", "🪐", "☄️", "👽", "🌌", "🌠"]
      },
      {
        name: "Fantasy",
        symbols: ["🧙‍♂️", "🧚", "🦄", "🐉", "🏰", "⚔️", "🔮", "👑", "💎"]
      }
    ];
    
    return (
      <div className="theme-inspirations">
        <h3>Theme Inspirations</h3>
        <div className="theme-tabs">
          {themeInspirations.map(theme => (
            <div key={theme.name} className="theme-tab">
              <h4>{theme.name}</h4>
              <div className="theme-symbols">
                {theme.symbols.map((symbol, index) => (
                  <span key={index} className="theme-symbol">{symbol}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="slot-machine" 
      style={{ 
        backgroundColor: config.theme.backgroundColor,
      }}
    >
      <div className="casino-lights"></div>
      
      {/* Sandwich Menu */}
      <div className="menu-container">
        <button className="menu-button" onClick={toggleMenu}>
          <div className="menu-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        
        {showMenu && (
          <div className="menu-dropdown">
            <div className="menu-item" onClick={() => handleMenuItemClick('rules')}>
              Game Rules
            </div>
            <div className="menu-item" onClick={() => handleMenuItemClick('paytable')}>
              Paytable
            </div>
            <div className="menu-item" onClick={() => handleMenuItemClick('howToPlay')}>
              How to Play
            </div>
            <div className="menu-item" onClick={toggleShareOptions}>
              Share Game
            </div>
          </div>
        )}
        
        {/* Share Options */}
        {showShareOptions && (
          <div className="share-options">
            <div className="share-title">Share on:</div>
            <div className="share-buttons">
              <button 
                className="share-button facebook" 
                onClick={() => shareOnSocialMedia('facebook')}
                title="Share on Facebook"
              >
                <span className="share-icon">f</span>
              </button>
              <button 
                className="share-button twitter" 
                onClick={() => shareOnSocialMedia('twitter')}
                title="Share on Twitter"
              >
                <span className="share-icon">t</span>
              </button>
              <button 
                className="share-button linkedin" 
                onClick={() => shareOnSocialMedia('linkedin')}
                title="Share on LinkedIn"
              >
                <span className="share-icon">in</span>
              </button>
              <button 
                className="share-button whatsapp" 
                onClick={() => shareOnSocialMedia('whatsapp')}
                title="Share on WhatsApp"
              >
                <span className="share-icon">w</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Menu Popups */}
      {activeMenuItem === 'rules' && renderGameRules()}
      {activeMenuItem === 'paytable' && renderPaytable()}
      {activeMenuItem === 'howToPlay' && renderHowToPlay()}
      
      <div className="slot-header">
        <h2>{config.name}</h2>
        <div className="slot-info">
          <div className="credits">
            Credits: {credits}
            <button 
              className="add-credits-button"
              onClick={handleAddCredits}
              title="Add 1000 credits"
            >
              +
            </button>
          </div>
          
          {/* Last Win Display */}
          <div className="last-win">
            Last Win: {lastWinAmount !== null ? `$${lastWinAmount.toFixed(2)}` : '-'}
          </div>
          
          <div className="autoplay-control">
            <button 
              className={`autoplay-toggle ${isAutoPlayEnabled ? 'active' : ''}`}
              onClick={toggleAutoPlay}
              title={isAutoPlayEnabled ? "Stop Auto Play" : "Enable Auto Play"}
              disabled={isSpinning}
            >
              {isAutoPlayEnabled ? '⏹️' : '🔄'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Predefined Bet Amounts */}
      <div className="bet-tabs">
        {config.betOptions.map(amount => (
          <button 
            key={amount}
            className={`bet-tab ${bet === amount ? 'active' : ''}`}
            onClick={() => handleBetChange(amount)}
            disabled={isSpinning || amount < config.minBet || amount > config.maxBet}
          >
            ${amount.toFixed(2)}
          </button>
        ))}
      </div>
      
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}
      
      {renderPaylineIndicators()}
      
      <div 
        className="reels-container" 
        ref={reelsRef}
        style={{ backgroundColor: config.theme.reelColor }}
      >
        {/* Payline path overlays */}
        {renderPaylinePaths()}
        
        {Array.from({ length: config.reels.cols }).map((_, colIndex) => (
          <div 
            key={colIndex} 
            className="reel"
            ref={el => reelRefs.current[colIndex] = el}
          >
            <div className="reel-symbols">
              {/* Extra symbols for animation */}
              {generateExtraSymbols().map((symbol, i) => (
                <div key={`extra-${i}`} className="symbol">
                  {symbol.emoji}
                </div>
              ))}
              
              {/* Actual result symbols */}
              {spinResult ? (
                // Show actual result
                Array.from({ length: config.reels.rows }).map((_, rowIndex) => {
                  const symbolId = spinResult.reelPositions[rowIndex][colIndex];
                  const symbol = config.symbols.find(s => s.id === symbolId);
                  
                  // Check if this symbol is part of a winning line
                  const isWinning = showWinAnimation && 
                    spinResult.winningLines.some(line => 
                      line.symbols.includes(symbolId)
                    );
                  
                  return (
                    <div 
                      key={`result-${rowIndex}`} 
                      className={`symbol ${isWinning ? 'winning' : ''}`}
                      data-row={rowIndex}
                      data-col={colIndex}
                    >
                      {symbol?.emoji || '❓'}
                    </div>
                  );
                })
              ) : (
                // Show placeholder symbols
                Array.from({ length: config.reels.rows }).map((_, rowIndex) => (
                  <div 
                    key={`placeholder-${rowIndex}`} 
                    className="symbol"
                    data-row={rowIndex}
                    data-col={colIndex}
                  >
                    {config.symbols[rowIndex % config.symbols.length]?.emoji || '🎰'}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="controls">
        <div className="bet-control">
          <button 
            onClick={() => handleBetChange(bet - config.betOptions[0])}
            disabled={bet <= config.minBet || isSpinning}
            className="bet-button"
          >
            -
          </button>
          <span className="current-bet">Bet: ${bet.toFixed(2)}</span>
          <button 
            onClick={() => handleBetChange(bet + config.betOptions[0])}
            disabled={bet >= config.maxBet || isSpinning}
            className="bet-button"
          >
            +
          </button>
        </div>
        
        <button 
          className="spin-button"
          onClick={handleSpin}
          disabled={isSpinning || credits < bet}
          style={{ backgroundColor: config.theme.buttonColor }}
        >
          {isSpinning ? 'Spinning...' : autoSpinCount > 0 ? `Auto (${autoSpinCount})` : isAutoPlayEnabled ? 'Auto Play' : 'SPIN'}
        </button>
      </div>
      
      {spinResult && spinResult.totalWin > 0 && (
        <div className={`win-message ${showWinAnimation ? 'show' : ''}`}>
          <h3>WIN! ${spinResult.totalWin.toFixed(2)}</h3>
          <div className="winning-lines">
            {spinResult.winningLines.map(line => (
              <div key={line.paylineId} className="winning-line">
                Payline {line.paylineId}: ${line.winAmount.toFixed(2)}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {spinResult?.triggeredFeatures.freeSpins && (
        <div className="feature-message">
          <h3>🎉 {spinResult.triggeredFeatures.freeSpins} FREE SPINS! 🎉</h3>
        </div>
      )}
      
      {showJackpot && (
        <div className="jackpot-celebration">
          <h2>JACKPOT!!!</h2>
          <p>You've won the maximum prize of ${(bet * 1000).toFixed(2)}!</p>
          <button onClick={closeJackpot}>Continue Playing</button>
        </div>
      )}
    </div>
  );
};

export default SlotMachine; 