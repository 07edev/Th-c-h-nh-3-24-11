import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { parseString } from 'react-native-xml2js';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export default function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const RSS_URL = 'https://vnexpress.net/rss/tin-moi-nhat.rss'; // hoặc feed bạn muốn

  useEffect(() => {
    fetch(RSS_URL)
      .then((res) => res.text())
      .then((text) => {
        parseString(text, (err: any, result: any) => {
          if (err) {
            console.error('Parse RSS lỗi:', err);
            return;
          }

          // result.rss.channel[0].item là mảng các bài viết
          const items = result.rss.channel[0].item;
          const parsed: NewsItem[] = items.map((i: any) => ({
            title: i.title[0],
            link: i.link[0],
            pubDate: i.pubDate[0],
            description: i.description ? i.description[0] : '',
          }));

          // Lấy 5 bài đầu
          setNews(parsed.slice(0, 5));
          setLoading(false);
        });
      })
      .catch((error) => {
        console.error('Lỗi fetch RSS:', error);
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', padding: 16, borderRadius: 8, marginBottom: 12, elevation: 2 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  date: { fontSize: 12, color: '#666', marginBottom: 8 },
  desc: { fontSize: 14, color: '#444' },
});
