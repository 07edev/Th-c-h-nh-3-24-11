import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';

interface Student {
  id: string;
  name: string;
  age: number;
  class: string;
}

const students: Student[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Sinh viên ${i + 1}`,
  age: 18 + Math.floor(Math.random() * 5),
  class: `Lớp ${Math.floor(Math.random() * 3) + 1}A`,
}));

export default function App() {
  const renderItem = ({ item }: { item: Student }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => Alert.alert('Thông báo', `Bạn đã chọn: ${item.name}`)}
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.info}>Tuổi: {item.age} - {item.class}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách sinh viên</Text>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  item: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});