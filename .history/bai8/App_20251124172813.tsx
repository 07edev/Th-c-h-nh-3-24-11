import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const POSTS_PER_PAGE = 10;

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (pageNum: number = 1, isLoadMore: boolean = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageNum}&_limit=${POSTS_PER_PAGE}`
      );

      if (!response.ok) throw new Error('Không thể tải dữ liệu');

      const data: Post[] = await response.json();

      if (data.length === 0) {
        setHasMore(false);
        if (!isLoadMore) Alert.alert('Thông báo', 'Không có bài viết nào');
        return;
      }

      setPosts((prev) => (isLoadMore ? [...prev, ...data] : data));
      setPage(pageNum);
      setHasMore(true);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setSearchText('');
    fetchPosts(1);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      fetchPosts(page + 1, true);
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.body.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => Alert.alert(item.title, item.body)}
    >
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.body} numberOfLines={3}>
        {item.body}
      </Text>
      <View style={styles.postFooter}>
        <Text style={styles.userId}>User #{item.userId}</Text>
        <Text style={styles.postId}>#{item.id}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () =>
    loadingMore ? (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Đang tải thêm...</Text>
      </View>
    ) : null;

  const renderEmpty = () =>
    !loading && (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {searchText ? 'Không tìm thấy bài viết nào' : 'Chưa có bài viết'}
        </Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bài viết</Text>
        <Text style={styles.headerSubtitle}>
          {searchText ? filteredPosts.length : posts.length} bài viết
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bài viết..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
        />
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#007AFF', paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 12,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: { flex: 1, padding: 12, fontSize: 16 },
  clearButton: { padding: 5 },
  clearButtonText: { fontSize: 20, color: '#999' },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  postCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8, lineHeight: 24 },
  body: { fontSize: 14, color: '#666', lineHeight: 20 },
  postFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  userId: { fontSize: 12, color: '#007AFF', fontWeight: '600' },
  postId: { fontSize: 12, color: '#999' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  footer: { paddingVertical: 20, alignItems: 'center' },
  footerText: { marginTop: 10, fontSize: 14, color: '#666' },
  emptyContainer: { paddingVertical: 50, alignItems: 'center' },
  emptyText: { fontSize: 16, color: '#999' },
});
