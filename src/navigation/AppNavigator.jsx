import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ShoppingBag, Edit3, ShoppingCart, Package } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

// Client Screens
import HomeScreen from '../screens/client/HomeScreen';
import ShopScreen from '../screens/client/ShopScreen';
import CartScreen from '../screens/client/CartScreen';
import CheckoutScreen from '../screens/client/CheckoutScreen';
import MyOrdersScreen from '../screens/client/MyOrdersScreen';
import OrderDetailScreen from '../screens/client/OrderDetailScreen';
import OrderSuccessScreen from '../screens/client/OrderSuccessScreen';
import ProfileScreen from '../screens/client/ProfileScreen';
import CustomizeScreen from '../screens/client/CustomizeScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminOrderDetailScreen from '../screens/admin/AdminOrderDetailScreen';
import AdminConfigScreen from '../screens/admin/AdminConfigScreen';

// Debug: log all screen components at startup
const SCREEN_MAP = {
    LoginScreen, SignUpScreen, HomeScreen, ShopScreen,
    CartScreen, CheckoutScreen, MyOrdersScreen, OrderDetailScreen,
    OrderSuccessScreen, ProfileScreen,
    AdminDashboardScreen, AdminOrdersScreen,
    AdminOrderDetailScreen, AdminConfigScreen,
};

Object.entries(SCREEN_MAP).forEach(([name, comp]) => {
    if (!comp) console.error(`🔴 UNDEFINED SCREEN: ${name}`);
    else console.log(`✅ Screen OK: ${name}`);
});

// Each navigator needs its OWN createNativeStackNavigator() instance
const AuthStackNav = createNativeStackNavigator();
const ClientTabNav = createBottomTabNavigator();
const ClientStackNav = createNativeStackNavigator();
const AdminStackNav = createNativeStackNavigator();
const RootStackNav = createNativeStackNavigator();

// Loading Screen
const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0a0a0a' }}>
        <ActivityIndicator size="large" color="#00ffff" />
        <Text style={{ color: '#444', marginTop: 12, letterSpacing: 2, fontSize: 11 }}>BOOTING...</Text>
    </View>
);

// Fallback for lazy-loaded screen
const ScreenFallback = () => (
    <View style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#ff00aa" />
    </View>
);

// Safe wrapper for lazy screen in case lazy isn't available
const SafeCustomizeScreen = (props) => {
    try {
        const Comp = require('../screens/client/CustomizeScreen').default;
        if (!Comp) return <ScreenFallback />;
        return <Comp {...props} />;
    } catch (e) {
        console.error('CustomizeScreen load error:', e.message);
        return <ScreenFallback />;
    }
};

// Auth Stack
const AuthStack = () => (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
        <AuthStackNav.Screen name="Login" component={LoginScreen} />
        <AuthStackNav.Screen name="SignUp" component={SignUpScreen} />
    </AuthStackNav.Navigator>
);

// Client Bottom Tabs
const ClientTabs = () => (
    <ClientTabNav.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#0a0a0a',
                borderTopColor: '#1a1a1a',
                borderTopWidth: 1,
                height: 62,
                paddingBottom: 8,
            },
            tabBarActiveTintColor: '#00ffff',
            tabBarInactiveTintColor: '#444',
            tabBarIcon: ({ color, size }) => {
                if (route.name === 'Home') return <Home color={color} size={size} />;
                if (route.name === 'Shop') return <ShoppingBag color={color} size={size} />;
                if (route.name === 'Customize') return <Edit3 color={color} size={size} />;
                if (route.name === 'Cart') return <ShoppingCart color={color} size={size} />;
                if (route.name === 'Orders') return <Package color={color} size={size} />;
                return null;
            },
        })}
    >
        <ClientTabNav.Screen name="Home" component={HomeScreen} />
        <ClientTabNav.Screen name="Shop" component={ShopScreen} />
        <ClientTabNav.Screen name="Customize" component={SafeCustomizeScreen} />
        <ClientTabNav.Screen name="Cart" component={CartScreen} />
        <ClientTabNav.Screen name="Orders" component={MyOrdersScreen} />
    </ClientTabNav.Navigator>
);

// Client Stack (tabs + extra screens)
const ClientStack = () => (
    <ClientStackNav.Navigator screenOptions={{ headerShown: false }}>
        <ClientStackNav.Screen name="MainTabs" component={ClientTabs} />
        <ClientStackNav.Screen name="Checkout" component={CheckoutScreen} />
        <ClientStackNav.Screen name="OrderDetail" component={OrderDetailScreen} />
        <ClientStackNav.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <ClientStackNav.Screen name="Profile" component={ProfileScreen} />
    </ClientStackNav.Navigator>
);

// Admin Stack
const AdminStack = () => (
    <AdminStackNav.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: '#0a0a0a' },
            headerTintColor: '#00ffff',
            headerTitleStyle: { fontWeight: '800', letterSpacing: 2 },
        }}
    >
        <AdminStackNav.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'DASHBOARD' }} />
        <AdminStackNav.Screen name="AdminOrders" component={AdminOrdersScreen} options={{ title: 'ORDERS' }} />
        <AdminStackNav.Screen name="AdminOrderDetail" component={AdminOrderDetailScreen} options={{ title: 'ORDER DETAIL' }} />
        <AdminStackNav.Screen name="AdminConfig" component={AdminConfigScreen} options={{ title: 'CONFIG' }} />
        <AdminStackNav.Screen name="Profile" component={ProfileScreen} options={{ title: 'PROFILE' }} />
    </AdminStackNav.Navigator>
);

// Root Navigator
export default function AppNavigator() {
    const { isLoggedIn, isAdmin, loading } = useAuth();

    if (loading) return <LoadingScreen />;

    return (
        <NavigationContainer>
            <RootStackNav.Navigator screenOptions={{ headerShown: false }}>
                {!isLoggedIn ? (
                    <RootStackNav.Screen name="Auth" component={AuthStack} />
                ) : isAdmin ? (
                    <RootStackNav.Screen name="Admin" component={AdminStack} />
                ) : (
                    <RootStackNav.Screen name="Client" component={ClientStack} />
                )}
            </RootStackNav.Navigator>
        </NavigationContainer>
    );
}
