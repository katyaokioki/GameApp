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
  TextInput,
  Platform // Добавляем Platform
} from 'react-native';
import * as Notifications from 'expo-notifications'; // Добавляем уведомления
import { useAppContext } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedButton from '../components/Button';

// Ключ для хранения состояния напоминаний
const REMINDER_KEY = '@gameapp_reminder_enabled';

const SettingsScreen = () => {
  const { settings, updateSettings, resetProgress, userStats } = useAppContext();
  const [localSettings, setLocalSettings] = useState(settings);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [username, setUsername] = useState('Игрок');
  const [isUsernameModalVisible, setUsernameModalVisible] = useState(false);
  // Добавляем состояние для напоминаний
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);

  // Синхронизация с глобальными настройками
  useEffect(() => {
    setLocalSettings(settings);
    loadReminderState(); // Загружаем состояние напоминаний
  }, [settings]);

  /**
   * НОВОЕ: Загрузка состояния напоминаний
   */
  const loadReminderState = async () => {
    try {
      const savedReminder = await AsyncStorage.getItem(REMINDER_KEY);
      if (savedReminder !== null) {
        setIsReminderEnabled(JSON.parse(savedReminder));
      }
    } catch (error) {
      console.error('Failed to load reminder state:', error);
    }
  };

  /**
   * НОВОЕ: Планирование ежедневного уведомления (только для Android)
   */
  const scheduleDailyReminder = async () => {
    if (Platform.OS !== 'android') return false;

    try {
      // Запрашиваем разрешения для Android 13+
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          '❌ Разрешение не предоставлено',
          'Вы не будете получать напоминания. Включите уведомления в настройках телефона.'
        );
        return false;
      }

      // Отменяем все предыдущие уведомления
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Планируем новое уведомление на 20:00 каждый день
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎮 Пора играть!",
          body: 'Ваши цели ждут вас в GameApp. Заходите и повышайте свой уровень!',
          data: { screen: 'Game' },
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: 20,
          minute: 0,
          repeats: true,
        },
      });

      Alert.alert('✅ Успешно', 'Ежедневное напоминание установлено на 20:00');
      return true;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      Alert.alert('❌ Ошибка', 'Не удалось установить напоминание');
      return false;
    }
  };

  /**
   * НОВОЕ: Отмена всех уведомлений
   */
  const cancelAllReminders = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      Alert.alert('ℹ️ Напоминание отключено');
    } catch (error) {
      console.error('Failed to cancel notifications:', error);
    }
  };

  /**
   * НОВОЕ: Отправка тестового уведомления
   */
  const sendTestNotification = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert('ℹ️ Информация', 'Тестовые уведомления доступны только на Android');
      return;
    }
    
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 Тестовое уведомление",
          body: "Если вы это видите - уведомления работают!",
          data: { test: true },
        },
        trigger: null, // Отправляем немедленно
      });
      Alert.alert('✅ Успешно', 'Тестовое уведомление отправлено');
    } catch (error) {
      Alert.alert('❌ Ошибка', 'Не удалось отправить тестовое уведомление');
    }
  };

  const handleSettingChange = (key, value) => {
    const updatedSettings = { ...localSettings, [key]: value };
    setLocalSettings(updatedSettings);
    updateSettings(updatedSettings);
    
    // Дополнительные действия в зависимости от настройки
    switch(key) {
      case 'soundEnabled':
        console.log('Звук:', value ? 'включен' : 'выключен');
        break;
      case 'notificationsEnabled':
        console.log('Уведомления:', value ? 'включены' : 'выключены');
        break;
      case 'difficulty':
        console.log('Сложность изменена на:', value);
        break;
    }
  };

  /**
   * НОВОЕ: Обработчик переключения напоминаний
   */
  const handleReminderToggle = async (value) => {
    setIsReminderEnabled(value);
    await AsyncStorage.setItem(REMINDER_KEY, JSON.stringify(value));

    // Платформо-специфичная логика: только для Android
    if (Platform.OS === 'android') {
      if (value) {
        await scheduleDailyReminder();
      } else {
        await cancelAllReminders();
      }
    } else {
      // Для iOS показываем информационное сообщение
      Alert.alert(
        'ℹ️ Информация',
        'Функция напоминаний доступна только на устройствах Android.'
      );
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

      {/* НОВАЯ СЕКЦИЯ: Напоминания (только для Android) */}
      {Platform.OS === 'android' && (
        <View style={[styles.section, styles.androidSection]}>
          <Text style={styles.sectionTitle}>📱 Напоминания (Android)</Text>
          <Text style={styles.sectionDescription}>Ежедневные напоминания об игре</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingText}>Напоминание в 20:00</Text>
              <Text style={styles.settingDescription}>Получать уведомление каждый день</Text>
            </View>
            <Switch
              value={isReminderEnabled}
              onValueChange={handleReminderToggle}
              trackColor={{ false: '#ddd', true: '#81b0ff' }}
              thumbColor={isReminderEnabled ? '#4A90E2' : '#f4f3f4'}
            />
          </View>

          {/* Тестовая кнопка для проверки уведомлений */}
          <TouchableOpacity 
            style={styles.testButton}
            onPress={sendTestNotification}
          >
            <Text style={styles.testButtonText}>🔔 Отправить тестовое уведомление</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Информация для iOS о недоступности функции */}
      {Platform.OS === 'ios' && (
        <View style={[styles.section, styles.iosSection]}>
          <Text style={styles.sectionTitle}>📱 Напоминания</Text>
          <Text style={styles.iosWarning}>
            ⚠️ Функция ежедневных напоминаний доступна только на устройствах Android
          </Text>
        </View>
      )}

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
          <Text style={styles.aboutText}>Платформа: {Platform.OS === 'ios' ? 'iOS' : 'Android'}</Text>
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
  androidSection: {
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  iosSection: {
    opacity: 0.8,
    backgroundColor: '#fafafa',
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
  testButton: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  iosWarning: {
    color: '#FF9800',
    fontStyle: 'italic',
    fontSize: 14,
    textAlign: 'center',
    padding: 10,
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