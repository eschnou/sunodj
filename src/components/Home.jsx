import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCharacter } from '../../character-generator/src/index.js';
import { generateRoomSlug } from '../utils/slugGenerator.js';
import './Home.css';

function Home() {
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState(null);
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  // Générer un personnage initial au chargement
  useEffect(() => {
    const initialCharacter = generateCharacter();
    setCharacter(initialCharacter);
  }, []);

  // Randomize character
  const handleRandomize = () => {
    const newCharacter = generateCharacter();
    setCharacter(newCharacter);
  };

  // Continue vers l'étape 2
  const handleContinue = () => {
    setStep(2);
  };

  // Retour vers l'étape 1
  const handleBack = () => {
    setStep(1);
  };

  // Créer une nouvelle room (logique de la branche main)
  const handleCreateRoom = () => {
    const slug = generateRoomSlug();
    console.log('[Home] Creating room with slug:', slug);

    // Sauvegarder le character
    if (character) {
      localStorage.setItem('sunorooms_character', JSON.stringify(character));
    }

    // Naviguer vers la room en mode DJ
    navigate(`/room/${slug}?dj=true`);
  };

  // Rejoindre une room existante (logique de la branche main)
  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      console.log('[Home] Joining room:', roomCode.trim());

      // Sauvegarder le character
      if (character) {
        localStorage.setItem('sunorooms_character', JSON.stringify(character));
      }

      // Naviguer vers la room
      navigate(`/room/${roomCode.trim()}`);
    }
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">🎵 SunoRooms</h1>
        <p className="home-subtitle">Listen to music together in sync</p>

        {/* Progress indicator */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Create Character</div>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Join or Create Room</div>
          </div>
        </div>

        {/* ÉTAPE 1 - Créer ton personnage */}
        {step === 1 && (
          <div className="step-content step-1">
            <h2>Create Your Character</h2>
            <p className="step-description">
              This is your avatar in the dancing room!
            </p>

            <div className="character-preview">
              {character && (
                <div
                  className="character-display"
                  dangerouslySetInnerHTML={{ __html: character.svg }}
                />
              )}
            </div>

            <div className="step-actions">
              <button className="btn btn-secondary" onClick={handleRandomize}>
                🎲 Randomize
              </button>
              <button className="btn btn-primary" onClick={handleContinue}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 - Créer ou Rejoindre une room */}
        {step === 2 && (
          <div className="step-content step-2">
            <h2>Your Character</h2>

            <div className="character-preview-small">
              {character && (
                <div
                  className="character-display-small"
                  dangerouslySetInnerHTML={{ __html: character.svg }}
                />
              )}
            </div>

            <div className="room-options">
              <div className="room-option">
                <h3>Create New Room</h3>
                <p>Start a new room and invite your friends</p>
                <button className="btn btn-create" onClick={handleCreateRoom}>
                  🎉 Create Room
                </button>
              </div>

              <div className="divider-or">
                <span>OR</span>
              </div>

              <div className="room-option">
                <h3>Join Existing Room</h3>
                <p>Enter a room code to join</p>
                <form onSubmit={handleJoinRoom}>
                  <input
                    type="text"
                    className="room-code-input"
                    placeholder="Enter room code (e.g. funky-tiger-42)"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-join"
                    disabled={!roomCode.trim()}
                  >
                    🚪 Join Room
                  </button>
                </form>
              </div>
            </div>

            <button className="btn btn-back" onClick={handleBack}>
              ← Back to Character
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
