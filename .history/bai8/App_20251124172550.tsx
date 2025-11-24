import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  RefreshControl
} from 'react-native';
import axios from 'axios';

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const pageSize = 10; // số bài mỗi trang

  const fetchPosts = async (pageNumber: number, reset = false) => {
    setLoading(true);
    try {
      const res = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
      const allPosts: Post[] = res.data;

      // Pagination giả lập
      const start = (pageNumber - 1) * pageSize;
      const end = start + pageSize;
      const newPosts = allPosts.slice(start, end);

      setPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  const handleLoadMore = () => {
    if (!loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchPosts(1, true).then(() => setRefreshing(false));
  };

  // Filter bài viết theo tìm kiếm
  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postBody}>{item.body}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách bài viết</Text>

      <TextInput
        placeholder="Tìm kiếm bài viết..."
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredPosts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5', paddingTop: 50 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  postContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  postTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  postBody: { fontSize: 14, color: '#555' },
});
