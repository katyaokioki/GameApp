import {
  calculateDifficultyMultiplier,
  getBaseGameTime,
  getPointsRange,
  getTargetCount
} from '../GameLogic';

describe('GameLogic Module Tests', () => {
  
  // Тест 1: calculateDifficultyMultiplier для разных сложностей
  test('calculateDifficultyMultiplier returns correct values for Легкий difficulty', () => {
    const result = calculateDifficultyMultiplier('Легкий');
    expect(result).toEqual({
      scoreMultiplier: 0.8,
      spawnRateMultiplier: 0.6,
      targetSizeMultiplier: 1.2,
      speedMultiplier: 0.7,
      timeMultiplier: 1.3,
    });
  });

  test('calculateDifficultyMultiplier returns correct values for Средний difficulty', () => {
    const result = calculateDifficultyMultiplier('Средний');
    expect(result).toEqual({
      scoreMultiplier: 1.0,
      spawnRateMultiplier: 1.0,
      targetSizeMultiplier: 1.0,
      speedMultiplier: 1.0,
      timeMultiplier: 1.0,
    });
  });

  test('calculateDifficultyMultiplier returns correct values for Сложный difficulty', () => {
    const result = calculateDifficultyMultiplier('Сложный');
    expect(result).toEqual({
      scoreMultiplier: 1.3,
      spawnRateMultiplier: 1.5,
      targetSizeMultiplier: 0.8,
      speedMultiplier: 1.4,
      timeMultiplier: 0.7,
    });
  });

  test('calculateDifficultyMultiplier returns default for unknown difficulty', () => {
    const result = calculateDifficultyMultiplier('Неизвестный');
    expect(result).toEqual({
      scoreMultiplier: 1.0,
      spawnRateMultiplier: 1.0,
      targetSizeMultiplier: 1.0,
      speedMultiplier: 1.0,
      timeMultiplier: 1.0,
    });
  });

  // Тест 2: getBaseGameTime
  test('getBaseGameTime returns correct times', () => {
    expect(getBaseGameTime('Легкий')).toBe(40);
    expect(getBaseGameTime('Средний')).toBe(30);
    expect(getBaseGameTime('Сложный')).toBe(20);
    expect(getBaseGameTime('Неизвестный')).toBe(30);
  });

  // Тест 3: getPointsRange
  test('getPointsRange returns correct ranges', () => {
    expect(getPointsRange('Легкий')).toEqual({ min: 8, max: 12 });
    expect(getPointsRange('Средний')).toEqual({ min: 5, max: 15 });
    expect(getPointsRange('Сложный')).toEqual({ min: 3, max: 20 });
    expect(getPointsRange('Неизвестный')).toEqual({ min: 5, max: 15 });
  });

  // Тест 4: getTargetCount
  test('getTargetCount returns correct counts', () => {
    expect(getTargetCount('Легкий')).toBe(6);
    expect(getTargetCount('Средний')).toBe(8);
    expect(getTargetCount('Сложный')).toBe(10);
    expect(getTargetCount('Неизвестный')).toBe(8);
  });
});