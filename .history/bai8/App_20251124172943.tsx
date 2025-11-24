import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
} from 'react-native';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const POSTS_PER_PAGE = 10;

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [hasMore, setHasMore] = useState(true);

  // Lấy bài viết
  const fetchPosts = async (pageNum: number = 1, isLoadMore = false) => {
    if (isLoadMore) setLoadingMore(true);
    else setLoading(true);

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageNum}&_limit=${POSTS_PER_PAGE}`
      );
      const data: Post[] = await response.json();

      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => (isLoadMore ? [...prev, ...data] : data));
      setPage(pageNum);
      setHasMore(true);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải dữ liệu');
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Refresh bài viết
  const handleRefresh = () => {
    setRefreshing(true);
    setSearchText('');
    fetchPosts(1);
  };

  // Load more khi cuộn xuống cuối
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1, true);
    }
  };

  // Filter bài viết theo search
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchText.toLowerCase()) ||
      p.body.toLowerCase().includes(searchText.toLowerCase())
  );

  // Render item
  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() => Alert.alert(item.title, item.body)}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
      <Text style={styles.footer}>User #{item.userId} • Post #{item.id}</Text>
    </TouchableOpacity>
  );

  const renderFooter = () =>
    loadingMore ? (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
        <Text style={styles.footerText}>Đang tải thêm...</Text>
      </View>
    ) : null;

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchText ? 'Không tìm thấy bài viết' : 'Chưa có bài viết'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh sách bài viết</Text>
        <Text style={styles.headerSubtitle}>
          {filteredPosts.length} bài viết
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm bài viết..."
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* FlatList */}
      {loading && !refreshing ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 10 }}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 15,
    alignItems: 'center',
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 16 },
  clearBtn: { fontSize: 18, color: '#999', paddingLeft: 8 },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#333' },
  body: { fontSize: 14, color: '#666', lineHeight: 20 },
  footer: { fontSize: 12, color: '#999', marginTop: 10 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  footerContainer: { paddingVertical: 15, alignItems: 'center' },
  footerText: { marginTop: 5, color: '#666' },
  emptyContainer: { paddingVertical: 50, alignItems: 'center' },
  emptyText: { color: '#999', fontSize: 16 },
});
