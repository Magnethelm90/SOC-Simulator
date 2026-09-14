import React, { useState } from 'react';
import { deriveSeverity, SEVERITY_LABEL, SEVERITY_CLASS } from '../utils/severity';

const TRIAGE_BONUS = 20;
const TRIAGE_PENALTY = -10;

export default function TriageScreen({ candidates, onConfirm }) {
  // candidates: [{ position, scenario }] - the pool to reorder.
  const [picked, setPicked] = useState([]); // chosen `position` values, in order
  const remaining = candidates.filter((c) => !picked.includes(c.position));
  const isDone = picked.length === candidates.length;

  const pick = (position) => {
    if (isDone) return;
    setPicked((prev) => [...prev, position]);
  };

  const orderedCandidates = picked.map((pos) => candidates.find((c) => c.position === pos));
  const severities = orderedCandidates.map((c) => deriveSeverity(c.scenario));
  const idealSeverities = [...severities].sort((a, b) => b - a);
  const isIdealOrder = isDone && severities.every((s, i) => s === idealSeverities[i]);
  const isWorstOrder = isDone && !isIdealOrder && JSON.stringify(severities) === JSON.stringify([...idealSeverities].reverse());
  const bonus = isIdealOrder ? TRIAGE_BONUS : (isWorstOrder ? TRIAGE_PENALTY : 0);

  return (
    <div className="screen">
      <div className="glass-panel">
        <h2 className="alert-title">Mehrere Alarme gleichzeitig!</h2>
        <p style={{ color: '#fff', fontSize: '1.05rem' }}>
          {candidates.length} Vorfälle laufen parallel auf. Wähle, in welcher Reihenfolge du sie bearbeitest –
          der kritischste zuerst bringt einen Bonus.
        </p>
      </div>

      {!isDone && (
        <div className="triage-list">
          {remaining.map(({ scenario, position }) => {
            const sev = deriveSeverity(scenario);
            return (
              <button key={position} type="button" className="triage-card" onClick={() => pick(position)}>
                <span className={`severity-dot ${SEVERITY_CLASS[sev]}`} />
                <span className="triage-card-title">{scenario.title}</span>
                <span className={`severity-label ${SEVERITY_CLASS[sev]}`}>{SEVERITY_LABEL[sev]}</span>
              </button>
            );
          })}
        </div>
      )}

      {isDone && (
        <div className="glass-panel">
          <div className="triage-order-list">
            {orderedCandidates.map((c, i) => (
              <div key={c.position} className="triage-order-item">
                <span className="option-key">{i + 1}</span>
                {c.scenario.title}
                <span className={`severity-label ${SEVERITY_CLASS[deriveSeverity(c.scenario)]}`}>
                  {SEVERITY_LABEL[deriveSeverity(c.scenario)]}
                </span>
              </div>
            ))}
          </div>
          {isIdealOrder && <div className="xp-gain triage-verdict">✅ Perfekt priorisiert! +{TRIAGE_BONUS} XP</div>}
          {isWorstOrder && <div className="xp-loss triage-verdict">⚠️ Der kritischste Alarm hätte zuerst dran sein sollen. {TRIAGE_PENALTY} XP</div>}
          {!isIdealOrder && !isWorstOrder && <div className="triage-verdict">Reihenfolge notiert – es geht direkt weiter.</div>}
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => onConfirm(picked, bonus)}>
            Vorfälle bearbeiten
          </button>
        </div>
      )}
    </div>
  );
}
