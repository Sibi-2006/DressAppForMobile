import React, { useRef } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { tshirtAssets } from '../config/tshirtAssets';

const { width } = Dimensions.get('window');

export default function ColorPickerSimple({ onColorSelect, selectedColor }) {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 100;
            scrollRef.current.scrollBy({
                x: direction === 'right' ? scrollAmount : -scrollAmount,
                animated: true,
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>PICK COLOR</Text>

            <View style={styles.colorPickerWrapper}>
                {/* LEFT ARROW */}
                <TouchableOpacity
                    style={[styles.arrow, styles.leftArrow]}
                    onPress={() => scroll('left')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.arrowText}>←</Text>
                </TouchableOpacity>

                {/* COLOR DOTS CAROUSEL */}
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    scrollEventThrottle={16}
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.contentContainer}
                >
                    {tshirtAssets.colors.map((color) => (
                        <TouchableOpacity
                            key={color.id}
                            style={styles.colorItem}
                            onPress={() => onColorSelect(color.id)}
                            activeOpacity={0.8}
                        >
                            {/* COLOR CIRCLE */}
                            <View
                                style={[
                                    styles.colorCircle,
                                    {
                                        backgroundColor: color.hex,
                                        borderWidth: selectedColor === color.id ? 3 : 0,
                                        borderColor: '#00FFFF',
                                    },
                                ]}
                            />

                            {/* COLOR NAME */}
                            <Text
                                style={[
                                    styles.colorName,
                                    selectedColor === color.id && styles.selectedColorName,
                                ]}
                            >
                                {color.name}
                            </Text>

                            {/* CHECKMARK */}
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
        paddingVertical: 16,
        paddingHorizontal: 0,
    },
    label: {
        fontSize: 10,
        fontWeight: '700',
        color: '#555',
        marginBottom: 12,
        letterSpacing: 3,
    },
    colorPickerWrapper: {
        position: 'relative',
        height: 120,
        justifyContent: 'center',
    },
    arrow: {
        position: 'absolute',
        top: '35%',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ translateY: -20 }],
    },
    leftArrow: {
        left: 0,
    },
    rightArrow: {
        right: 0,
    },
    arrowText: {
        fontSize: 18,
        color: '#00FFFF',
        fontWeight: 'bold',
    },
    scrollContainer: {
        flex: 1,
        marginHorizontal: 30,
    },
    contentContainer: {
        paddingHorizontal: 8,
        gap: 20,
        alignItems: 'center',
    },
    colorItem: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    colorCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    colorName: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    selectedColorName: {
        color: '#00FFFF',
        fontWeight: 'bold',
    },
    checkmark: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#00FFFF',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkText: {
        color: '#000000',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
