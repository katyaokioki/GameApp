import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAppContext } from '../context/AppContext';


const MainScreen = ({ navigation }) => {
  const { userStats } = useAppContext(); // Получаем статистику
  const menuItems = [
    { title: '🎮 Играть', screen: 'Game', color: '#FF5722', icon: '🎮' }, // НОВЫЙ ПУНКТ
    { title: 'Продолжить игру', screen: 'Game', color: '#4CAF50', icon: '▶️' },    
    { title: 'Прогресс', screen: 'Progress', color: '#FF9800', icon: '📈' },
    { title: 'Рейтинг', screen: 'Rating', color: '#E91E63', icon: '🏆' },
    { title: 'Настройки', screen: 'Settings', color: '#2196F3', icon: '⚙️' },
    { title: 'Правила', screen: 'Rules', color: '#9C27B0', icon: '📖' },
  ];

  return (
    <ScrollView style={styles.container}>
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
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Ваша статистика</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.totalScore}</Text>
            <Text style={styles.statLabel}>Очки</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{userStats.currentLevel}</Text>
            <Text style={styles.statLabel}>Уровень</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#4A90E2', alignItems: 'center' },
  headerTitle: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  headerSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9, marginTop: 5 },
  menuContainer: { padding: 15 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: { fontSize: 24, marginRight: 15 },
  menuText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  statsContainer: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#4A90E2' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 5 },
});

export default MainScreen;