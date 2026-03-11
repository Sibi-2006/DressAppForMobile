import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const STEPS = [
    {
        num: '01',
        icon: '👤',
        title: 'Sign Up / Login',
        desc: 'Create your NEONTHREADS account or sign in. Your designs, cart, and orders are all saved securely to your profile.',
        color: '#00ffff',
    },
    {
        num: '02',
        icon: '👕',
        title: 'Browse T-Shirt Designs',
        desc: 'Explore our catalog of Normal Fit and Oversized Fit base t-shirts. Use the filter bar to narrow down by style.',
        color: '#bf00ff',
    },
    {
        num: '03',
        icon: '🎯',
        title: 'Select a T-Shirt',
        desc: 'Tap any t-shirt card to open the customize screen. Choose from Black, White, Blue, or Purple in your preferred fit.',
        color: '#00ffff',
    },
    {
        num: '04',
        icon: '🎨',
        title: 'Customize Front & Back',
        desc: 'Upload your design image for the FRONT or BACK of the shirt. Use the FRONT / BACK tabs to switch. Drag, scale, and rotate each design layer.',
        color: '#ff00aa',
    },
    {
        num: '05',
        icon: '🔍',
        title: 'Preview Your Design',
        desc: 'See your custom design live on the t-shirt canvas as you make changes. Both front and back are fully previewable.',
        color: '#00ff88',
    },
    {
        num: '06',
        icon: '🛒',
        title: 'Add to Cart',
        desc: 'Happy with the design? Select your size (S, M, L, XL, 2XL) and quantity, then tap the ADD TO CART button to save it.',
        color: '#ff00aa',
    },
    {
        num: '07',
        icon: '💳',
        title: 'Checkout & UPI Payment',
        desc: 'Enter your delivery address and tap Pay via UPI. Your UPI app opens automatically. Complete the payment and enter your UTR/Transaction ID to confirm.',
        color: '#ffaa00',
    },
    {
        num: '08',
        icon: '🎉',
        title: 'Order Confirmed!',
        desc: 'Your order is placed! Track it anytime from My Orders. Status updates from Processing → Printing → Shipped → Delivered.',
        color: '#00ff88',
    },
];

const StepCard = ({ item, index }) => (
    <View style={[styles.card, { borderColor: item.color + '33' }]}>
        {/* Background step number */}
        <Text style={[styles.bgNum, { color: item.color + '18' }]}>{item.num}</Text>

        {/* Top row */}
        <View style={styles.cardTop}>
            <View style={[styles.iconBox, { backgroundColor: item.color + '18', borderColor: item.color + '44' }]}>
                <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <View style={[styles.numBadge, { backgroundColor: item.color + '22', borderColor: item.color + '44' }]}>
                <Text style={[styles.numText, { color: item.color }]}>{item.num}</Text>
            </View>
        </View>

        {/* Content */}
        <Text style={[styles.stepTitle, { color: item.color }]}>{item.title}</Text>
        <Text style={styles.stepDesc}>{item.desc}</Text>

        {/* Connector line (not last) */}
        {index < STEPS.length - 1 && (
            <View style={styles.connector} />
        )}
    </View>
);

const HowToUseScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#00ffff" size={22} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>HOW TO USE</Text>
                    <Text style={styles.headerSub}>Your step-by-step guide</Text>
                </View>
            </View>

            <FlatList
                data={STEPS}
                keyExtractor={(item) => item.num}
                renderItem={({ item, index }) => <StepCard item={item} index={index} />}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.intro}>
                        <Text style={styles.introEmoji}>🧵</Text>
                        <Text style={styles.introText}>
                            From blank canvas to custom wearable art — follow these {STEPS.length} simple steps to get your NEONTHREADS tee.
                        </Text>
                    </View>
                }
                ListFooterComponent={
                    <View style={styles.footer}>
                        <Text style={styles.footerTitle}>Ready to design? 🎨</Text>
                        <Text style={styles.footerSub}>
                            Head to the Shop tab, pick your base, and start creating something legendary.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 10,
        backgroundColor: '#111', borderWidth: 1, borderColor: '#1a1a1a',
        justifyContent: 'center', alignItems: 'center',
    },
    headerTitle: {
        color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 3,
    },
    headerSub: {
        color: '#444', fontSize: 11, marginTop: 2,
    },

    list: { paddingHorizontal: 20, paddingBottom: 40 },

    intro: {
        paddingVertical: 24,
        alignItems: 'center',
    },
    introEmoji: { fontSize: 36, marginBottom: 12 },
    introText: {
        color: '#666', textAlign: 'center', fontSize: 13, lineHeight: 20,
        maxWidth: width - 60,
    },

    card: {
        backgroundColor: '#111',
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
    },
    bgNum: {
        position: 'absolute', right: 12, top: 8,
        fontSize: 72, fontWeight: '900', lineHeight: 80,
        zIndex: 0,
    },
    cardTop: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 14, zIndex: 1,
    },
    iconBox: {
        width: 52, height: 52, borderRadius: 13,
        borderWidth: 1, justifyContent: 'center', alignItems: 'center',
    },
    icon: { fontSize: 24 },
    numBadge: {
        paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: 20, borderWidth: 1,
    },
    numText: { fontSize: 11, fontWeight: '900', letterSpacing: 1 },

    stepTitle: {
        fontSize: 14, fontWeight: '900', letterSpacing: 0.5,
        marginBottom: 8, zIndex: 1,
    },
    stepDesc: {
        color: '#666', fontSize: 13, lineHeight: 19,
        zIndex: 1,
    },

    connector: {
        height: 1, backgroundColor: '#1a1a1a',
        marginTop: 16, marginHorizontal: -20,
    },

    footer: {
        backgroundColor: '#111',
        borderRadius: 16, borderWidth: 1, borderColor: '#00ffff22',
        padding: 24, marginTop: 8, alignItems: 'center',
    },
    footerTitle: {
        color: '#00ffff', fontSize: 16, fontWeight: '900',
        letterSpacing: 1, marginBottom: 8,
    },
    footerSub: {
        color: '#555', textAlign: 'center', fontSize: 13, lineHeight: 19,
    },
});

export default HowToUseScreen;
