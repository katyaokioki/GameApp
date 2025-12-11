import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import MainScreen from '../screens/MainScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RatingScreen from '../screens/RatingScreen';
import RulesScreen from '../screens/RulesScreen';
import GameScreen from '../screens/GameScreen';
import ProgressScreen from '../screens/ProgressScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4A90E2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
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
        options={{ title: 'Игра', 
        headerShown: false }} 
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
        options={{ title: 'Правила игры' }}
      />
      <Stack.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ title: 'Прогресс игры' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;