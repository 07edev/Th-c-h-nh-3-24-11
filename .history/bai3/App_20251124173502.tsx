import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Vibration,
  Alert,
  Keyboard
} from 'react-native';

export default function App() {
  const [seconds, setSeconds] = useState<string>(''); // input
  const [timeLeft, setTimeLeft] = useState<number>(0); // countdown
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  // Hàm start countdown
  const startCountdown = () => {
    const sec = parseInt(seconds);
    if (isNaN(sec) || sec <= 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập số giây hợp lệ.');
      return;
    }

    setTimeLeft(sec);
    setRunning(true);
    Keyboard.dismiss();

    // Nếu đang có interval trước đó thì clear
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          Vibration.vibrate(1000); // rung 1 giây
          Alert.alert("Time's up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Clear interval khi unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đồng hồ đếm ngược</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập số giây"
        keyboardType="numeric"
        value={seconds}
        onChangeText={setSeconds}
        editable={!running}
      />

      <TouchableOpacity
        style={[styles.button, running ? styles.buttonDisabled : {}]}
        onPress={startCountdown}
        disabled={running}
      >
        <Text style={styles.buttonText}>{running ? 'Đang chạy...' : 'Start'}</Text>
      </TouchableOpacity>

      <Text style={styles.timer}>
        {timeLeft > 0 ? timeLeft + ' s' : running ? 'Time’s up' : 'Chưa bắt đầu'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30
  },
  input: {
    width: '60%',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: 'white'
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 30
  },
  buttonDisabled: {
    backgroundColor: '#99cfff'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333'
  }
});
