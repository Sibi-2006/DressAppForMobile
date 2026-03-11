import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const NeonLoader = ({ text = 'Loading...' }) => {
    const [fadeAnim] = useState(new Animated.Value(0.3));

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Animated.Text style={[styles.logoNeon, { opacity: fadeAnim }]}>NEON</Animated.Text>
                <Text style={styles.logoThreads}>THREADS</Text>
            </View>
            <Text style={styles.text}>{text.toUpperCase()}</Text>
            <View style={styles.progressBar}>
                <Animated.View style={[styles.progressLine, { opacity: fadeAnim }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a', alignItems: 'center', justifyContent: 'center' },
    logoContainer: { flexDirection: 'row', marginBottom: 20 },
    logoNeon: {
        color: '#00ffff', fontSize: 32, fontWeight: '900', letterSpacing: 2,
        textShadow: '0px 0px 10px rgba(0, 255, 255, 0.8)'
    },
    logoThreads: { color: '#ffffff', fontSize: 32, fontWeight: '900', letterSpacing: 2 },
    text: { color: '#555', fontSize: 12, fontWeight: 'bold', letterSpacing: 3, marginTop: 10 },
    progressBar: { width: 200, height: 2, backgroundColor: '#1a1a1a', marginTop: 20, overflow: 'hidden' },
    progressLine: { width: '100%', height: '100%', backgroundColor: '#00ffff' }
});

export default NeonLoader;
