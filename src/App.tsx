import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import SlotBuilder from './components/SlotBuilder/SlotBuilder';
import SlotMachine from './components/SlotMachine/SlotMachine';
import GameDirectory from './components/GameDirectory/GameDirectory';
import { SlotConfig, validateSlotConfig } from './utils/slotMachineEngine';
import './App.css';

/**
 * Main Application Component
 * 
 * Manages routing and global state for the Emoji Slots Builder application.
 * Handles saving and loading slot machine configurations from localStorage.
 */
const App: React.FC = () => {
  const [savedGames, setSavedGames] = useState<SlotConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load saved games from localStorage on initial render
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    try {
      const savedGamesJson = localStorage.getItem('emojiSlots');
      if (savedGamesJson) {
        const games = JSON.parse(savedGamesJson);
        
        // Validate each game configuration
        const validGames = games.filter((game: SlotConfig) => {
          const validation = validateSlotConfig(game);
          if (!validation.isValid) {
            console.warn(`Skipping invalid game "${game.name}": ${validation.error}`);
            return false;
          }
          return true;
        });
        
        setSavedGames(validGames);
      }
    } catch (error) {
      console.error('Failed to parse saved games:', error);
      setError('Failed to load saved games. Local storage may be corrupted.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Save games to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('emojiSlots', JSON.stringify(savedGames));
      } catch (error) {
        console.error('Failed to save games to localStorage:', error);
        setError('Failed to save games. You may be out of storage space.');
      }
    }
  }, [savedGames, loading]);
  
  /**
   * Handles saving a new or updated slot machine configuration
   */
  const handleSaveGame = (config: SlotConfig) => {
    // Validate the configuration
    const validation = validateSlotConfig(config);
    if (!validation.isValid) {
      setError(`Cannot save invalid configuration: ${validation.error}`);
      return;
    }
    
    // Check if game already exists (update) or is new (add)
    const existingIndex = savedGames.findIndex(game => game.id === config.id);
    
    if (existingIndex >= 0) {
      // Update existing game
      const updatedGames = [...savedGames];
      updatedGames[existingIndex] = config;
      setSavedGames(updatedGames);
    } else {
      // Add new game
      setSavedGames([...savedGames, config]);
    }
    
    // Clear any previous errors
    setError(null);
  };
  
  /**
   * Handles deleting a slot machine configuration
   */
  const handleDeleteGame = (id: string) => {
    setSavedGames(savedGames.filter(game => game.id !== id));
  };
  
  /**
   * Finds a game by ID
   */
  const findGameById = (id: string | undefined): SlotConfig | undefined => {
    if (!id) return undefined;
    return savedGames.find(game => game.id === id);
  };
  
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="logo">
            <Link to="/">🎰 Emoji Slots Builder</Link>
          </div>
          <nav>
            <Link to="/" className="nav-link">Game Directory</Link>
            <Link to="/create" className="nav-link create-button">Create New Slot</Link>
          </nav>
        </header>
        
        {error && (
          <div className="error-banner">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}
        
        <main className="app-content">
          {loading ? (
            <div className="loading">Loading saved games...</div>
          ) : (
            <Routes>
              <Route 
                path="/" 
                element={
                  <GameDirectory 
                    games={savedGames} 
                    onDeleteGame={handleDeleteGame}
                  />
                } 
              />
              <Route 
                path="/create" 
                element={<SlotBuilder onSave={handleSaveGame} />} 
              />
              <Route 
                path="/edit/:id" 
                element={
                  <SlotBuilder 
                    onSave={handleSaveGame} 
                    initialConfig={findGameById(
                      window.location.pathname.split('/').pop()
                    )}
                  />
                } 
              />
              <Route 
                path="/play/:id" 
                element={
                  <PlayRoute 
                    findGameById={findGameById} 
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </main>
        
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Emoji Slots Builder - Create and play custom slot games with emojis!</p>
        </footer>
      </div>
    </Router>
  );
};

/**
 * Play Route Component
 * 
 * Handles rendering the slot machine or an error message if the game is not found.
 */
interface PlayRouteProps {
  findGameById: (id: string | undefined) => SlotConfig | undefined;
}

const PlayRoute: React.FC<PlayRouteProps> = ({ findGameById }) => {
  const id = window.location.pathname.split('/').pop();
  const game = findGameById(id);
  
  return (
    <div className="play-container">
      <h2>Play Slot Machine</h2>
      {game ? (
        <SlotMachine config={game} />
      ) : (
        <div className="error-message">
          <p>Game not found! The slot machine you're looking for doesn't exist.</p>
          <Link to="/" className="button">Back to Directory</Link>
        </div>
      )}
    </div>
  );
};

export default App; 