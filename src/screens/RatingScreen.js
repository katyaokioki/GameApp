// RatingScreen.js
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppContext } from '../context/AppContext';

const RatingScreen = () => {
  const { userStats } = useAppContext(); // Получаем данные из контекста

  // Динамический массив игроков с использованием данных из контекста
  const players = [
    { id: '1', name: 'Алексей', score: 2450, level: 25 },
    { id: '2', name: 'Мария', score: 2310, level: 24 },
    { id: '3', name: 'Дмитрий', score: 2150, level: 22 },
    { id: '4', name: 'Анна', score: 1980, level: 20 },
    { id: '5', name: 'Иван', score: 1850, level: 19 },
    { 
      id: '6', 
      name: 'Вы', 
      score: userStats.totalScore, // Используем реальный счет из контекста
      level: userStats.currentLevel, // Используем текущий уровень из контекста
      isCurrentUser: true 
    },
    { id: '7', name: 'Ольга', score: 1320, level: 14 },
  ].sort((a, b) => b.score - a.score);

  const renderPlayer = ({ item, index }) => (
    <View style={[
      styles.playerRow,
      item.isCurrentUser && styles.currentUserRow,
      index < 3 && styles.topThreeRow,
    ]}>
      <View style={styles.rankContainer}>
        <Text style={[
          styles.rank,
          index < 3 && styles.topThreeRank,
          item.isCurrentUser && styles.currentUserRank,
        ]}>
          {index + 1}
        </Text>
      </View>
      
      <View style={styles.playerInfo}>
        <Text style={[
          styles.playerName,
          item.isCurrentUser && styles.currentUserName,
        ]}>
          {item.name}
        </Text>
        <Text style={styles.playerLevel}>Уровень: {item.level}</Text>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={[
          styles.playerScore,
          item.isCurrentUser && styles.currentUserScore,
        ]}>
          {item.score}
        </Text>
        <Text style={styles.scoreLabel}>очков</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Рейтинг игроков</Text>
        <Text style={styles.subtitle}>Топ-10 лучших результатов</Text>
        <Text style={styles.userInfo}>
          Ваш счет: {userStats.totalScore} | Уровень: {userStats.currentLevel}
        </Text>
      </View>
      
      <FlatList
        data={players}
        keyExtractor={(item) => item.id}
        renderItem={renderPlayer}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Нет данных о рейтинге</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  header: { 
    padding: 20, 
    backgroundColor: '#4A90E2', 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 28, 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#fff', 
    opacity: 0.9, 
    marginTop: 5 
  },
  userInfo: {
    fontSize: 14,
    color: '#fff',
    marginTop: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  listContainer: { 
    padding: 15 
  },
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
  currentUserRow: { 
    backgroundColor: '#E3F2FD', 
    borderWidth: 2, 
    borderColor: '#4A90E2' 
  },
  topThreeRow: { 
    backgroundColor: '#FFF8E1' 
  },
  rankContainer: { 
    width: 40, 
    alignItems: 'center' 
  },
  rank: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#666' 
  },
  topThreeRank: { 
    fontSize: 24, 
    color: '#FF9800' 
  },
  currentUserRank: { 
    color: '#4A90E2' 
  },
  playerInfo: { 
    flex: 1 
  },
  playerName: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333' 
  },
  currentUserName: { 
    color: '#4A90E2', 
    fontWeight: 'bold' 
  },
  playerLevel: { 
    fontSize: 14, 
    color: '#666', 
    marginTop: 2 
  },
  scoreContainer: { 
    alignItems: 'flex-end' 
  },
  playerScore: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#4CAF50' 
  },
  currentUserScore: { 
    color: '#4A90E2' 
  },
  scoreLabel: { 
    fontSize: 12, 
    color: '#999', 
    marginTop: 2 
  },
  emptyContainer: {
    padding: 50,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default RatingScreen;