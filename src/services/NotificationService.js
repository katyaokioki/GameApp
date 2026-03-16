import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Сервис для работы с уведомлениями
 */
class NotificationService {
  /**
   * Запрос разрешений на уведомления
   */
  async requestPermissions() {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }

  /**
   * Проверка текущего статуса разрешений
   */
  async getPermissionsStatus() {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }

  /**
   * Планирование ежедневного уведомления
   * @param {Object} options - параметры уведомления
   * @param {number} options.hour - час (0-23)
   * @param {number} options.minute - минута (0-59)
   * @param {string} options.title - заголовок
   * @param {string} options.body - текст
   */
  async scheduleDailyReminder({ hour = 20, minute = 0, title, body }) {
    if (Platform.OS !== 'android') {
      throw new Error('This feature is only available on Android');
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Notification permissions not granted');
    }

    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || "🎮 Пора играть!",
        body: body || 'Ваши цели ждут вас в GameApp',
        data: { screen: 'Game' },
        sound: true,
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });

    return true;
  }

  /**
   * Отмена всех запланированных уведомлений
   */
  async cancelAllReminders() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Отправка тестового уведомления
   */
  async sendTestNotification() {
    if (Platform.OS !== 'android') return;
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🔔 Тестовое уведомление",
        body: "Уведомления работают корректно!",
        data: { test: true },
      },
      trigger: null,
    });
  }
}

export default new NotificationService();