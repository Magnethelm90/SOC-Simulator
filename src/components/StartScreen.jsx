import React, { useState } from 'react';

export default function StartScreen({ onStart, score, onReset, settings, onSettingsChange, categories, onToggleCategory, unlockedCount, totalAchievements, onShowAchievements }) {
  const [showSettings, setShowSettings] = useState(false);
  const isHardcore = settings.difficulty === 'hardcore';
  const timerActive = isHardcore || settings.timerEnabled;

  return (
    <div className="screen">
      <div className="glass-panel">
        <h2>Willkommen im SOC</h2>
        <p>
          Du bist der neue Security Analyst auf Schicht. Deine Aufgabe:
          Eingehende Sicherheitswarnungen analysieren und sofort die richtige Gegenmaßnahme ergreifen.
        </p>
        <p>
          Eine falsche Entscheidung kann das gesamte Netzwerk gefährden. Bist du bereit?
        </p>
      </div>

      <button className="btn btn-primary" onClick={onStart}>
        SYSTEM STARTEN{timerActive ? ' ⏱' : ''}
      </button>

      <button className="btn-link settings-toggle" onClick={() => setShowSettings(s => !s)}>
        ⚙ Einstellungen {showSettings ? '▲' : '▼'}
      </button>

      <button className="btn-link" onClick={onShowAchievements}>
        🏆 Erfolge ({unlockedCount} / {totalAchievements})
      </button>

      {showSettings && (
        <div className="glass-panel settings-panel">
          <div className="settings-group">
            <div className="settings-label">Schwierigkeit</div>
            <div className="difficulty-options">
              <label className={`difficulty-option ${!isHardcore ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="difficulty"
                  checked={!isHardcore}
                  onChange={() => onSettingsChange({ difficulty: 'normal' })}
                />
                <span>Normal</span>
              </label>
              <label className={`difficulty-option ${isHardcore ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="difficulty"
                  checked={isHardcore}
                  onChange={() => onSettingsChange({ difficulty: 'hardcore' })}
                />
                <span>Hardcore ⏱ (+20% XP)</span>
              </label>
            </div>
          </div>

          <div className="settings-group">
            <label className="settings-checkbox-row">
              <input
                type="checkbox"
                checked={timerActive}
                disabled={isHardcore}
                onChange={(e) => onSettingsChange({ timerEnabled: e.target.checked })}
              />
              <span>
                Zeitdruck aktivieren {isHardcore && '(im Hardcore-Modus immer an)'}
              </span>
            </label>
            <label className="settings-checkbox-row">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onSettingsChange({ soundEnabled: e.target.checked })}
              />
              <span>Sound aktivieren</span>
            </label>
          </div>

          <div className="settings-group">
            <div className="settings-label">Kategorien (antippen zum Ausschließen)</div>
            <div className="category-chip-row">
              {categories.map(({ name, count }) => {
                const excluded = settings.excludedCategories.includes(name);
                return (
                  <button
                    type="button"
                    key={name}
                    className={`category-chip ${excluded ? 'excluded' : ''}`}
                    onClick={() => onToggleCategory(name)}
                  >
                    {name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {score > 0 && (
        <button className="btn-link" onClick={onReset}>
          Punktestand zurücksetzen ({score} XP)
        </button>
      )}
    </div>
  );
}
