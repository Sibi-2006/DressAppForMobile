import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientTabs from './ClientTabs';
import CheckoutScreen from '../screens/client/CheckoutScreen';
import OrderSuccessScreen from '../screens/client/OrderSuccessScreen';

const Stack = createNativeStackNavigator();

const ClientStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={ClientTabs} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        </Stack.Navigator>
    );
};

export default ClientStack;
