import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/AppHeader';
import { useToast } from '../../context/ToastContext';

const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue} numberOfLines={1}>{value || 'Not provided'}</Text>
    </View>
);

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { toast_info } = useToast();

    useEffect(() => {
        console.log('ProfileScreen — user:', JSON.stringify(user, null, 2));
    }, [user]);

    // Exact backend field names: _id, name, email, phone_number, whatsapp_number, role
    const name = user?.name || 'User';
    const email = user?.email || 'Not provided';
    const phone = user?.phone_number || 'Not provided';
    const whatsapp = user?.whatsapp_number || user?.phone_number || 'Not provided';
    const role = user?.role?.toUpperCase() || 'MEMBER';

    const initials = (() => {
        if (!user?.name) return '?';
        return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    })();

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => { toast_info('Logged out successfully 👋'); logout(); } },
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader title="PROFILE" showBack />
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <Text style={styles.userName}>{name}</Text>
                    <Text style={styles.userEmail}>{email}</Text>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>
                            {role === 'ADMIN' ? '⚡ ADMIN' : '🔥 MEMBER'}
                        </Text>
                    </View>
                </View>

                {/* Info */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>ACCOUNT INFO</Text>
                    <InfoRow label="Full Name" value={name} />
                    <InfoRow label="Email" value={email} />
                    <InfoRow label="Phone" value={phone} />
                    <InfoRow label="WhatsApp" value={whatsapp} />
                    <InfoRow label="Role" value={role} />
                </View>

                {/* Logout */}
                <View style={styles.logoutSection}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <Text style={styles.logoutText}>🚪  LOGOUT</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },

    avatarSection: {
        alignItems: 'center',
        padding: 36,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    avatar: {
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: '#111', borderWidth: 2, borderColor: '#00ffff',
        justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    },
    avatarText: {
        color: '#00ffff', fontSize: 30, fontWeight: '900',
        textShadowColor: 'rgba(0,255,255,0.8)',
        textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10,
    },
    userName: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 4 },
    userEmail: { color: '#666', fontSize: 13, marginBottom: 12 },
    roleBadge: {
        paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20,
        borderWidth: 1, borderColor: '#00ffff', backgroundColor: 'rgba(0,255,255,0.08)',
    },
    roleText: { color: '#00ffff', fontSize: 11, fontWeight: '700', letterSpacing: 2 },

    card: {
        margin: 16, backgroundColor: '#111', borderRadius: 16,
        padding: 20, borderWidth: 1, borderColor: '#1a1a1a',
    },
    sectionTitle: {
        color: '#00ffff', fontSize: 11, fontWeight: '700', letterSpacing: 4, marginBottom: 16,
        textShadowColor: 'rgba(0,255,255,0.4)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 6,
    },
    infoRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1a1a1a',
    },
    infoLabel: { color: '#666', fontSize: 13 },
    infoValue: { color: '#fff', fontSize: 13, fontWeight: '500', flex: 1, textAlign: 'right', marginLeft: 12 },

    logoutSection: { paddingHorizontal: 16 },
    logoutBtn: {
        borderWidth: 1, borderColor: '#ff3333', borderRadius: 10,
        paddingVertical: 16, alignItems: 'center',
        backgroundColor: 'rgba(255,51,51,0.06)', minHeight: 52,
    },
    logoutText: { color: '#ff3333', fontSize: 14, fontWeight: '700', letterSpacing: 2 },
});
