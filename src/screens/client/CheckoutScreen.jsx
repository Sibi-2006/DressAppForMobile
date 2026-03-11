import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Linking, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MapPin, Phone, CreditCard, ShoppingBag, ArrowRight, Check } from 'lucide-react-native';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import api from '../../config/api';
import { useToast } from '../../context/ToastContext';

const CheckoutScreen = ({ navigation }) => {
    const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const { toast_success, toast_error, toast_warning, toast_info } = useToast();

    const [address, setAddress] = useState({
        fullName: user?.name || '',
        phone: user?.phone_number || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [utr, setUtr] = useState('');
    const [paymentStarted, setPaymentStarted] = useState(false);
    const [loading, setLoading] = useState(false);

    const total = getCartTotal();

    const handlePayUPI = () => {
        if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.pincode) {
            toast_warning('Please fill in all delivery details!');
            return;
        }

        const upiId = 'neonthreads@upi';
        const upiLink = `upi://pay?pa=${upiId}&pn=NEONTHREADS&am=${total}&cu=INR&tn=Order_from_NeonThreads`;

        Linking.openURL(upiLink).then(() => {
            setPaymentStarted(true);
            toast_info('Complete payment in your UPI app 💳');
        }).catch(() => {
            toast_warning('Could not open UPI app — pay manually to neonthreads@upi');
            setPaymentStarted(true);
        });
    };

    const handleSubmitOrder = async () => {
        if (!utr) {
            toast_warning('Please enter your UTR / Transaction ID');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                items: cartItems,
                shippingAddress: address,
                paymentInfo: {
                    method: 'UPI',
                    transactionId: utr,
                    amount: total
                }
            };

            const { data } = await api.post('/api/orders', orderData);
            if (data.success) {
                toast_success('Order placed successfully! 🎉');
                await clearCart();
                navigation.replace('OrderSuccess', { orderId: data.orderId });
            }
        } catch (err) {
            toast_error(err.response?.data?.message || 'Order failed. Try again!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>FINAL <Text style={{ color: '#00ffff' }}>STEP</Text></Text>
                </View>

                {!paymentStarted ? (
                    <View style={styles.form}>
                        <View style={styles.sectionHeader}>
                            <MapPin color="#00ffff" size={18} />
                            <Text style={styles.sectionTitle}>SHIPPING ADDRESS</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="Full Name"
                                placeholderTextColor="#555"
                                value={address.fullName}
                                onChangeText={(text) => setAddress({ ...address, fullName: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                placeholderTextColor="#555"
                                value={address.phone}
                                keyboardType="phone-pad"
                                onChangeText={(text) => setAddress({ ...address, phone: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Address Line 1"
                                placeholderTextColor="#555"
                                value={address.addressLine1}
                                onChangeText={(text) => setAddress({ ...address, addressLine1: text })}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Address Line 2 (Optional)"
                                placeholderTextColor="#555"
                                value={address.addressLine2}
                                onChangeText={(text) => setAddress({ ...address, addressLine2: text })}
                            />
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, { flex: 1, marginRight: 10 }]}
                                    placeholder="City"
                                    placeholderTextColor="#555"
                                    value={address.city}
                                    onChangeText={(text) => setAddress({ ...address, city: text })}
                                />
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="State"
                                    placeholderTextColor="#555"
                                    value={address.state}
                                    onChangeText={(text) => setAddress({ ...address, state: text })}
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Pincode"
                                placeholderTextColor="#555"
                                value={address.pincode}
                                keyboardType="number-pad"
                                onChangeText={(text) => setAddress({ ...address, pincode: text })}
                            />
                        </View>

                        <View style={styles.summaryBox}>
                            <Text style={styles.summaryTitle}>ORDER SUMMARY</Text>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>{cartItems.length} Items</Text>
                                <Text style={styles.summaryValue}>₹{total}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Shipping</Text>
                                <Text style={[styles.summaryValue, { color: '#00ff88' }]}>FREE</Text>
                            </View>
                            <View style={[styles.summaryRow, { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#222' }]}>
                                <Text style={[styles.summaryLabel, { color: '#ffffff' }]}>Grand Total</Text>
                                <Text style={[styles.summaryValue, { fontSize: 20, color: '#00ffff' }]}>₹{total}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.payBtn} onPress={handlePayUPI}>
                            <CreditCard color="#0a0a0a" size={20} />
                            <Text style={styles.payBtnText}>PAY WITH UPI</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.form}>
                        <View style={styles.paymentStatus}>
                            <View style={[styles.statusIcon, { borderColor: '#ff00aa' }]}>
                                <CreditCard color="#ff00aa" size={40} />
                            </View>
                            <Text style={styles.statusTitle}>PAYMENT INITIALIZED</Text>
                            <Text style={styles.statusDesc}>Once you've completed the payment in your UPI app, enter the Transaction ID (UTR) below to confirm.</Text>
                        </View>

                        <View style={[styles.inputGroup, { marginTop: 30 }]}>
                            <Text style={styles.label}>ENTER UTR / TRANSACTION ID</Text>
                            <TextInput
                                style={[styles.input, { borderColor: '#00ffff', borderWeight: 2 }]}
                                placeholder="12 Digit Transaction ID"
                                placeholderTextColor="#555"
                                value={utr}
                                keyboardType="number-pad"
                                onChangeText={setUtr}
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.payBtn, { backgroundColor: '#00ff88' }]}
                            onPress={handleSubmitOrder}
                            disabled={loading}
                        >
                            <Text style={styles.payBtnText}>{loading ? 'CONFIRMING...' : 'CONFIRM ORDER'}</Text>
                            <Check color="#0a0a0a" size={20} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => setPaymentStarted(false)}
                        >
                            <Text style={styles.backBtnText}>BACK TO ADDRESS</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    scrollContent: { paddingBottom: 50 },
    header: { padding: 40, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
    headerTitle: { color: '#ffffff', fontSize: 28, fontWeight: '900', letterSpacing: 2 },
    form: { padding: 30 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 25 },
    sectionTitle: { color: '#00ffff', fontWeight: 'bold', letterSpacing: 2, fontSize: 12 },
    inputGroup: { gap: 15 },
    input: { backgroundColor: '#111', borderRadius: 10, borderWidth: 1, borderColor: '#222', padding: 15, color: '#fff', fontSize: 14 },
    row: { flexDirection: 'row' },
    summaryBox: { backgroundColor: '#111', borderRadius: 20, padding: 25, marginTop: 40, borderWidth: 1, borderColor: '#1a1a1a' },
    summaryTitle: { color: '#555', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 20 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    summaryLabel: { color: '#888', fontSize: 12, fontWeight: 'bold' },
    summaryValue: { color: '#fff', fontSize: 14, fontWeight: '900' },
    payBtn: { backgroundColor: '#00ffff', borderRadius: 12, paddingVertical: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 40 },
    payBtnText: { color: '#0a0a0a', fontWeight: '900', fontSize: 14, letterSpacing: 1 },
    paymentStatus: { alignItems: 'center', paddingVertical: 20 },
    statusIcon: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
    statusTitle: { color: '#ff00aa', fontSize: 20, fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
    statusDesc: { color: '#666', textAlign: 'center', lineHeight: 22, fontSize: 14 },
    label: { color: '#555', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 10 },
    backBtn: { marginTop: 25, alignSelf: 'center' },
    backBtnText: { color: '#444', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 }
});

export default CheckoutScreen;
