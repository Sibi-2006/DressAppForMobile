import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function AppHeader({ title, showBack = false }) {
    const navigation = useNavigation();
    const { user } = useAuth();

    const getInitials = () => {
        const name = user?.name;
        if (!name) return '?';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <View style={styles.header}>
            {/* Left: Back or Logo */}
            <View style={styles.left}>
                {showBack ? (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.logo}>
                        <Text style={styles.logoCyan}>NEON</Text>
                        <Text style={styles.logoPink}>THREADS</Text>
                    </Text>
                )}
            </View>

            {/* Center: Title */}
            {title ? (
                <View style={styles.center}>
                    <Text style={styles.title}>{title}</Text>
                </View>
            ) : (
                <View style={styles.center} />
            )}

            {/* Right: Profile / Auth Actions */}
            <View style={styles.right}>
                {user ? (
                    <TouchableOpacity
                        style={styles.profileBtn}
                        onPress={() => navigation.navigate('Profile')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.profileInitials}>{getInitials()}</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity
                            style={styles.authBtnIn}
                            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.authBtnInText}>LOGIN</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0a0a0a',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    left: { flex: 1, alignItems: 'flex-start' },
    center: { flex: 1, alignItems: 'center' },
    right: { flex: 1, alignItems: 'flex-end' },
    logo: { fontSize: 18, fontWeight: '900', letterSpacing: 1 },
    logoCyan: {
        color: '#00ffff',
        textShadowColor: 'rgba(0,255,255,0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    logoPink: {
        color: '#ff00aa',
        textShadowColor: 'rgba(255,0,170,0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    title: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 2,
        textShadowColor: 'rgba(0,255,255,0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
    },
    backBtn: { padding: 4 },
    backIcon: {
        color: '#00ffff',
        fontSize: 20,
        fontWeight: '700',
        textShadowColor: 'rgba(0,255,255,0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    profileBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#111',
        borderWidth: 1.5,
        borderColor: '#00ffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitials: {
        color: '#00ffff',
        fontSize: 12,
        fontWeight: '700',
    },
    authBtnIn: {
        borderWidth: 1, borderColor: '#00ffff', backgroundColor: 'transparent',
        paddingVertical: 5, paddingHorizontal: 12, borderRadius: 6,
    },
    authBtnInText: {
        color: '#00ffff', fontSize: 10, fontWeight: '700', letterSpacing: 1,
    },
});
