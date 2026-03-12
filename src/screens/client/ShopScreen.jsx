import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, Image,
    TouchableOpacity, RefreshControl, ActivityIndicator, Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Star, ArrowRight } from 'lucide-react-native';
import api from '../../config/api';
import AppHeader from '../../components/AppHeader';
import { tshirtAssets } from '../../config/tshirtAssets';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;  // 2 columns, 24px padding each side, 0 gap

const ProductImage = ({ source }) => {
    const [error, setError] = useState(false);
    return (
        <Image
            source={error ? { uri: 'https://via.placeholder.com/400x400/111111/00ffff?text=NEON' } : source}
            style={styles.productImage}
            resizeMode="contain"
            onError={() => setError(true)}
        />
    );
};

const ShopScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFit, setActiveFit] = useState('ALL');
    const listRef = useRef(null);

    // Scroll to top when tab is focused
    useFocusEffect(
        useCallback(() => {
            listRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, [])
    );

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/api/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const onRefresh = () => { setRefreshing(true); fetchProducts(); };

    const getImageSource = (product) => {
        // High priority: backend absolute urls
        if (product.images && typeof product.images === 'object') {
            const colorId = product.colors?.[0] || Object.keys(product.images)[0];
            const colorData = product.images[colorId];
            if (colorData?.front && (colorData.front.startsWith('http') || colorData.front.startsWith('data:'))) {
                return { uri: colorData.front };
            }
        }

        // Local fallback
        try {
            const colorToUse = product.color?.toLowerCase() || product.colors?.[0]?.toLowerCase() || 'black';
            const fitKey = product.fit_type === 'OVERSIZED_FIT' ? 'oversized' : 'normal';

            const imageMap = {
                'normal_black_front': require('../../../assets/tshirts/normal_black_front.png'),
                'normal_white_front': require('../../../assets/tshirts/normal_white_front.png'),
                'normal_blue_front': require('../../../assets/tshirts/normal_blue_front.png'),
                'normal_purple_front': require('../../../assets/tshirts/normal_purple_front.png'),
                'oversized_black_front': require('../../../assets/tshirts/oversized_black_front.png'),
                'oversized_white_front': require('../../../assets/tshirts/oversized_white_front.png'),
                'oversized_blue_front': require('../../../assets/tshirts/oversized_blue_front.png'),
                'oversized_purple_front': require('../../../assets/tshirts/oversized_purple_front.png'),
            };

            const key = `${fitKey}_${colorToUse}_front`;
            return imageMap[key] || imageMap['normal_black_front'];
        } catch (e) {
            return require('../../../assets/tshirts/normal_black_front.png');
        }
    };

    const filteredProducts = activeFit === 'ALL'
        ? products
        : products.filter(p => p.fit_type === activeFit);

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Customize', {
                color: item.color || item.colors?.[0] || 'Black',
                fit: item.fit_type,
            })}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                <ProductImage source={getImageSource(item)} />
                <View style={[styles.badge, { backgroundColor: item.fit_type === 'OVERSIZED_FIT' ? '#ff00aa' : '#00ffff' }]}>
                    <Text style={styles.badgeText}>{item.fit_type === 'OVERSIZED_FIT' ? 'OS' : 'NF'}</Text>
                </View>
            </View>

            <View style={styles.cardContent}>
                <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.productFit}>{item.fit_type === 'OVERSIZED_FIT' ? 'Oversized' : 'Normal'} Fit</Text>

                <View style={styles.priceRow}>
                    <Text style={styles.price}>₹{item.price}</Text>
                    <Star color="#00ffff" fill="#00ffff" size={10} />
                </View>

                <View style={styles.designBtn}>
                    <Text style={styles.designText}>DESIGN</Text>
                    <ArrowRight color="#00ffff" size={12} />
                </View>
            </View>
        </TouchableOpacity>
    );

    const FILTERS = [
        { id: 'ALL', label: 'ALL' },
        { id: 'NORMAL_FIT', label: 'NORMAL' },
        { id: 'OVERSIZED_FIT', label: 'OVERSIZED' },
    ];

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <AppHeader title="SHOP" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00ffff" />
                    <Text style={styles.loadingText}>LOADING CATALOG...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader title="SHOP" />

            <View style={styles.filterBar}>
                {FILTERS.map(f => (
                    <TouchableOpacity
                        key={f.id}
                        style={[styles.filterChip, activeFit === f.id && styles.activeChip]}
                        onPress={() => setActiveFit(f.id)}
                    >
                        <Text style={[styles.filterText, activeFit === f.id && styles.activeFilterText]}>
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                ref={listRef}
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={item => item._id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00ffff" />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>👕</Text>
                        <Text style={styles.emptyText}>No products found.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#555', marginTop: 12, fontWeight: '700', letterSpacing: 2, fontSize: 12 },

    filterBar: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    filterChip: {
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#222',
        backgroundColor: '#0a0a0a',
    },
    activeChip: { backgroundColor: '#00ffff', borderColor: '#00ffff' },
    filterText: { color: '#555', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
    activeFilterText: { color: '#0a0a0a' },

    listContent: { paddingHorizontal: 16, paddingBottom: 24 },
    row: { justifyContent: 'space-between', marginBottom: 16 },

    card: {
        backgroundColor: '#111',
        width: CARD_WIDTH,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#1a1a1a',
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: CARD_WIDTH,
        backgroundColor: '#0f0f0f',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    badge: {
        position: 'absolute',
        top: 8,
        right: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    badgeText: { color: '#0a0a0a', fontSize: 9, fontWeight: '900' },

    cardContent: { padding: 12 },
    productName: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 2 },
    productFit: { color: '#555', fontSize: 10, marginBottom: 8 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    price: {
        color: '#00ffff',
        fontWeight: '900',
        fontSize: 15,
        textShadowColor: 'rgba(0,255,255,0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
    },
    designBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
        paddingTop: 8,
    },
    designText: { color: '#00ffff', fontSize: 10, fontWeight: '900', letterSpacing: 1 },

    emptyContainer: { paddingVertical: 80, alignItems: 'center' },
    emptyEmoji: { fontSize: 48, marginBottom: 12 },
    emptyText: { color: '#444', fontWeight: '700', fontSize: 14 },
});

export default ShopScreen;
