import React, { useState } from 'react'; // ОДИН импорт
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './AppContext';
import { 
  View, Text, TouchableOpacity, StyleSheet, 
  ScrollView, Switch, FlatList 
} from 'react-native';

// 1. ЭКРАН ПРИВЕТСТВИЯ
const WelcomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>🎮 Йоу! Добро пожаловать!</Text>
    <Text style={styles.subtitle}>Увлекательная игра ждёт тебя</Text>
    
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('Main')}
    >
      <Text style={styles.buttonText}>Начать игру</Text>
    </TouchableOpacity>
    
    <TouchableOpacity
      style={[styles.button, styles.secondaryButton]}
      onPress={() => navigation.navigate('Rules')}
    >
      <Text style={styles.buttonText}>Правила</Text>
    </TouchableOpacity>
  </View>
);

// 2. ГЛАВНОЕ МЕНЮ - ОБНОВИЛ: добавил кнопку Играть
const MainScreen = ({ navigation }) => {
  const menuItems = [
    { title: '🎮 Играть', screen: 'Game', color: '#FF5722' }, // ДОБАВЛЕНО
    { title: 'Продолжить', screen: 'Progress', color: '#4CAF50' },
    { title: 'Настройки', screen: 'Settings', color: '#2196F3' },
    { title: 'Рейтинг', screen: 'Rating', color: '#E91E63' },
    { title: 'Правила', screen: 'Rules', color: '#9C27B0' },
    { title: 'Прогресс', screen: 'Progress', color: '#FF9800' },
  ];

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Главное меню</Text>
        <Text style={styles.headerSubtitle}>Выберите раздел</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: item.color }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 3. ИГРОВОЙ ЭКРАН (Один раз, полный код)
const GameScreen = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targets, setTargets] = useState([]);

  const createTarget = () => {
    const newTarget = {
      id: Date.now() + Math.random(),
      x: Math.random() * 75 + 5,
      y: Math.random() * 60 + 15,
      size: Math.random() * 30 + 20,
      points: Math.floor(Math.random() * 10) + 5,
    };
    setTargets(prev => [...prev, newTarget]);
  };

  const handleTargetPress = (targetId, points) => {
    setScore(prev => prev + points);
    setTargets(prev => prev.filter(t => t.id !== targetId));
    createTarget();
  };

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(30);
    setTargets([]);
    
    for (let i = 0; i < 3; i++) {
      setTimeout(createTarget, i * 300);
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <View style={styles.gameContainer}>
      <View style={styles.gameHeader}>
        <Text style={styles.gameTitle}>🎯 Игра: Лопни шарик!</Text>
        <View style={styles.gameStats}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Очки</Text>
            <Text style={styles.statValue}>{score}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Время</Text>
            <Text style={styles.statValue}>{timeLeft}с</Text>
          </View>
        </View>
      </View>

      {!isPlaying ? (
        <View style={styles.gameStartScreen}>
          <Text style={styles.gameInstructionsTitle}>Правила:</Text>
          <Text style={styles.gameInstructions}>
            • Нажимай на шарики{"\n"}
            • Каждый даёт 5-15 очков{"\n"}
            • У тебя 30 секунд{"\n"}
            • Собери максимум очков!
          </Text>
          
          <TouchableOpacity
            style={styles.startButton}
            onPress={startGame}
          >
            <Text style={styles.startButtonText}>🎮 НАЧАТЬ ИГРУ</Text>
          </TouchableOpacity>

          {score > 0 && (
            <View style={styles.lastScore}>
              <Text style={styles.lastScoreText}>Последний результат:</Text>
              <Text style={styles.lastScoreValue}>{score} очков!</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.gameArea}>
          <View style={styles.targetsContainer}>
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
          </View>
          <Text style={styles.gameHint}>Жми на шарики!</Text>
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

// 4. ЭКРАН НАСТРОЕК
const SettingsScreen = ({ navigation }) => {
  const [isSoundOn, setSoundOn] = useState(true);
  const [difficulty, setDifficulty] = useState('Средний');

  return (
    <ScrollView style={styles.settingsContainer}>
      <Text style={styles.screenTitle}>Настройки игры</Text>
      
      <View style={styles.settingSection}>
        <Text style={styles.sectionTitle}>Звук</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingText}>Звуковые эффекты</Text>
          <Switch
            value={isSoundOn}
            onValueChange={setSoundOn}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
        </View>
      </View>

      <View style={styles.settingSection}>
        <Text style={styles.sectionTitle}>Сложность</Text>
        {['Легкий', 'Средний', 'Сложный'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.difficultyOption,
              difficulty === level && styles.selectedOption
            ]}
            onPress={() => setDifficulty(level)}
          >
            <Text style={[
              styles.difficultyText,
              difficulty === level && styles.selectedText
            ]}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 5. ЭКРАН РЕЙТИНГА
const RatingScreen = ({ navigation }) => {
  const players = [
    { id: '1', name: 'Игрок 1', score: 2500 },
    { id: '2', name: 'Игрок 2', score: 2300 },
    { id: '3', name: 'Ты', score: 2100, isYou: true },
    { id: '4', name: 'Игрок 4', score: 1900 },
  ];

  return (
    <View style={styles.ratingContainer}>
      <Text style={styles.screenTitle}>🏆 Рейтинг игроков</Text>
      
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={[
            styles.playerRow,
            item.isYou && styles.yourRow
          ]}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={[
              styles.playerName,
              item.isYou && styles.yourName
            ]}>{item.name}</Text>
            <Text style={styles.playerScore}>{item.score}</Text>
          </View>
        )}
      />
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>
    </View>
  );
};

// 6. ЭКРАН ПРАВИЛ
const RulesScreen = ({ navigation }) => {
  const rules = [
    '🎯 Цель игры: набрать как можно больше очков',
    '⭐️ За каждый уровень получаешь очки',
    '📈 Прогресс сохраняется автоматически',
    '🏆 Соревнуйся с друзьями в рейтинге',
    '⚙️ Настрой игру под себя',
  ];

  return (
    <ScrollView style={styles.rulesContainer}>
      <Text style={styles.screenTitle}>📖 Правила игры</Text>
      
      {rules.map((rule, index) => (
        <View key={index} style={styles.ruleCard}>
          <Text style={styles.ruleText}>{rule}</Text>
        </View>
      ))}
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 7. ЭКРАН ПРОГРЕССА
const ProgressScreen = ({ navigation }) => {
  const progress = {
    score: 2100,
    level: 5,
    completed: 12,
    total: 25,
  };

  const progressPercent = Math.round((progress.completed / progress.total) * 100);

  return (
    <View style={styles.progressContainer}>
      <Text style={styles.screenTitle}>📈 Твой прогресс</Text>
      
      <View style={styles.statsCard}>
        <Text style={styles.statValue}>{progress.score}</Text>
        <Text style={styles.statLabel}>Очков</Text>
      </View>
      
      <View style={styles.statsCard}>
        <Text style={styles.statValue}>{progress.level}</Text>
        <Text style={styles.statLabel}>Уровень</Text>
      </View>
      
      <View style={styles.progressSection}>
        <Text style={styles.progressText}>
          Пройдено: {progress.completed}/{progress.total} ({progressPercent}%)
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Назад</Text>
      </TouchableOpacity>
    </View>
  );
};

// НАВИГАЦИЯ
const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>

    
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#4A90E2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Main" 
            component={MainScreen}
            options={{ title: 'Главная' }}
          />
          {/* ВАЖНО: добавить GameScreen в навигатор */}
          <Stack.Screen 
            name="Game" 
            component={GameScreen}
            options={{ title: 'Игра', headerShown: false }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Настройки' }}
          />
          <Stack.Screen 
            name="Rating" 
            component={RatingScreen}
            options={{ title: 'Рейтинг' }}
          />
          <Stack.Screen 
            name="Rules" 
            component={RulesScreen}
            options={{ title: 'Правила' }}
          />
          <Stack.Screen 
            name="Progress" 
            component={ProgressScreen}
            options={{ title: 'Прогресс' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

// СТИЛИ (удалите дубликаты)
const styles = StyleSheet.create({
  // Основные стили
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 20,
  },
  title: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#6C63FF',
  },
  buttonText: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Главное меню
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    padding: 20,
    borderRadius: 15,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Общие стили для экранов
  settingsContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  ratingContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  rulesContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  progressContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Настройки
  settingSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  difficultyOption: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: '#4A90E2',
  },
  difficultyText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '600',
  },
  
  // Рейтинг
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  yourRow: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  rank: {
    width: 40,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  playerName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  yourName: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  playerScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  
  // Правила
  ruleCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ruleText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  
  // Прогресс
  statsCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  progressSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  progressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  
  // Игровые стили (уникальные, без дублей)
  gameContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gameHeader: {
    padding: 20,
    backgroundColor: '#16213e',
    alignItems: 'center',
  },
  gameTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#8f9bb3',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 32,
    color: '#00ff88',
    fontWeight: 'bold',
  },
  gameStartScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#141530',
  },
  gameInstructionsTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gameInstructions: {
    fontSize: 18,
    color: '#c1c1c1',
    lineHeight: 28,
    marginBottom: 40,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#ff5722',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 30,
    marginBottom: 30,
    shadowColor: '#ff5722',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  lastScore: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  lastScoreText: {
    fontSize: 16,
    color: '#a0a0c0',
    marginBottom: 8,
  },
  lastScoreValue: {
    fontSize: 32,
    color: '#ffd166',
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#141530',
  },
  targetsContainer: {
    flex: 1,
    position: 'relative',
  },
  target: {
    position: 'absolute',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  targetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameHint: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#a0a0c0',
    fontSize: 16,
    padding: 15,
    backgroundColor: 'rgba(26, 27, 53, 0.9)',
    marginHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3a3b6d',
  },
  
  // Кнопка назад (общая)
  backButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
    minWidth: 120,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});