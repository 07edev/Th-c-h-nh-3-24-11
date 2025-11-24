import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';

// Types
type RootTabParamList = {
  HomeTab: undefined;
  NewsTab: undefined;
  ProfileTab: undefined;
};

type HomeStackParamList = {
  Home: undefined;
  Detail: { id: string; name: string };
};

// Home Stack
const HomeStack = createNativeStackNavigator<HomeStackParamList>();

const items = Array.from({ length: 10 }, (_, i) => ({
  id: `${i + 1}`,
  name: `Item ${i + 1}`,
}));

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Detail', { id: item.id, name: item.name })}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function DetailScreen({ route }: any) {
  const { id, name } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết</Text>
      <Text style={styles.detailText}>ID: {id}</Text>
      <Text style={styles.detailText}>Name: {name}</Text>
    </View>
  );
}

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />
      <HomeStack.Screen name="Detail" component={DetailScreen} options={{ title: 'Chi tiết' }} />
    </HomeStack.Navigator>
  );
}

// News Stack
const NewsStack = createNativeStackNavigator();

function NewsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>News Screen</Text>
      <Text style={styles.subtitle}>Tin tức mới nhất</Text>
    </View>
  );
}

function NewsStackScreen() {
  return (
    <NewsStack.Navigator>
      <NewsStack.Screen name="News" component={NewsScreen} options={{ title: 'Tin tức' }} />
    </NewsStack.Navigator>
  );
}

// Profile Stack
const ProfileStack = createNativeStackNavigator();

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Text style={styles.subtitle}>Thông tin cá nhân</Text>
    </View>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Hồ sơ' }} />
    </ProfileStack.Navigator>
  );
}

// Bottom Tabs
const Tab = createBottomTabNavigator<RootTabParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>
          }}
        />
        <Tab.Screen
          name="NewsTab"
          component={NewsStackScreen}
          options={{
            tabBarLabel: 'News',
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>📰</Text>
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileStackScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  item: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
  },
  detailText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
