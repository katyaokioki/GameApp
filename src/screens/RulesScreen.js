import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const RulesScreen = () => {
  const rules = [
    { title: '🎯 Цель игры', description: 'Набирайте очки, проходя уровни и выполняя задания.' },
    { title: '⭐️ Начисление очков', description: 'За каждый пройденный уровень вы получаете очки. Чем сложнее уровень, тем больше очков.' },
    { title: '📈 Прогресс', description: 'Ваш прогресс сохраняется автоматически. Вы можете продолжить с того места, где остановились.' },
    { title: '🏆 Рейтинг', description: 'Соревнуйтесь с другими игроками в глобальном рейтинге.' },
    { title: '⚙️ Настройки', description: 'Вы можете настроить звук, сложность и другие параметры игры.' },
    { title: '💡 Советы', description: 'Не торопитесь - тщательно обдумывайте каждый ход. Используйте бонусы и специальные возможности.' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📖 Правила игры</Text>
        <Text style={styles.subtitle}>Ознакомьтесь с основными правилами</Text>
      </View>

      <View style={styles.rulesContainer}>
        {rules.map((rule, index) => (
          <View key={index} style={styles.ruleCard}>
            <Text style={styles.ruleTitle}>{rule.title}</Text>
            <Text style={styles.ruleDescription}>{rule.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Удачи в игре! 🍀</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#4A90E2', alignItems: 'center' },
  title: { fontSize: 28, color: '#fff', fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#fff', opacity: 0.9, marginTop: 5 },
  rulesContainer: { padding: 15 },
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
  ruleTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  ruleDescription: { fontSize: 16, color: '#666', lineHeight: 24 },
  footer: { padding: 20, alignItems: 'center' },
  footerText: { fontSize: 18, color: '#4A90E2', fontWeight: '600' },
});

export default RulesScreen;