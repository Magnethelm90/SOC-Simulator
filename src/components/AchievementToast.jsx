import { useEffect } from 'react';

const AUTO_DISMISS_MS = 4500;

export default function AchievementToast({ achievement, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, AUTO_DISMISS_MS);
    return () => clearTimeout(id);
  }, [onDone]);

  return (
    <div className="achievement-toast" onClick={onDone} role="button" tabIndex={0}>
      <span className="achievement-toast-icon">{achievement.icon}</span>
      <div>
        <div className="achievement-toast-label">Erfolg freigeschaltet!</div>
        <div className="achievement-toast-title">{achievement.title}</div>
      </div>
    </div>
  );
}
