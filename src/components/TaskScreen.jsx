import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/sound';

const TICK_THRESHOLD = 5; // seconds remaining at which the countdown starts ticking audibly

export default function TaskScreen({ scenario, currentStepIndex = 0, onAnswer, taskNumber, totalTasks, timerSeconds }) {
  const isMultiStage = scenario.isMultiStage;
  const currentStep = isMultiStage ? scenario.steps[currentStepIndex] : scenario;

  const title = isMultiStage ? `${scenario.title} - ${currentStep.stepTitle}` : scenario.title;
  const description = currentStep.description;
  const logs = currentStep.logs || scenario.logs;
  const options = currentStep.options;
  const isMultiSelect = currentStep.isMultiSelect;
  const category = scenario.category;
  const showProgress = Number.isInteger(taskNumber) && Number.isInteger(totalTasks) && totalTasks > 0;

  // No effect needed to reset selectedOptions/timeLeft on step/scenario
  // change: the parent remounts this component with a fresh key whenever
  // scenario or currentStepIndex changes, so useState's initial value
  // naturally resets.
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timerSeconds);

  // Countdown timer: when enabled, ticks down every second and, on reaching
  // zero, submits an empty answer (counts as incorrect, same as picking a
  // wrong option) so the shift keeps moving instead of stalling forever.
  useEffect(() => {
    if (!timerSeconds) return undefined;
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(id);
          onAnswer([]);
          return 0;
        }
        if (next <= TICK_THRESHOLD) {
          playSound('tick');
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerSeconds, onAnswer]);

  // Keyboard shortcuts: digit keys select/toggle an option, Enter confirms
  // a multi-select answer.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      const idx = Number(e.key) - 1;
      if (Number.isNaN(idx) || idx < 0 || idx >= options.length) {
        if (e.key === 'Enter' && isMultiSelect && selectedOptions.length > 0) {
          onAnswer(selectedOptions);
        }
        return;
      }
      const option = options[idx];
      if (isMultiSelect) {
        setSelectedOptions((prev) => (
          prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
        ));
      } else {
        onAnswer([option]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, isMultiSelect, selectedOptions, onAnswer]);

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSubmit = () => {
    onAnswer(selectedOptions);
  };

  const timerUrgency = timerSeconds && timeLeft <= TICK_THRESHOLD ? 'urgent' : (timerSeconds && timeLeft <= timerSeconds / 2 ? 'warning' : '');

  return (
    <div className="screen">
      {showProgress && (
        <div className="progress-track" aria-label={`Vorfall ${taskNumber} von ${totalTasks}`}>
          <div className="progress-track-header">
            <span>Vorfall {taskNumber} / {totalTasks}</span>
            {category && <span className="category-badge">{category}</span>}
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${(taskNumber / totalTasks) * 100}%` }} />
          </div>
        </div>
      )}

      {timerSeconds > 0 && (
        <div className={`timer-track ${timerUrgency}`}>
          <div className="timer-header">
            <span>⏱ Reaktionszeit</span>
            <span>{timeLeft}s</span>
          </div>
          <div className="timer-bar">
            <div className="timer-bar-fill" style={{ width: `${(timeLeft / timerSeconds) * 100}%` }} />
          </div>
        </div>
      )}

      <div className="glass-panel">
        <h2 className="alert-title">{title}</h2>
        <p style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '15px' }}>{description}</p>

        {logs && (
          <div className="log-console">
            <div className="log-console-header">
              <span className="log-dot red"></span>
              <span className="log-dot yellow"></span>
              <span className="log-dot green"></span>
              <span className="log-console-title">TERMINAL LOG FEED</span>
            </div>
            <pre className="log-console-body">
              <code>{logs}</code>
            </pre>
          </div>
        )}
      </div>

      <div className="options-container">
        {isMultiSelect ? (
          <>
            {options.map((option, index) => (
              <label key={index} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => toggleOption(option)}
                />
                <span className="checkbox-text"><span className="option-key">{index + 1}</span>{option.text}</span>
              </label>
            ))}
            <button
              className="btn btn-primary"
              style={{ marginTop: '20px' }}
              onClick={handleSubmit}
              disabled={selectedOptions.length === 0}
            >
              Antworten bestätigen (Enter)
            </button>
          </>
        ) : (
          options.map((option, index) => (
            <button
              key={index}
              className="btn"
              onClick={() => onAnswer([option])}
            >
              <span className="option-key">{index + 1}</span>{option.text}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
