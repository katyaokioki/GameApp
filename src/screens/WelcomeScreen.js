import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Video } from 'expo-av';
import { useFonts } from 'expo-font';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import AnimatedButton from '../components/Button';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const videoTopRef = useRef(null);
  const videoBottomRef = useRef(null);
  
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    RussoOne_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="light-content" 
      />
      
      <View style={styles.videosContainer}>
        <View style={styles.videoHalf}>
          <Video
            ref={videoTopRef}
            source={require('../../assets/macan.mp4')}
            style={styles.video}
            resizeMode="cover"
            isLooping={true}
            isMuted={true}
            shouldPlay={true}
          />
        </View>
        
        <View style={styles.videoHalf}>
          <Video
            ref={videoBottomRef}
            source={require('../../assets/macan.mp4')}
            style={styles.video}
            resizeMode="cover"
            isLooping={true}
            isMuted={true}
            shouldPlay={true}
          />
        </View>
      </View>
        
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>to the Game</Text>
          
        <AnimatedButton
          title="Start"
          onPress={() => navigation.navigate('Main')}
          variant="primary"
          size="large"
          style={styles.button}
          textStyle={styles.buttonText}
        />
          
        <AnimatedButton
          title="Rules"
          onPress={() => navigation.navigate('Rules')}
          variant="secondary"
          size="large"
          style={[styles.button, styles.secondaryButton]}
          textStyle={[styles.buttonText, styles.secondaryButtonText]}
        />
      </View>
    </View>
  );
};

// Уберите стили для TouchableOpacity и оставьте только:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videosContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
  },
  videoHalf: {
    flex: 1,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  title: {
    fontSize: width > 400 ? 36 : 30,
    color: '#fff',
    fontFamily: 'RussoOne_400Regular',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: width > 400 ? 18 : 16,
    color: '#fff',
    fontFamily: 'Roboto_400Regular',
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    minWidth: 200,
    marginVertical: 10,
  },
  buttonText: {
    fontFamily: 'Roboto_700Bold',
  },
  secondaryButton: {
    // Стили уже в компоненте через variant="secondary"
  },
  secondaryButtonText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
});

export default WelcomeScreen;