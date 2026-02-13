// src/hooks/useButtonAnimation.js
import { useRef, useCallback } from 'react';
import { Animated } from 'react-native';

const useButtonAnimation = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const handlePressOut = useCallback(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 150,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  const getAnimatedStyle = useCallback(() => ({
    transform: [{ scale: scaleAnim }],
    opacity: opacityAnim,
  }), [scaleAnim, opacityAnim]);

  const getPressHandlers = useCallback(() => ({
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
  }), [handlePressIn, handlePressOut]);

  return {
    handlePressIn,
    handlePressOut,
    getAnimatedStyle,
    getPressHandlers,
    scaleAnim,
    opacityAnim,
  };
};

export default useButtonAnimation;