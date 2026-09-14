// Scenarios don't carry an explicit severity rating, so for the triage
// mini-game we derive a rough one heuristically from the shape of their
// options: a scenario that has a possible Game Over option is treated as
// the most critical, one with any penalty as medium, and a plain
// multiple-choice question (no penalty/game-over options at all) as low.
export const SEVERITY = { LOW: 1, MEDIUM: 2, HIGH: 3 };

export const SEVERITY_LABEL = { 1: 'Niedrig', 2: 'Mittel', 3: 'Kritisch' };
export const SEVERITY_CLASS = { 1: 'low', 2: 'medium', 3: 'high' };

export const deriveSeverity = (scenario) => {
  const options = scenario.isMultiStage
    ? scenario.steps.flatMap((s) => s.options)
    : scenario.options;
  if (options.some((o) => o.isGameOver)) return SEVERITY.HIGH;
  if (options.some((o) => o.penalty)) return SEVERITY.MEDIUM;
  return SEVERITY.LOW;
};
