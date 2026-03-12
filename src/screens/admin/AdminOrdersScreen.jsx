import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { Search, Filter, ChevronRight, User } from 'lucide-react-native';
import api from '../../config/api';

const AdminOrdersScreen = ({ navigation }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/api/orders');
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch admin orders', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchOrders();
    };

    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
        const matchesSearch =
            order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.shippingAddress?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const renderOrderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.orderItem}
            onPress={() => navigation.navigate('AdminOrderDetail', { orderId: item._id })}
        >
            <View style={styles.orderInfo}>
                <Text style={styles.orderId}>#{item._id.slice(-8).toUpperCase()}</Text>
                <View style={styles.userRow}>
                    <User color="#555" size={12} />
                    <Text style={styles.userName}>{item.shippingAddress?.fullName || item.user?.name || 'GUEST'}</Text>
                </View>
                <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>

            <View style={styles.orderMeta}>
                <Text style={styles.orderTotal}>₹{item.totalPrice}</Text>
                <View style={[styles.statusTag, { backgroundColor: getStatusColor(item.status) + '20', borderColor: getStatusColor(item.status) }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status?.toUpperCase()}</Text>
                </View>
            </View>

            <ChevronRight color="#222" size={20} />
        </TouchableOpacity>
    );

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s === 'pending') return '#ffaa00';
        if (s === 'processing') return '#00ffff';
        if (s === 'shipped') return '#bf00ff';
        if (s === 'delivered') return '#00ff88';
        if (s === 'cancelled') return '#ff3333';
        return '#888';
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00ffff" />
                <Text style={styles.loadingText}>FETCHING ORDERS...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Search color="#555" size={18} style={{ marginRight: 10 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by ID or customer..."
                    placeholderTextColor="#555"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.filterBar}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
                    {['ALL', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <TouchableOpacity
                            key={status}
                            style={[styles.filterChip, statusFilter === status && styles.activeFilterChip]}
                            onPress={() => setStatusFilter(status)}
                        >
                            <Text style={[styles.filterChipText, statusFilter === status && styles.activeFilterChipText]}>{status.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredOrders}
                renderItem={renderOrderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00ffff" />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No matching orders found.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    loadingContainer: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#555', marginTop: 10, fontWeight: 'bold', letterSpacing: 2 },
    searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', margin: 20, paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#222' },
    searchInput: { flex: 1, color: '#fff', paddingVertical: 12, fontSize: 14 },
    filterBar: { paddingHorizontal: 20, marginBottom: 20 },
    filterChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 15, borderWeight: 1, borderColor: '#222', backgroundColor: '#0a0a0a' },
    activeFilterChip: { backgroundColor: '#00ffff', borderColor: '#00ffff' },
    filterChipText: { color: '#666', fontSize: 10, fontWeight: 'bold' },
    activeFilterChipText: { color: '#0a0a0a' },
    listContent: { paddingHorizontal: 20, paddingBottom: 50 },
    orderItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', padding: 15, borderRadius: 15, marginBottom: 15, borderWidth: 1, borderColor: '#1a1a1a' },
    orderInfo: { flex: 1 },
    orderId: { color: '#ffffff', fontWeight: 'bold', fontSize: 14, letterSpacing: 1, marginBottom: 5 },
    userRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
    userName: { color: '#888', fontSize: 12, fontWeight: 'bold' },
    orderDate: { color: '#444', fontSize: 10, fontWeight: 'bold' },
    orderMeta: { alignItems: 'flex-end', marginRight: 15 },
    orderTotal: { color: '#00ffff', fontWeight: '900', fontSize: 16, marginBottom: 8 },
    statusTag: { paddingVertical: 2, paddingHorizontal: 8, borderRadius: 4, borderWidth: 1 },
    statusText: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
    emptyContainer: { paddingVertical: 100, alignItems: 'center' },
    emptyText: { color: '#333', fontWeight: 'bold' }
});

export default AdminOrdersScreen;
