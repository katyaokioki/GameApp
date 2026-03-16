import { 
  calculateDifficultyMultiplier, 
  getBaseGameTime, 
  getPointsRange,
  getTargetCount,
  getDifficultyDescription 
} from '../GameLogic';

describe('Модульное тестирование GameLogic', () => {
  
  // ТЕСТЫ ДЛЯ calculateDifficultyMultiplier
  describe('calculateDifficultyMultiplier', () => {
    test('Легкая сложность возвращает правильные множители', () => {
      const result = calculateDifficultyMultiplier('Легкий');
      
      expect(result).toEqual({
        speedMultiplier: 0.7,
        scoreMultiplier: 0.8,
        spawnRateMultiplier: 0.6,
        timeMultiplier: 1.3,
        targetSizeMultiplier: 1.2,
      });
    });

    test('Средняя сложность возвращает правильные множители', () => {
      const result = calculateDifficultyMultiplier('Средний');
      
      expect(result).toEqual({
        speedMultiplier: 1.0,
        scoreMultiplier: 1.0,
        spawnRateMultiplier: 1.0,
        timeMultiplier: 1.0,
        targetSizeMultiplier: 1.0,
      });
    });

    test('Сложная сложность возвращает правильные множители', () => {
      const result = calculateDifficultyMultiplier('Сложный');
      
      expect(result).toEqual({
        speedMultiplier: 1.4,
        scoreMultiplier: 1.3,
        spawnRateMultiplier: 1.5,
        timeMultiplier: 0.7,
        targetSizeMultiplier: 0.8,
      });
    });

    test('Неизвестная сложность возвращает значения по умолчанию', () => {
      const result = calculateDifficultyMultiplier('Неизвестный');
      
      expect(result).toEqual({
        speedMultiplier: 1.0,
        scoreMultiplier: 1.0,
        spawnRateMultiplier: 1.0,
        timeMultiplier: 1.0,
        targetSizeMultiplier: 1.0,
      });
    });
  });

  // ТЕСТЫ ДЛЯ getBaseGameTime
  describe('getBaseGameTime', () => {
    test('возвращает правильное время для каждой сложности', () => {
      expect(getBaseGameTime('Легкий')).toBe(40);
      expect(getBaseGameTime('Средний')).toBe(30);
      expect(getBaseGameTime('Сложный')).toBe(20);
      expect(getBaseGameTime('Неизвестный')).toBe(30);
    });
  });

  // ТЕСТЫ ДЛЯ getPointsRange
  describe('getPointsRange', () => {
    test('возвращает правильные диапазоны очков', () => {
      expect(getPointsRange('Легкий')).toEqual({ min: 8, max: 12 });
      expect(getPointsRange('Средний')).toEqual({ min: 5, max: 15 });
      expect(getPointsRange('Сложный')).toEqual({ min: 3, max: 20 });
      expect(getPointsRange('Неизвестный')).toEqual({ min: 5, max: 15 });
    });
  });

  // ТЕСТЫ ДЛЯ getTargetCount
  describe('getTargetCount', () => {
    test('возвращает правильное количество целей', () => {
      expect(getTargetCount('Легкий')).toBe(6);
      expect(getTargetCount('Средний')).toBe(8);
      expect(getTargetCount('Сложный')).toBe(10);
      expect(getTargetCount('Неизвестный')).toBe(8);
    });
  });

  // ТЕСТЫ ДЛЯ getDifficultyDescription
  describe('getDifficultyDescription', () => {
    test('возвращает правильные описания', () => {
      expect(getDifficultyDescription('Легкий')).toBe('Медленная скорость, больше времени, меньше очков');
      expect(getDifficultyDescription('Средний')).toBe('Стандартная скорость, нормальное время, средние очки');
      expect(getDifficultyDescription('Сложный')).toBe('Высокая скорость, мало времени, больше очков');
      expect(getDifficultyDescription('Неизвестный')).toBe('Стандартные настройки');
    });
  });
});