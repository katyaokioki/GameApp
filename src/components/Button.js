// src/components/AnimatedButton.js
import React from 'react';
import {
  TouchableWithoutFeedback,
  Animated,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import useButtonAnimation from '../hooks/useButtonAnimation';

const AnimatedButton = ({
  title,
  onPress,
  style,
  textStyle,
  children,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  ...props
}) => {
  const { handlePressIn, handlePressOut, getAnimatedStyle } = useButtonAnimation();

  const getButtonStyle = () => {
    const baseStyles = {
      primary: {
        backgroundColor: '#4A90E2',
      },
      secondary: {
        backgroundColor: '#6C63FF',
      },
      danger: {
        backgroundColor: '#FF5722',
      },
      success: {
        backgroundColor: '#4CAF50',
      },
      warning: {
        backgroundColor: '#FF9800',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#4A90E2',
      },
    };

    const sizeStyles = {
      small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
      },
      medium: {
        paddingVertical: 15,
        paddingHorizontal: 30,
      },
      large: {
        paddingVertical: 18,
        paddingHorizontal: 40,
      },
    };

    return [baseStyles[variant] || baseStyles.primary, sizeStyles[size] || sizeStyles.medium];
  };

  const getTextStyle = () => {
    const textStyles = {
      primary: { color: '#fff' },
      secondary: { color: '#fff' },
      danger: { color: '#fff' },
      success: { color: '#fff' },
      warning: { color: '#fff' },
      outline: { color: '#4A90E2' },
    };

    const sizeTextStyles = {
      small: { fontSize: 14 },
      medium: { fontSize: 16 },
      large: { fontSize: 18 },
    };

    return [textStyles[variant] || textStyles.primary, sizeTextStyles[size] || sizeTextStyles.medium];
  };

  return (
    <TouchableWithoutFeedback
      onPress={disabled ? null : onPress}
      onPressIn={disabled ? null : handlePressIn}
      onPressOut={disabled ? null : handlePressOut}
      disabled={disabled}
      {...props}
    >
      <Animated.View
        style={[
          styles.buttonBase,
          ...getButtonStyle(),
          style,
          disabled && styles.disabledButton,
          getAnimatedStyle(),
        ]}
      >
        {children ? (
          children
        ) : (
          <Text style={[styles.buttonText, ...getTextStyle(), textStyle]}>
            {title}
          </Text>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
});

export default AnimatedButton;