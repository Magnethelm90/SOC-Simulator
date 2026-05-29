import React from 'react';

export default function ResultScreen({ isCorrect, feedback, onNext, isNextStep, xpChange, isGameOver }) {
  const isCriticalError = isGameOver || isCorrect === false;
  
  return (
    <div className="screen">
      <div className={`glass-panel ${isGameOver ? 'game-over-panel' : ''}`} style={{ borderColor: isCriticalError ? 'var(--error-color)' : 'var(--accent-color)' }}>
        <h2 className={isCriticalError ? "result-wrong" : "result-correct"}>
          {isGameOver ? "GAME OVER: Kritischer Fehler!" : (isCorrect ? "System gesichert!" : "Fehlerhafte Reaktion!")}
        </h2>
        <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '15px' }}>{feedback}</p>
        
        {xpChange !== 0 && (
          <div className={xpChange > 0 ? "xp-gain" : "xp-loss"} style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            {xpChange > 0 ? `+${xpChange} XP` : `${xpChange} XP`}
          </div>
        )}
      </div>
      <button className={`btn ${isGameOver ? 'btn-danger' : 'btn-primary'}`} onClick={onNext}>
        {isGameOver ? "SCHICHT BEENDEN" : (isNextStep ? "NÄCHSTER SCHRITT" : "WEITER")}
      </button>
    </div>
  );
}
