// src/navigation/AppNavigator.js
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useResourceContext } from '../context/ResourceContext';

// Импортируем экраны
import WelcomeScreen from '../screens/WelcomeScreen';
import MainScreen from '../screens/MainScreen';
import GameScreen from '../screens/GameScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RatingScreen from '../screens/RatingScreen';
import RulesScreen from '../screens/RulesScreen';
import ProgressScreen from '../screens/ProgressScreen';
import LoginScreen from '../screens/LoginScreen';      // Добавлено
import RegisterScreen from '../screens/RegisterScreen'; // Добавлено

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading, checkAuth } = useResourceContext();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    verifyAuth();
  }, []);

  if (isChecking || isLoading) {
    // Можно показать экран загрузки
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Welcome" : "Login"}
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'Roboto_700Bold',
        },
      }}
    >
      {isAuthenticated ? (
        // Пользователь авторизован - показываем основные экраны
        <>
          <Stack.Screen 
            name="Welcome" 
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Main" 
            component={MainScreen}
            options={{ title: 'Главная' }}
          />
          <Stack.Screen 
            name="Game" 
            component={GameScreen}
            options={{ title: 'Игра', headerShown: false }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Настройки' }}
          />
          <Stack.Screen 
            name="Rating" 
            component={RatingScreen}
            options={{ title: 'Рейтинг' }}
          />
          <Stack.Screen 
            name="Rules" 
            component={RulesScreen}
            options={{ title: 'Правила' }}
          />
          <Stack.Screen 
            name="Progress" 
            component={ProgressScreen}
            options={{ title: 'Прогресс' }}
          />
        </>
      ) : (
        // Пользователь не авторизован - показываем экраны входа/регистрации
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;