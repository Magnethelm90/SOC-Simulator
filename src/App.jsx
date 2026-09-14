import { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import TaskScreen from './components/TaskScreen';
import ResultScreen from './components/ResultScreen';
import { scenarios } from './data/scenarios';
import './index.css';

const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

const getLevelInfo = (xp) => {
  if (xp < 100) return { level: 1, title: 'Trainee' };
  if (xp < 300) return { level: 2, title: 'Junior Analyst' };
  if (xp < 600) return { level: 3, title: 'SOC Analyst' };
  if (xp < 1000) return { level: 4, title: 'Senior Analyst' };
  return { level: 5, title: 'Lead Incident Responder' };
};

// Every STREAK_INTERVAL correct answers in a row earns a bonus on top of the
// normal +100 XP, to reward consistently correct decisions.
const STREAK_INTERVAL = 3;
const STREAK_BONUS = 15;

function App() {
  const [gameState, setGameState] = useState('start'); // start, task, result, end
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [taskOrder, setTaskOrder] = useState([]);
  const [score, setScore] = useState(() => {
    const savedScore = localStorage.getItem('soc_simulator_score');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });

  // Per-shift stats. Reset every time a new shift starts (unlike score/XP,
  // which is meant to persist and keep accumulating across shifts).
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  const [lastAnswerState, setLastAnswerState] = useState({
    isCorrect: null,
    xpChange: 0,
    isGameOver: false,
    streakBonus: 0,
    correctAnswerTexts: [],
  });

  useEffect(() => {
    localStorage.setItem('soc_simulator_score', score);
  }, [score]);

  const startGame = () => {
    const newOrder = shuffleArray(scenarios.map((_, i) => i));
    setTaskOrder(newOrder);
    setGameState('task');
    setCurrentTaskIndex(0);
    setCurrentStepIndex(0);
    setStreak(0);
    setMaxStreak(0);
    setStats({ correct: 0, wrong: 0 });
    // Score wird nicht zurückgesetzt, damit man weiter aufsteigen kann!
  };

  const resetScore = () => {
    if (!window.confirm('Punktestand und Level wirklich auf 0 zurücksetzen?')) return;
    setScore(0);
  };

  const handleAnswer = (selectedOptions) => {
    const currentScenario = scenarios[taskOrder[currentTaskIndex]];
    const currentStep = currentScenario.isMultiStage ? currentScenario.steps[currentStepIndex] : currentScenario;
    const allCorrectOptions = currentStep.options.filter(opt => opt.isCorrect);

    let isCorrect = false;

    if (currentStep.isMultiSelect) {
      const selectedCorrectCount = selectedOptions.filter(opt => opt.isCorrect).length;
      const selectedWrongCount = selectedOptions.filter(opt => !opt.isCorrect).length;

      // All correct options selected and no wrong options selected
      if (selectedWrongCount === 0 && selectedCorrectCount === allCorrectOptions.length && allCorrectOptions.length > 0) {
        isCorrect = true;
      }
    } else {
      isCorrect = selectedOptions[0]?.isCorrect || false;
    }

    const hasGameOver = selectedOptions.some(opt => opt.isGameOver);
    let totalPenalty = selectedOptions.reduce((sum, opt) => sum + (opt.penalty || 0), 0);

    // Default XP gain for a correct step
    let xpChange = isCorrect ? 100 : 0;

    let streakBonus = 0;
    if (isCorrect && !hasGameOver) {
      const newStreak = streak + 1;
      if (newStreak % STREAK_INTERVAL === 0) {
        streakBonus = STREAK_BONUS;
      }
      setStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setStreak(0);
      setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }
    xpChange += streakBonus;

    // If not correct but no penalty defined, default to some penalty or leave it 0?
    // Let's just deduct what is defined in penalty.
    xpChange -= totalPenalty;

    // Ensure score doesn't drop below 0 if we don't want to, but negative is fine for a simulator.
    setScore(prev => Math.max(0, prev + xpChange));

    setLastAnswerState({
      isCorrect,
      xpChange,
      isGameOver: hasGameOver,
      streakBonus,
      correctAnswerTexts: allCorrectOptions.map(opt => opt.text),
    });

    setGameState('result');
  };

  const nextTask = () => {
    if (lastAnswerState.isGameOver) {
      setGameState('end');
      return;
    }

    const currentScenario = scenarios[taskOrder[currentTaskIndex]];

    // Check if we should go to next step
    if (lastAnswerState.isCorrect && currentScenario.isMultiStage && currentStepIndex + 1 < currentScenario.steps.length) {
      setCurrentStepIndex(currentStepIndex + 1);
      setGameState('task');
      return;
    }

    // Otherwise go to next task
    if (currentTaskIndex + 1 < taskOrder.length) {
      setCurrentTaskIndex(currentTaskIndex + 1);
      setCurrentStepIndex(0);
      setGameState('task');
    } else {
      setGameState('end');
    }
  };

  const levelInfo = getLevelInfo(score);
  const totalAnswered = stats.correct + stats.wrong;
  const accuracy = totalAnswered > 0 ? Math.round((stats.correct / totalAnswered) * 100) : 0;

  return (
    <div className="app-container">
      <div className="terminal-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>SOC Terminal v2.4</h1>
            <p>Status: {gameState === 'start' ? 'Standby' : 'Active Monitoring'}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00ffcc' }}>Level {levelInfo.level}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{levelInfo.title}</div>
            <div style={{ fontSize: '0.8rem', color: '#88c0d0' }}>{score} XP</div>
          </div>
        </div>
        {streak >= 2 && (gameState === 'task' || gameState === 'result') && (
          <div className="streak-badge">🔥 Serie: {streak}</div>
        )}
      </div>

      {gameState === 'start' && <StartScreen onStart={startGame} score={score} onReset={resetScore} />}

      {gameState === 'task' && taskOrder.length > 0 && (
        <TaskScreen
          key={`${currentTaskIndex}-${currentStepIndex}`}
          scenario={scenarios[taskOrder[currentTaskIndex]]}
          currentStepIndex={currentStepIndex}
          onAnswer={handleAnswer}
          taskNumber={currentTaskIndex + 1}
          totalTasks={taskOrder.length}
        />
      )}

      {gameState === 'result' && taskOrder.length > 0 && (() => {
        const currentScenario = scenarios[taskOrder[currentTaskIndex]];
        const currentStep = currentScenario.isMultiStage ? currentScenario.steps[currentStepIndex] : currentScenario;
        const isNextStep = lastAnswerState.isCorrect && currentScenario.isMultiStage && currentStepIndex + 1 < currentScenario.steps.length;

        return (
          <ResultScreen
            isCorrect={lastAnswerState.isCorrect}
            feedback={currentStep.feedback}
            isNextStep={isNextStep}
            onNext={nextTask}
            xpChange={lastAnswerState.xpChange}
            isGameOver={lastAnswerState.isGameOver}
            streakBonus={lastAnswerState.streakBonus}
            correctAnswerTexts={lastAnswerState.correctAnswerTexts}
          />
        );
      })()}

      {gameState === 'end' && (
        <div className="screen">
          <div className="glass-panel">
            <h2>Schicht beendet</h2>
            <p>Hier ist die Auswertung deiner Leistung als SOC-Analyst:</p>
            <div className="final-score" style={{ marginBottom: '10px' }}>
              <div>{score} XP</div>
              <div style={{ fontSize: '1.2rem', color: '#88c0d0', marginTop: '5px' }}>
                Erreichter Rang: {levelInfo.title} (Level {levelInfo.level})
              </div>
            </div>
            <div className="shift-stats">
              <div className="shift-stat">
                <span className="shift-stat-value">{stats.correct}/{totalAnswered}</span>
                <span className="shift-stat-label">Richtig</span>
              </div>
              <div className="shift-stat">
                <span className="shift-stat-value">{accuracy}%</span>
                <span className="shift-stat-label">Trefferquote</span>
              </div>
              <div className="shift-stat">
                <span className="shift-stat-value">{maxStreak}</span>
                <span className="shift-stat-label">Beste Serie</span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={startGame}>
              Neue Schicht starten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
