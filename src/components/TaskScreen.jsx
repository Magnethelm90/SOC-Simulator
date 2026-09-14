import React, { useState } from 'react';

export default function TaskScreen({ scenario, currentStepIndex = 0, onAnswer, taskNumber, totalTasks }) {
  const isMultiStage = scenario.isMultiStage;
  const currentStep = isMultiStage ? scenario.steps[currentStepIndex] : scenario;

  const title = isMultiStage ? `${scenario.title} - ${currentStep.stepTitle}` : scenario.title;
  const description = currentStep.description;
  const logs = currentStep.logs || scenario.logs;
  const options = currentStep.options;
  const isMultiSelect = currentStep.isMultiSelect;
  const category = scenario.category;
  const showProgress = Number.isInteger(taskNumber) && Number.isInteger(totalTasks) && totalTasks > 0;

  // No effect needed to reset selectedOptions on step/scenario change: the
  // parent remounts this component with a fresh key whenever scenario or
  // currentStepIndex changes, so useState's initial value naturally resets.
  const [selectedOptions, setSelectedOptions] = useState([]);

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
                <span className="checkbox-text">{option.text}</span>
              </label>
            ))}
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '20px' }}
              onClick={handleSubmit}
              disabled={selectedOptions.length === 0}
            >
              Antworten bestätigen
            </button>
          </>
        ) : (
          options.map((option, index) => (
            <button 
              key={index} 
              className="btn" 
              onClick={() => onAnswer([option])}
            >
              {option.text}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
