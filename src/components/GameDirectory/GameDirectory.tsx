import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SlotConfig } from '../../utils/slotMachineEngine';
import './GameDirectory.css';

interface GameDirectoryProps {
  games: SlotConfig[];
  onDeleteGame: (id: string) => void;
}

/**
 * Game Directory Component
 * 
 * Displays a list of saved slot machine games with filtering and sorting options.
 * Allows users to play, edit, or delete games.
 */
const GameDirectory: React.FC<GameDirectoryProps> = ({ games, onDeleteGame }) => {
  const [sortBy, setSortBy] = useState<'newest' | 'name'>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  // Filter games based on search term
  const filteredGames = games.filter(game => 
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort games based on sort option
  const sortedGames = [...filteredGames].sort((a, b) => {
    if (sortBy === 'newest') {
      return b.createdAt - a.createdAt;
    } else {
      return a.name.localeCompare(b.name);
    }
  });
  
  /**
   * Handles the delete confirmation process
   */
  const handleDeleteClick = (id: string) => {
    setConfirmDelete(id);
  };
  
  /**
   * Confirms and executes the delete action
   */
  const confirmDeleteGame = (id: string) => {
    onDeleteGame(id);
    setConfirmDelete(null);
  };
  
  /**
   * Cancels the delete action
   */
  const cancelDelete = () => {
    setConfirmDelete(null);
  };
  
  return (
    <div className="game-directory">
      <div className="directory-header">
        <h2>Emoji Slot Games Directory</h2>
        <p>Browse and play custom slot games created by the community</p>
      </div>
      
      <div className="directory-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search games or authors..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="sort-options">
          <label>Sort by:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as 'newest' | 'name')}>
            <option value="newest">Newest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>
      
      {sortedGames.length === 0 ? (
        <div className="no-games">
          <p>No games found. Create your first slot machine!</p>
          <Link to="/create" className="create-game-button">Create New Slot</Link>
        </div>
      ) : (
        <div className="games-grid">
          {sortedGames.map(game => (
            <div key={game.id} className="game-card">
              <div 
                className="game-preview"
                style={{ backgroundColor: game.theme.backgroundColor }}
              >
                <div className="game-symbols">
                  {game.symbols.slice(0, 3).map((symbol, index) => (
                    <div key={index} className="game-symbol">
                      {symbol.emoji}
                    </div>
                  ))}
                </div>
                <div 
                  className="game-button"
                  style={{ backgroundColor: game.theme.buttonColor }}
                >
                  SPIN
                </div>
              </div>
              
              <div className="game-info">
                <h3>{game.name}</h3>
                <p>Created by: {game.author || 'Anonymous'}</p>
                <p>Reels: {game.reels.rows}x{game.reels.cols}</p>
                <p>Symbols: {game.symbols.length}</p>
                <p>Paylines: {game.paylines.length}</p>
                <p>RTP: {(game.rtp * 100).toFixed(1)}%</p>
                <p>Created: {new Date(game.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div className="game-actions">
                <Link to={`/play/${game.id}`} className="play-button">Play Now</Link>
                <Link to={`/edit/${game.id}`} className="edit-button">Edit</Link>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteClick(game.id)}
                >
                  Delete
                </button>
                
                {confirmDelete === game.id && (
                  <div className="delete-confirmation">
                    <p>Are you sure you want to delete "{game.name}"?</p>
                    <div className="confirmation-buttons">
                      <button 
                        className="confirm-delete"
                        onClick={() => confirmDeleteGame(game.id)}
                      >
                        Yes, Delete
                      </button>
                      <button 
                        className="cancel-delete"
                        onClick={cancelDelete}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GameDirectory; 