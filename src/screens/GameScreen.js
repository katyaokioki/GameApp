import React, { useState, useEffect } from 'react';
import GameTarget from '../components/GameTarget';
import { 
  View, 
  Text, 
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Platform // Добавляем Platform
} from 'react-native';
import * as Haptics from 'expo-haptics'; // Добавляем Haptics
import { useAppContext } from '../context/AppContext';
import AnimatedButton from '../components/Button';
import { 
  calculateDifficultyMultiplier, 
  getBaseGameTime, 
  getPointsRange,
  getTargetCount 
} from '../utils/GameLogic';

const GameScreen = ({ navigation }) => {
  const { userStats, addScore, settings } = useAppContext();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targets, setTargets] = useState([]);
  const [gameTimer, setGameTimer] = useState(null);
  const [targetTimer, setTargetTimer] = useState(null);
  const [difficultyMultiplier, setDifficultyMultiplier] = useState({});
  const [baseTime, setBaseTime] = useState(30);
  const [pointsRange, setPointsRange] = useState({ min: 5, max: 15 });
  const [maxTargets, setMaxTargets] = useState(8);

  const targetImages = [
    require('../../assets/macan.png'),
  ];

  useEffect(() => {
    if (settings?.difficulty) {
      const multiplier = calculateDifficultyMultiplier(settings.difficulty);
      setDifficultyMultiplier(multiplier);
      
      const gameTime = getBaseGameTime(settings.difficulty);
      setBaseTime(gameTime);
      setTimeLeft(gameTime);
      
      setPointsRange(getPointsRange(settings.difficulty));
      setMaxTargets(getTargetCount(settings.difficulty));
    } else {
      const multiplier = calculateDifficultyMultiplier('Средний');
      setDifficultyMultiplier(multiplier);
      setBaseTime(30);
      setTimeLeft(30);
      setPointsRange({ min: 5, max: 15 });
      setMaxTargets(8);
    }
  }, [settings?.difficulty]);

  useEffect(() => {
    return () => {
      if (gameTimer) clearInterval(gameTimer);
      if (targetTimer) clearInterval(targetTimer);
    };
  }, []);

  const createTarget = () => {
    const imageIndex = Math.floor(Math.random() * targetImages.length);
    const { min, max } = pointsRange;
    
    const baseSize = 50;
    const sizeMultiplier = difficultyMultiplier?.targetSizeMultiplier || 1.0;
    const targetSize = Math.floor(baseSize * sizeMultiplier);
    
    const newTarget = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 5,
      y: Math.random() * 70 + 10,
      size: targetSize,
      points: Math.floor(Math.random() * (max - min + 1)) + min,
      imageIndex: imageIndex,
      rotation: Math.random() * 360,
      opacity: 1,
      speed: difficultyMultiplier?.speedMultiplier || 1.0,
    };
    
    setTargets(prev => {
      const updatedTargets = [...prev, newTarget];
      return updatedTargets.slice(-maxTargets);
    });
  };

  /**
   * ИЗМЕНЕНО: Добавлен Haptic Feedback для iOS
   */
  const handleTargetPress = (targetId, points) => {
    // Платформо-специфичная логика: тактильный отклик для iOS
    if (Platform.OS === 'ios' && settings?.vibrationEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log('🎯 Haptic feedback on iOS');
      } catch (error) {
        console.warn('Haptics failed:', error);
      }
    }
    
    const scoreMultiplier = difficultyMultiplier?.scoreMultiplier || 1.0;
    const calculatedPoints = Math.round(points * scoreMultiplier);
    const newScore = score + calculatedPoints;
    
    setScore(newScore);
    
    setTargets(prev => 
      prev.map(target => 
        target.id === targetId 
          ? { ...target, opacity: 0.3, size: target.size * 0.7 }
          : target
      )
    );
    
    setTimeout(() => {
      setTargets(prev => prev.filter(t => t.id !== targetId));
      if (isPlaying) {
        createTarget();
      }
    }, 100);
  };

  const startGame = () => {
    if (gameTimer) clearInterval(gameTimer);
    if (targetTimer) clearInterval(targetTimer);

    setIsPlaying(true);
    setScore(0);
    setTargets([]);
    
    const initialTime = baseTime;
    setTimeLeft(initialTime);

    const initialTargets = Math.min(3, Math.floor(maxTargets / 2));
    for (let i = 0; i < initialTargets; i++) {
      setTimeout(() => createTarget(), i * 500);
    }

    const spawnRateMultiplier = difficultyMultiplier?.spawnRateMultiplier || 1.0;
    const spawnInterval = Math.max(500, 1500 / spawnRateMultiplier);
    
    const targetInterval = setInterval(() => {
      if (isPlaying && targets.length < maxTargets) {
        createTarget();
      }
    }, spawnInterval);
    setTargetTimer(targetInterval);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(targetInterval);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setGameTimer(timer);
  };

  const endGame = () => {
    setIsPlaying(false);
    
    addScore(score);
    
    let difficultyBonus = 0;
    if (settings?.difficulty === 'Сложный') {
      difficultyBonus = Math.round(score * 0.2);
    } else if (settings?.difficulty === 'Легкий') {
      difficultyBonus = Math.round(score * 0.1);
    }
    
    const totalScore = score + difficultyBonus;
    
    Alert.alert(
      'Игра окончена!',
      `Сложность: ${settings?.difficulty || 'Средний'}\n` +
      `Вы набрали: ${score} очков\n` +
      (difficultyBonus > 0 ? `Бонус за сложность: +${difficultyBonus}\n` : '') +
      `Всего: ${totalScore} очков!\n\n` +
      `Ваш лучший результат: ${Math.max(userStats?.bestScore || 0, totalScore)}`,
      [{ text: 'OK' }]
    );
  };

  const pauseGame = () => {
    if (gameTimer) clearInterval(gameTimer);
    if (targetTimer) clearInterval(targetTimer);
    setIsPlaying(false);
    
    Alert.alert(
      'Игра на паузе',
      'Продолжить игру?',
      [
        { text: 'Выйти', onPress: () => navigation.goBack() },
        { 
          text: 'Продолжить', 
          onPress: () => {
            setIsPlaying(true);
            
            const timer = setInterval(() => {
              setTimeLeft(prev => {
                if (prev <= 1) {
                  clearInterval(timer);
                  endGame();
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
            setGameTimer(timer);
          }
        }
      ]
    );
  };

  const getDifficultyColor = () => {
    switch(settings?.difficulty) {
      case 'Легкий': return '#4CAF50';
      case 'Средний': return '#FF9800';
      case 'Сложный': return '#F44336';
      default: return '#4A90E2';
    }
  };

  const instructions = {
    title: '🎯 Игра: поймай!',
    howToPlay: [
      '• Нажимай на появляющиеся картинки',
      '• Сложность влияет на скорость и очки',
      '• Управляй скоростью в настройках',
      '• Собери максимум очков!'
    ].join('\n')
  };

  const handleExitToMenu = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.difficultyBadge}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
            {settings?.difficulty || 'Средний'}
          </Text>
        </View>
        
        <Text style={styles.title}>{instructions.title}</Text>
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Очки</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Время</Text>
            <Text style={[styles.statValue, timeLeft < 10 && styles.timeWarning]}>
              {timeLeft}с
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Лучший</Text>
            <Text style={styles.statValue}>{userStats?.bestScore || 0}</Text>
          </View>
        </View>
      </View>

      {!isPlaying ? (
        <View style={styles.startScreen}>
          <View style={styles.difficultyInfo}>
            <Text style={styles.difficultyInfoTitle}>Текущая сложность: {settings?.difficulty || 'Средний'}</Text>
            <Text style={styles.difficultyInfoText}>
              {settings?.difficulty === 'Легкий' && '• Медленная скорость\n• Больше времени\n• Меньше очков'}
              {settings?.difficulty === 'Средний' && '• Средняя скорость\n• Стандартное время\n• Нормальные очки'}
              {settings?.difficulty === 'Сложный' && '• Высокая скорость\n• Мало времени\n• Больше очков'}
              {(!settings?.difficulty || settings?.difficulty === 'Средний') && '• Средняя скорость\n• Стандартное время\n• Нормальные очки'}
            </Text>
            <TouchableOpacity 
              style={styles.changeDifficultyButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.changeDifficultyText}>Изменить сложность</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.instructionsTitle}>Как играть:</Text>
          <Text style={styles.instructions}>{instructions.howToPlay}</Text>
          
          <View style={styles.imagePreview}>
            <Text style={styles.previewText}>Примеры целей:</Text>
            <View style={styles.previewImages}>
              {targetImages.slice(0, 3).map((img, index) => (
                <Image 
                  key={index} 
                  source={img} 
                  style={styles.previewImage} 
                  onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                />
              ))}
            </View>
          </View>
          
          <View style={styles.startButtons}>
            <AnimatedButton
              title="🎮 НАЧАТЬ ИГРУ"
              onPress={startGame}
              variant="danger"
              size="large"
              style={styles.startButton}
              textStyle={styles.startButtonText}
            />
            
            <AnimatedButton
              title="Выйти в меню"
              onPress={handleExitToMenu}
              variant="primary"
              size="medium"
              style={styles.exitButton}
              textStyle={styles.exitButtonText}
            />
            
            {(userStats?.bestScore || 0) > 0 && (
              <View style={styles.bestScore}>
                <Text style={styles.bestScoreText}>Ваш лучший результат:</Text>
                <Text style={styles.bestScoreValue}>{userStats?.bestScore || 0} очков!</Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.gameArea}>
          {targets.map(target => (
            <TouchableOpacity
              key={target.id}
              onPress={() => handleTargetPress(target.id, target.points)}
              style={[
                styles.targetContainer,
                {
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  opacity: target.opacity,
                  transform: [
                    { rotate: `${target.rotation}deg` },
                    { scale: target.size / 80 }
                  ]
                }
              ]}
              activeOpacity={0.7}
            >
              <Image
                source={targetImages[target.imageIndex]}
                style={styles.targetImage}
                resizeMode="contain"
                onError={(e) => console.log('Target image error:', e.nativeEvent.error)}
              />
              <View style={styles.pointsOverlay}>
                <Text style={styles.targetText}>+{target.points}</Text>
              </View>
            </TouchableOpacity>
          ))}
          
          <View style={styles.gameControls}>
            <TouchableOpacity 
              style={styles.pauseButton}
              onPress={pauseGame}
            >
              <Text style={styles.pauseButtonText}>⏸ Пауза</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.hint}>Жми на картинки!</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    backgroundColor: '#16213e',
    alignItems: 'center',
  },
  difficultyBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#8f9bb3',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 28,
    color: '#00ff88',
    fontWeight: 'bold',
  },
  timeWarning: {
    color: '#ff4444',
  },
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#141530',
  },
  difficultyInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  difficultyInfoTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  difficultyInfoText: {
    fontSize: 14,
    color: '#c1c1c1',
    lineHeight: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  changeDifficultyButton: {
    alignSelf: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
  },
  changeDifficultyText: {
    fontSize: 12,
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
  instructionsTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 18,
    color: '#c1c1c1',
    lineHeight: 28,
    marginBottom: 30,
    textAlign: 'center',
  },
  imagePreview: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  previewImages: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  previewImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  startButtons: {
    alignItems: 'center',
    width: '100%',
  },
  startButton: {
    marginBottom: 15,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  exitButton: {
    marginBottom: 30,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bestScore: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  bestScoreText: {
    fontSize: 14,
    color: '#a0a0c0',
    marginBottom: 5,
  },
  bestScoreValue: {
    fontSize: 24,
    color: '#ffd166',
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#141530',
  },
  targetContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  targetImage: {
    width: 80,
    height: 80,
  },
  pointsOverlay: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  targetText: {
    color: '#00ff88',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gameControls: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  pauseButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pauseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  hint: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#a0a0c0',
    fontSize: 16,
    padding: 10,
  },
});

export default GameScreen;