import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ShoppingBag, Edit3, ShoppingCart, HelpCircle } from 'lucide-react-native';

import HomeScreen from '../screens/client/HomeScreen';
import ShopScreen from '../screens/client/ShopScreen';
import CustomizeScreen from '../screens/client/CustomizeScreen';
import CartScreen from '../screens/client/CartScreen';
import HowToUseScreen from '../screens/client/HowToUseScreen';

const Tab = createBottomTabNavigator();

const ClientTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#00ffff',
                tabBarInactiveTintColor: '#444',
                tabBarStyle: {
                    backgroundColor: '#0a0a0a',
                    borderTopWidth: 1,
                    borderTopColor: '#111',
                    height: 62,
                    paddingBottom: 10,
                    paddingTop: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 9,
                    fontWeight: '700',
                    letterSpacing: 0.5,
                },
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Home') return <Home color={color} size={size} />;
                    if (route.name === 'Shop') return <ShoppingBag color={color} size={size} />;
                    if (route.name === 'Customize') return <Edit3 color={color} size={size} />;
                    if (route.name === 'Cart') return <ShoppingCart color={color} size={size} />;
                    if (route.name === 'Guide') return <HelpCircle color={color} size={size} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Shop" component={ShopScreen} />
            <Tab.Screen name="Customize" component={CustomizeScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
            <Tab.Screen name="Guide" component={HowToUseScreen} />
        </Tab.Navigator>
    );
};

export default ClientTabs;
