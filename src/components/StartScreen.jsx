import React from 'react';

export default function StartScreen({ onStart, score, onReset }) {
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
        SYSTEM STARTEN
      </button>
      {score > 0 && (
        <button className="btn-link" onClick={onReset}>
          Punktestand zurücksetzen ({score} XP)
        </button>
      )}
    </div>
  );
}
