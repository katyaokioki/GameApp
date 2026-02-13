// utils/GameLogic.js
export const calculateDifficultyMultiplier = (difficulty) => {
  switch(difficulty) {
    case 'Легкий':
      return {
        speedMultiplier: 0.7,
        scoreMultiplier: 0.8,
        spawnRateMultiplier: 0.6,
        timeMultiplier: 1.3,
        targetSizeMultiplier: 1.2,
      };
    case 'Средний':
      return {
        speedMultiplier: 1.0,
        scoreMultiplier: 1.0,
        spawnRateMultiplier: 1.0,
        timeMultiplier: 1.0,
        targetSizeMultiplier: 1.0,
      };
    case 'Сложный':
      return {
        speedMultiplier: 1.4,
        scoreMultiplier: 1.3,
        spawnRateMultiplier: 1.5,
        timeMultiplier: 0.7,
        targetSizeMultiplier: 0.8,
      };
    default:
      return {
        speedMultiplier: 1.0,
        scoreMultiplier: 1.0,
        spawnRateMultiplier: 1.0,
        timeMultiplier: 1.0,
        targetSizeMultiplier: 1.0,
      };
  }
};

export const getBaseGameTime = (difficulty) => {
  switch(difficulty) {
    case 'Легкий': return 40;
    case 'Средний': return 30;
    case 'Сложный': return 20;
    default: return 30;
  }
};

export const getPointsRange = (difficulty) => {
  switch(difficulty) {
    case 'Легкий': return { min: 8, max: 12 };
    case 'Средний': return { min: 5, max: 15 };
    case 'Сложный': return { min: 3, max: 20 };
    default: return { min: 5, max: 15 };
  }
};

export const getTargetCount = (difficulty) => {
  switch(difficulty) {
    case 'Легкий': return 6;
    case 'Средний': return 8;
    case 'Сложный': return 10;
    default: return 8;
  }
};

export const getDifficultyDescription = (difficulty) => {
  switch(difficulty) {
    case 'Легкий': 
      return 'Медленная скорость, больше времени, меньше очков';
    case 'Средний': 
      return 'Стандартная скорость, нормальное время, средние очки';
    case 'Сложный': 
      return 'Высокая скорость, мало времени, больше очков';
    default: 
      return 'Стандартные настройки';
  }
};