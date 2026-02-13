// src/styles/GlobalStyles.js
import { StyleSheet, Platform } from 'react-native';

export const GlobalStyles = StyleSheet.create({
  // ... существующие стили ...
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 5,
  },
  
  // Стили для кнопок с поддержкой анимации
  buttonBase: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Варианты кнопок
  primaryButton: {
    backgroundColor: '#4A90E2',
  },
  
  secondaryButton: {
    backgroundColor: '#6C63FF',
  },
  
  successButton: {
    backgroundColor: '#4CAF50',
  },
  
  dangerButton: {
    backgroundColor: '#FF5722',
  },
  
  warningButton: {
    backgroundColor: '#FF9800',
  },
  
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  
  outlineButtonText: {
    color: '#4A90E2',
  },
  
  // Размеры кнопок
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  
  smallButtonText: {
    fontSize: 14,
  },
  
  largeButton: {
    paddingVertical: 18,
    paddingHorizontal: 40,
  },
  
  largeButtonText: {
    fontSize: 18,
  },
  
  // Кнопки навигации
  backButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Кнопки для игрового экрана
  gameButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  
  gameButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  // Кнопки выбора ответа
  answerButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 12,
    margin: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  
  answerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  
  correctAnswerButton: {
    backgroundColor: '#4CAF50',
  },
  
  wrongAnswerButton: {
    backgroundColor: '#FF5722',
  },
  
  // Кнопка с иконкой
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconButtonText: {
    marginLeft: 8,
  },
  
  // Отключенная кнопка
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  
  disabledButtonText: {
    color: '#666666',
  },
});

// Утилитарные функции для анимации
export const ButtonAnimationUtils = {
  // Конфигурация анимации нажатия
  pressInConfig: {
    toValue: 0.95,
    tension: 150,
    friction: 3,
    useNativeDriver: true,
  },
  
  pressOutConfig: {
    toValue: 1,
    tension: 150,
    friction: 3,
    useNativeDriver: true,
  },
  
  // Создать анимированный стиль
  createAnimatedStyle: (scaleValue) => ({
    transform: [{ scale: scaleValue }],
  }),
  
  // Утилита для создания обработчиков анимации
  createAnimationHandlers: (scaleAnim) => {
    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    return { handlePressIn, handlePressOut };
  },
};