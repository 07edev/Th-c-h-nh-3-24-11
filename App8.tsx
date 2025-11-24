import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Linking, StyleSheet } from 'react-native';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export default function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const RSS_URL = 'https://vnexpress.net/rss/tin-moi-nhat.rss';

  useEffect(() => {
    fetch(RSS_URL)
      .then(res => res.text())
      .then(text => {
        // Dùng DOMParser để parse XML
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        const items = xml.getElementsByTagName('item');

        const parsed: NewsItem[] = [];
        for (let i = 0; i < Math.min(items.length, 5); i++) {
          const item = items[i];
          parsed.push({
            title: item.getElementsByTagName('title')[0].textContent || '',
            link: item.getElementsByTagName('link')[0].textContent || '',
            pubDate: item.getElementsByTagName('pubDate')[0].textContent || '',
            description: item.getElementsByTagName('description')[0].textContent || '',
          });
        }

        setNews(parsed);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi fetch RSS:', err);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }: { item: NewsItem }) => (
    <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.link)}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.pubDate}</Text>
      <Text numberOfLines={3} style={styles.desc}>{item.description}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={news}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  date: { fontSize: 12, color: '#666', marginBottom: 8 },
  desc: { fontSize: 14, color: '#444' },
});
