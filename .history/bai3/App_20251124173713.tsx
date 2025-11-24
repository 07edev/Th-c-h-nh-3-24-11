import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Vibration } from 'react-native';

export default function App() {
  const [inputSeconds, setInputSeconds] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timeout = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      Alert.alert("Time's up!", 'Hết giờ rồi!');
      Vibration.vibrate(1000);
    }

    return () => clearTimeout(timeout);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    const seconds = parseInt(inputSeconds);
    if (isNaN(seconds) || seconds <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số giây hợp lệ');
      return;
    }
    setTimeLeft(seconds);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setInputSeconds('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đồng hồ đếm ngược</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập số giây"
        keyboardType="numeric"
        value={inputSeconds}
        onChangeText={setInputSeconds}
        editable={!isRunning}
      />

      <Text style={styles.timer}>{timeLeft}s</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isRunning && styles.buttonDisabled]}
          onPress={handleStart}
          disabled={isRunning}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={handleStop}
          disabled={!isRunning}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={handleReset}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  timer: {
    fontSize: 72,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#00b3ff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#1f3348',
    padding: 15,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  stopButton: {
    backgroundColor: '#8519139c',
  },
  resetButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
