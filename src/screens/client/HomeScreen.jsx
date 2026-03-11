import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, Dimensions, Animated, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/AppHeader';

const { width } = Dimensions.get('window');

const FEATURES = [
    { icon: '🎨', title: 'Custom Design', desc: 'Upload your artwork' },
    { icon: '👕', title: 'Premium Quality', desc: 'Soft & durable fabric' },
    { icon: '🚚', title: 'Fast Delivery', desc: 'Pan India shipping' },
    { icon: '💳', title: 'Easy Payment', desc: 'UPI & more options' },
];

const STEPS = [
    { step: '01', title: 'Choose Your Shirt', desc: 'Pick fit, color and size' },
    { step: '02', title: 'Upload Your Design', desc: 'Add artwork front & back' },
    { step: '03', title: 'Pay with UPI', desc: 'Fast & secure payment' },
    { step: '04', title: 'Get Delivered', desc: 'Delivered to your door' },
];

const COLLECTIONS = [
    { label: 'Normal Fit', color: '#00ffff', desc: 'Classic everyday wear', fit: 'NORMAL_FIT' },
    { label: 'Oversized', color: '#ff00aa', desc: 'Streetwear style', fit: 'OVERSIZED_FIT' },
];

export default function HomeScreen() {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [glowAnim] = useState(new Animated.Value(0.4));

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
                Animated.timing(glowAnim, { toValue: 0.4, duration: 1500, useNativeDriver: false }),
            ])
        ).start();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
            <AppHeader />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* ── HERO ── */}
                <View style={styles.hero}>
                    <Animated.View style={{ opacity: glowAnim }}>
                        <Text style={styles.logoText}>
                            <Text style={styles.logoCyan}>NEON</Text>
                            <Text style={styles.logoPink}>THREADS</Text>
                        </Text>
                    </Animated.View>

                    <Text style={styles.tagline}>Design Your Identity 🔥</Text>
                    <Text style={styles.subtitle}>
                        Premium custom t-shirts crafted just for you.{'\n'}Upload your art. Own your look.
                    </Text>

                    {user && (
                        <Text style={styles.welcomeText}>
                            WELCOME BACK, {user.name?.split(' ')[0]?.toUpperCase()}!
                        </Text>
                    )}

                    <View style={styles.ctaRow}>
                        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Shop')}>
                            <Text style={styles.primaryBtnText}>🛍️  SHOP NOW</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Customize')}>
                            <Text style={styles.secondaryBtnText}>✏️  CUSTOMIZE</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── FEATURES ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>WHY NEONTHREADS?</Text>
                    <View style={styles.featuresGrid}>
                        {FEATURES.map((item, i) => (
                            <View key={i} style={styles.featureCard}>
                                <Text style={styles.featureIcon}>{item.icon}</Text>
                                <Text style={styles.featureTitle}>{item.title}</Text>
                                <Text style={styles.featureDesc}>{item.desc}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ── COLLECTION ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>OUR COLLECTION</Text>
                    <View style={styles.collectionRow}>
                        {COLLECTIONS.map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[styles.collectionCard, { borderColor: item.color }]}
                                onPress={() => navigation.navigate('Shop')}
                                activeOpacity={0.75}
                            >
                                <Text style={[styles.collectionLabel, { color: item.color }]}>{item.label}</Text>
                                <Text style={styles.collectionDesc}>{item.desc}</Text>
                                <Text style={[styles.collectionArrow, { color: item.color }]}>Shop →</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* ── HOW IT WORKS ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>HOW IT WORKS</Text>
                    {STEPS.map((item, i) => (
                        <View key={i} style={styles.stepRow}>
                            <Text style={styles.stepNumber}>{item.step}</Text>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>{item.title}</Text>
                                <Text style={styles.stepDesc}>{item.desc}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* ── BOTTOM CTA ── */}
                <View style={styles.bottomCta}>
                    <Text style={styles.bottomCtaLabel}>Ready to create your custom tee? 🔥</Text>
                    <TouchableOpacity style={styles.bigBtn} onPress={() => navigation.navigate('Customize')} activeOpacity={0.8}>
                        <Text style={styles.bigBtnText}>START DESIGNING</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    scrollContent: { paddingBottom: 40 },

    // ── HERO ──
    hero: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 36,
        paddingBottom: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    logoText: {
        fontSize: 42,
        fontWeight: '900',
        letterSpacing: 3,
        marginBottom: 14,
        textAlign: 'center',
    },
    logoCyan: {
        color: '#00ffff',
        textShadowColor: 'rgba(0,255,255,0.9)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 16,
    },
    logoPink: {
        color: '#ff00aa',
        textShadowColor: 'rgba(255,0,170,0.9)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 16,
    },
    tagline: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        color: '#777',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 12,
    },
    welcomeText: {
        color: '#00ffff',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 3,
        marginBottom: 24,
        textShadowColor: 'rgba(0,255,255,0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
    },
    ctaRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
        marginTop: 10,
    },
    primaryBtn: {
        backgroundColor: '#00ffff',
        paddingVertical: 15,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        minHeight: 50,
    },
    primaryBtnText: {
        color: '#0a0a0a',
        fontWeight: '800',
        fontSize: 13,
        letterSpacing: 1,
    },
    secondaryBtn: {
        borderWidth: 1,
        borderColor: '#00ffff',
        paddingVertical: 15,
        borderRadius: 10,
        flex: 1,
        alignItems: 'center',
        minHeight: 50,
    },
    secondaryBtnText: {
        color: '#00ffff',
        fontWeight: '800',
        fontSize: 13,
        letterSpacing: 1,
    },

    // ── SECTIONS ──
    section: {
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    sectionTitle: {
        color: '#00ffff',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 4,
        marginBottom: 20,
        textShadowColor: 'rgba(0,255,255,0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
    },

    // ── FEATURES ──
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    featureCard: {
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#222',
        borderRadius: 14,
        padding: 18,
        width: (width - 60) / 2,
        alignItems: 'center',
    },
    featureIcon: { fontSize: 26, marginBottom: 10 },
    featureTitle: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        marginBottom: 5,
        textAlign: 'center',
    },
    featureDesc: { color: '#666', fontSize: 11, textAlign: 'center', lineHeight: 16 },

    // ── COLLECTION ──
    collectionRow: { flexDirection: 'row', gap: 12 },
    collectionCard: {
        flex: 1,
        backgroundColor: '#111',
        borderWidth: 1.5,
        borderRadius: 14,
        padding: 18,
    },
    collectionLabel: {
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 6,
    },
    collectionDesc: { color: '#666', fontSize: 11, marginBottom: 14, lineHeight: 16 },
    collectionArrow: { fontSize: 13, fontWeight: '700' },

    // ── STEPS ──
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 22,
        gap: 16,
    },
    stepNumber: {
        color: '#00ffff',
        fontSize: 28,
        fontWeight: '900',
        opacity: 0.35,
        width: 48,
        lineHeight: 32,
    },
    stepContent: { flex: 1 },
    stepTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 4,
    },
    stepDesc: { color: '#666', fontSize: 12 },

    // ── BOTTOM CTA ──
    bottomCta: { padding: 24, alignItems: 'center' },
    bottomCtaLabel: {
        color: '#888',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    bigBtn: {
        backgroundColor: '#ff00aa',
        paddingVertical: 18,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#ff00aa',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 16,
        shadowOpacity: 0.4,
    },
    bigBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '900',
        letterSpacing: 3,
        textShadowColor: 'rgba(255,0,170,0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
});
