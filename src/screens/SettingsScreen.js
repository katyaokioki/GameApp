import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  ScrollView, 
  Alert,
  TouchableOpacity,
  Modal,
  TextInput
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedButton from '../components/Button';

const SettingsScreen = () => {
  const { settings, updateSettings, resetProgress, userStats } = useAppContext();
  const [localSettings, setLocalSettings] = useState(settings);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [username, setUsername] = useState('Игрок');
  const [isUsernameModalVisible, setUsernameModalVisible] = useState(false);

  // Синхронизация с глобальными настройками
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSettingChange = (key, value) => {
    const updatedSettings = { ...localSettings, [key]: value };
    setLocalSettings(updatedSettings);
    updateSettings(updatedSettings);
    
    // Дополнительные действия в зависимости от настройки
    switch(key) {
      case 'soundEnabled':
        // Здесь можно вызвать функцию для управления звуком
        console.log('Звук:', value ? 'включен' : 'выключен');
        break;
      case 'notificationsEnabled':
        // Запросить/отозвать разрешение на уведомления
        console.log('Уведомления:', value ? 'включены' : 'выключены');
        break;
      case 'difficulty':
        // Сохранить сложность для использования в игре
        console.log('Сложность изменена на:', value);
        break;
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Сброс прогресса',
      'Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Сбросить', 
          style: 'destructive',
          onPress: () => {
            resetProgress();
            Alert.alert('Готово', 'Прогресс успешно сброшен');
          }
        }
      ]
    );
  };

  const handleChangeUsername = () => {
    setUsernameModalVisible(true);
  };

  const saveUsername = async () => {
    if (username.trim().length > 0) {
      await AsyncStorage.setItem('username', username);
      updateSettings({ username });
      setUsernameModalVisible(false);
    }
  };

  const difficultyOptions = [
    { value: 'Легкий', description: 'Для новичков', color: '#4CAF50' },
    { value: 'Средний', description: 'Стандартная сложность', color: '#FF9800' },
    { value: 'Сложный', description: 'Для опытных игроков', color: '#F44336' }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Профиль пользователя */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{settings.username || 'Игрок'}</Text>
          <TouchableOpacity onPress={handleChangeUsername}>
            <Text style={styles.changeUsername}>Изменить имя</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Настройки игры */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎮 Настройки игры</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>Звуковые эффекты</Text>
            <Text style={styles.settingDescription}>Включить звуки игры</Text>
          </View>
          <Switch
            value={localSettings.soundEnabled}
            onValueChange={(value) => handleSettingChange('soundEnabled', value)}
            trackColor={{ false: '#ddd', true: '#81b0ff' }}
            thumbColor={localSettings.soundEnabled ? '#4A90E2' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>Уведомления</Text>
            <Text style={styles.settingDescription}>Получать уведомления</Text>
          </View>
          <Switch
            value={localSettings.notificationsEnabled}
            onValueChange={(value) => handleSettingChange('notificationsEnabled', value)}
            trackColor={{ false: '#ddd', true: '#81b0ff' }}
            thumbColor={localSettings.notificationsEnabled ? '#4A90E2' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingText}>Виброотклик</Text>
            <Text style={styles.settingDescription}>Тактильная обратная связь</Text>
          </View>
          <Switch
            value={localSettings.vibrationEnabled || false}
            onValueChange={(value) => handleSettingChange('vibrationEnabled', value)}
            trackColor={{ false: '#ddd', true: '#81b0ff' }}
            thumbColor={localSettings.vibrationEnabled ? '#4A90E2' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Сложность игры */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Сложность игры</Text>
        <Text style={styles.sectionDescription}>Влияет на скорость и количество очков</Text>
        
        {difficultyOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.difficultyOption,
              localSettings.difficulty === option.value && styles.difficultyOptionSelected,
              { borderLeftColor: option.color }
            ]}
            onPress={() => handleSettingChange('difficulty', option.value)}
          >
            <View>
              <Text style={[
                styles.difficultyText,
                localSettings.difficulty === option.value && styles.difficultyTextSelected
              ]}>
                {option.value}
              </Text>
              <Text style={styles.difficultyDescription}>{option.description}</Text>
            </View>
            {localSettings.difficulty === option.value && (
              <Text style={styles.selectedIcon}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Управление данными */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💾 Управление данными</Text>
        
        <AnimatedButton
          title="Сбросить прогресс"
          onPress={handleResetProgress}
          variant="outline"
          size="medium"
          color="#F44336"
          style={styles.dangerButton}
        />
        
        <View style={styles.dataInfo}>
          <Text style={styles.dataText}>Всего очков: {settings.totalScore || 0}</Text>
          <Text style={styles.dataText}>Прогресс: {Math.round((settings.completedLevels / settings.totalLevels) * 100)}%</Text>
        </View>
      </View>

      {/* О приложении */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ℹ️ О приложении</Text>
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>Версия 1.0.0</Text>
          <Text style={styles.aboutText}>Разработчик: Ваша команда</Text>
          <Text style={styles.aboutText}>© 2024 Все права защищены</Text>
        </View>
      </View>

      {/* Модальное окно для изменения имени */}
      <Modal
        visible={isUsernameModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Изменение имени</Text>
            <TextInput
              style={styles.usernameInput}
              value={username}
              onChangeText={setUsername}
              placeholder="Введите имя"
              maxLength={20}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setUsernameModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveUsername}
              >
                <Text style={styles.saveButtonText}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  profileSection: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatar: {
    fontSize: 30,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  changeUsername: {
    fontSize: 14,
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontFamily: 'RussoOne_400Regular',  
    fontWeight: 'bold', 
    marginBottom: 5, 
    color: '#333' 
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
  },
  settingText: { 
    fontSize: 16, 
    color: '#333',
    marginBottom: 3,
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
  },
  difficultyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderLeftWidth: 4,
  },
  difficultyOptionSelected: {
    backgroundColor: '#E3F2FD',
  },
  difficultyText: {
    fontSize: 16,
    color: '#333',
  },
  difficultyTextSelected: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  difficultyDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  selectedIcon: {
    fontSize: 20,
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  dangerButton: {
    marginTop: 10,
    borderColor: '#F44336',
  },
  dataInfo: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  dataText: {
    fontSize: 14,
    color: '#666',
    marginVertical: 3,
  },
  aboutContainer: { paddingVertical: 10 },
  aboutText: { 
    fontSize: 14, 
    color: '#666', 
    marginVertical: 3 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  usernameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SettingsScreen;