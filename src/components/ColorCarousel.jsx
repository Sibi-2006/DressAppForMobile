import React, { useRef } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { tshirtAssets } from '../config/tshirtAssets';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.45; // 2 cards visible with gap

export default function ColorCarousel({ onColorSelect, selectedColor, fit }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const scrollAmount = cardWidth + 16; // card width + gap

        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                x: direction === 'right' ? scrollAmount : -scrollAmount,
                animated: true,
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SELECT COLOR</Text>

            <View style={styles.carouselWrapper}>
                {/* LEFT ARROW */}
                <TouchableOpacity
                    style={[styles.arrow, styles.leftArrow]}
                    onPress={() => scroll('left')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.arrowText}>←</Text>
                </TouchableOpacity>

                {/* SCROLLABLE CAROUSEL */}
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    scrollEnabled={true}
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.contentContainer}
                >
                    {tshirtAssets.colors.map((color) => (
                        <TouchableOpacity
                            key={color.id}
                            style={[
                                styles.colorCard,
                                selectedColor === color.id && styles.selectedCard,
                            ]}
                            onPress={() => onColorSelect(color.id)}
                            activeOpacity={0.8}
                        >
                            {/* T-SHIRT IMAGE */}
                            <Image
                                source={color.images[fit].front}
                                style={styles.tshirtImage}
                                resizeMode="contain"
                            />

                            {/* COLOR NAME */}
                            <View style={styles.colorInfo}>
                                <View style={[styles.colorDot, { backgroundColor: color.hex }]} />
                                <Text style={styles.colorName}>{color.name}</Text>
                            </View>

                            {/* CHECKMARK IF SELECTED */}
                            {selectedColor === color.id && (
                                <View style={styles.checkmark}>
                                    <Text style={styles.checkmarkText}>✓</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* RIGHT ARROW */}
                <TouchableOpacity
                    style={[styles.arrow, styles.rightArrow]}
                    onPress={() => scroll('right')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.arrowText}>→</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#00FFFF',
        marginBottom: 12,
        letterSpacing: 2,
    },
    carouselWrapper: {
        position: 'relative',
        height: cardWidth + 60,
    },
    arrow: {
        position: 'absolute',
        top: '50%',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: -22 }],
    },
    leftArrow: {
        left: 0,
    },
    rightArrow: {
        right: 0,
    },
    arrowText: {
        fontSize: 20,
        color: '#00FFFF',
        fontWeight: 'bold',
    },
    scrollContainer: {
        flex: 1,
        marginHorizontal: 50,
    },
    contentContainer: {
        paddingVertical: 0,
        gap: 16,
    },
    colorCard: {
        width: cardWidth,
        borderRadius: 8,
        backgroundColor: '#1a1a1a',
        borderWidth: 2,
        borderColor: '#333333',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 12,
    },
    selectedCard: {
        borderColor: '#00FFFF',
        borderWidth: 3,
    },
    tshirtImage: {
        width: '100%',
        height: cardWidth - 60,
        marginBottom: 8,
    },
    colorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    colorName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    checkmark: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#00FFFF',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
