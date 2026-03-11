import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckCircle, Package, ArrowRight } from 'lucide-react-native';

const OrderSuccessScreen = ({ navigation, route }) => {
    const orderId = route.params?.orderId || 'NT-' + Date.now().toString().slice(-6);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <CheckCircle color="#00ff88" size={80} />
                </View>

                <Text style={styles.successText}>ORDER PLACED SUCCESSFULLY</Text>
                <Text style={styles.descText}>Your design has been encoded into our production queue. We'll notify you when it's ready.</Text>

                <View style={styles.orderBox}>
                    <Text style={styles.orderLabel}>ORDER ID</Text>
                    <Text style={styles.orderId}>{orderId}</Text>
                </View>

                <TouchableOpacity
                    style={styles.ordersBtn}
                    onPress={() => navigation.navigate('Orders')}
                >
                    <Package color="#00ffff" size={18} />
                    <Text style={styles.ordersBtnText}>VIEW MY ORDERS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.homeBtn}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.homeBtnText}>CONTINUE SHOPPING</Text>
                    <ArrowRight color="#666" size={18} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a', padding: 40, justifyContent: 'center' },
    content: { alignItems: 'center' },
    iconContainer: { marginBottom: 30, boxShadow: '0px 0px 20px rgba(0, 255, 136, 0.3)' },
    successText: { color: '#00ffff', fontSize: 24, fontWeight: '900', textAlign: 'center', letterSpacing: 2, marginBottom: 20 },
    descText: { color: '#666', textAlign: 'center', lineHeight: 22, fontSize: 14, marginBottom: 40 },
    orderBox: { backgroundColor: '#111', borderRadius: 15, padding: 20, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#1a1a1a', marginBottom: 50 },
    orderLabel: { color: '#555', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10 },
    orderId: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 },
    ordersBtn: { backgroundColor: 'rgba(0, 255, 255, 0.05)', borderRadius: 10, paddingVertical: 15, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#00ffff', marginBottom: 20 },
    ordersBtnText: { color: '#00ffff', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
    homeBtn: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    homeBtnText: { color: '#666', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 }
});

export default OrderSuccessScreen;
