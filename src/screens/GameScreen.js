// src/screens/GameScreen.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Alert 
} from 'react-native';
import { useAppContext } from '../context/AppContext';

const GameScreen = ({ navigation }) => {
  const { userStats, addScore } = useAppContext();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targets, setTargets] = useState([]);
  const [gameTimer, setGameTimer] = useState(null);
  const [targetTimer, setTargetTimer] = useState(null);

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if (gameTimer) clearInterval(gameTimer);
      if (targetTimer) clearInterval(targetTimer);
    };
  }, []);

  const createTarget = () => {
    const newTarget = {
      id: Date.now() + Math.random(),
      x: Math.random() * 75 + 5,
      y: Math.random() * 60 + 15,
      size: Math.random() * 30 + 20,
      points: Math.floor(Math.random() * 10) + 5,
    };
    setTargets(prev => [...prev, newTarget].slice(-8)); // максимум 8 шариков
  };

  const handleTargetPress = (targetId, points) => {
    const newScore = score + points;
    setScore(newScore);
    setTargets(prev => prev.filter(t => t.id !== targetId));
    createTarget();
  };

  const startGame = () => {
    // Очищаем старые таймеры
    if (gameTimer) clearInterval(gameTimer);
    if (targetTimer) clearInterval(targetTimer);

    // Сбрасываем состояние
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setTargets([]);

    // Создаем первые шарики
    for (let i = 0; i < 3; i++) {
      setTimeout(createTarget, i * 300);
    }

    // Таймер создания новых шариков
    const targetInterval = setInterval(() => {
      if (targets.length < 8) {
        createTarget();
      }
    }, 1500);
    setTargetTimer(targetInterval);

    // Таймер игры
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          clearInterval(targetInterval);
          setIsPlaying(false);
          
          // Сохраняем результат в контекст
          addScore(score);
          
          // Показываем результат
          Alert.alert(
            'Игра окончена!',
            `Вы набрали ${score} очков!\n\nЛучший результат: ${Math.max(userStats.bestScore, score)}`,
            [{ text: 'OK' }]
          );
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setGameTimer(timer);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎯 Игра: Лопни шарик!</Text>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Очки</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Время</Text>
            <Text style={styles.statValue}>{timeLeft}с</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Лучший</Text>
            <Text style={styles.statValue}>{userStats.bestScore}</Text>
          </View>
        </View>
      </View>

      {!isPlaying ? (
        <View style={styles.startScreen}>
          <Text style={styles.instructionsTitle}>Как играть:</Text>
          <Text style={styles.instructions}>
            • Нажимай на шарики{"\n"}
            • Каждый даёт 5-15 очков{"\n"}
            • У тебя 30 секунд{"\n"}
            • Собери максимум очков!
          </Text>
          
          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>🎮 НАЧАТЬ ИГРУ</Text>
          </TouchableOpacity>

          {userStats.bestScore > 0 && (
            <View style={styles.bestScore}>
              <Text style={styles.bestScoreText}>Ваш лучший результат:</Text>
              <Text style={styles.bestScoreValue}>{userStats.bestScore} очков!</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.gameArea}>
          {targets.map(target => (
            <TouchableOpacity
              key={target.id}
              style={[
                styles.target,
                {
                  left: `${target.x}%`,
                  top: `${target.y}%`,
                  width: target.size,
                  height: target.size,
                  backgroundColor: `hsl(${target.points * 20}, 80%, 60%)`,
                }
              ]}
              onPress={() => handleTargetPress(target.id, target.points)}
            >
              <Text style={styles.targetText}>+{target.points}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.hint}>Жми на шарики!</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Выйти в меню</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
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
  startScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#141530',
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
    marginBottom: 40,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#ff5722',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 30,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  target: {
    position: 'absolute',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  targetText: {
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
  backButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GameScreen;