import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ShoppingBag, Edit3, ShoppingCart, Package } from 'lucide-react-native';

import HomeScreen from '../screens/client/HomeScreen';
import ShopScreen from '../screens/client/ShopScreen';
import CustomizeScreen from '../screens/client/CustomizeScreen';
import CartScreen from '../screens/client/CartScreen';
import MyOrdersScreen from '../screens/client/MyOrdersScreen';

const Tab = createBottomTabNavigator();

const ClientTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#00ffff',
                tabBarInactiveTintColor: '#555',
                tabBarStyle: {
                    backgroundColor: '#0a0a0a',
                    borderTopWidth: 0,
                    height: 60,
                    paddingBottom: 10,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') return <Home color={color} size={size} />;
                    if (route.name === 'Shop') return <ShoppingBag color={color} size={size} />;
                    if (route.name === 'Customize') return <Edit3 color={color} size={size} />;
                    if (route.name === 'Cart') return <ShoppingCart color={color} size={size} />;
                    if (route.name === 'Orders') return <Package color={color} size={size} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Shop" component={ShopScreen} />
            <Tab.Screen name="Customize" component={CustomizeScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Orders" component={MyOrdersScreen} />
        </Tab.Navigator>
    );
};

export default ClientTabs;
