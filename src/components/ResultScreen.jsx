import React, { useState } from 'react';

export default function ResultScreen({ isCorrect, feedback, onNext, isNextStep, xpChange, isGameOver, streakBonus, correctAnswerTexts, explanation }) {
  const isCriticalError = isGameOver || isCorrect === false;
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className="screen">
      <div className={`glass-panel ${isGameOver ? 'game-over-panel' : ''}`} style={{ borderColor: isCriticalError ? 'var(--error-color)' : 'var(--accent-color)' }}>
        <h2 className={isCriticalError ? "result-wrong" : "result-correct"}>
          {isGameOver ? "GAME OVER: Kritischer Fehler!" : (isCorrect ? "System gesichert!" : "Fehlerhafte Reaktion!")}
        </h2>
        <p style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '15px' }}>{feedback}</p>

        {!isCorrect && correctAnswerTexts && correctAnswerTexts.length > 0 && (
          <div className="correct-answer-box">
            <div className="correct-answer-label">Richtige Reaktion gewesen wäre:</div>
            <ul>
              {correctAnswerTexts.map((text, i) => (
                <li key={i}>{text}</li>
              ))}
            </ul>
          </div>
        )}

        {explanation && (
          <div className="explanation-block">
            <button type="button" className="btn-link explain-toggle" onClick={() => setShowExplanation(s => !s)}>
              {showExplanation ? 'Weniger anzeigen ▲' : 'Warum? Mehr erfahren ▼'}
            </button>
            {showExplanation && <div className="explanation-box">{explanation}</div>}
          </div>
        )}

        {xpChange !== 0 && (
          <div className={xpChange > 0 ? "xp-gain" : "xp-loss"} style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            {xpChange > 0 ? `+${xpChange} XP` : `${xpChange} XP`}
          </div>
        )}
        {streakBonus > 0 && (
          <div className="streak-bonus">🔥 Serien-Bonus: +{streakBonus} XP</div>
        )}
      </div>
      <button className={`btn ${isGameOver ? 'btn-danger' : 'btn-primary'}`} onClick={onNext}>
        {isGameOver ? "SCHICHT BEENDEN" : (isNextStep ? "NÄCHSTER SCHRITT" : "WEITER")}
      </button>
    </div>
  );
}
