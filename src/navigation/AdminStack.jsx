import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminOrdersScreen from '../screens/admin/AdminOrdersScreen';
import AdminOrderDetailScreen from '../screens/admin/AdminOrderDetailScreen';
import AdminConfigScreen from '../screens/admin/AdminConfigScreen';

const Stack = createNativeStackNavigator();

const AdminStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: '#0a0a0a' },
                headerTintColor: '#00ffff',
                headerTitleStyle: { fontWeight: 'bold' },
            }}
        >
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'DASHBOARD' }} />
            <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} options={{ title: 'ORDERS' }} />
            <Stack.Screen name="AdminOrderDetail" component={AdminOrderDetailScreen} options={{ title: 'ORDER DETAIL' }} />
            <Stack.Screen name="AdminConfig" component={AdminConfigScreen} options={{ title: 'CONFIG' }} />
        </Stack.Navigator>
    );
};

export default AdminStack;
