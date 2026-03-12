import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Package, MapPin, CreditCard, ChevronLeft } from 'lucide-react-native';
import api from '../../config/api';
import AppHeader from '../../components/AppHeader';

const STATUS_CONFIG = {
    pending: { color: '#ffaa00', label: 'PENDING' },
    processing: { color: '#00aaff', label: 'PROCESSING' },
    shipped: { color: '#aa00ff', label: 'SHIPPED' },
    delivered: { color: '#00ff88', label: 'DELIVERED' },
    cancelled: { color: '#ff3333', label: 'CANCELLED' },
};

export default function OrderDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId } = route.params;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetail();
    }, [orderId]);

    const fetchOrderDetail = async () => {
        try {
            const res = await api.get(`/api/orders/${orderId}`);
            setOrder(res.data);
        } catch (error) {
            console.log('Fetch detail error:', error.message);
            Alert.alert('Error', 'Could not load order details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <AppHeader title="ORDER DETAIL" showBack />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#00ffff" />
                </View>
            </SafeAreaView>
        );
    }

    if (!order) return null;

    const statusKey = order.status?.toLowerCase() || 'pending';
    const status = STATUS_CONFIG[statusKey] || { color: '#888', label: statusKey.toUpperCase() };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader title="ORDER DETAIL" showBack />
            
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Status Bar */}
                <View style={[styles.statusBanner, { backgroundColor: status.color + '10', borderColor: status.color }]}>
                    <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
                    <Text style={styles.orderIdText}>Order #{order.orderId || order._id.slice(-8).toUpperCase()}</Text>
                </View>

                {/* Items */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Package color="#00ffff" size={18} />
                        <Text style={styles.sectionTitle}>YOUR CUSTOM THREADS</Text>
                    </View>
                    
                    {order.items?.map((item, idx) => {
                        const itemImage = item.front_images?.[0]?.url || item.image || item.front_image;
                        return (
                            <View key={idx} style={styles.itemCard}>
                                <Image 
                                    source={{ uri: itemImage || 'https://via.placeholder.com/200' }} 
                                    style={styles.itemImage} 
                                    resizeMode="contain" 
                                />
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.name || 'Custom T-Shirt'}</Text>
                                    <Text style={styles.itemMeta}>
                                        {item.fit_type?.replace('_', ' ')} · {item.size} · {item.color}
                                    </Text>
                                    <Text style={styles.itemQty}>QTY: {item.quantity}</Text>
                                </View>
                                <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Shipping */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <MapPin color="#ff00aa" size={18} />
                        <Text style={styles.sectionTitle}>DELIVERY ADDRESS</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.addressName}>{order.userId?.name || 'Customer'}</Text>
                        <Text style={styles.addressText}>
                            {order.shippingAddress?.street || order.shippingAddress?.addressLine1}{'\n'}
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}{'\n'}
                            PIN: {order.shippingAddress?.zipCode || order.shippingAddress?.pincode}
                        </Text>
                    </View>
                </View>

                {/* Payment */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <CreditCard color="#00ff88" size={18} />
                        <Text style={styles.sectionTitle}>PAYMENT SUMMARY</Text>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Items Total</Text>
                            <Text style={styles.priceVal}>₹{order.totalPrice}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Delivery</Text>
                            <Text style={[styles.priceVal, { color: '#00ff88' }]}>FREE</Text>
                        </View>
                        <View style={[styles.priceRow, styles.grandTotalRow]}>
                            <Text style={styles.grandTotalLabel}>TOTAL PAID</Text>
                            <Text style={styles.grandTotalVal}>₹{order.totalPrice}</Text>
                        </View>
                        <Text style={styles.utrLabel}>UTR: <Text style={{ color: '#888' }}>{order.payment?.utr_number || 'N/A'}</Text></Text>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 20 },
    
    statusBanner: {
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 25,
        alignItems: 'center',
    },
    statusLabel: { fontSize: 24, fontWeight: '900', letterSpacing: 2, marginBottom: 4 },
    orderIdText: { color: '#666', fontSize: 12, fontWeight: '700', letterSpacing: 1 },

    section: { marginBottom: 30 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
    sectionTitle: { color: '#555', fontSize: 11, fontWeight: '900', letterSpacing: 2 },
    
    card: { backgroundColor: '#111', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#1a1a1a' },
    
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#111',
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1a1a1a',
        alignItems: 'center',
    },
    itemImage: { width: 60, height: 60, borderRadius: 8, backgroundColor: '#0a0a0a', marginRight: 15 },
    itemInfo: { flex: 1 },
    itemName: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 4 },
    itemMeta: { color: '#555', fontSize: 10, fontWeight: '600', marginBottom: 6 },
    itemQty: { color: '#888', fontSize: 10, fontWeight: '800' },
    itemPrice: { color: '#fff', fontSize: 14, fontWeight: '900' },

    addressName: { color: '#fff', fontSize: 14, fontWeight: '800', marginBottom: 6 },
    addressText: { color: '#888', fontSize: 13, lineHeight: 20 },

    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    priceLabel: { color: '#666', fontSize: 13, fontWeight: '600' },
    priceVal: { color: '#fff', fontSize: 13, fontWeight: '800' },
    grandTotalRow: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#222' },
    grandTotalLabel: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
    grandTotalVal: { color: '#00ffff', fontSize: 18, fontWeight: '900' },
    utrLabel: { color: '#444', fontSize: 10, fontWeight: '700', marginTop: 12 },
});
