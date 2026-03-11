import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

export const CartContext = React.createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = React.useState([]);
    const [cartCount, setCartCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        fetchCart();
    }, []);

    React.useEffect(() => {
        const count = cartItems.reduce(
            (total, item) => total + (item.quantity || 0), 0
        );
        setCartCount(count);
    }, [cartItems]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const res = await api.get('/api/cart');
            setCartItems(res.data.items || []);
        } catch (error) {
            console.log('Fetch cart error:', error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (item) => {
        try {
            const res = await api.post('/api/cart/add', item);
            setCartItems(res.data.items || []);
            return { success: true };
        } catch (error) {
            console.log('Add to cart error:', error);
            return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const res = await api.delete(`/api/cart/remove/${itemId}`);
            setCartItems(res.data.items || []);
        } catch (error) {
            console.log('Remove cart error:', error);
        }
    };

    const clearCart = async () => {
        try {
            await api.delete('/api/cart/clear');
            setCartItems([]);
        } catch (error) {
            console.log('Clear cart error:', error);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const res = await api.patch('/api/cart/update', { itemId, quantity });
            setCartItems(res.data.items || []);
        } catch (error) {
            console.log('Update qty error:', error);
        }
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            loading,
            fetchCart,
            addToCart,
            removeFromCart,
            clearCart,
            updateQuantity,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = React.useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export default CartContext;
