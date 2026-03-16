import { Platform } from 'react-native';

/**
 * Утилиты для определения платформы и выполнения платформо-специфичного кода
 */

/**
 * Проверка, является ли платформа iOS
 */
export const isIOS = Platform.OS === 'ios';

/**
 * Проверка, является ли платформа Android
 */
export const isAndroid = Platform.OS === 'android';

/**
 * Проверка, является ли платформа веб
 */
export const isWeb = Platform.OS === 'web';

/**
 * Выполнение функции только на iOS
 * @param {Function} fn - функция для выполнения на iOS
 * @param {any} fallback - значение по умолчанию для других платформ
 */
export const ifIOS = (fn, fallback = null) => {
  return isIOS ? fn() : fallback;
};

/**
 * Выполнение функции только на Android
 * @param {Function} fn - функция для выполнения на Android
 * @param {any} fallback - значение по умолчанию для других платформ
 */
export const ifAndroid = (fn, fallback = null) => {
  return isAndroid ? fn() : fallback;
};

/**
 * Получение значения в зависимости от платформы
 * @param {Object} values - объект со значениями для разных платформ
 * @param {any} defaultValue - значение по умолчанию
 */
export const platformValue = (values, defaultValue) => {
  return values[Platform.OS] ?? defaultValue;
};

/**
 * Получение информации об устройстве
 */
export const getDeviceInfo = () => {
  return {
    os: Platform.OS,
    version: Platform.Version,
    isIOS,
    isAndroid,
    isWeb,
    isTablet: Platform.isPad,
    brand: Platform.constants?.Brand,
    model: Platform.constants?.Model,
  };
};