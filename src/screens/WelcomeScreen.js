import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Добро пожаловать!</Text>
      <Text style={styles.subtitle}>Увлекательная игра</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Main')}
      >
        <Text style={styles.buttonText}>Начать игру</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Rules')}
      >
        <Text style={styles.buttonText}>Правила игры</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    padding: 20,
  },
  title: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#6C63FF',
  },
  buttonText: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WelcomeScreen;