// App.js
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AppProvider } from './src/context/AppContext';
import { ResourceProvider } from './src/context/ResourceContext';
import { GameProvider } from './src/context/GameContext';
import AppNavigator from './src/navigation/AppNavigator';

// Настройка обработчика уведомлений
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    setupNotificationListeners();

    if (Platform.OS === 'android') {
      checkAndroidPermissions();
    }

    // ИСПРАВЛЕНО: правильная очистка подписок
    return () => {
      if (notificationListener.current) {
        Notifications.removeSubscription(notificationListener.current); // ИСПРАВЛЕНО
      }
      if (responseListener.current) {
        Notifications.removeSubscription(responseListener.current); // ИСПРАВЛЕНО
      }
    };
  }, []);

  const setupNotificationListeners = () => {
    // ИСПРАВЛЕНО: сохраняем подписки, а не сами слушатели
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('📬 Уведомление получено:', notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('🔔 Нажатие на уведомление:', response);
        const { screen } = response.notification.request.content.data;
        if (screen === 'Game') {
          Alert.alert('Переход в игру', 'Возвращайтесь играть!');
        }
      }
    );
  };

  const checkAndroidPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    console.log('📱 Статус разрешений:', status);
  };

  return (
    <AppProvider>
      <ResourceProvider>
        <GameProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </GameProvider>
      </ResourceProvider>
    </AppProvider>
  );
}