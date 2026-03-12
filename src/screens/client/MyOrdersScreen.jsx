import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, ActivityIndicator,
    RefreshControl, Alert, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import api from '../../config/api';
import AppHeader from '../../components/AppHeader';
import { useToast } from '../../context/ToastContext';

// Status display config
const STATUS_CONFIG = {
    pending: { color: '#ffaa00', label: 'PENDING' },
    processing: { color: '#00aaff', label: 'PROCESSING' },
    shipped: { color: '#aa00ff', label: 'SHIPPED' },
    delivered: { color: '#00ff88', label: 'DELIVERED' },
    cancelled: { color: '#ff3333', label: 'CANCELLED' },
    PENDING: { color: '#ffaa00', label: 'PENDING' },
    PROCESSING: { color: '#00aaff', label: 'PROCESSING' },
    SHIPPED: { color: '#aa00ff', label: 'SHIPPED' },
    DELIVERED: { color: '#00ff88', label: 'DELIVERED' },
    CANCELLED: { color: '#ff3333', label: 'CANCELLED' },
};

// Inline OrderCard component — no external imports needed
const OrderCard = ({ order, onCancel }) => {
    const statusKey = order.status || 'pending';
    const { color = '#888', label = statusKey.toUpperCase() } = STATUS_CONFIG[statusKey] || {};
    const orderId = (order.order_id || order._id || '').slice(-8).toUpperCase();
    const totalAmount = order.totalAmount || order.total_price || order.price || 0;
    const orderDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : '';
    const itemCount = order.items?.length || order.item_count || 1;
    const isPending = statusKey === 'pending' || statusKey === 'PENDING';

    return (
        <TouchableOpacity 
            style={card.container} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('OrderDetail', { orderId: order._id })}
        >
            {/* Header row */}
            <View style={card.header}>
                <View>
                    <Text style={card.orderId}>#{orderId}</Text>
                    {!!orderDate && <Text style={card.date}>{orderDate}</Text>}
                </View>
                <View style={[card.badge, { borderColor: color }]}>
                    <Text style={[card.badgeText, { color }]}>{label}</Text>
                </View>
            </View>

            {/* Summary row */}
            <View style={card.summaryRow}>
                <Text style={card.summaryLabel}>{itemCount} item{itemCount !== 1 ? 's' : ''}</Text>
                <Text style={[card.total, { color: '#00ffff' }]}>
                    ₹{Number(totalAmount).toLocaleString('en-IN')}
                </Text>
            </View>

            {/* Design preview thumbnails */}
            {order.items?.slice(0, 2).map((item, idx) => {
                const itemImage = item.front_images?.[0]?.url || item.image || item.front_image;
                if (!itemImage) return null;
                
                return (
                    <View key={idx} style={card.thumbRow}>
                        <Image
                            source={{ uri: itemImage }}
                            style={card.thumb}
                            resizeMode="contain"
                        />
                        <View style={card.thumbInfo}>
                            <Text style={card.thumbName} numberOfLines={1}>{item.name || 'Custom Design'}</Text>
                            <Text style={card.thumbMeta}>
                                {[item.fit_type?.replace('_', ' '), item.size, item.color].filter(Boolean).join(' · ')}
                            </Text>
                        </View>
                    </View>
                );
            })}

            {/* Cancel button for pending orders */}
            {isPending && (
                <TouchableOpacity 
                    style={card.cancelBtn} 
                    onPress={(e) => {
                        e.stopPropagation(); // prevent card click
                        onCancel(order._id);
                    }}
                >
                    <Text style={card.cancelText}>CANCEL ORDER</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const card = StyleSheet.create({
    container: {
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    orderId: { color: '#fff', fontWeight: '800', fontSize: 15, letterSpacing: 1, marginBottom: 3 },
    date: { color: '#444', fontSize: 11 },
    badge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    badgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
        marginBottom: 10,
    },
    summaryLabel: { color: '#555', fontSize: 12, fontWeight: '600' },
    total: {
        fontSize: 18,
        fontWeight: '900',
        textShadowColor: 'rgba(0,255,255,0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
    },
    thumbRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
    },
    thumb: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#0a0a0a' },
    thumbInfo: { flex: 1 },
    thumbName: { color: '#ccc', fontSize: 12, fontWeight: '600', marginBottom: 3 },
    thumbMeta: { color: '#555', fontSize: 10 },
    cancelBtn: {
        marginTop: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ff3333',
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: 'rgba(255,51,51,0.05)',
    },
    cancelText: { color: '#ff3333', fontSize: 12, fontWeight: '700', letterSpacing: 1 },
});

// ── Main Screen ──
export default function MyOrdersScreen() {
    const navigation = useNavigation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { toast_success, toast_error, toast_info } = useToast();

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/api/orders/myorders');
            console.log('Orders response:', JSON.stringify(res.data).slice(0, 200));
            // Handle different response shapes: array, { orders: [] }, { data: [] }
            const list = Array.isArray(res.data)
                ? res.data
                : res.data?.orders || res.data?.data || [];
            setOrders(list);
        } catch (error) {
            console.log('Fetch orders error:', error.response?.data || error.message);
            setOrders([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleCancel = (orderId) => {
        Alert.alert('Cancel Order', 'Are you sure you want to cancel?', [
            { text: 'Keep Order', style: 'cancel' },
            {
                text: 'Yes, Cancel',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.put(`/api/orders/${orderId}/cancel`);
                        fetchOrders();
                        toast_success('Order cancelled ✓');
                    } catch {
                        toast_error('Could not cancel order');
                    }
                },
            },
        ]);
    };

    const handleRefresh = () => { setRefreshing(true); fetchOrders(); };

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <AppHeader title="MY ORDERS" />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#ff00aa" />
                    <Text style={styles.loadingText}>SYNCING ORDERS...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader title="MY ORDERS" />

            {orders.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyIcon}>📦</Text>
                    <Text style={styles.emptyTitle}>NO ORDERS YET</Text>
                    <Text style={styles.emptySub}>You haven't placed any orders yet.</Text>
                    <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Shop')}>
                        <Text style={styles.shopBtnText}>BROWSE SHOP</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#ff00aa" />}
                >
                    <Text style={styles.countText}>
                        {orders.length} ORDER{orders.length !== 1 ? 'S' : ''}
                    </Text>
                    {orders.map(order => (
                        <OrderCard key={order._id} order={order} onCancel={handleCancel} />
                    ))}
                    <View style={{ height: 24 }} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },

    loadingText: { color: '#555', marginTop: 12, fontWeight: '700', letterSpacing: 2, fontSize: 12 },

    emptyIcon: { fontSize: 52, marginBottom: 16 },
    emptyTitle: {
        color: '#333',
        fontWeight: '900',
        letterSpacing: 3,
        fontSize: 16,
        marginBottom: 8,
    },
    emptySub: { color: '#444', fontSize: 13, textAlign: 'center', marginBottom: 28 },
    shopBtn: {
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#00ffff',
        minHeight: 50,
        justifyContent: 'center',
    },
    shopBtnText: { color: '#00ffff', fontWeight: '700', fontSize: 13, letterSpacing: 1 },

    list: { padding: 16 },
    countText: { color: '#444', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 14 },
});
