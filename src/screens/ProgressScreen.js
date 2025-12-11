import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from './AppContext'; 



const ProgressScreen = () => {
  const { userStats } = useAppContext(); // Получаем статистику из контекста

  const levels = [
    { id: 1, name: 'Введение', completed: true, score: 100 },
    { id: 2, name: 'Основы', completed: true, score: 150 },
    { id: 3, name: 'Продвинутый', completed: true, score: 200 },
    { id: 4, name: 'Эксперт', completed: true, score: 250 },
    { id: 5, name: 'Мастер', completed: false, score: 0, current: true },
    { id: 6, name: 'Гуру', completed: false, score: 0 },
    { id: 7, name: 'Легенда', completed: false, score: 0 },
  ];

  const calculateProgress = () => {
    return Math.round((userStats.completedLevels / userStats.totalLevels) * 100);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📈 Ваш прогресс</Text>
        <Text style={styles.subtitle}>Отслеживайте свои достижения</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Общая статистика</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userStats.totalScore}</Text>
            <Text style={styles.statLabel}>Общий счёт</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userStats.currentLevel}</Text>
            <Text style={styles.statLabel}>Текущий уровень</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userStats.gamesPlayed}</Text>
            <Text style={styles.statLabel}>Сыграно игр</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userStats.winRate}</Text>
            <Text style={styles.statLabel}>Процент побед</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <Text style={styles.progressTitle}>
            Прогресс по уровням: {calculateProgress()}%
          </Text>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${calculateProgress()}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {userStats.completedLevels} из {userStats.totalLevels} уровней завершено
          </Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Уровни</Text>
        {levels.map((level) => (
          <View 
            key={level.id} 
            style={[
              styles.levelItem,
              level.completed && styles.completedLevel,
              level.current && styles.currentLevel,
            ]}
          >
            <View style={styles.levelInfo}>
              <Text style={styles.levelName}>{level.name}</Text>
              <Text style={styles.levelScore}>
                {level.completed ? `+${level.score} очков` : 'Не завершён'}
              </Text>
            </View>
            <View style={styles.levelStatus}>
              {level.completed && <Text style={styles.statusText}>✅</Text>}
              {level.current && <Text style={styles.statusText}>🎯</Text>}
              {!level.completed && !level.current && <Text style={styles.statusText}>🔒</Text>}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Достижения</Text>
        <View style={styles.achievementsContainer}>
          {progress.achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>🏆</Text>
              <Text style={styles.achievementText}>{achievement}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#4A90E2', alignItems: 'center' },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#fff', opacity: 0.9, marginTop: 5 },
  statsContainer: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 15 },
  statsTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { 
    width: '48%', 
    backgroundColor: '#f8f9fa', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10,
    alignItems: 'center',
  },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#4A90E2' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 5 },
  progressBarContainer: { marginTop: 20 },
  progressTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 },
  progressBarBackground: { 
    height: 10, 
    backgroundColor: '#e0e0e0', 
    borderRadius: 5, 
    overflow: 'hidden' 
  },
  progressBarFill: { 
    height: '100%', 
    backgroundColor: '#4CAF50', 
    borderRadius: 5 
  },
  progressText: { fontSize: 14, color: '#666', marginTop: 5, textAlign: 'center' },
  section: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  levelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  completedLevel: { backgroundColor: '#F1F8E9' },
  currentLevel: { backgroundColor: '#E3F2FD' },
  levelInfo: { flex: 1 },
  levelName: { fontSize: 16, fontWeight: '600', color: '#333' },
  levelScore: { fontSize: 14, color: '#666', marginTop: 2 },
  levelStatus: { width: 40, alignItems: 'center' },
  statusText: { fontSize: 20 },
  achievementsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  achievementCard: {
    width: '48%',
    backgroundColor: '#FFF8E1',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  achievementIcon: { fontSize: 24, marginBottom: 5 },
  achievementText: { fontSize: 14, color: '#333', textAlign: 'center' },
});

export default ProgressScreen;