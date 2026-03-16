import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Компонент игровой цели с платформо-специфичной тактильной отдачей
 * @param {Object} props - Свойства компонента
 * @param {string|number} props.id - Уникальный идентификатор цели
 * @param {string|number} props.value - Значение, отображаемое на цели
 * @param {Function} props.onPress - Функция обратного вызова при нажатии
 * @param {boolean} props.isActive - Активна ли цель для нажатия
 */
const GameTarget = ({ id, value, onPress, isActive }) => {
  
  /**
   * Обработчик нажатия с платформо-специфичной тактильной обратной связью
   */
  const handlePress = () => {
    // Платформо-специфичная логика: тактильный отклик только для iOS
    if (Platform.OS === 'ios') {
      try {
        // Используем легкий удар для имитации физического нажатия
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log('🎯 Haptic feedback triggered on iOS');
      } catch (error) {
        console.warn('⚠️ Haptics failed on iOS:', error.message);
      }
    } 
    
    // Вызываем основную игровую логику (кроссплатформенная часть)
    onPress(id);
  };

  return (
    <TouchableOpacity
      style={[
        styles.target,
        isActive ? styles.activeTarget : styles.inactiveTarget,
        Platform.OS === 'ios' ? styles.iosTarget : styles.androidTarget
      ]}
      onPress={handlePress}
      disabled={!isActive}
      activeOpacity={Platform.OS === 'ios' ? 0.7 : 0.5}
    >
      <Text style={[
        styles.targetText,
        Platform.OS === 'ios' && styles.iosText
      ]}>
        {value}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  target: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    // Тени работают по-разному на платформах
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  activeTarget: {
    backgroundColor: '#4CAF50',
  },
  inactiveTarget: {
    backgroundColor: '#9E9E9E',
    opacity: 0.5,
  },
  iosTarget: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  androidTarget: {
    borderWidth: 2,
    borderColor: '#FFC107',
  },
  targetText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  iosText: {
    fontWeight: '600',
  },
});

export default GameTarget;