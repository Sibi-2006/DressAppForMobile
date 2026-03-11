import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MessageSquare, LogOut, Info, Settings } from 'lucide-react-native';
import api from '../../config/api';
import { AuthContext } from '../../context/AuthContext';

const AdminConfigScreen = ({ navigation }) => {
    const { logout } = useContext(AuthContext);
    const [toastMessage, setToastMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const { data } = await api.get('/api/admin/toast-message');
                setToastMessage(data.message || '');
            } catch (err) {
                console.error('Failed to fetch config', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleSaveToast = async () => {
        setUpdating(true);
        try {
            await api.post('/api/admin/toast-message', { message: toastMessage });
            Alert.alert('Success', 'Global toast message updated!');
        } catch (err) {
            Alert.alert('Error', 'Failed to update toast message.');
        } finally {
            setUpdating(false);
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to end this session?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout', style: 'destructive', onPress: async () => {
                    await logout();
                }
            }
        ]);
    };

    if (loading) return <View style={styles.loadingContainer}><ActivityIndicator color="#ff00aa" /></View>;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Settings color="#ff00aa" size={40} style={{ marginBottom: 20 }} />
                <Text style={styles.headerTitle}>SYSTEM <Text style={{ color: '#ff00aa' }}>CONFIG</Text></Text>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <MessageSquare color="#00ffff" size={18} />
                    <Text style={styles.cardTitle}>WELCOME TOAST MESSAGE</Text>
                </View>
                <Text style={styles.cardDesc}>This message appears at the top of every client's Home screen.</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter message..."
                    placeholderTextColor="#444"
                    value={toastMessage}
                    onChangeText={setToastMessage}
                    multiline
                />

                <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSaveToast}
                    disabled={updating}
                >
                    <Text style={styles.saveBtnText}>{updating ? 'SAVING...' : 'UPDATE MESSAGE'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Info color="#888" size={18} />
                    <Text style={styles.cardTitle}>APP INFORMATION</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Version</Text>
                    <Text style={styles.infoValue}>1.0.0 (Neon)</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Backend Status</Text>
                    <Text style={[styles.infoValue, { color: '#00ff88' }]}>OPERATIONAL</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <LogOut color="#ff3333" size={20} />
                <Text style={styles.logoutText}>TERMINATE SESSION</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    loadingContainer: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
    header: { padding: 40, alignItems: 'center', backgroundColor: '#111', borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
    headerTitle: { color: '#ffffff', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
    card: { backgroundColor: '#111', margin: 20, borderRadius: 20, padding: 25, borderWidth: 1, borderColor: '#1a1a1a' },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
    cardTitle: { color: '#555', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
    cardDesc: { color: '#666', fontSize: 12, marginBottom: 20, lineHeight: 18 },
    input: { backgroundColor: '#0a0a0a', borderRadius: 10, borderWidth: 1, borderColor: '#222', padding: 15, color: '#00ffff', fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
    saveBtn: { backgroundColor: 'rgba(0, 255, 255, 0.1)', borderWeight: 1, borderColor: '#00ffff', borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginTop: 20, borderStyle: 'dashed', borderWidth: 1 },
    saveBtnText: { color: '#00ffff', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1a1a1a' },
    infoLabel: { color: '#666', fontSize: 13 },
    infoValue: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
    logoutBtn: { margin: 20, marginTop: 10, borderRadius: 15, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 15, borderWeight: 1, borderColor: '#ff3333', borderWidth: 1 },
    logoutText: { color: '#ff3333', fontWeight: 'bold', fontSize: 14, letterSpacing: 1 }
});

export default AdminConfigScreen;
