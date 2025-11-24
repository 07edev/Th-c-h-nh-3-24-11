import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, FlatList, TouchableOpacity, Modal, Dimensions, Text } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';

const images = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  url: `https://source.unsplash.com/800x800/?nature,water&sig=${i + 1}`,
}));

const { width, height } = Dimensions.get('window');

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openModal = (index: number) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const nextImage = () => {
    if (selectedIndex < images.length - 1) {
      setSelectedIndex((prev) => prev + 1);
    }
  };

  const prevImage = () => {
    if (selectedIndex > 0) {
      setSelectedIndex((prev) => prev - 1);
    }
  };

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.translationX < -50) {
        // Vuốt sang trái - ảnh tiếp theo
        nextImage();
      } else if (event.translationX > 50) {
        // Vuốt sang phải - ảnh trước
        prevImage();
      }
    });

  const renderItem = ({ item, index }: { item: typeof images[0]; index: number }) => (
    <TouchableOpacity style={styles.imageContainer} onPress={() => openModal(index)}>
      <Image source={{ uri: item.url }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Gallery</Text>
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
        />

        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <GestureDetector gesture={swipeGesture}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: images[selectedIndex].url }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
              </View>
            </GestureDetector>

            <View style={styles.indicator}>
              <Text style={styles.indicatorText}>
                {selectedIndex + 1} / {images.length}
              </Text>
            </View>

            {/* Navigation buttons */}
            {selectedIndex > 0 && (
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeft]}
                onPress={prevImage}
              >
                <Text style={styles.navButtonText}>‹</Text>
              </TouchableOpacity>
            )}

            {selectedIndex < images.length - 1 && (
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonRight]}
                onPress={nextImage}
              >
                <Text style={styles.navButtonText}>›</Text>
              </TouchableOpacity>
            )}
          </View>
        </Modal>

        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2d1',
    paddingTop: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  grid: {
    paddingHorizontal: 10,
  },
  imageContainer: {
    flex: 1 / 3,
    padding: 5,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  imageWrapper: {
    width: width,
    height: height * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width * 0.9,
    height: height * 0.75,
    borderRadius: 12,
  },
  indicator: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
  },
  indicatorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    backgroundColor: 'rgba(255,255,255,0.25)',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  navButtonLeft: {
    left: 15,
  },
  navButtonRight: {
    right: 15,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
});
