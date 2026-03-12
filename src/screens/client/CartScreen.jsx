import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react-native';
import { CartContext } from '../../context/CartContext';
import AppHeader from '../../components/AppHeader';
import { useToast } from '../../context/ToastContext';

const { width } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = React.useContext(CartContext);
    const { toast_info } = useToast();

    const renderItem = ({ item }) => (
        <View style={styles.cartItem}>
            <View style={styles.itemPreview}>
                <Image
                    source={{ uri: item.front_images?.[0]?.url || item.image || item.back_images?.[0]?.url || 'https://via.placeholder.com/200x200/111111/00ffff?text=N' }}
                    style={styles.previewImage}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.itemDetails}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                    {item.fit_type?.replace('_', ' ')} · {item.size} · {item.color}
                </Text>

                <View style={styles.quantityRow}>
                    <View style={styles.qtyControls}>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => {
                            if (item.quantity - 1 === 0) {
                                removeFromCart(item._id);
                                toast_info('Item removed from cart');
                            } else {
                                updateQuantity(item._id, item.quantity - 1);
                                toast_info('Quantity updated');
                            }
                        }}>
                            <Minus color="#888" size={12} />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity style={styles.qtyBtn} onPress={() => {
                            updateQuantity(item._id, item.quantity + 1);
                            toast_info('Quantity updated');
                        }}>
                            <Plus color="#888" size={12} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.removeBtn} onPress={() => { removeFromCart(item._id); toast_info('Item removed from cart'); }}>
                <Trash2 color="#ff3333" size={16} />
            </TouchableOpacity>
        </View>
    );

    if (cartItems.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <AppHeader title="CART" />
                <View style={styles.emptyContainer}>
                    <ShoppingBag color="#222" size={72} />
                    <Text style={styles.emptyTitle}>YOUR CART IS EMPTY</Text>
                    <Text style={styles.emptySub}>The neon dimension awaits your designs.</Text>
                    <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Shop')}>
                        <Text style={styles.shopBtnText}>BROWSE SHOP</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader title="CART" />

            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
                    <Text style={styles.totalValue}>₹{getCartTotal().toLocaleString('en-IN')}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Checkout')}>
                    <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
                    <ArrowRight color="#0a0a0a" size={16} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },

    listContent: { padding: 16, paddingBottom: 20 },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#111',
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#1a1a1a',
        alignItems: 'center',
    },
    itemPreview: {
        width: 70,
        height: 70,
        backgroundColor: '#0a0a0a',
        borderRadius: 10,
        marginRight: 14,
        overflow: 'hidden',
    },
    previewImage: { width: '100%', height: '100%' },
    itemDetails: { flex: 1 },
    itemName: { color: '#fff', fontWeight: '700', fontSize: 13, marginBottom: 4 },
    itemMeta: { color: '#555', fontSize: 10, fontWeight: '600', marginBottom: 10, letterSpacing: 0.5 },
    quantityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    qtyControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#222',
        paddingHorizontal: 4,
        paddingVertical: 2,
        gap: 6,
    },
    qtyBtn: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: { color: '#00ffff', paddingHorizontal: 8, fontWeight: '700', fontSize: 12 },
    itemPrice: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 15,
        textShadowColor: 'rgba(0,255,255,0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 4,
    },
    removeBtn: { padding: 8, marginLeft: 6 },

    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
        backgroundColor: '#0a0a0a',
    },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    totalLabel: { color: '#555', fontSize: 11, fontWeight: '700', letterSpacing: 2 },
    totalValue: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '900',
        textShadowColor: 'rgba(0,255,255,0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
    },
    checkoutBtn: {
        backgroundColor: '#00ffff',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        minHeight: 52,
        shadowColor: '#00ffff',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 12,
        shadowOpacity: 0.3,
    },
    checkoutText: { color: '#0a0a0a', fontWeight: '900', fontSize: 14, letterSpacing: 1 },

    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyTitle: {
        color: '#00ffff',
        fontSize: 20,
        fontWeight: '900',
        marginTop: 20,
        marginBottom: 10,
        letterSpacing: 2,
        textShadowColor: 'rgba(0,255,255,0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    emptySub: { color: '#555', fontSize: 13, textAlign: 'center', marginBottom: 36, lineHeight: 20 },
    shopBtn: {
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ff00aa',
        minHeight: 50,
        justifyContent: 'center',
    },
    shopBtnText: { color: '#ff00aa', fontWeight: '700', fontSize: 13, letterSpacing: 1 },
});

export default CartScreen;
