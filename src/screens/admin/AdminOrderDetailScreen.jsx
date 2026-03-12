import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking, ActivityIndicator, Alert } from 'react-native';
import { Phone, MessageCircle, Download, Package, MapPin, CreditCard, ChevronDown, User } from 'lucide-react-native';
import api from '../../config/api';

const AdminOrderDetailScreen = ({ route }) => {
    const { orderId } = route.params;
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchOrderDetail = async () => {
        try {
            const { data } = await api.get(`/api/orders/${orderId}`);
            setOrder(data);
        } catch (err) {
            console.error('Failed to fetch order details', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [orderId]);

    const handleUpdateStatus = async (newStatus) => {
        setUpdating(true);
        try {
            await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
            await fetchOrderDetail();
            Alert.alert('Updated', `Order status set to ${newStatus.toUpperCase()}`);
        } catch (err) {
            Alert.alert('Error', 'Failed to update status.');
        } finally {
            setUpdating(false);
        }
    };

    const handleCall = () => {
        const phone = order?.shippingAddress?.phone || order?.user?.phone_number;
        if (phone) Linking.openURL(`tel:${phone}`);
    };

    const handleWhatsApp = () => {
        const phone = order?.user?.whatsapp_number || order?.shippingAddress?.phone;
        if (phone) {
            const cleanPhone = phone.replace(/\D/g, '');
            Linking.openURL(`whatsapp://send?phone=91${cleanPhone}&text=Hi, this is NeonThreads regarding your order #${orderId.slice(-8).toUpperCase()}`);
        }
    };

    if (loading) return <View style={styles.loadingContainer}><ActivityIndicator color="#00ffff" /></View>;

    return (
        <ScrollView style={styles.container}>
            {/* Status Section */}
            <View style={styles.statusSection}>
                <Text style={styles.sectionLabel}>CURRENT STATUS</Text>
                <View style={styles.statusRow}>
                    <Text style={[styles.statusText, { color: getStatusColor(order?.status) }]}>{order?.status.toUpperCase()}</Text>
                    <View style={styles.statusDropdown}>
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                            <TouchableOpacity
                                key={s}
                                style={[styles.statusBtn, order?.status === s && styles.activeStatusBtn]}
                                onPress={() => handleUpdateStatus(s)}
                                disabled={updating}
                            >
                                <Text style={[styles.statusBtnText, order?.status === s && styles.activeStatusBtnText]}>{s.slice(0, 1).toUpperCase()}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            {/* Customer Section */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <User color="#00ffff" size={18} />
                    <Text style={styles.cardTitle}>CUSTOMER INFO</Text>
                </View>
                <Text style={styles.customerName}>{order?.shippingAddress?.fullName || order?.user?.name}</Text>
                <Text style={styles.customerEmail}>{order?.user?.email}</Text>

                <View style={styles.contactRow}>
                    <TouchableOpacity style={styles.contactBtn} onPress={handleCall}>
                        <Phone color="#fff" size={16} />
                        <Text style={styles.contactBtnText}>CALL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.contactBtn, { backgroundColor: '#25D366' }]} onPress={handleWhatsApp}>
                        <MessageCircle color="#fff" size={16} />
                        <Text style={styles.contactBtnText}>WHATSAPP</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Items Section */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Package color="#ff00aa" size={18} />
                    <Text style={styles.cardTitle}>ORDER ITEMS</Text>
                </View>
                {order?.items.map((item, idx) => {
                    const firstColor = item.color || (item.colors?.[0]);
                    const itemImage = item.image || item.front_images?.[0]?.url || item.front_image;
                    
                    return (
                        <View key={idx} style={styles.orderListItem}>
                            <View style={styles.itemImageContainer}>
                                {itemImage ? (
                                    <Image source={{ uri: itemImage }} style={styles.itemThumb} resizeMode="contain" />
                                ) : (
                                    <View style={[styles.itemThumb, { backgroundColor: '#1a1a1a' }]} />
                                )}
                            </View>
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName}>{item.name || 'Custom T-Shirt'}</Text>
                                <Text style={styles.itemMeta}>{item.fit_type?.replace('_', ' ')} | {item.color} | {item.size}</Text>
                                <Text style={styles.itemQty}>QTY: {item.quantity} | ₹{item.price}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Address Section */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <MapPin color="#00ffff" size={18} />
                    <Text style={styles.cardTitle}>SHIPPING ADDRESS</Text>
                </View>
                <Text style={styles.addressText}>
                    {order?.shippingAddress?.street || order?.shippingAddress?.addressLine1}{'\n'}
                    {order?.shippingAddress?.city}, {order?.shippingAddress?.state}{'\n'}
                    PIN: {order?.shippingAddress?.zipCode || order?.shippingAddress?.pincode}
                </Text>
            </View>

            {/* Payment Section */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <CreditCard color="#00ff88" size={18} />
                    <Text style={styles.cardTitle}>PAYMENT INFO</Text>
                </View>
                <View style={styles.paymentRow}>
                    <Text style={styles.payLabel}>Method:</Text>
                    <Text style={styles.payVal}>{order?.paymentInfo?.method || 'UPI'}</Text>
                </View>
                <View style={styles.paymentRow}>
                    <Text style={styles.payLabel}>Transaction ID:</Text>
                    <Text style={styles.payVal}>{order?.paymentInfo?.transactionId || 'N/A'}</Text>
                </View>
                <View style={styles.paymentRow}>
                    <Text style={styles.payLabel}>Amount:</Text>
                    <Text style={[styles.payVal, { color: '#00ffff', fontWeight: '900' }]}>₹{order?.totalPrice}</Text>
                </View>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

// Helper for status colors

const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (s === 'pending') return '#ffaa00';
    if (s === 'processing') return '#00ffff';
    if (s === 'shipped') return '#bf00ff';
    if (s === 'delivered') return '#00ff88';
    if (s === 'cancelled') return '#ff3333';
    return '#888';
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    loadingContainer: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
    statusSection: { padding: 30, backgroundColor: '#111', borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
    sectionLabel: { color: '#555', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 15 },
    statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusText: { fontSize: 22, fontWeight: '900', letterSpacing: 2 },
    statusDropdown: { flexDirection: 'row', gap: 5 },
    statusBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#0a0a0a', borderWidth: 1, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
    activeStatusBtn: { backgroundColor: '#00ffff', borderColor: '#00ffff' },
    statusBtnText: { color: '#666', fontSize: 10, fontWeight: 'bold' },
    activeStatusBtnText: { color: '#0a0a0a' },
    card: { backgroundColor: '#111', margin: 20, marginTop: 10, borderRadius: 20, padding: 25, borderWidth: 1, borderColor: '#1a1a1a' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    cardTitle: { color: '#555', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
    customerName: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    customerEmail: { color: '#666', fontSize: 13, marginBottom: 20 },
    contactRow: { flexDirection: 'row', gap: 15 },
    contactBtn: { flex: 1, backgroundColor: '#00ffff', borderRadius: 8, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    contactBtnText: { color: '#0a0a0a', fontWeight: 'bold', fontSize: 11 },
    orderListItem: { flexDirection: 'row', gap: 15, paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#1a1a1a' },
    itemImageContainer: { width: 60, height: 60, backgroundColor: '#0a0a0a', borderRadius: 10, padding: 5 },
    itemThumb: { width: '100%', height: '100%' },
    itemName: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
    itemMeta: { color: '#666', fontSize: 10, marginBottom: 4 },
    itemQty: { color: '#ff00aa', fontSize: 10, fontWeight: 'bold' },
    addressText: { color: '#ccc', fontSize: 14, lineHeight: 22 },
    paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    payLabel: { color: '#666', fontSize: 13 },
    payVal: { color: '#fff', fontSize: 13, fontWeight: 'bold' }
});

export default AdminOrderDetailScreen;
