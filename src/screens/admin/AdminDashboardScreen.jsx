import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, useWindowDimensions } from 'react-native';
import { ShoppingBag, DollarSign, Package, TrendingUp, Users, Clock, LogOut, User } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';

const KPICard = ({ title, value, icon: Icon, color, width }) => (
    <View style={[styles.kpiCard, { width }]}>
        <View style={[styles.kpiIcon, { backgroundColor: color + '10' }]}>
            <Icon color={color} size={20} />
        </View>
        <Text style={styles.kpiValue} numberOfLines={1}>{value}</Text>
        <Text style={styles.kpiTitle}>{title.toUpperCase()}</Text>
    </View>
);

const AdminDashboardScreen = ({ navigation }) => {
    const { width } = useWindowDimensions();
    const { logout } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Columns: 4 for tablet (> 600px), 2 for mobile
    const columns = width > 600 ? 4 : 2;
    const cardWidth = (width - 60 - (columns - 1) * 15) / columns;

    const fetchStats = async () => {
        try {
            // Mock backend stats or actual endpoint if exists
            // Since we use the real backend, let's try calling admin/stats or similar
            const { data } = await api.get('/api/admin/analytics');
            setStats({
                totalOrders: data.totalOrders,
                revenue: data.totalRevenue,
                pendingOrders: data.statusBreakdown?.pending || 0,
                totalUsers: data.totalTshirtsSold // Using this as proxy or actual users if available
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleLogout = () => {
        logout();
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchStats();
    };

    if (loading && !refreshing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00ffff" />
                <Text style={styles.loadingText}>AUTHORIZING ACCESS...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00ffff" />}
        >
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        <Text style={styles.headerTitle}>COMMAND <Text style={{ color: '#00ffff' }}>CENTER</Text></Text>
                        <Text style={styles.headerSub}>Overview of the neon marketplace.</Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.headerBtn}>
                            <User color="#00ffff" size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleLogout} style={[styles.headerBtn, { borderColor: '#ff333320' }]}>
                            <LogOut color="#ff3333" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.grid}>
                <KPICard title="Total Orders" value={stats?.totalOrders || 0} icon={Package} color="#00ffff" width={cardWidth} />
                <KPICard title="Revenue" value={`₹${stats?.revenue || 0}`} icon={DollarSign} color="#00ff88" width={cardWidth} />
                <KPICard title="Pending" value={stats?.pendingOrders || 0} icon={Clock} color="#ffaa00" width={cardWidth} />
                <KPICard title="Citizens" value={stats?.totalUsers || 0} icon={Users} color="#ff00aa" width={cardWidth} />
            </View>

            <View style={styles.actionSection}>
                <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('AdminOrders')}
                >
                    <ShoppingBag color="#00ffff" size={20} />
                    <Text style={styles.actionBtnText}>MANAGE ALL ORDERS</Text>
                    <TrendingUp color="#333" size={16} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => navigation.navigate('AdminConfig')}
                >
                    <TrendingUp color="#ff00aa" size={20} />
                    <Text style={styles.actionBtnText}>ANALYTICS & CONFIG</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

// Mid-file import removed

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    loadingContainer: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#555', marginTop: 10, fontWeight: 'bold', letterSpacing: 2 },
    header: { padding: 30 },
    headerTitle: { color: '#ffffff', fontSize: 28, fontWeight: '900', letterSpacing: 2, marginBottom: 5 },
    headerSub: { color: '#555', fontSize: 12, fontWeight: 'bold' },
    grid: { paddingHorizontal: 30, flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'flex-start' },
    kpiCard: { backgroundColor: '#111', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#1a1a1a', alignItems: 'center' },
    kpiIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
    kpiValue: { color: '#fff', fontSize: 20, fontWeight: '900', marginBottom: 5 },
    kpiTitle: { color: '#555', fontSize: 8, fontWeight: 'bold', letterSpacing: 2 },
    actionSection: { padding: 30, marginTop: 10 },
    sectionTitle: { color: '#333', fontSize: 10, fontWeight: 'bold', letterSpacing: 3, marginBottom: 20 },
    actionBtn: { backgroundColor: '#111', borderRadius: 15, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 15, borderWidth: 1, borderColor: '#1a1a1a', marginBottom: 15 },
    actionBtnText: { flex: 1, color: '#ffffff', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
    headerBtn: { padding: 10, borderRadius: 12, backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333' }
});

export default AdminDashboardScreen;
