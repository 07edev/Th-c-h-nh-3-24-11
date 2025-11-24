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
      activeOpacity={0.7}
      onPress={() => Alert.alert('Thông báo', `Bạn đã chọn: ${item.name}`)}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.class}</Text>
        </View>
      </View>
      <Text style={styles.info}>Tuổi: {item.age}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách sinh viên</Text>
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007AFF',
  },
  item: {
    backgroundColor: 'white',
    padding: 20,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  badge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});
