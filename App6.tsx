import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

const API_KEY = '949c3e4346bb2f7b14fd38c837b67ae5';

interface WeatherData {
  temp: number;
  humidity: number;
  description: string;
  city: string;
}

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên thành phố');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=vi`
      );

      if (!response.ok) {
        throw new Error('Không tìm thấy thành phố');
      }

      const data = await response.json();

      setWeather({
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        city: data.name,
      });
    } catch (err) {
      setError('Không thể lấy dữ liệu thời tiết. Vui lòng kiểm tra tên thành phố.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thời tiết</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên thành phố..."
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>Tìm</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      {weather && (
        <View style={styles.weatherCard}>
          <Text style={styles.cityName}>{weather.city}</Text>
          <Text style={styles.temp}>{weather.temp}°C</Text>
          <Text style={styles.description}>{weather.description}</Text>
          <Text style={styles.humidity}>Độ ẩm: {weather.humidity}%</Text>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  weatherCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 30,
    marginTop: 30,
    alignItems: 'center',
    elevation: 5,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  temp: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#007AFF',
    marginVertical: 10,
  },
  description: {
    fontSize: 20,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  humidity: {
    fontSize: 18,
    color: '#666',
  },
});
