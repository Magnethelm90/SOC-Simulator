import React from 'react';
import { ACHIEVEMENTS } from '../data/achievements';

export default function AchievementsScreen({ unlocked, onBack }) {
  return (
    <div className="screen">
      <div className="glass-panel">
        <h2>Erfolge</h2>
        <p>{unlocked.length} / {ACHIEVEMENTS.length} freigeschaltet</p>
      </div>
      <div className="achievement-list">
        {ACHIEVEMENTS.map((a) => {
          const done = unlocked.includes(a.id);
          return (
            <div key={a.id} className={`achievement-item ${done ? 'unlocked' : 'locked'}`}>
              <span className="achievement-item-icon">{done ? a.icon : '🔒'}</span>
              <div>
                <div className="achievement-item-title">{a.title}</div>
                <div className="achievement-item-description">{a.description}</div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="btn btn-primary" onClick={onBack}>
        Zurück
      </button>
    </div>
  );
}
