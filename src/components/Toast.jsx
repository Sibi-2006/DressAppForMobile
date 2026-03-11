import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const TOAST_CONFIG = {
    success: { icon: '✅', color: '#00ff88', borderColor: '#00ff88', bg: '#001a0d' },
    error: { icon: '❌', color: '#ff3333', borderColor: '#ff3333', bg: '#1a0000' },
    warning: { icon: '⚠️', color: '#ffaa00', borderColor: '#ffaa00', bg: '#1a1000' },
    info: { icon: 'ℹ️', color: '#00ffff', borderColor: '#00ffff', bg: '#001a1a' },
    cart: { icon: '🛒', color: '#ff00aa', borderColor: '#ff00aa', bg: '#1a0011' },
};

const Toast = ({ visible, message, type = 'success', duration = 3000, onHide }) => {
    const translateY = useRef(new Animated.Value(-120)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0, useNativeDriver: false, tension: 80, friction: 10,
                }),
                Animated.timing(opacity, {
                    toValue: 1, duration: 200, useNativeDriver: false,
                }),
            ]).start();

            const timer = setTimeout(hideToast, duration);
            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(translateY, { toValue: -120, duration: 250, useNativeDriver: false }),
            Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: false }),
        ]).start(() => { if (onHide) onHide(); });
    };

    if (!visible) return null;

    const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }],
                    opacity,
                    backgroundColor: config.bg,
                    borderColor: config.borderColor,
                },
            ]}
        >
            <Text style={styles.icon}>{config.icon}</Text>
            <Text style={[styles.message, { color: config.color }]} numberOfLines={2}>
                {message}
            </Text>
            <TouchableOpacity onPress={hideToast} style={styles.closeBtn}>
                <Text style={[styles.closeText, { color: config.color }]}>✕</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60,
        left: 16,
        right: 16,
        zIndex: 9999,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 12,
    },
    icon: { fontSize: 18 },
    message: {
        flex: 1, fontSize: 13, fontWeight: '600', lineHeight: 18,
    },
    closeBtn: { padding: 2 },
    closeText: { fontSize: 14, fontWeight: '700', opacity: 0.7 },
});

export default Toast;
