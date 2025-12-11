import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';

const SettingsScreen = () => {
  const [isSoundEnabled, setSoundEnabled] = useState(true);
  const [isNotificationsEnabled, setNotificationsEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState('Средний');

  const difficultyOptions = ['Легкий', 'Средний', 'Сложный'];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Настройки игры</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Звуковые эффекты</Text>
          <Switch
            value={isSoundEnabled}
            onValueChange={setSoundEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isSoundEnabled ? '#4A90E2' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Уведомления</Text>
          <Switch
            value={isNotificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isNotificationsEnabled ? '#4A90E2' : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Сложность игры</Text>
        {difficultyOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.difficultyOption,
              difficulty === option && styles.selectedOption,
            ]}
            onPress={() => setDifficulty(option)}
          >
            <Text style={[
              styles.difficultyText,
              difficulty === option && styles.selectedText,
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>О приложении</Text>
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>Версия 1.0.0</Text>
          <Text style={styles.aboutText}>Разработчик: Ваша команда</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: { fontSize: 16, color: '#333' },
  difficultyOption: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  selectedOption: { backgroundColor: '#4A90E2' },
  difficultyText: { fontSize: 16, color: '#333' },
  selectedText: { color: '#fff', fontWeight: '600' },
  aboutContainer: { padding: 10 },
  aboutText: { fontSize: 14, color: '#666', marginVertical: 5 },
});

export default SettingsScreen;