import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Animated,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { useAppContext } from '../context/AppContext';

// Компонент для анимированной кнопки
const AnimatedMenuItem = ({ item, onPress, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Staggered animation для элементов меню
    Animated.sequence([
      Animated.delay(index * 100),
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 60,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      tension: 150,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 150,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayPressIn={0}
      delayPressOut={100}
    >
      <Animated.View
        style={[
          styles.menuItem,
          { backgroundColor: item.color },
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ],
          }
        ]}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.menuIcon}>{item.icon}</Text>
        </View>
        <Text style={styles.menuText}>{item.title}</Text>
        <View style={styles.chevronContainer}>
          <Text style={styles.chevron}>›</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// Компонент для анимированной статистики с прогресс-баром
const AnimatedStatItem = ({ value, label, maxValue = 1000 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: value / maxValue,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, [value]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[
        styles.statItem,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[
            styles.progressFill,
            { width: progressWidth }
          ]} 
        />
      </View>
    </Animated.View>
  );
};

const MainScreen = ({ navigation }) => {
  const { userStats } = useAppContext();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const menuItems = [
    { 
      title: '🎮 Начать игру', 
      screen: 'Game', 
      color: '#FF5722', 
      icon: '🎮',
      description: 'Начните новую игру' 
    },
    { 
      title: 'Продолжить', 
      screen: 'Game', 
      color: '#4CAF50', 
      icon: '▶️',
      description: 'Продолжить сохраненную игру'
    },    
    { 
      title: 'Прогресс', 
      screen: 'Progress', 
      color: '#FF9800', 
      icon: '📈',
      description: 'Отслеживайте ваш прогресс'
    },
    { 
      title: 'Рейтинг', 
      screen: 'Rating', 
      color: '#E91E63', 
      icon: '🏆',
      description: 'Соревнуйтесь с другими игроками'
    },
    { 
      title: 'Настройки', 
      screen: 'Settings', 
      color: '#2196F3', 
      icon: '⚙️',
      description: 'Настройте приложение'
    },
    { 
      title: 'Правила', 
      screen: 'Rules', 
      color: '#9C27B0', 
      icon: '📖',
      description: 'Ознакомьтесь с правилами'
    },
  ];

  // Параллакс эффект для заголовка
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [150, 100],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Фиксированный заголовок */}
      <Animated.View 
        style={[
          styles.header,
          {
            height: headerHeight,
            opacity: headerOpacity,
          }
        ]}
      >
        <Text style={styles.headerTitle}>Главное меню</Text>
        <Text style={styles.headerSubtitle}>Выберите раздел</Text>
      </Animated.View>
      
      <Animated.ScrollView 
        style={styles.scrollView}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Пустое пространство для заголовка */}
        <View style={{ height: 150 }} />
        
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Основные разделы</Text>
          {menuItems.map((item, index) => (
            <AnimatedMenuItem
              key={index}
              item={item}
              index={index}
              onPress={() => navigation.navigate(item.screen)}
            />
          ))}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Ваша статистика</Text>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Progress')}>
              <Text style={styles.statsLink}>Подробнее →</Text>
            </TouchableWithoutFeedback>
          </View>
          
          <View style={styles.statsRow}>
            <AnimatedStatItem 
              value={userStats.totalScore} 
              label="Общий счет"
              maxValue={5000}
            />
            <AnimatedStatItem 
              value={userStats.currentLevel} 
              label="Текущий уровень"
              maxValue={25}
            />
          </View>
          
          {/* Дополнительная статистика */}
          <View style={styles.additionalStats}>
            <View style={styles.additionalStat}>
              <Text style={styles.additionalStatValue}>{userStats.gamesPlayed || 0}</Text>
              <Text style={styles.additionalStatLabel}>Игр сыграно</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.additionalStat}>
              <Text style={styles.additionalStatValue}>{userStats.winRate || 0}%</Text>
              <Text style={styles.additionalStatLabel}>Процент побед</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.additionalStat}>
              <Text style={styles.additionalStatValue}>{userStats.bestScore || 0}</Text>
              <Text style={styles.additionalStatLabel}>Лучший счет</Text>
            </View>
          </View>
        </View>

        {/* Быстрые действия */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Быстрые действия</Text>
          <View style={styles.actionsRow}>
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Game')}>
              <View style={styles.quickAction}>
                <Text style={styles.actionIcon}>⚡</Text>
                <Text style={styles.actionText}>Быстрый старт</Text>
              </View>
            </TouchableWithoutFeedback>
            
            <TouchableWithoutFeedback onPress={() => {/* Действие */}}>
              <View style={styles.quickAction}>
                <Text style={styles.actionIcon}>🔄</Text>
                <Text style={styles.actionText}>Обновить</Text>
              </View>
            </TouchableWithoutFeedback>
            
            <TouchableWithoutFeedback onPress={() => navigation.navigate('Settings')}>
              <View style={styles.quickAction}>
                <Text style={styles.actionIcon}>🎯</Text>
                <Text style={styles.actionText}>Цели</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        
        {/* Дополнительный отступ внизу */}
        <View style={{ height: 30 }} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  headerTitle: { 
    fontSize: 28, 
    fontFamily: 'RussoOne_400Regular',  
    color: '#fff', 
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: { 
    fontSize: 16, 
    fontFamily: 'RussoOne_400Regular',  
    color: '#fff', 
    opacity: 0.9, 
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0, // Убираем отступ сверху
  },
  menuContainer: { 
    padding: 15,
    marginTop: 0, // Убираем marginTop
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'RussoOne_400Regular',
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuIcon: { 
    fontSize: 22,
  },
  menuText: { 
    flex: 1,
    color: '#fff', 
    fontFamily: 'RussoOne_400Regular',  
    fontSize: 18, 
    fontWeight: '600',
  },
  chevronContainer: {
    marginLeft: 10,
  },
  chevron: {
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: { 
    fontSize: 20, 
    fontFamily: 'RussoOne_400Regular',  
    fontWeight: 'bold', 
    color: '#333' 
  },
  statsLink: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: { 
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  statValue: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#4A90E2',
    marginBottom: 5,
  },
  statLabel: { 
    fontSize: 14, 
    color: '#666', 
    marginBottom: 10,
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A90E2',
    borderRadius: 3,
  },
  additionalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  additionalStat: {
    alignItems: 'center',
  },
  additionalStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  additionalStatLabel: {
    fontSize: 12,
    color: '#999',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#f0f0f0',
  },
  quickActions: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    width: 100,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default MainScreen;